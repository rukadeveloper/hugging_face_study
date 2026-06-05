from fastapi import APIRouter, File, UploadFile, HTTPException
from transformers import pipeline
from pathlib import Path
import pandas as pd
from urllib.parse import unquote
import os

router = APIRouter()

# Load models
sentiment_pipeline = pipeline(
    "text-classification",
    model="WhitePeak/bert-base-cased-Korean-sentiment"
)

def normalize_label(label: str) -> str:
    """Normalize different label formats to a consistent format"""
    if isinstance(label, str):
        if label.startswith("LABEL_"):
            # LABEL_0 -> POSITIVE, LABEL_1 -> NEUTRAL, LABEL_2 -> NEGATIVE
            label_map = {"LABEL_0": "POSITIVE", "LABEL_1": "NEUTRAL", "LABEL_2": "NEGATIVE"}
            return label_map.get(label, label)
        return label
    return str(label)


@router.post("/sentiment-analysis")
async def sentiment_analysis(text: str):
    """Analyze sentiment of a single text"""
    try:
        result = sentiment_pipeline(text)
        return {
            "text": text,
            "label": normalize_label(result[0]["label"]),
            "score": result[0]["score"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/multi-sentiment")
async def multi_sentiment(texts: str):
    """Analyze sentiment of multiple texts (newline-separated)"""
    try:
        # Split by newline and filter empty lines
        text_list = [t.strip() for t in texts.split("\n") if t.strip()]

        if not text_list:
            raise HTTPException(status_code=400, detail="No text provided")

        results = []
        for text in text_list:
            result = sentiment_pipeline(text)
            results.append({
                "text": text,
                "label": normalize_label(result[0]["label"]),
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


@router.post("/csv_result")
async def csv_result(file_path: str):
    """Analyze CSV file with sentiment analysis"""
    try:
        # Convert URL path to actual filesystem path
        # Remove /uploads/ prefix if present and convert to real path
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
            result = sentiment_pipeline(text)
            results.append({
                "text": text,
                "label": normalize_label(result[0]["label"]),
                "score": result[0]["score"]
            })

        return {
            "file": file_path,
            "results": results,
            "total": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/csv_chart")
async def csv_chart(file_path: str):
    """Generate chart data from CSV file"""
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
        labels = []
        scores = []
        positive_reviews = []
        negative_reviews = []

        for idx, row in df.iterrows():
            text = str(row.iloc[0])
            result = sentiment_pipeline(text)
            label = normalize_label(result[0]["label"])
            score = result[0]["score"]

            labels.append(label)
            scores.append(score)

            if label == "POSITIVE":
                positive_reviews.append((text, score))
            elif label == "NEGATIVE":
                negative_reviews.append((text, score))

        # Sort to get most positive and negative
        positive_reviews.sort(key=lambda x: x[1], reverse=True)
        negative_reviews.sort(key=lambda x: x[1], reverse=True)

        # Count labels
        from collections import Counter
        label_counts = Counter(labels)

        # Calculate percentages (only positive and negative)
        total_sentiment = label_counts.get("POSITIVE", 0) + label_counts.get("NEGATIVE", 0)
        positive_pct = (label_counts.get("POSITIVE", 0) / total_sentiment * 100) if total_sentiment > 0 else 0
        negative_pct = (label_counts.get("NEGATIVE", 0) / total_sentiment * 100) if total_sentiment > 0 else 0

        return {
            "file": file_path,
            "chart_data": [
                {"name": "POSITIVE", "value": label_counts.get("POSITIVE", 0), "percentage": round(positive_pct, 1)},
                {"name": "NEGATIVE", "value": label_counts.get("NEGATIVE", 0), "percentage": round(negative_pct, 1)}
            ],
            "most_positive_review": positive_reviews[0] if positive_reviews else None,
            "most_negative_review": negative_reviews[0] if negative_reviews else None,
            "total": len(labels)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
