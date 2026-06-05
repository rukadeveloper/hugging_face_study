from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import sentiment, fileUpload, soundAssistant
from pathlib import Path

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sentiment.router, prefix="/api/v1", tags=["sentiment"])
app.include_router(fileUpload.router, prefix="/api/v1", tags=["file"])
app.include_router(soundAssistant.router, prefix="/api/v1", tags=["sound"])

# Create answer directory if it doesn't exist
answer_dir = Path(__file__).parent.parent / "answer"
answer_dir.mkdir(exist_ok=True)

# Mount static files
app.mount("/answer", StaticFiles(directory=str(answer_dir)), name="answer")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Welcome to HuggingFace AI API"}
