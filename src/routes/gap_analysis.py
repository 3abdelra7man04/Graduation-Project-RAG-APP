from bson import ObjectId
from fastapi import FastAPI, APIRouter, Depends, UploadFile, status, Request
from fastapi.responses import JSONResponse
import logging
from .schemes.gap_analysis import CountTopicRequest, SuggestDocumentRequest
from models.ProjectModel import ProjectModel
from models.QueryModel import QueryModel
from models.ChunkModel import ChunkModel
from models.db_schemes.data_chunk import DataChunk
from services import NLPService
from models.enums.ResponseEnums import ResponseSignal

# Uvicorn logger instance
logger = logging.getLogger("uvicorn.error")

# gap analysis API router
gap_analysis_router = APIRouter(
    prefix="/api/v1/gap_analysis",
    tags=["api_v1", "gap_analysis"],
)


@gap_analysis_router.api_route("/topics/{project_id}", methods=["GET", "POST"])
async def count_gap_analysis_topics(
    request: Request,
    project_id: str,
    topic_request: CountTopicRequest = Depends()
):
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)

        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )

        topic_list = topic_request.topic_list
        if request.method == "POST":
            try:
                body = await request.json()
                if isinstance(body, dict) and "topic_list" in body:
                    topic_list = body["topic_list"]
            except Exception:
                pass

        query_model = await QueryModel.create_instance(db_client)
        all_topic_counts = await query_model.count_queries_by_topic(project_id=project.id)

        total_queries = sum(all_topic_counts.values())
        total_queries_for_pct = total_queries if total_queries > 0 else 1

        topics_data = []
        for topic in topic_list:
            count = all_topic_counts.get(topic, 0)
            percentage = round((count / total_queries_for_pct) * 100, 2) if total_queries > 0 else 0.0
            topics_data.append({
                "topic": topic,
                "nameKey": topic,
                "count": count,
                "queries": count,
                "percentage": percentage,
                "covered": percentage
            })

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.GAP_ANALYSIS_TOPICS_SUCCESS.value,
                "project_id": str(project.id),
                "total_queries": total_queries,
                "topics": topics_data
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code= status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.GAP_ANALYSIS_TOPICS_ERROR.value}
        )

@gap_analysis_router.get("/well_covered/{project_id}")
async def count_well_covered_topics(request: Request, project_id: str):
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)

        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )

        query_model = await QueryModel.create_instance(db_client)
        total_queries = await query_model.count_total_queries(project_id=project.id)
        failed_queries = await query_model.count_failed_queries(project_id=project.id)
        well_covered_queries = max(0, total_queries - failed_queries)

        if total_queries > 0:
            well_covered_percentage = round((well_covered_queries / total_queries) * 100, 2)
            failed_percentage = round((failed_queries / total_queries) * 100, 2)
        else:
            well_covered_percentage = 100.0
            failed_percentage = 0.0

        overview = [
            {
                "labelKey": "wellCovered",
                "count": well_covered_queries,
                "pct": well_covered_percentage,
                "percentageStr": f"{well_covered_percentage}%"
            },
            {
                "labelKey": "gapDetected",
                "count": failed_queries,
                "pct": failed_percentage,
                "percentageStr": f"{failed_percentage}%"
            }
        ]

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.GAP_ANALYSIS_WELL_COVERED_SUCCESS.value,
                "project_id": str(project.id),
                "total_queries": total_queries,
                "failed_queries": failed_queries,
                "failed_percentage": failed_percentage,
                "well_covered_queries": well_covered_queries,
                "well_covered_percentage": well_covered_percentage,
                "overview": overview
            }
        )
    except Exception as e:
        logger.error(f"Error in count_well_covered_topics: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.GAP_ANALYSIS_WELL_COVERED_ERROR.value}
        )

@gap_analysis_router.put("/dismiss/{project_id}/{query_id}")
async def dismiss_unanswered_query(
    request: Request,
    project_id: str,
    query_id: str
):
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)

        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )

        query_model = await QueryModel.create_instance(db_client)
        result = await query_model.update_query_resolved_state(query_id=ObjectId(query_id), resolved=True)

        if result.matched_count == 0:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"signal": ResponseSignal.GAP_ANALYSIS_QUERY_NOT_FOUND.value}
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.GAP_ANALYSIS_DISMISS_SUCCESS.value,
                "project_id": str(project.id),
                "query_id": query_id
            }
        )
    except Exception as e:
        logger.error(f"Error in dismiss_unanswered_query: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.GAP_ANALYSIS_DISMISS_ERROR.value}
        )

@gap_analysis_router.get("/unanswered/{project_id}")
async def list_all_unanswered_queries(request: Request, project_id: str):
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)

        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )

        query_model = await QueryModel.create_instance(db_client)
        queries = await query_model.get_unresolved_failed_queries(project_id=project.id)

        queries_data = []
        for q in queries:
            try:
                dumped = q.model_dump(mode="json", by_alias=True)
            except Exception:
                dumped = {
                    "_id": str(q.id) if q.id else None,
                    "query_text": q.query_text,
                    "query_topic": q.query_topic,
                    "createdAt": str(q.createdAt) if q.createdAt else None,
                    "failed": q.failed,
                    "resolved": q.resolved
                }
            queries_data.append(dumped)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.GAP_ANALYSIS_LIST_UNANSWERED_SUCCESS.value,
                "project_id": str(project.id),
                "queries": queries_data
            }
        )
    except Exception as e:
        logger.error(f"Error in list_all_unanswered_queries: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.GAP_ANALYSIS_LIST_UNANSWERED_ERROR.value}
        )

@gap_analysis_router.post("/suggest_document/{project_id}/{query_id}")
async def suggest_document_for_query(
    request: Request,
    project_id: str,
    query_id: str,
    suggest_request: SuggestDocumentRequest
):
    try:
        db_client = request.app.db_client
        project_model = await ProjectModel.create_instance(db_client)
        project = await project_model.get_project_or_create_one(project_id=project_id)

        if not project:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value}
            )

        chunk_record = DataChunk(
            chunk_text=suggest_request.document_text,
            chunk_metadata=suggest_request.metadata or {"source": "suggested_document", "query_id": query_id},
            chunk_order=1,
            chunk_project_id=project.id,
            chunk_asset_id=ObjectId()
        )

        chunk_model = await ChunkModel.create_instance(db_client=db_client)
        await chunk_model.add_many_chunks(data_chunks=[chunk_record])

        nlp_service = NLPService(
            generation_client=request.app.generation_client,
            embedding_client=request.app.embedding_client,
            vectordb_client=request.app.vectordb_client,
            template_parser=request.app.template_parser
        )
        nlp_service.index_into_vectordb(Project=project, chunks=[chunk_record])

        query_model = await QueryModel.create_instance(db_client)
        await query_model.update_query_resolved_state(query_id=ObjectId(query_id), resolved=True)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.GAP_ANALYSIS_SUGGEST_SUCCESS.value,
                "project_id": str(project.id),
                "query_id": query_id
            }
        )
    except Exception as e:
        logger.error(f"Error in suggest_document_for_query: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.GAP_ANALYSIS_SUGGEST_ERROR.value}
        )