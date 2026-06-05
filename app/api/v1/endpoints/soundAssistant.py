from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from transformers import pipeline
import edge_tts
import asyncio
from pathlib import Path
from datetime import datetime
from urllib.parse import unquote

router = APIRouter()

# Global variables to store intermediate results
voice_txt = ""
current_answer = ""

# Load models
whisper = pipeline("automatic-speech-recognition", model="openai/whisper-base")
text_generator = pipeline("text-generation", model="gpt2", device=-1)


async def text_to_voice(text: str) -> tuple[str, str]:
    """Convert text to voice using edge-tts"""
    try:
        # Create answer directory if it doesn't exist
        answer_dir = Path(__file__).parent.parent.parent.parent.parent / "answer"
        answer_dir.mkdir(exist_ok=True)

        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"answer_{timestamp}.mp3"
        filepath = answer_dir / filename

        # Convert text to speech
        communicate = edge_tts.Communicate(text, "ko-KR-InJoonNeural", rate="+0%", volume="+0%", pitch="+0Hz")
        await communicate.save(str(filepath))

        # Return both the URL and pathname
        return f"/answer/{filename}", str(filepath)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"TTS error: {str(e)}")


@router.post("/audio_to_text")
async def audio_to_text(input_audio_path: str = Form(...)):
    """Convert audio file to text using Whisper"""
    global voice_txt

    try:
        # Convert URL path to actual filesystem path
        if input_audio_path.startswith("http://localhost:8000/uploads/"):
            input_audio_path = input_audio_path.replace("http://localhost:8000/uploads/", "")
        elif input_audio_path.startswith("/uploads/"):
            input_audio_path = input_audio_path.replace("/uploads/", "")

        # Get the actual file path
        actual_path = Path(__file__).parent.parent.parent.parent.parent / "uploads" / input_audio_path

        if not actual_path.exists():
            raise HTTPException(status_code=404, detail=f"File not found: {actual_path}")

        # Run Whisper analysis
        result = whisper(str(actual_path))
        voice_txt = result["text"]

        return {
            "text": voice_txt,
            "file": input_audio_path
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/text_generation")
async def text_generation(question: str = Form(...)):
    """Generate text response based on question"""
    global current_answer

    try:
        # Use English prompt due to GPT-2 limitation with Korean
        prompt = f"Based on: {voice_txt[:100]}\nQuestion: {question}\nAnswer: "

        result = text_generator(
            prompt,
            max_new_tokens=200,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )

        # Extract the answer portion (after "Answer: ")
        generated_text = result[0]["generated_text"]
        if "Answer: " in generated_text:
            answer_portion = generated_text.split("Answer: ", 1)[1].strip()
        else:
            answer_portion = generated_text

        current_answer = answer_portion

        return {
            "question": question,
            "answer": answer_portion
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tts")
async def tts():
    """Convert current answer to speech"""
    try:
        if not current_answer:
            raise HTTPException(status_code=400, detail="No answer to convert")

        url, pathname = await text_to_voice(current_answer)

        return {
            "url": url,
            "pathname": pathname,
            "text": current_answer
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
