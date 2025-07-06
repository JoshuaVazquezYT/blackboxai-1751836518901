from fastapi import FastAPI, Form, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "YOUR_ELEVENLABS_API_KEY")

@app.post("/generate-tts")
def generate_tts(text: str = Form(...), voice_id: str = Form(...)):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    json_data = {
        "text": text,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    response = requests.post(url, headers=headers, json=json_data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return Response(content=response.content, media_type="audio/mpeg")

# Mocked video generation endpoint
@app.post("/generate-video")
async def generate_video(style_id: str = Form(...), voice_id: str = Form(...), text: str = Form(...)):
    # This is a mocked response, in real implementation this would trigger video generation
    video_url = f"https://example.com/videos/{style_id}_{voice_id}.mp4"
    return JSONResponse(content={"video_url": video_url})

# File upload endpoint for Firebase Storage simulation (mocked)
@app.post("/upload")
async def upload_file(file: UploadFile = File(...), nsfw: bool = Form(...)):
    # Mock upload, just return file info and nsfw tag
    return JSONResponse(content={"filename": file.filename, "nsfw": nsfw})
