from pydantic import BaseModel
from typing import Literal, Optional

class QueryClassification(BaseModel):
    topic: Literal["regulations", "curriculum", "courses", "departments", "academic_calendar",
     "social", "non-relevant", "other"]
    failed: Literal[True, False]
    
    