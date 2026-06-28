from stores.llm.templates.template_parser import TemplateParser
from dataclasses import dataclass
from typing import Optional, Any
from controllers.NLPController import NLPController
from models.FailedQueriesModel import FailedQueriesModel

@dataclass
class AgentDeps:
    nlp_controller: Optional[NLPController] = None
    project: Optional[Any] = None
    failed_queries_model: Optional[FailedQueriesModel] = None
    template_parser: Optional[TemplateParser] = None
    limit: int = 5