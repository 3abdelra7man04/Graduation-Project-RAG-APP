from pydantic import BaseModel
from typing import Literal, Optional
from models.enums.QueryTopicEnum import QueryTopicEnum

# derived from QueryTopicEnum so the topic list lives in one place.
# kept as a Literal (not the enum itself) so model_json_schema() still emits an
# inline string enum - this scheme is sent to the provider in strict json_schema mode.
TopicLiteral = Literal[tuple(QueryTopicEnum.values())]  # type: ignore[valid-type]

class QueryClassification(BaseModel):
    topic: TopicLiteral
    failed: Literal[True, False]
