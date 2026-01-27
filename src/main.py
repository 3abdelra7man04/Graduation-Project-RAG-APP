# import libraries
from fastapi import FastAPI
from routes import base, data

# fastAPI app
app = FastAPI()

# include the base router created in base.py
app.include_router(base.base_router)
# include the data router created in data.py
app.include_router(data.data_router)
