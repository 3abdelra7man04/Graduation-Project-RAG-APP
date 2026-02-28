from fastapi import FastAPI, APIRouter, Depends, UploadFile, status, Request
from fastapi.responses import JSONResponse
import os
from helpers.config import get_settings, Settings
from controllers import DataController, ProjectController, ProcessController
import aiofiles
from models import ResponseSignal
import logging
from .schemes.data import ProcessRequest
from models.ProjectModel import ProjectModel
from models.DataChunkModel import DataChunkModel
from models.db_schemes.data_chunk import DataChunk

# Uvicorn logger instance
logger = logging.getLogger("uvicorn.error")

# Data API router
data_router = APIRouter(
    prefix="/api/v1/data",
    tags=["api_v1", "data"],
)

# upload endpoint
@data_router.post("/upload/{project_id}")
async def upload_data(
    request: Request,     # the reqeust object has the app and its data
    project_id: str,
    file: UploadFile,
    app_settings: Settings = Depends(get_settings),
):
    
    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(db_client=db_client) # create the ProjectModel instance

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

    # Upload completed successfully
    return JSONResponse(
        content={
            "signal": ResponseSignal.FILE_UPLOAD_SUCCESS.value,
            "file_id": file_id
        }
    )

# process endpoint
@data_router.post("/process/{project_id}")
async def process_endpoint(
    request: Request,     # the reqeust object has the app and its data
    project_id: str, 
    process_request: ProcessRequest):

    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(db_client=db_client) # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)
    
    file_id = process_request.file_id
    chunk_size = process_request.chunk_size
    chunk_overlap = process_request.chunk_overlap
    do_reset = process_request.do_reset

    # create Process Controller object
    process_cotroller = ProcessController(project_id=project_id)

    # get file content
    file_content = process_cotroller.get_file_content(file_id)

    # get file chunks
    file_chunks = process_cotroller.process_file_content(file_id=file_id, file_content=file_content,
                                                         chunk_size= chunk_size,
                                                         chunk_overlap=chunk_overlap)
    
    # if an  error occurs return 400 status code
    if file_chunks is None or len(file_chunks) == 0:
        return JSONResponse(
            status_code = status.HTTP_400_BAD_REQUEST,
            content = {
                "signal" : ResponseSignal.PROCESSING_FAILED.value
        })
    
    # add data chunks to collection
    data_chunk_model = DataChunkModel(db_client=db_client) # create the DataChunkModel instance

    file_chunks_documents = [
        DataChunk(chunk_text = chunk.page_content,
                  chunk_metadata = chunk.metadata,
                  chunk_order = i + 1,
                  chunk_project_id = project.id)
        for i, chunk in enumerate(file_chunks)]
    
    if do_reset == True:
        _ = await data_chunk_model.delete_chunks_by_project_id(project_id=project.id)
    
    file_chunks_len = await data_chunk_model.add_many_chunks(file_chunks_documents)
    
    # process completed successfully
    return JSONResponse(
        content={
            "signal": ResponseSignal.PROCESSING_SUCCESS.value,
            "file_id": file_id
        }
    )
