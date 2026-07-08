from sqlalchemy import true
from .BaseDataModel import BaseDataModel
from .enums.DataBaseEnum import DataBaseEnum
from bson.objectid import ObjectId
from .db_schemes.query import Query
from datetime import datetime, timedelta
from typing import Optional


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

    async def get_query_by_id(self, query_id: ObjectId):
        query = await self.collection.find_one({"_id": query_id})
        if not query:
            return None
        return Query(**query)

    async def list_queries_by_chat_id(self, chat_id: ObjectId, ascending: bool = False):
        order = 1 if ascending else -1
        queries = await self.collection.find({
            "query_chat_id": chat_id
        }).sort("createdAt", order).to_list(length=None)
        return [Query(**q) for q in queries]

    async def list_queries_by_project_id(self, project_id: ObjectId, ascending: bool = False):
        
        if ascending == True: 
            order = 1
        else:
            order = -1

        queries = await self.collection.find({
                "query_project_id": project_id
                }).sort("createdAt", order).to_list(length = None)

        return [Query(**q) for q in queries]

    async def count_queries_by_query_topic(
        self,
        query_topic: Optional[str] = None,
        project_id: Optional[ObjectId] = None,
    ):
        match_stage = {}
        if query_topic is not None:
            match_stage["query_topic"] = query_topic
        if project_id is not None:
            match_stage["query_project_id"] = project_id

        if query_topic is not None:
            return await self.collection.count_documents(match_stage)

        pipeline = []
        if match_stage:
            pipeline.append({"$match": match_stage})

        pipeline.append({
            "$group": {
                "_id": "$query_topic",
                "count": {"$sum": 1}
            }
        })
        pipeline.append({
            "$sort": {"count": -1}
        })

        results = await self.collection.aggregate(pipeline).to_list(length=None)
        return {doc.get("_id", "Unknown"): doc.get("count", 0) for doc in results}

    async def count_queries_by_topic(
        self,
        query_topic: Optional[str] = None,
        project_id: Optional[ObjectId] = None,
    ):
        return await self.count_queries_by_query_topic(
            query_topic=query_topic,
            project_id=project_id,
        )

    async def count_failed_queries(self, project_id: ObjectId):
        return await self.collection.count_documents({
            "query_project_id": project_id,
            "failed": True
        })

    async def count_total_queries(self, project_id: ObjectId):
        return await self.collection.count_documents({
            "query_project_id": project_id
        })

    async def get_unresolved_failed_queries(self, project_id: ObjectId, ascending: bool = False):
        order = 1 if ascending else -1
        queries = await self.collection.find({
            "query_project_id": project_id,
            "failed": True,
            "resolved": {"$ne": True}
        }).sort("createdAt", order).to_list(length=None)
        return [Query(**q) for q in queries]

    async def update_query_resolved_state(self, query_id: ObjectId, resolved: bool = True):
        result = await self.collection.update_one(
            {"_id": query_id},
            {"$set": {"resolved": resolved}}
        )
        return result

    async def count_answered_queries_total(self, project_id: ObjectId):
        project_id = ObjectId(project_id) if isinstance(project_id, str) else project_id
        return await self.collection.count_documents({
            "query_project_id": project_id,
            "$or": [
                {"failed": {"$ne": True}},
                {"resolved": True}
            ]
        })

    async def count_answered_queries_this_week(self, project_id: ObjectId):
        project_id = ObjectId(project_id) if isinstance(project_id, str) else project_id
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        return await self.collection.count_documents({
            "query_project_id": project_id,
            "createdAt": {"$gte": seven_days_ago},
            "$or": [
                {"failed": {"$ne": True}},
                {"resolved": True}
            ]
        })

    async def get_avg_latency_overall(self, project_id: ObjectId):
        project_id = ObjectId(project_id) if isinstance(project_id, str) else project_id
        pipeline = [
            {
                "$match": {
                    "query_project_id": project_id,
                    "latency_seconds": {"$exists": True, "$ne": None, "$gt": 0},
                    "$or": [
                        {"failed": {"$ne": True}},
                        {"resolved": True}
                    ]
                }
            },
            {
                "$group": {
                    "_id": None,
                    "avg_latency": {"$avg": "$latency_seconds"}
                }
            }
        ]
        results = await self.collection.aggregate(pipeline).to_list(length=None)
        if results and "avg_latency" in results[0] and results[0]["avg_latency"] is not None:
            return float(results[0]["avg_latency"])
        return 0.0

    async def get_avg_latency_this_week(self, project_id: ObjectId):
        project_id = ObjectId(project_id) if isinstance(project_id, str) else project_id
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        pipeline = [
            {
                "$match": {
                    "query_project_id": project_id,
                    "createdAt": {"$gte": seven_days_ago},
                    "latency_seconds": {"$exists": True, "$ne": None, "$gt": 0},
                    "$or": [
                        {"failed": {"$ne": True}},
                        {"resolved": True}
                    ]
                }
            },
            {
                "$group": {
                    "_id": None,
                    "avg_latency": {"$avg": "$latency_seconds"}
                }
            }
        ]
        results = await self.collection.aggregate(pipeline).to_list(length=None)
        if results and "avg_latency" in results[0] and results[0]["avg_latency"] is not None:
            return float(results[0]["avg_latency"])
        return 0.0
