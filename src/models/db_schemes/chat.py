from pydantic import Field, BaseModel
from typing import Optional
from bson.objectid import ObjectId
from datetime import datetime

class Chat(BaseModel):
    id: Optional[ObjectId] = Field(None, alias = "_id")
    chat_project_id: ObjectId
    chat_user_id: ObjectId
    chat_title: str
    chat_history: list[dict]
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config():
         arbitrary_types_allowed = True
    

    @classmethod
    def get_indexes(cls):
         return [
               {
                         "key": [("user_project_id", 1)],
                         "name": "user_project_id_index_1",
                         "unique": False
               }]