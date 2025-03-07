from fastapi import APIRouter

router = APIRouter()

@router.get("/example")
def read_example():
    return {"message": "Hello This is Example Message from Endpoint! This message was created using REST API"}