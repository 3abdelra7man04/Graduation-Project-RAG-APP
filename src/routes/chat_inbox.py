from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from models.ChatModel import ChatModel
from datetime import datetime

chat_inbox_router = APIRouter(
    prefix="/api/v1/chat_inbox",
    tags=["api_v1", "chat_inbox"],
)

@chat_inbox_router.get("/list")
async def list_all_chats(request: Request):
    db_client = request.app.db_client

    chat_model = await ChatModel.create_instance(db_client)
    all_chats = await chat_model.get_all_chats(ascending=False)

    for chat in all_chats:
        chat["id"] = str(chat["_id"])
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

        # Format queries
        formatted_queries = []
        if "chat_conversation" in chat:
            for idx, conv in enumerate(chat["chat_conversation"]):
                formatted_queries.append({
                    "id": idx + 1,
                    "q": conv.get("question", ""),
                    "qAr": conv.get("question", ""),
                    "answer": conv.get("answer", ""),
                    "answerAr": conv.get("answer", ""),
                    "confidence": 1.0, # default since not stored
                    "source": None,
                    "time": chat.get("time", ""),
                    "liked": None
                })
        chat["queries"] = formatted_queries
        
        # default chat title to date time if none exists
        if not chat.get("chat_title"):
            chat["chat_title"] = f"{chat.get('date', '')} {chat.get('time', '')}"

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": "LIST_ALL_CHATS_SUCCESS", "all_chats": all_chats}
    )
