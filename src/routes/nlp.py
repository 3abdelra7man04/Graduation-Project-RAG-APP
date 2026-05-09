from fastapi import FastAPI, APIRouter, Depends, UploadFile, status, Request, BackgroundTasks
from fastapi.responses import JSONResponse
import os
from helpers.config import get_settings, Settings
import logging
from .schemes.nlp import PushRequest, SearchRequest
from models.ProjectModel import ProjectModel
from models.ChunkModel import ChunkModel
from models.enums.ResponseEnums import ResponseSignal
from controllers import NLPController


# Uvicorn logger instance
logger = logging.getLogger("uvicorn.error")

# nlp API router
nlp_router = APIRouter(
    prefix="/api/v1/nlp",
    tags=["api_v1", "nlp"],
)

# Background task for indexing chunks to avoid blocking
async def background_indexing_task(project, chunk_model, nlp_controller, do_reset: bool):
    try:
        if do_reset:
            nlp_controller.reset_vectordb_collection(Project=project)
            print("RESET DONE")

        page_num = 1
        inserted_chunks_count = 0

        while True:
            # get chunks
            chunks = await chunk_model.get_chunks_from_project(project_id=project.id, page_num=page_num)

            if len(chunks):
                page_num += 1
            else:
                break
            
            # index them into vector db
            is_inserted = nlp_controller.index_into_vectordb(Project=project, chunks=chunks)

            if not is_inserted:
                logger.error(f"Vector DB Indexing Error for project {project.id}")
                break
            
            inserted_chunks_count += len(chunks)
            
    except Exception as e:
        logger.error(f"Background indexing failed for project {project.id}: {e}")


@nlp_router.delete("/index/delete/{project_id}")
async def index_project_delete(request: Request, project_id: str):
    
    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    # project not found
    if not project:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value},
            )
    
    # nlp_controller instance
    nlp_controller = NLPController(generation_client= request.app.generation_client,
                                   embedding_client=request.app.embedding_client,
                                   vectordb_client= request.app.vectordb_client,
                                   template_parser=request.app.template_parser)
    
    # get chunks of project on batches and then index them
    is_deleted = nlp_controller.reset_vectordb_collection(Project=project)

    if not is_deleted:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "signal": ResponseSignal.VECTOR_DB_INDEXING_ERROR.value
            }
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "signal": ResponseSignal.VECTOR_DB_INDEXING_SUCCESS.value,
        }
    )

@nlp_router.post("/index/push/{project_id}")
async def index_project(
    request: Request, 
    project_id: str, 
    push_request: PushRequest,
    background_tasks: BackgroundTasks
):
    
    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    # project not found
    if not project:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value},
            )
    
    # create chunk_model instane
    chunk_model = await ChunkModel.create_instance(db_client=db_client)
    
    # nlp_controller instance
    nlp_controller = NLPController(generation_client= request.app.generation_client,
                                   embedding_client=request.app.embedding_client,
                                   vectordb_client= request.app.vectordb_client,
                                   template_parser=request.app.template_parser)
    
    # Delegate indexing to background task
    background_tasks.add_task(
        background_indexing_task,
        project=project,
        chunk_model=chunk_model,
        nlp_controller=nlp_controller,
        do_reset=push_request.do_reset
    )

    return JSONResponse(
        status_code=status.HTTP_202_ACCEPTED,
        content={
            "signal": ResponseSignal.VECTOR_DB_INDEXING_SUCCESS.value,
            "message": "Indexing started in background"
        }
    )


@nlp_router.get("/index/info/{project_id}")
async def get_project_index_info(request: Request, project_id: str):

    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    # project not found
    if not project:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value},
            )
    
    # nlp_controller instance
    nlp_controller = NLPController(generation_client= request.app.generation_client,
                                   embedding_client=request.app.embedding_client,
                                   vectordb_client= request.app.vectordb_client,
                                   template_parser=request.app.template_parser)
    
    info = nlp_controller.get_vector_db_collection_info(project)

    if not info:
        return JSONResponse(
            status_code= status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.VECTOR_DB_COLLECTION_NOT_FOUND.value}
        )
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.VECTOR_DB_GET_INFO_SUCCESS.value,
                 "info": info.model_dump()}
    )


@nlp_router.post("/index/search/{project_id}")
async def search_in_index(request: Request, project_id: str, search_request: SearchRequest):

    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    # project not found
    if not project:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value},
            )
    
    # nlp_controller instance
    nlp_controller = NLPController(generation_client= request.app.generation_client,
                                   embedding_client=request.app.embedding_client,
                                   vectordb_client= request.app.vectordb_client,
                                   template_parser=request.app.template_parser,
                                   reranking_client=request.app.reranking_client)
    
    results = nlp_controller.search_in_vectordb(Project= project, query= search_request.query, limit= search_request.limit)

    if not results:
        return JSONResponse(
            status_code= status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.VECTOR_DB_COLLECTION_NOT_FOUND.value}
        )
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.VECTOR_DB_SEARCH_SUCCESS.value,
                 "response": [res for res in results]}
    )

@nlp_router.post("/index/answer/{project_id}")
async def answer_rag(request: Request, project_id: str, search_request: SearchRequest):

    # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    # project not found
    if not project:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value},
            )
    
    # nlp_controller instance
    nlp_controller = NLPController(generation_client= request.app.generation_client,
                                   embedding_client=request.app.embedding_client,
                                   vectordb_client= request.app.vectordb_client,
                                   template_parser=request.app.template_parser,
                                   reranking_client=request.app.reranking_client)
    
    answer, full_prompt, chat_history, prompt_tokens, completion_tokens = nlp_controller.answer_rag_questions(project, query = search_request.query, limit=search_request.limit)

    if not answer:
        return JSONResponse(
            status_code= status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.RAG_ANSWER_ERROR.value}
        )
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"signal": ResponseSignal.RAG_ANSWER_SUCCESS.value,
                 "answer": answer,
                 "prompt tokens": prompt_tokens,
                 "completion tokens": completion_tokens,
                 "full_prompt": full_prompt,
                 "chat_history": chat_history}
    )