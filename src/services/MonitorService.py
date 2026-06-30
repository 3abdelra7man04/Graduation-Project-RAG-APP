from .BaseService import BaseService

class MonitorService(BaseService):
    
    def __init__(self, chat_history: dict):
        super().__init__()
