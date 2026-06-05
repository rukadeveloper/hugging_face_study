from fastapi import APIRouter, HTTPException
from transformers import pipeline
import pandas as pd
from pathlib import Path
from collections import Counter

router = APIRouter()

# Load emotion classification model
emotion_pipeline = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base"
)


@router.post("/emotion-analysis")
async def emotion_analysis(text: str):
    """Analyze emotion of a single text"""
    try:
        result = emotion_pipeline(text)
        return {
            "text": text,
            "emotion": result[0]["label"],
            "score": result[0]["score"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/multi-emotion")
async def multi_emotion(texts: str):
    """Analyze emotion of multiple texts (newline-separated)"""
    try:
        # Split by newline and filter empty lines
        text_list = [t.strip() for t in texts.split("\n") if t.strip()]

        if not text_list:
            raise HTTPException(status_code=400, detail="No text provided")

        results = []
        for text in text_list:
            result = emotion_pipeline(text)
            results.append({
                "text": text,
                "emotion": result[0]["label"],
                "score": result[0]["score"]
            })

        # Zip texts with results
        output = list(zip(text_list, results))

        return {
            "results": output,
            "total": len(output)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/emotion_csv")
async def emotion_csv(file_path: str):
    """Analyze emotion of CSV file"""
    try:
        # Convert URL path to actual filesystem path
        if file_path.startswith("/uploads/"):
            file_path = file_path.replace("/uploads/", "")

        # Get the actual file path
        actual_path = Path(__file__).parent.parent.parent.parent.parent / "uploads" / file_path

        if not actual_path.exists():
            raise HTTPException(status_code=404, detail=f"File not found: {actual_path}")

        # Read CSV
        df = pd.read_csv(actual_path)

        # Analyze each row
        results = []
        for idx, row in df.iterrows():
            # Get text from first column
            text = str(row.iloc[0])
            result = emotion_pipeline(text)
            results.append({
                "text": text,
                "emotion": result[0]["label"],
                "score": result[0]["score"]
            })

        return {
            "file": file_path,
            "results": results,
            "total": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/emotion_visual")
async def emotion_visual(file_path: str):
    """Generate emotion visualization data from CSV file"""
    try:
        # Convert URL path to actual filesystem path
        if file_path.startswith("/uploads/"):
            file_path = file_path.replace("/uploads/", "")

        actual_path = Path(__file__).parent.parent.parent.parent.parent / "uploads" / file_path

        if not actual_path.exists():
            raise HTTPException(status_code=404, detail=f"File not found")

        # Read CSV
        df = pd.read_csv(actual_path)

        # Analyze each row
        emotions = []
        scores = []

        for idx, row in df.iterrows():
            text = str(row.iloc[0])
            result = emotion_pipeline(text)
            emotion = result[0]["label"]
            score = result[0]["score"]

            emotions.append(emotion)
            scores.append(score)

        # Count emotions
        emotion_counts = Counter(emotions)

        # Calculate percentages
        total = len(emotions)
        chart_data = [
            {
                "name": emotion,
                "value": count,
                "percentage": round(count / total * 100, 1)
            }
            for emotion, count in emotion_counts.items()
        ]

        return {
            "file": file_path,
            "chart_data": chart_data,
            "total": total,
            "average_score": round(sum(scores) / len(scores), 3) if scores else 0
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
