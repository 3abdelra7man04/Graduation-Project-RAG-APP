from .providers.QdrantDBProvider import QdrantDBProvider
from .vectordb_enums import VectordbEnums
from controllers.BaseController import BaseController

class VectordbFactory:
    def __init__(self, settings: dict):
        self.settings = settings
    
    def create_provider_instance(self, provider: str):

        # qdrant
        if provider == VectordbEnums.QDRANT.value:

            # get database path using base controller
            base_controller = BaseController()
            db_path = base_controller.get_database_path(db_path=self.settings.VECTOR_DB_PATH)

            return QdrantDBProvider(db_path= db_path, distance_method= self.settings.VECTOR_DB_DISTANCE_METHOD,)

        return None
    