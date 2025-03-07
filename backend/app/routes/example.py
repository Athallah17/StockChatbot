from fastapi import APIRouter

router = APIRouter()

@router.get("/example")
def read_example():
    return {"message": "This is an example endpoint from the backend with RESTAPI, example.py!"}