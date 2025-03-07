from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import example, fetchdata

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(example.router)
app.include_router(fetchdata.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}