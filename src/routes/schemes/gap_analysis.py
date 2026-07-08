# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional

class CountTopicRequest(BaseModel):
    topic_list: list[str] = ["regulations", "curriculum", "courses",
                             "departments", "academic_calendar", "social", "non-relevant", "other"]

class SuggestDocumentRequest(BaseModel):
    document_text: str
    metadata: Optional[dict] = {}