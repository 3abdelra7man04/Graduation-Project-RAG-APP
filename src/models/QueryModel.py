from sqlalchemy import true
from .BaseDataModel import BaseDataModel
from .enums.DataBaseEnum import DataBaseEnum
from bson.objectid import ObjectId
from .db_schemes.query import Query
from datetime import datetime, timedelta


class QueryModel(BaseDataModel):
    def __init__(self, db_client: object):
        super().__init__(db_client = db_client)
        self.collection = self.db_client[DataBaseEnum.QUERIES_COLLECTION_NAME.value]
    
    @classmethod
    async def create_instance(cls, db_client: object):
        instance = cls(db_client = db_client)
        await instance.init_collection()
        return instance
    
    async def init_collection(self):
        all_collections = await self.db_client.list_collection_names()
        
        if DataBaseEnum.QUERIES_COLLECTION_NAME.value not in all_collections:
            self.collection = self.db_client[DataBaseEnum.QUERIES_COLLECTION_NAME.value]
            indexes = Query.get_indexes()
            for index in indexes:
                keys = index.pop("key")
                await  self.collection.create_index(
                    keys = keys,
                    **index
                )
    
    # creates chat and returns its id
    async def add_query(self, query: Query):
        result = await self.collection.insert_one(query.model_dump(by_alias=True, exclude_unset=True))
        query.id = result.inserted_id

        return result.inserted_id
    
    async def delete_query_by_id(self, query_id: ObjectId):
        result = await self.collection.delete_one({"_id": query_id})

        return result

    async def list_queries_by_project_id(self, project_id: ObjectId, ascending: bool = False):
        
        if ascending == True: 
            order = 1
        else:
            order = -1

        queries = await self.collection.find({
                "query_project_id": project_id
                }).sort("createdAt", order).to_list(length = None)

        return queries
