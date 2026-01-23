from fastapi import FastAPI, APIRouter

# base router
base_router = APIRouter(
    prefix = "/api/v1",
    tags = ["api-v1"],
    )

# routes
## default route
@base_router.get("/")
def welcome():
    return {
        "message": "Hello All!"
    }
