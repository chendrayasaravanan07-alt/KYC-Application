from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import uuid
import os
from pathlib import Path
import json
from datetime import datetime
from typing import Dict, Optional

from ocr import extract_text_from_image
from autofill import autofill_details
from face_match import compare_faces
from liveness import detect_liveness
from loan_risk import loan_risk_prediction


# Simple JSON Storage Class
class JSONStorage:
    """Simple JSON file storage for KYC data"""
    
    def __init__(self, filename: str = "kyc_data.json"):
        self.filepath = Path(filename)
        self.data = self._load_data()

        # FIX: ensure "sessions" always exists
        if "sessions" not in self.data:
            self.data["sessions"] = []
            self._save_data()
    
    def _load_data(self) -> Dict:
        if self.filepath.exists():
            try:
                with open(self.filepath, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return {"sessions": []}
        else:
            return {"sessions": []}
    
    def _save_data(self):
        with open(self.filepath, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
    
    def add_ocr_record(self, filename: str, ocr_text: str, extracted_details: Dict) -> str:
        record_id = f"kyc_{len(self.data['sessions']) + 1}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        record = {
            "record_id": record_id,
            "timestamp": datetime.now().isoformat(),
            "filename": filename,
            "ocr_text": ocr_text,
            "extracted_details": extracted_details,
            "verification_results": {}
        }
        
        self.data["sessions"].append(record)
        self._save_data()
        
        return record_id
    
    def add_verification_result(self, record_id: str, verification_type: str, result: Dict):
        for record in self.data["sessions"]:
            if record["record_id"] == record_id:
                record["verification_results"][verification_type] = {
                    "result": result,
                    "timestamp": datetime.now().isoformat()
                }
                self._save_data()
                return True
        
        raise ValueError(f"Record {record_id} not found")
    
    def get_record(self, record_id: str) -> Optional[Dict]:
        for record in self.data["sessions"]:
            if record["record_id"] == record_id:
                return record
        return None
    
    def get_all_records(self) -> list:
        return self.data["sessions"]
    
    def get_latest_record(self) -> Optional[Dict]:
        if self.data["sessions"]:
            return self.data["sessions"][-1]
        return None



# Initialize FastAPI and Storage
app = FastAPI()
storage = JSONStorage("kyc_data.json")

# Create temp directory
TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)


def save_file(file: UploadFile) -> str:
    """Save uploaded file to temp directory"""
    try:
        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = TEMP_DIR / filename
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        if not filepath.exists():
            raise HTTPException(status_code=500, detail="Failed to save uploaded file")
        
        return str(filepath)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    finally:
        file.file.close()


def cleanup_file(filepath: str):
    """Remove temporary file"""
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception as e:
        print(f"Warning: Could not delete temp file {filepath}: {e}")


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "KYC ML Service API",
        "storage": f"Data stored in: kyc_data.json",
        "endpoints": {
            "ocr": "POST /ocr - Extract text and save",
            "face_match": "POST /face-match - Compare faces",
            "liveness": "POST /liveness - Check liveness",
            "loan_risk": "GET /loan-risk - Calculate risk",
            "get_record": "GET /record/{record_id}",
            "get_all": "GET /records",
            "health": "GET /health"
        }
    }


@app.post("/ocr")
async def ocr_api(file: UploadFile = File(...)):
    """Extract text from image and save to JSON"""
    path = None
    try:
        print(f"Received file: {file.filename}")
        
        path = save_file(file)
        text = extract_text_from_image(path)
        details = autofill_details(text)
        
        # Save to JSON storage
        record_id = storage.add_ocr_record(
            filename=file.filename,
            ocr_text=text,
            extracted_details=details
        )
        
        print(f"Data saved with record_id: {record_id}")
        
        return {
            "record_id": record_id,
            "filename": file.filename,
            "ocr_text": text,
            "extracted_details": details,
            "saved": True,
            "message": f"Data saved to kyc_data.json"
        }
    
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
    
    finally:
        if path:
            cleanup_file(path)


@app.post("/face-match")
async def face_match_api(
    record_id: str,
    doc_face: UploadFile = File(...),
    selfie: UploadFile = File(...)
):
    """Compare faces and add to existing record"""
    doc_path = None
    selfie_path = None
    
    try:
        doc_path = save_file(doc_face)
        selfie_path = save_file(selfie)
        
        result = compare_faces(doc_path, selfie_path)
        
        # Add to existing record
        storage.add_verification_result(record_id, "face_match", result)
        
        return {
            "record_id": record_id,
            "verification_type": "face_match",
            "result": result,
            "saved": True
        }
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Face matching failed: {str(e)}")
    
    finally:
        if doc_path:
            cleanup_file(doc_path)
        if selfie_path:
            cleanup_file(selfie_path)


@app.post("/liveness")
async def liveness_api(record_id: str, selfie: UploadFile = File(...)):
    """Detect liveness and add to existing record"""
    path = None
    
    try:
        path = save_file(selfie)
        result = detect_liveness(path)
        
        # Add to existing record
        storage.add_verification_result(record_id, "liveness", result)
        
        return {
            "record_id": record_id,
            "verification_type": "liveness",
            "result": result,
            "saved": True
        }
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Liveness detection failed: {str(e)}")
    
    finally:
        if path:
            cleanup_file(path)


@app.get("/loan-risk")
def risk_api(record_id: str, income: float, age: int, loan_amount: float):
    """Calculate loan risk and add to existing record"""
    try:
        result = loan_risk_prediction(income, age, loan_amount)
        
        # Add to existing record
        storage.add_verification_result(record_id, "loan_risk", result)
        
        return {
            "record_id": record_id,
            "verification_type": "loan_risk",
            "result": result,
            "saved": True
        }
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk prediction failed: {str(e)}")


@app.get("/record/{record_id}")
def get_record(record_id: str):
    """Get specific record by ID"""
    record = storage.get_record(record_id)
    
    if not record:
        raise HTTPException(status_code=404, detail=f"Record {record_id} not found")
    
    return record


@app.get("/records")
def get_all_records():
    """Get all stored records"""
    records = storage.get_all_records()
    return {
        "total_records": len(records),
        "records": records
    }


@app.get("/latest")
def get_latest():
    """Get the most recent record"""
    record = storage.get_latest_record()
    
    if not record:
        raise HTTPException(status_code=404, detail="No records found")
    
    return record


@app.get("/health")
def health_check():
    """Health check"""
    return {
        "status": "healthy",
        "storage_file": "kyc_data.json",
        "total_records": len(storage.get_all_records())
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)