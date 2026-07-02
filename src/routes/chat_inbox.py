from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from models.ChatModel import ChatModel
from models.QueryModel import QueryModel
from bson import ObjectId
from datetime import datetime

chat_inbox_router = APIRouter(
    prefix="/api/v1/chat_inbox",
    tags=["api_v1", "chat_inbox"],
)

from services.MonitorService import (
    MonitorService,
    calculate_cost,
    HYDE_INPUT_PRICE_PER_1M,
    HYDE_OUTPUT_PRICE_PER_1M,
    EMBEDDING_INPUT_PRICE_PER_1M,
    EMBEDDING_OUTPUT_PRICE_PER_1M,
    CLASSIFICATION_INPUT_PRICE_PER_1M,
    CLASSIFICATION_OUTPUT_PRICE_PER_1M
)


@chat_inbox_router.get("/list")
async def list_all_chats(request: Request):
    db_client = request.app.db_client

    chat_model = await ChatModel.create_instance(db_client)
    query_model = await QueryModel.create_instance(db_client)
    all_chats = await chat_model.get_all_chats(ascending=False)

    for chat in all_chats:
        chat_id_str = str(chat["_id"])
        chat["id"] = chat_id_str
        del chat["_id"]
        
        if "chat_user_id" in chat:
            chat["chat_user_id"] = str(chat["chat_user_id"])
        if "chat_project_id" in chat:
            chat["chat_project_id"] = str(chat["chat_project_id"])
            
        if "updatedAt" in chat and chat["updatedAt"]:
            # create date and time fields for the UI
            chat["date"] = chat["updatedAt"].strftime("%Y-%m-%d")
            chat["time"] = chat["updatedAt"].strftime("%I:%M %p")
            chat["updatedAt"] = str(chat["updatedAt"])
            
        if "expiresAt" in chat and chat["expiresAt"]:
            chat["expiresAt"] = str(chat["expiresAt"])

        # Extract per-turn metrics from chat_history (always has data from provider)
        chat_history = chat.get("chat_history", [])
        turn_metrics = MonitorService._extract_per_turn_metrics_from_history(chat_history)

        # Also fetch QueryModel records for trace data (may be empty for old chats)
        queries_db = []
        try:
            target_id = ObjectId(chat_id_str)
        except Exception:
            target_id = chat_id_str
        try:
            queries_db = await query_model.list_queries_by_chat_id(chat_id=target_id, ascending=True)
        except Exception:
            pass

        # Format queries from chat_conversation
        formatted_queries = []
        if "chat_conversation" in chat:
            for idx, conv in enumerate(chat["chat_conversation"]):
                q_db = queries_db[idx] if idx < len(queries_db) else None
                hist_metrics = turn_metrics[idx] if idx < len(turn_metrics) else None

                q_agent_cost = hist_metrics["provider_cost"] if hist_metrics else (getattr(q_db, "agent_cost", 0.0) or 0.0)
                q_tin = getattr(q_db, "tokens_in", 0) or (hist_metrics["tokens_in"] if hist_metrics else 0) if q_db else (hist_metrics["tokens_in"] if hist_metrics else 0)
                q_tout = getattr(q_db, "tokens_out", 0) or (hist_metrics["tokens_out"] if hist_metrics else 0) if q_db else (hist_metrics["tokens_out"] if hist_metrics else 0)
                q_latency = getattr(q_db, "latency_seconds", 0.0) or (hist_metrics["latency"] if hist_metrics else 0.0) if q_db else (hist_metrics["latency"] if hist_metrics else 0.0)
                q_trace = getattr(q_db, "trace", []) or [] if q_db else []

                agent_in = getattr(q_db, "agent_in_tokens", 0) or q_tin if q_db else q_tin
                agent_out = getattr(q_db, "agent_out_tokens", 0) or q_tout if q_db else q_tout
                q_embed_tok = getattr(q_db, "query_embed_tokens", 0) or 0 if q_db else 0
                h_embed_tok = getattr(q_db, "hyde_embed_tokens", 0) or 0 if q_db else 0
                hyde_in = getattr(q_db, "hyde_prompt_tokens", 0) or 0 if q_db else 0
                hyde_out = getattr(q_db, "hyde_completion_tokens", 0) or 0 if q_db else 0
                class_in = getattr(q_db, "query_classification_prompt_tokens", 0) or 0 if q_db else 0
                class_out = getattr(q_db, "query_classification_completion_tokens", 0) or 0 if q_db else 0
                tool_calls = getattr(q_db, "tool_calls_count", 0) or 0 if q_db else 0

                embedding_cost = calculate_cost(q_embed_tok + h_embed_tok, 0, EMBEDDING_INPUT_PRICE_PER_1M, EMBEDDING_OUTPUT_PRICE_PER_1M)
                hyde_cost = calculate_cost(hyde_in, hyde_out, HYDE_INPUT_PRICE_PER_1M, HYDE_OUTPUT_PRICE_PER_1M)
                q_tools_cost = round(embedding_cost + hyde_cost, 9)
                q_class_cost = calculate_cost(class_in, class_out, CLASSIFICATION_INPUT_PRICE_PER_1M, CLASSIFICATION_OUTPUT_PRICE_PER_1M)
                q_cost = round(q_agent_cost + embedding_cost + hyde_cost + q_class_cost, 9)

                formatted_queries.append({
                    "id": idx + 1,
                    "q": conv.get("question", ""),
                    "qAr": conv.get("question", ""),
                    "answer": conv.get("answer", ""),
                    "answerAr": conv.get("answer", ""),
                    "query_cost": q_cost,
                    "latency": q_latency,
                    "tokens_in": q_tin,
                    "tokens_out": q_tout,
                    "agent_in_tokens": agent_in,
                    "agent_out_tokens": agent_out,
                    "query_embed_tokens": q_embed_tok,
                    "hyde_embed_tokens": h_embed_tok,
                    "hyde_prompt_tokens": hyde_in,
                    "hyde_completion_tokens": hyde_out,
                    "query_classification_prompt_tokens": class_in,
                    "query_classification_completion_tokens": class_out,
                    "tool_calls_count": tool_calls,
                    "agent_cost": q_agent_cost,
                    "tools_cost": q_tools_cost,
                    "embedding_cost": embedding_cost,
                    "hyde_cost": hyde_cost,
                    "classification_cost": q_class_cost,
                    "trace": q_trace,
                    "source": None,
                    "time": chat.get("time", ""),
                    "liked": None
                })
        chat["queries"] = formatted_queries
        
        # Build conversation totals from formatted queries
        total_cost = sum(q["query_cost"] for q in formatted_queries) if formatted_queries else sum(m["provider_cost"] for m in turn_metrics)
        total_latency = sum(q["latency"] for q in formatted_queries) if formatted_queries else sum(m["latency"] for m in turn_metrics)
        total_tokens_in = sum(q["tokens_in"] for q in formatted_queries) if formatted_queries else sum(m["tokens_in"] for m in turn_metrics)
        total_tokens_out = sum(q["tokens_out"] for q in formatted_queries) if formatted_queries else sum(m["tokens_out"] for m in turn_metrics)
        count = len(formatted_queries) or len(turn_metrics)

        chat["total_conversation_cost"] = round(total_cost, 6)
        chat["avg_latency_seconds"] = round(total_latency / count, 4) if count > 0 else 0.0
        chat["total_tokens_in"] = total_tokens_in
        chat["total_tokens_out"] = total_tokens_out
        
        # Remove chat_history from response (it's huge and not needed by the UI)
        if "chat_history" in chat:
            del chat["chat_history"]
        if "chat_conversation" in chat:
            del chat["chat_conversation"]

        # default chat title to date time if none exists
        if not chat.get("chat_title"):
            chat["chat_title"] = f"{chat.get('date', '')} {chat.get('time', '')}"

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": "LIST_ALL_CHATS_SUCCESS", "all_chats": all_chats}
    )
