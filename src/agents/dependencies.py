from stores.llm.templates.template_parser import TemplateParser
from dataclasses import dataclass
from typing import Optional, Any
from controllers.NLPController import NLPController

@dataclass
class AgentDeps:
    nlp_controller: Optional[NLPController] = None
    project: Optional[Any] = None
    template_parser: Optional[TemplateParser] = None
    limit: int = 5