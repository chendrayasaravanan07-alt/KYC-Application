import json
import os
from datetime import datetime
from typing import Dict, Any

class JSONStorage:
    def __init__(self, filename="kyc_data.json"):
        self.filename = filename

        if not os.path.exists(self.filename):
            with open(self.filename, "w", encoding="utf-8") as f:
                json.dump({"ocr_records": []}, f, ensure_ascii=False, indent=4)

    def _read(self) -> Dict[str, Any]:
        with open(self.filename, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data: Dict[str, Any]):
        with open(self.filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    def add_ocr_record(self, filename: str, ocr_text: str, extracted_details: Dict[str, Any]):
        db = self._read()

        new_record = {
            "id": len(db["ocr_records"]) + 1,
            "filename": filename,
            "ocr_text": ocr_text,
            "extracted_details": extracted_details,
            "timestamp": datetime.now().isoformat()
        }

        db["ocr_records"].append(new_record)
        self._write(db)

        return new_record["id"]

    def get_all_records(self):
        db = self._read()
        return db["ocr_records"]
