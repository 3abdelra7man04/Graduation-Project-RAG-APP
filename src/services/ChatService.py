from .BaseService import BaseService
from .NLPService import NLPService
from .MonitorService import MonitorService
from agents.dependencies import AgentDeps
from models.ProjectModel import ProjectModel
from models.ChatModel import ChatModel
from models.QueryModel import QueryModel
from models.db_schemes.chat import Chat
from models.db_schemes.query import Query
from models.enums.QueryTopicEnum import QueryTopicEnum
from bson.objectid import ObjectId
from dataclasses import dataclass
from datetime import datetime, timedelta
from pydantic import TypeAdapter
from pydantic_ai.messages import ModelMessage, ToolReturnPart, ToolCallPart, ModelResponse
import logging
import time

# Uvicorn logger instance
logger = logging.getLogger("uvicorn.error")


# the outcome of a single agent run, before it is persisted
@dataclass
class AgentTurn:
    answer: str
    chat_history: list[dict]
    monitor_data: dict
    topic: str
    failed: bool
    resolved: bool


class ChatService(BaseService):

    # constructor
    def __init__(self, db_client, agent_client, generation_client, embedding_client,
                 vectordb_client, reranking_client, template_parser, guest_chat_TTL):
        super().__init__()

        self.db_client = db_client
        self.agent_client = agent_client
        self.generation_client = generation_client
        self.embedding_client = embedding_client
        self.vectordb_client = vectordb_client
        self.reranking_client = reranking_client
        self.template_parser = template_parser
        self.guest_chat_TTL = guest_chat_TTL

    # build a service from the app level clients created at startup
    @classmethod
    def from_app(cls, app):
        return cls(
            db_client=app.db_client,
            agent_client=app.agent_client,
            generation_client=app.generation_client,
            embedding_client=app.embedding_client,
            vectordb_client=app.vectordb_client,
            reranking_client=app.reranking_client,
            template_parser=app.template_parser,
            guest_chat_TTL=app.guest_chat_TTL,
        )

    # get project or create one
    async def get_project(self, project_id: str):
        project_model = await ProjectModel.create_instance(db_client=self.db_client)

        return await project_model.get_project_or_create_one(project_id=project_id)

    # nlp_service instance
    def _build_nlp_service(self):
        return NLPService(generation_client=self.generation_client,
                          embedding_client=self.embedding_client,
                          vectordb_client=self.vectordb_client,
                          template_parser=self.template_parser,
                          reranking_client=self.reranking_client)

    # log the tools the agent called and what they returned
    def _log_tool_trace(self, result):
        logger.debug("=== TOOL TRACE ===")

        for msg in result.all_messages():
            if isinstance(msg, ModelResponse):
                for part in msg.parts:
                    if isinstance(part, ToolCallPart):
                        logger.debug(f"[CALL] {part.tool_name} -> {part.args}")

                    elif isinstance(part, ToolReturnPart):
                        logger.debug(f"[RETURN] {part.tool_name} -> {part.content}")

    # run one agent turn, then classify and measure it
    async def _run_agent_turn(self, project, chat_request, message_history: list = None):

        nlp_service = self._build_nlp_service()
        monitor_service = MonitorService()

        deps = AgentDeps(
            nlp_service=nlp_service,
            project=project,
            template_parser=self.template_parser,
            limit=chat_request.limit,
            monitor_service=monitor_service
        )

        start_time = time.time()

        # run agent
        if message_history is None:
            result = await self.agent_client.run(user_prompt=chat_request.query, deps=deps)
        else:
            result = await self.agent_client.run(user_prompt=chat_request.query, deps=deps,
                                                 message_history=message_history)

        latency_seconds = time.time() - start_time

        self._log_tool_trace(result)

        # agent answer
        answer = result.output

        # query classification
        topic, failed, resolved, class_in_tokens, class_out_tokens = nlp_service.classify_query_topic_and_failure(
            query=chat_request.query,
            query_answer=answer,
            topic_names=QueryTopicEnum.values()
        )

        classification_model = getattr(self.generation_client, "classification_model_id", None)

        monitor_data = monitor_service.get_query_monitor_data(
            result=result,
            query_text=chat_request.query,
            latency_seconds=latency_seconds,
            agent_model=getattr(self.agent_client, "model", None) or getattr(self.agent_client, "model_name", None),
            embedding_model=self.embedding_client.embedding_model_id,
            hyde_model=self.generation_client.generation_model_id,
            classification_model=classification_model,
            classification_prompt_tokens=class_in_tokens,
            classification_completion_tokens=class_out_tokens
        )

        # agent chat history using adapter
        chat_history = TypeAdapter(list).dump_python(result.all_messages(), mode='json')

        return AgentTurn(
            answer=answer,
            chat_history=chat_history,
            monitor_data=monitor_data,
            topic=topic,
            failed=failed,
            resolved=resolved
        )

    # build the query record tracked for a single turn
    def _build_query(self, project, chat_id: ObjectId, chat_request, turn: AgentTurn):
        monitor_data = turn.monitor_data

        return Query(
            query_project_id=project.id,
            query_chat_id=chat_id,
            # guest chats have no user, so the query is left unattributed
            query_user_id=ObjectId(chat_request.user_id) if chat_request.user_id else None,
            query_text=chat_request.query,
            query_topic=turn.topic,
            createdAt=datetime.utcnow(),
            failed=turn.failed,
            resolved=turn.resolved,
            query_answer=turn.answer,
            agent_in_tokens=monitor_data["agent_in_tokens"],
            agent_out_tokens=monitor_data["agent_out_tokens"],
            query_embed_tokens=monitor_data["query_embed_tokens"],
            hyde_embed_tokens=monitor_data["hyde_embed_tokens"],
            hyde_prompt_tokens=monitor_data["hyde_prompt_tokens"],
            hyde_completion_tokens=monitor_data["hyde_completion_tokens"],
            query_classification_prompt_tokens=monitor_data["query_classification_prompt_tokens"],
            query_classification_completion_tokens=monitor_data["query_classification_completion_tokens"],
            tokens_in=monitor_data["tokens_in"],
            tokens_out=monitor_data["tokens_out"],
            tool_calls_count=monitor_data["tool_calls_count"],
            latency_seconds=monitor_data["latency_seconds"],
            trace=monitor_data["trace"]
        )

    # persist the query record of a turn
    async def _record_query(self, project, chat_id: ObjectId, chat_request, turn: AgentTurn):
        query_model = await QueryModel.create_instance(db_client=self.db_client)

        return await query_model.add_query(
            self._build_query(project=project, chat_id=chat_id, chat_request=chat_request, turn=turn)
        )

    # start a new conversation
    async def start_conversation(self, project, chat_request):

        turn = await self._run_agent_turn(project=project, chat_request=chat_request)

        chat_model = await ChatModel.create_instance(self.db_client)

        # chat title
        chat_title = None
        if not chat_request.is_guest:
            chat_title = chat_request.query[:30]

        # chat conversation
        chat_conversation = [{"question": chat_request.query, "answer": turn.answer}]

        # create chat
        ## if not guest
        if not chat_request.is_guest:
            chat_id = await chat_model.create_chat(Chat(
                chat_project_id=project.id,
                chat_user_id=ObjectId(chat_request.user_id),
                is_guest_chat=False,
                chat_title=chat_title,
                chat_history=turn.chat_history,
                chat_conversation=chat_conversation,
                updatedAt=datetime.utcnow()
            ))
        ## if guest
        else:
            chat_id = await chat_model.create_chat(Chat(
                chat_project_id=project.id,
                is_guest_chat=True,
                chat_title=chat_title,
                chat_history=turn.chat_history,
                chat_conversation=chat_conversation,
                updatedAt=datetime.utcnow(),
                expiresAt=datetime.utcnow() + timedelta(seconds=self.guest_chat_TTL)
            ))

        # update queries
        _ = await self._record_query(project=project, chat_id=chat_id,
                                     chat_request=chat_request, turn=turn)

        return {
            "answer": turn.answer,
            "chat_id": str(chat_id),
            "chat_title": chat_title
        }

    # continue an existing conversation
    async def continue_conversation(self, project, chat_id: str, chat_request):

        chat_model = await ChatModel.create_instance(self.db_client)

        # get chat history
        chat = await chat_model.get_chat_by_id(chat_id=ObjectId(chat_id))

        # parse db dicts back into pydantic-ai message objects
        parsed_chat_history = TypeAdapter(list[ModelMessage]).validate_python(chat.chat_history)

        turn = await self._run_agent_turn(project=project, chat_request=chat_request,
                                          message_history=parsed_chat_history)

        # update chat history
        _ = await chat_model.update_chat_history_and_conversation(
            chat_id=ObjectId(chat_id),
            chat_history=turn.chat_history,
            question=chat_request.query,
            answer=turn.answer
        )

        # if guest update expiry
        if chat_request.is_guest:
            _ = await chat_model.update_chat_expiry(chat_id=ObjectId(chat_id), TTL=self.guest_chat_TTL)

        # update queries
        _ = await self._record_query(project=project, chat_id=ObjectId(chat_id),
                                     chat_request=chat_request, turn=turn)

        return {
            "answer": turn.answer,
            "chat_id": str(chat_id),
            "chat_title": chat.chat_title
        }

    # list all the chats of a user
    async def list_user_chats(self, project, user_id: str):
        chat_model = await ChatModel.create_instance(self.db_client)

        all_chats = await chat_model.list_all_user_chats(project_id=ObjectId(project.id),
                                                        user_id=ObjectId(user_id),
                                                        ascending=False)

        for chat in all_chats:
            chat["_id"] = str(chat["_id"])
            chat["updatedAt"] = str(chat["updatedAt"])

        return all_chats

    # get the conversation of a chat
    async def get_conversation(self, chat_id: str):
        chat_model = await ChatModel.create_instance(self.db_client)

        # get chat history safely
        try:
            chat = await chat_model.get_chat_by_id(chat_id=ObjectId(chat_id))
        except Exception:
            chat = None

        if not chat:
            return None

        return chat.chat_conversation

    # delete a chat
    async def delete_chat(self, chat_id: str):
        chat_model = await ChatModel.create_instance(self.db_client)

        return await chat_model.delete_chat_by_id(chat_id=ObjectId(chat_id))

    # rename a chat
    async def rename_chat(self, chat_id: str, new_title: str):
        chat_model = await ChatModel.create_instance(self.db_client)

        return await chat_model.update_chat_title(chat_id=ObjectId(chat_id), chat_title=new_title)
