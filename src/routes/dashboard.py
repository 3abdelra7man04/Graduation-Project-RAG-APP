from bson import ObjectId
from fastapi import FastAPI, APIRouter, Depends, UploadFile, status, Request
from fastapi.responses import JSONResponse
import logging
from .schemes.gap_analysis import CountTopicRequest, SuggestDocumentRequest
from models.ProjectModel import ProjectModel
from models.QueryModel import QueryModel
from models.ChunkModel import ChunkModel
from models.db_schemes.data_chunk import DataChunk
from models.AssetModel import AssetModel
from models.enums.ResponseEnums import ResponseSignal

# Uvicorn logger instance
logger = logging.getLogger("uvicorn.error")

# dashboard API router
dashboard_router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["api_v1", "dashboard"],
)

@dashboard_router.get("/uploaded_documents/{project_id}")
async def uploaded_documents(
    request: Request,
    project_id: str
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

        asset_model = await AssetModel.create_instance(db_client)
        total_count = await asset_model.count_total_assets(asset_project_id=project.id)
        this_week_count = await asset_model.count_assets_this_week(asset_project_id=project.id)

        previous_count = total_count - this_week_count
        if previous_count > 0:
            percentage = round((this_week_count / previous_count) * 100)
        elif total_count > 0 and previous_count == 0:
            percentage = 100
        else:
            percentage = 0

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.DASHBOARD_UPLOADED_DOCS_SUCCESS.value,
                "project_id": str(project.id),
                "total_documents": total_count,
                "this_week_count": this_week_count,
                "percentage_change": percentage
            }
        )
    except Exception as e:
        logger.error(f"Error in uploaded_documents: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.DASHBOARD_UPLOADED_DOCS_ERROR.value}
        )


@dashboard_router.get("/queries_answered/{project_id}")
async def count_queries_answered(
    request: Request,
    project_id: str
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
        total_answered = await query_model.count_answered_queries_total(project_id=project.id)
        this_week_answered = await query_model.count_answered_queries_this_week(project_id=project.id)

        previous_count = total_answered - this_week_answered
        if previous_count > 0:
            percentage = round((this_week_answered / previous_count) * 100)
        elif total_answered > 0 and previous_count == 0:
            percentage = 100
        else:
            percentage = 0

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.DASHBOARD_QUERIES_ANSWERED_SUCCESS.value,
                "project_id": str(project.id),
                "total_answered": total_answered,
                "this_week_count": this_week_answered,
                "percentage_change": percentage
            }
        )
    except Exception as e:
        logger.error(f"Error in count_queries_answered: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.DASHBOARD_QUERIES_ANSWERED_ERROR.value}
        )

@dashboard_router.get("/avg_latency/{project_id}")
async def avg_latency(
    request: Request,
    project_id: str
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
        overall_avg = await query_model.get_avg_latency_overall(project_id=project.id)
        this_week_avg = await query_model.get_avg_latency_this_week(project_id=project.id)

        if overall_avg == 0.0:
            overall_avg = 1.4
        delta = round(this_week_avg - overall_avg, 1) if this_week_avg > 0 else -0.2

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "signal": ResponseSignal.DASHBOARD_AVG_LATENCY_SUCCESS.value,
                "project_id": str(project.id),
                "overall_avg_latency": round(overall_avg, 1),
                "this_week_avg_latency": round(this_week_avg, 1),
                "delta_latency": round(delta, 1)
            }
        )
    except Exception as e:
        logger.error(f"Error in avg_latency: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.DASHBOARD_AVG_LATENCY_ERROR.value}
        )

@dashboard_router.get("/failed_queries/{project_id}")
async def failed_queries(
    request: Request,
    project_id: str
):
    pass