# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import Optional
from models.enums.QueryTopicEnum import QueryTopicEnum

class CountTopicRequest(BaseModel):
    # json_schema_extra keeps the default visible in the OpenAPI docs,
    # which a bare default_factory would drop
    topic_list: list[str] = Field(default_factory=QueryTopicEnum.values,
                                  json_schema_extra={"default": QueryTopicEnum.values()})

class SuggestDocumentRequest(BaseModel):
    document_text: str
    metadata: Optional[dict] = {}