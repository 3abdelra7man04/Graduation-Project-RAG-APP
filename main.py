# import libraries
from fastapi import FastAPI

# fastAPI app
app = FastAPI()

# welcome route
@app.get("/welcome")
def welcome():
    return{
        "message": "Hello World!"
    }
