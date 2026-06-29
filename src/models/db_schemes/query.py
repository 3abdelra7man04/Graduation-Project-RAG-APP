from pydantic import Field, BaseModel
from typing import Optional
from bson.objectid import ObjectId
from datetime import datetime

class Query(BaseModel):
    id: Optional[ObjectId] = Field(None, alias = "_id")
    query_project_id: ObjectId
    query_chat_id: ObjectId
    query_user_id: ObjectId
    query_text: str
    query_topic: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    failed: bool = False
    resolved: bool = True

    class Config():
         arbitrary_types_allowed = True
    

    @classmethod
    def get_indexes(cls):
         return [
               {
                    "key": [("query_project_id", 1)],
                    "name": "query_project_id_index_1",
                    "unique": False,
               }]