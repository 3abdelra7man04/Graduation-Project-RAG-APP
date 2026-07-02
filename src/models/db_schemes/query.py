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
    
    # Monitoring and Token tracking fields
    query_answer: Optional[str] = None
    agent_in_tokens: Optional[int] = 0
    agent_out_tokens: Optional[int] = 0
    query_embed_tokens: Optional[int] = 0
    hyde_embed_tokens: Optional[int] = 0
    hyde_prompt_tokens: Optional[int] = 0
    hyde_completion_tokens: Optional[int] = 0
    query_classification_prompt_tokens: Optional[int] = 0
    query_classification_completion_tokens: Optional[int] = 0
    
    # Legacy / optional cost fields
    agent_cost: Optional[float] = 0.0
    tools_cost: Optional[float] = 0.0
    embedding_cost: Optional[float] = 0.0
    hyde_cost: Optional[float] = 0.0
    classification_cost: Optional[float] = 0.0
    total_cost: Optional[float] = 0.0
    tokens_in: Optional[int] = 0
    tokens_out: Optional[int] = 0
    tool_calls_count: Optional[int] = 0
    latency_seconds: Optional[float] = 0.0
    trace: Optional[list[dict]] = None

    class Config():
         arbitrary_types_allowed = True
    

    @classmethod
    def get_indexes(cls):
         return [
               {
                    "key": [("query_project_id", 1)],
                    "name": "query_project_id_index_1",
                    "unique": False,
               },
               {
                    "key": [("query_chat_id", 1)],
                    "name": "query_chat_id_index_1",
                    "unique": False,
               }]