from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path

router = APIRouter()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "csv", "mp3", "wav", "m4a", "ogg", "flac"}

UPLOAD_DIRECTORY = Path(__file__).parent.parent.parent.parent.parent / "uploads"
UPLOAD_DIRECTORY.mkdir(exist_ok=True)


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@router.post("/file-upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload file to the uploads directory"""
    try:
        if not allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Save file with timestamp prefix
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename_parts = file.filename.rsplit(".", 1)
        new_filename = f"{timestamp}_{filename_parts[0]}.{filename_parts[1]}"

        filepath = UPLOAD_DIRECTORY / new_filename

        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)

        return {
            "filename": new_filename,
            "url": f"/uploads/{new_filename}",
            "size": len(content)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
