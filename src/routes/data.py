from fastapi import FastAPI, APIRouter, Depends, UploadFile, status, Request, BackgroundTasks
from fastapi.responses import JSONResponse
import os
from helpers.config import get_settings, Settings
from controllers import DataController, ProjectController, ProcessController
import aiofiles
from models import ResponseSignal
import logging
from .schemes.data import ProcessRequest
from models.ProjectModel import ProjectModel
from models.ChunkModel import ChunkModel
from models.AssetModel import AssetModel
from models.db_schemes.data_chunk import DataChunk
from models.db_schemes.asset import Asset
from models.enums.AssetTypeEnum import AssetTypeEnum

# Uvicorn logger instance
logger = logging.getLogger("uvicorn.error")

# Data API router
data_router = APIRouter(
    prefix="/api/v1/data",
    tags=["api_v1", "data"],
)

# Background task for file processing
async def process_files_background(project_id: str, project_files_ids: dict, chunk_size: int, chunk_overlap: int, db_client):
    try:
        # create Process Controller object
        process_cotroller = ProcessController(project_id=project_id)
        chunk_model = await ChunkModel.create_instance(db_client=db_client)

        for asset_id, file_id in project_files_ids.items():
            # get file content
            file_content = process_cotroller.get_file_content(file_id)

            if file_content is None:
                logger.error(f"Error while processing file: {file_id}")
                continue

            # get file chunks
            file_chunks = process_cotroller.process_file_content(
                file_id=file_id,
                file_content=file_content,
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
            )

            # if an error occurs skip to next
            if file_chunks is None or len(file_chunks) == 0:
                continue

            file_chunks_records = [
                DataChunk(
                    chunk_text=chunk.page_content,
                    chunk_metadata=chunk.metadata,
                    chunk_order=i + 1,
                    chunk_project_id=project_id,
                    chunk_asset_id=asset_id,
                )
                for i, chunk in enumerate(file_chunks)
            ]

            await chunk_model.add_many_chunks(data_chunks=file_chunks_records)

    except Exception as e:
        logger.error(f"Background processing failed: {e}")


# upload endpoint
@data_router.post("/upload/{project_id}")
async def upload_data(
    request: Request,  # the reqeust object has the app and its data
    project_id: str,
    file: UploadFile,
    app_settings: Settings = Depends(get_settings),
):

    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    # Initialize data controller
    data_controller = DataController()

    # Validate uploaded file
    is_valid, result_signal = data_controller.validate_uploaded_file(file=file)

    if not is_valid:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": result_signal},
        )

    # Resolve project directory and file path
    project_dir_path = ProjectController().get_project_path(project_id=project_id)
    file_path, file_id = data_controller.generate_unique_filepath(
        orig_file_name=file.filename,
        project_id=project_id,
    )

    try:
        # Write file asynchronously in chunks
        async with aiofiles.open(file_path, "wb") as f:
            while chunk := await file.read(app_settings.FILE_DEFAULT_CHUNK_SIZE):
                await f.write(chunk)

    except Exception as e:
        # Log upload failure
        logger.error(f"Error while uploading file: {e}")

        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.FILE_UPLOAD_FAILED.value},
        )

    asset_model = await AssetModel.create_instance(db_client=request.app.db_client)

    asset_resource = Asset(
        asset_project_id=project.id,
        asset_type=AssetTypeEnum.FILE.value,
        asset_name=file_id,
        asset_size=os.path.getsize(file_path),
    )

    asset_record = await asset_model.create_asset(asset=asset_resource)

    # Upload completed successfully
    return JSONResponse(
        content={
            "signal": ResponseSignal.FILE_UPLOAD_SUCCESS.value,
            "file_id": str(asset_record.id),
        }
    )


# process endpoint
@data_router.post("/process/{project_id}")
async def process_endpoint(
    request: Request,  # the reqeust object has the app and its data
    project_id: str,
    process_request: ProcessRequest,
    background_tasks: BackgroundTasks, # Add background tasks
):

    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    chunk_size = process_request.chunk_size
    chunk_overlap = process_request.chunk_overlap
    do_reset = process_request.do_reset

    asset_model = await AssetModel.create_instance(db_client=request.app.db_client)

    project_files_ids = {}
    if process_request.file_id:
        asset_record = await asset_model.get_asset_record(
            asset_project_id=project.id, asset_name=process_request.file_id
        )

        if asset_record is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "signal": ResponseSignal.FILE_ID_ERROR.value,
                },
            )

        project_files_ids = {asset_record.id: asset_record.asset_name}
    else:

        project_files = await asset_model.get_all_project_assets(
            asset_project_id=project.id,
            asset_type=AssetTypeEnum.FILE.value,
        )

        project_files_ids = {record.id: record.asset_name for record in project_files}

    if len(project_files_ids) == 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "signal": ResponseSignal.NO_FILES_ERROR.value,
            },
        )

    chunk_model = await ChunkModel.create_instance(db_client=request.app.db_client)

    if do_reset == True:
        _ = await chunk_model.delete_chunks_by_project_id(project_id=project.id)

    # Delegate processing to background
    background_tasks.add_task(
        process_files_background,
        project_id=project.id,
        project_files_ids=project_files_ids,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        db_client=db_client
    )

    return JSONResponse(
        status_code=status.HTTP_202_ACCEPTED,
        content={
            "signal": ResponseSignal.PROCESSING_SUCCESS.value,
        }
    )