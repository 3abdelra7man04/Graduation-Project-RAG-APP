from .BaseController import BaseController

class MonitorController(BaseController):
    
    def __init__(self, chat_history: dict):
        super().__init__()
