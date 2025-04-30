from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import FileResponse
from PIL import Image
import io
import os
from uuid import uuid4

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # veya sadece "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image/")
async def process_image(
    image: UploadFile = File(...),
    width: int = Form(...),
    height: int = Form(...),
    rotate: int = Form(0),
    flip_horizontal: bool = Form(False),
    flip_vertical: bool = Form(False),
    crop_x: int = Form(0),
    crop_y: int = Form(0),
    crop_width: int = Form(0),
    crop_height: int = Form(0),
):
    # Resmi oku
    image_data = await image.read()
    img = Image.open(io.BytesIO(image_data))

    # Kırpma (varsa)
    if crop_width > 0 and crop_height > 0:
        img = img.crop((crop_x, crop_y, crop_x + crop_width, crop_y + crop_height))

    # Boyutlandırma
    img = img.resize((width, height))

    # Döndürme
    if rotate:
        img = img.rotate(-rotate, expand=True)

    # Çevirme
    if flip_horizontal:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    if flip_vertical:
        img = img.transpose(Image.FLIP_TOP_BOTTOM)

    # Yeni dosya oluştur ve döndür
    output_path = f"processed_{uuid4().hex}.png"
    img.save(output_path)

    return FileResponse(output_path, media_type="image/png")
