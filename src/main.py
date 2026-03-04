# import libraries
from fastapi import FastAPI
from routes import base, data, user
from motor.motor_asyncio import AsyncIOMotorClient
from helpers.config import get_settings
from fastapi.middleware.cors import CORSMiddleware

# fastAPI app
app = FastAPI()

# mongo connection startup
@app.on_event("startup")
async def startup_db_client():

    settings = get_settings() # get app settings

    app.mongo_connection = AsyncIOMotorClient(settings.MONGODB_URL) # initialize mongo connection

    app.db_client = app.mongo_connection[settings.MONGODB_DATABASE] # create db client

# mongo connection shutdown
@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongo_connection.close()


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
