# import libraries
from fastapi import FastAPI
from routes import base, data
from motor.motor_asyncio import AsyncioMotorClient
from helpers.config import get_settings

# fastAPI app
app = FastAPI()

# mongo connection startup
@app.on_event("startup")
async def startup_db_client():

    settings = get_settings() # get app settings

    app.mongo_connection = AsyncioMotorClient(settings.MONGODB_URL) # initialize mongo connection

    app.db_client = app.mongo_connection[settings.MONGODB_DATABASE] # create db client

# mongo connection shutdown
@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongo_connection.close()


# include the base router created in base.py
app.include_router(base.base_router)
# include the data router created in data.py
app.include_router(data.data_router)
