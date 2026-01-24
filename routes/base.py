from fastapi import FastAPI, APIRouter
import os

# base router
base_router = APIRouter(
    prefix = "/api/v1",
    tags = ["api-v1"],
    )

# routes
## default route
## returns an app's name and version
@base_router.get("/")
def welcome():
    app_name = os.getenv("APP_NAME")
    app_version = os.getenv("APP_VERSION")
    return {
        "app_name": app_name,
        "app_version": app_version
    }
