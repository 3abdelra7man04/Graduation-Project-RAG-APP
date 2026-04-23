from pydantic import BaseModel
from typing import Optional

class ProcessRequest(BaseModel):
    file_id: str = None
    chunk_size: Optional[int] = 500
    chunk_overlap: Optional[int] = 50
    do_reset: Optional[bool] = False
    