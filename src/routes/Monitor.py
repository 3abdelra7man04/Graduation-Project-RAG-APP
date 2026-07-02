from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from bson import ObjectId
from models.ProjectModel import ProjectModel
from models.ChatModel import ChatModel
from models.QueryModel import QueryModel
from models.enums.ResponseEnums import ResponseSignal
from services.MonitorService import MonitorService
import logging

logger = logging.getLogger("uvicorn.error")

monitor_router = APIRouter(
    prefix="/api/v1/monitor",
    tags=["api_v1", "monitor"],
)

@monitor_router.get("/stats/{project_id}")
async def get_project_monitor_stats(request: Request, project_id: str):
    """Get overall cost averages and total metrics across all queries in a project."""
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)
        
        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )
            
        query_model = await QueryModel.create_instance(db_client)
        queries = await query_model.list_queries_by_project_id(project_id=project.id)
        
        stats = MonitorService.calculate_project_stats(queries)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.MONITOR_STATS_SUCCESS.value,
                "project_id": str(project.id),
                "stats": stats
            }
        )
    except Exception as e:
        logger.error(f"Error in get_project_monitor_stats: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@monitor_router.get("/queries/{project_id}")
async def list_project_queries_with_trace(request: Request, project_id: str):
    """List all queries in a project with individual cost breakdown and agent trace."""
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)
        
        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )
            
        query_model = await QueryModel.create_instance(db_client)
        queries = await query_model.list_queries_by_project_id(project_id=project.id)
        
        queries_data = []
        for q in queries:
            queries_data.append({
                "query_id": str(getattr(q, "id", "")),
                "query_chat_id": str(getattr(q, "query_chat_id", "")),
                "query_user_id": str(getattr(q, "query_user_id", "")),
                "query_text": getattr(q, "query_text", ""),
                "query_answer": getattr(q, "query_answer", ""),
                "query_topic": getattr(q, "query_topic", ""),
                "createdAt": getattr(q, "createdAt", None).isoformat() if getattr(q, "createdAt", None) else None,
                "agent_cost": getattr(q, "agent_cost", 0.0) or 0.0,
                "tools_cost": getattr(q, "tools_cost", 0.0) or 0.0,
                "embedding_cost": getattr(q, "embedding_cost", 0.0) or 0.0,
                "hyde_cost": getattr(q, "hyde_cost", 0.0) or 0.0,
                "total_cost": getattr(q, "total_cost", 0.0) or 0.0,
                "tokens_in": getattr(q, "tokens_in", 0) or 0,
                "tokens_out": getattr(q, "tokens_out", 0) or 0,
                "agent_in_tokens": getattr(q, "agent_in_tokens", 0) or 0,
                "agent_out_tokens": getattr(q, "agent_out_tokens", 0) or 0,
                "query_embed_tokens": getattr(q, "query_embed_tokens", 0) or 0,
                "hyde_embed_tokens": getattr(q, "hyde_embed_tokens", 0) or 0,
                "hyde_prompt_tokens": getattr(q, "hyde_prompt_tokens", 0) or 0,
                "hyde_completion_tokens": getattr(q, "hyde_completion_tokens", 0) or 0,
                "query_classification_prompt_tokens": getattr(q, "query_classification_prompt_tokens", 0) or 0,
                "query_classification_completion_tokens": getattr(q, "query_classification_completion_tokens", 0) or 0,
                "tool_calls_count": getattr(q, "tool_calls_count", 0) or 0,
                "latency_seconds": getattr(q, "latency_seconds", 0.0) or 0.0,
                "trace": getattr(q, "trace", []) or []
            })
            
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.MONITOR_QUERY_SUCCESS.value,
                "project_id": str(project.id),
                "count": len(queries_data),
                "queries": queries_data
            }
        )
    except Exception as e:
        logger.error(f"Error in list_project_queries_with_trace: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@monitor_router.get("/query/{query_id}")
async def get_single_query_monitor_data(request: Request, query_id: str):
    """Get cost breakdown, tokens, latency, and full replay trace for a single query."""
    try:
        db_client = request.app.db_client
        query_model = await QueryModel.create_instance(db_client)
        try:
            target_id = ObjectId(query_id)
        except Exception:
            target_id = query_id
        query = await query_model.get_query_by_id(query_id=target_id)
        
        if not query:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"signal": ResponseSignal.MONITOR_QUERY_NOT_FOUND.value}
            )
            
        data = {
            "query_id": str(getattr(query, "id", "")),
            "query_project_id": str(getattr(query, "query_project_id", "")),
            "query_chat_id": str(getattr(query, "query_chat_id", "")),
            "query_user_id": str(getattr(query, "query_user_id", "")),
            "query_text": getattr(query, "query_text", ""),
            "query_answer": getattr(query, "query_answer", ""),
            "query_topic": getattr(query, "query_topic", ""),
            "createdAt": getattr(query, "createdAt", None).isoformat() if getattr(query, "createdAt", None) else None,
            "agent_cost": getattr(query, "agent_cost", 0.0) or 0.0,
            "tools_cost": getattr(query, "tools_cost", 0.0) or 0.0,
            "embedding_cost": getattr(query, "embedding_cost", 0.0) or 0.0,
            "hyde_cost": getattr(query, "hyde_cost", 0.0) or 0.0,
            "total_cost": getattr(query, "total_cost", 0.0) or 0.0,
            "tokens_in": getattr(query, "tokens_in", 0) or 0,
            "tokens_out": getattr(query, "tokens_out", 0) or 0,
            "agent_in_tokens": getattr(query, "agent_in_tokens", 0) or 0,
            "agent_out_tokens": getattr(query, "agent_out_tokens", 0) or 0,
            "query_embed_tokens": getattr(query, "query_embed_tokens", 0) or 0,
            "hyde_embed_tokens": getattr(query, "hyde_embed_tokens", 0) or 0,
            "hyde_prompt_tokens": getattr(query, "hyde_prompt_tokens", 0) or 0,
            "hyde_completion_tokens": getattr(query, "hyde_completion_tokens", 0) or 0,
            "query_classification_prompt_tokens": getattr(query, "query_classification_prompt_tokens", 0) or 0,
            "query_classification_completion_tokens": getattr(query, "query_classification_completion_tokens", 0) or 0,
            "tool_calls_count": getattr(query, "tool_calls_count", 0) or 0,
            "latency_seconds": getattr(query, "latency_seconds", 0.0) or 0.0,
            "trace": getattr(query, "trace", []) or []
        }
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.MONITOR_QUERY_SUCCESS.value,
                "query": data
            }
        )
    except Exception as e:
        logger.error(f"Error in get_single_query_monitor_data: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@monitor_router.get("/conversations/{project_id}")
async def list_project_conversations_with_cost(request: Request, project_id: str):
    """List all conversations in a project with total cost and query counts."""
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)
        
        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )
            
        chat_model = await ChatModel.create_instance(db_client)
        chats = await chat_model.collection.find({"chat_project_id": project.id}).to_list(length=None)
        
        query_model = await QueryModel.create_instance(db_client)
        
        conversations_data = []
        for c_dict in chats:
            chat_id = c_dict["_id"]
            queries = await query_model.list_queries_by_chat_id(chat_id=chat_id, ascending=True)
            stats = MonitorService.calculate_conversation_stats(chat=c_dict, queries=queries, chat_history=c_dict.get("chat_history", []))
            
            conversations_data.append({
                "chat_id": str(chat_id),
                "chat_title": c_dict.get("chat_title", ""),
                "is_guest_chat": c_dict.get("is_guest_chat", False),
                "updatedAt": c_dict.get("updatedAt", None).isoformat() if c_dict.get("updatedAt", None) else None,
                "queries_count": stats["queries_count"],
                "total_conversation_cost": stats["total_conversation_cost"],
                "total_agent_cost": stats["total_agent_cost"],
                "total_tools_cost": stats["total_tools_cost"],
                "avg_query_cost": stats["avg_query_cost_in_conversation"]
            })
            
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.MONITOR_CONVERSATION_SUCCESS.value,
                "project_id": str(project.id),
                "count": len(conversations_data),
                "conversations": conversations_data
            }
        )
    except Exception as e:
        logger.error(f"Error in list_project_conversations_with_cost: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@monitor_router.get("/conversation/{chat_id}")
async def get_conversation_monitor_data(request: Request, chat_id: str):
    """Get total cost, average query cost, and step-by-step trace of all queries in a conversation."""
    try:
        db_client = request.app.db_client
        chat_model = await ChatModel.create_instance(db_client)
        try:
            target_id = ObjectId(chat_id)
        except Exception:
            target_id = chat_id
            
        chat = await chat_model.get_chat_by_id(chat_id=target_id)
        
        if not chat:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"signal": ResponseSignal.MONITOR_CONVERSATION_NOT_FOUND.value}
            )
            
        query_model = await QueryModel.create_instance(db_client)
        queries = await query_model.list_queries_by_chat_id(chat_id=target_id, ascending=True)
        
        # Pass chat_history so we can fall back to provider data for old chats
        chat_history = getattr(chat, "chat_history", []) or []
        stats = MonitorService.calculate_conversation_stats(chat=chat, queries=queries, chat_history=chat_history)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.MONITOR_CONVERSATION_SUCCESS.value,
                "conversation": stats
            }
        )
    except Exception as e:
        logger.error(f"Error in get_conversation_monitor_data: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )
