# import libraries
from fastapi import FastAPI
from routes import base
from dotenv import load_dotenv

# load .env variables
load_dotenv(".env")

# fastAPI app
app = FastAPI()

# include the base router created in base
app.include_router(base.base_router)
