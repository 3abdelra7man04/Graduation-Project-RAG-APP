from stores.llm.templates.template_parser import TemplateParser
from dataclasses import dataclass
from typing import Optional, Any
from services.NLPService import NLPService

@dataclass
class AgentDeps:
    nlp_service: Optional[NLPService] = None
    project: Optional[Any] = None
    template_parser: Optional[TemplateParser] = None
    limit: int = 5
    monitor_service: Optional[Any] = None