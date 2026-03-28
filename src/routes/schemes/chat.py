from pydantic import BaseModel
from typing import Optional
from bson.objectid import ObjectId

class ChatRequest(BaseModel):
    
    user_id: str
    query: str
    limit: Optional[int] = 3