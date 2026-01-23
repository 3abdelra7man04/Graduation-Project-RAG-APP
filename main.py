# import libraries
from fastapi import FastAPI
from routes import base

# fastAPI app
app = FastAPI()

# include the base router created in base
app.include_router(base.base_router)