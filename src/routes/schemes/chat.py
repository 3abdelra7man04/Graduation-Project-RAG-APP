from pydantic import BaseModel
from typing import Optional
from bson.objectid import ObjectId

class ChatRequest(BaseModel):
    
    user_id: str
    query: str
    limit: Optional[int] = 3

class RenameChatRequest(BaseModel):

    new_title: str
