from ..vectordb_interface import VectordbInterface
from ..vectordb_enums import DistanceMethodsEnums
import logging
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

class QdrantDBProvider(VectordbInterface):
    
    # constructor
    def __init__(self, db_path: str):
        super().__init__()

        self.db_path = db_path

        self.client = QdrantClient(path = db_path)

        self.logger = logging.getLogger(__name__)

    # collection existence
    def does_collection_exist(self, collection_name: str) -> bool:
        return self.client.collection_exists(collection_name=collection_name)
    
    # list all collections
    def list_all_collections(self) -> list:
        return self.client.get_collections()
    
    # collection info
    def get_collection_info(self, collection_name: str) -> dict:
        return self.client.get_collection(collection_name=collection_name)

    # delete collection
    def delete_collection(self, collection_name):
        if self.does_collection_exist(collection_name):
            return self.client.delete_collection(collection_name=collection_name)

        self.logger.error(f"cannot find collection of name : {collection_name}")
        return False

    # create collection
    def create_collection(self, collection_name, embedding_size, distance_method, do_reset = False):
        
        if do_reset:
            self.delete_collection(collection_name)
        
        # cosine distance
        if distance_method == DistanceMethodsEnums.COSINE.value:
            self.distance_method = Distance.COSINE
        
        # dot distance
        if distance_method == DistanceMethodsEnums.DOT.value:
            self.distance_method = Distance.DOT
        
        # if collection does not exist
        if not self.does_collection_exist(collection_name):
            self.client.create_collection(collection_name = collection_name,
                                          vectors_config = VectorParams(size= embedding_size,
                                                                                     distance=self.distance_method))

            return True
        
        # if collection does exist
        return False
    
    def insert_vectors(self, collection_name: str, embedding_texts: list, embedding_vectors: list,
                         metadatas: list = None, record_ids: list = None, batch_size: int = 50):

        # handle none metadata and record ids
        if metadatas is None:
            metadatas = [None] * len(embedding_texts)
        
        if record_ids is None:
            record_ids = [None] * len(embedding_texts)
        
        # check collection existence
        if not self.does_collection_exist(collection_name= collection_name):
            self.logger.error(f"cannot find collection of name : {collection_name}")
            return False
        
        # insert vectors
        for i in range(0, len(embedding_texts), batch_size):
            batch_end = i + batch_size

            batch_embedding_texts = embedding_texts[i:batch_end]
            batch_embedding_vectors = embedding_vectors[i:batch_end]
            batch_metadatas = metadatas[i:batch_end]
            batch_record_ids = record_ids[i:batch_end]
            
            try:
                self.client.upsert(collection_name= collection_name,
                                wait=True,
                                points= [PointStruct(id=batch_record_ids[j], vector=batch_embedding_vectors[j],
                                                    payload={
                                                        "text": batch_embedding_texts[j],
                                                        "metadata": batch_metadatas[j]
                                                    }) 
                                        for j in range(len(batch_embedding_texts))]
                                )
            except Exception as e:
                self.logger.error(f"Error while inserting batch {e}")
                return False
        
        return True
    
    def search_vectors(self, collection_name: str, query_vector: list, limit: int):
        # check collection existence
        if not self.does_collection_exist(collection_name= collection_name):
            self.logger.error(f"cannot find collection of name : {collection_name}")
            return False
        
        return self.client.query_points(collection_name= collection_name,
                                        query=query_vector, limit=limit).points