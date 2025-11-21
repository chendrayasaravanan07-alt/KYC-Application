# main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
from pathlib import Path

from ocr import perform_ocr_from_path
from face_match import face_match
from liveness import liveness_check_from_video_path
from autofill import extract_fields_from_text
from loan_risk import predict_loan_risk

APP_DIR = Path(__file__).parent
UPLOAD_DIR = APP_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="KYC ML Service (LBPH + Tesseract)")

def save_upload(file: UploadFile) -> str:
    ext = Path(file.filename).suffix or ""
    fname = f"{uuid.uuid4().hex}{ext}"
    out_path = UPLOAD_DIR / fname
    with out_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    return str(out_path)

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    """
    Upload image file (id doc) -> returns extracted text
    """
    saved = save_upload(file)
    result = perform_ocr_from_path(saved)
    return JSONResponse(result)

@app.post("/face/match")
async def face_match_endpoint(id_image: UploadFile = File(...), selfie_image: UploadFile = File(...)):
    """
    Upload id_image and selfie_image -> returns match boolean and score
    """
    id_path = save_upload(id_image)
    selfie_path = save_upload(selfie_image)
    result = face_match(id_path, selfie_path)
    return JSONResponse(result)

@app.post("/liveness")
async def liveness_endpoint(video: UploadFile = File(...)):
    """
    Upload short video (mp4/avi) recorded from camera -> returns liveness check
    """
    video_path = save_upload(video)
    result = liveness_check_from_video_path(video_path)
    return JSONResponse(result)

@app.post("/autofill")
async def autofill_endpoint(file: UploadFile = File(...)):
    """
    Upload image (id doc) -> OCR -> extract fields
    """
    saved = save_upload(file)
    ocr_res = perform_ocr_from_path(saved)
    text = ocr_res.get("text", "")
    fields = extract_fields_from_text(text)
    return {"ocr_text": text, "extracted_fields": fields}

@app.post("/loan/risk")
async def loan_risk_endpoint(
    monthly_income: int = Form(...),
    existing_liabilities: int = Form(0),
    credit_score: int = Form(600)
):
    features = {
        "monthly_income": monthly_income,
        "existing_liabilities": existing_liabilities,
        "credit_score": credit_score
    }
    res = predict_loan_risk(features)
    return res

@app.get("/")
async def root():
    return {"message": "KYC ML service is running"}
