from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
import logging
from .schemes.chat import ChatRequest, RenameChatRequest
from models.enums.ResponseEnums import ResponseSignal
from services import ChatService

# Uvicorn logger instance
logger = logging.getLogger("uvicorn.error")

# chat API router
chat_router = APIRouter(
    prefix="/api/v1/chat",
    tags=["api_v1", "chat"],
)

# project not found response
def project_not_found_response():
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value},
    )


# start conversation
@chat_router.post("/{project_id}")
async def start_conversation(request: Request, project_id: str, chat_request: ChatRequest):

    chat_service = ChatService.from_app(request.app)

    project = await chat_service.get_project(project_id=project_id)

    # project not found
    if not project:
        return project_not_found_response()

    result = await chat_service.start_conversation(project=project, chat_request=chat_request)

    if not result["answer"]:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.RAG_ANSWER_ERROR.value}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.RAG_ANSWER_SUCCESS.value, **result}
    )


# continue conversation
@chat_router.post("/{project_id}/c/{chat_id}")
async def continue_conversation(request: Request, project_id: str, chat_id: str, chat_request: ChatRequest):

    chat_service = ChatService.from_app(request.app)

    project = await chat_service.get_project(project_id=project_id)

    # project not found
    if not project:
        return project_not_found_response()

    result = await chat_service.continue_conversation(project=project, chat_id=chat_id,
                                                      chat_request=chat_request)

    if not result["answer"]:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.RAG_ANSWER_ERROR.value}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.RAG_ANSWER_SUCCESS.value, **result}
    )


# list all the chats of a user
@chat_router.get("/{project_id}/list/{user_id}")
async def list_chats(request: Request, project_id: str, user_id: str):

    chat_service = ChatService.from_app(request.app)

    project = await chat_service.get_project(project_id=project_id)

    # project not found
    if not project:
        return project_not_found_response()

    all_chats = await chat_service.list_user_chats(project=project, user_id=user_id)

    if not all_chats:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.LIST_CHATS_ERROR.value}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.LIST_CHATS_SUCCESS.value,
                 "all_chats": all_chats}
    )


# get the conversation of a chat
@chat_router.get("/{project_id}/get/{chat_id}")
async def get_chat_conversation(request: Request, project_id: str, chat_id: str):

    chat_service = ChatService.from_app(request.app)

    project = await chat_service.get_project(project_id=project_id)

    # project not found
    if not project:
        return project_not_found_response()

    chat_conversation = await chat_service.get_conversation(chat_id=chat_id)

    if chat_conversation is None:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.LIST_CHATS_ERROR.value}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.LIST_CHATS_SUCCESS.value,
                 "chat_conversation": chat_conversation}
    )


# delete a conversation
@chat_router.delete("/{project_id}/delete/{chat_id}")
async def delete_conversation(request: Request, project_id: str, chat_id: str):

    chat_service = ChatService.from_app(request.app)

    project = await chat_service.get_project(project_id=project_id)

    # project not found
    if not project:
        return project_not_found_response()

    del_res = await chat_service.delete_chat(chat_id=chat_id)

    if not del_res:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.CHAT_DELETE_ERROR.value}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.CHAT_DELETE_SUCCESS.value}
    )


# rename a chat
@chat_router.put("/{project_id}/rename/{chat_id}")
async def rename_chat(request: Request, project_id: str, chat_id: str, rename_chat_request: RenameChatRequest):

    chat_service = ChatService.from_app(request.app)

    project = await chat_service.get_project(project_id=project_id)

    # project not found
    if not project:
        return project_not_found_response()

    rename_res = await chat_service.rename_chat(chat_id=chat_id,
                                                new_title=rename_chat_request.new_title)

    if not rename_res:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.CHAT_RENAME_ERROR.value}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.CHAT_RENAME_SUCCESS.value}
    )
