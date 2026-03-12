# import libraries
from fastapi import FastAPI
from routes import base, data, user
from motor.motor_asyncio import AsyncIOMotorClient
from helpers.config import get_settings
from fastapi.middleware.cors import CORSMiddleware
from stores.llm.LLMFactory import LLMFactory

# fastAPI app
app = FastAPI()

# mongo connection startup
async def startup_db_client():

    # get app settings
    settings = get_settings()

    # initialize mongo connection
    app.mongo_connection = AsyncIOMotorClient(settings.MONGODB_URL) 

    # create db client
    app.db_client = app.mongo_connection[settings.MONGODB_DATABASE] 

    # create llm generation client
    app.generation_client = LLMFactory.create_provider_instance(provider_name = settings.GENERATION_BACKEND)
    app.generation_client.set_generation_model(model_id = settings.GENERATION_MODEL_ID)

    # create llm embedding client
    app.embedding_client = LLMFactory.create_provider_instance(provider_name = settings.EMBEDDING_BACKEND)
    app.embedding_client.set_embedding_model(model_id = settings.EMBEDDING_MODEL_ID, embedding_size = settings.EMBEDDING_MODEL_SIZE)

# mongo connection shutdown
async def shutdown_db_client():
    app.mongo_connection.close()

app.router.lifespan.on_startup.append(startup_db_client)
app.router.lifespan.on_shutdown.append(shutdown_db_client)

# include the base router created in base.py
app.include_router(base.base_router)
# include the data router created in data.py
app.include_router(data.data_router)
#include the user router created in user.py
app.include_router(user.user_router)

# أهم جزء للربط مع React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # في الـ Production حط رابط الـ React بتاعك بس
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
