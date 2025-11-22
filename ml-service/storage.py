import json
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
import uuid


class KYCStorage:
    """Simple file-based storage for KYC data without database"""
    
    def __init__(self, base_dir: str = "kyc_data"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(exist_ok=True)
        
        # Create subdirectories
        self.sessions_dir = self.base_dir / "sessions"
        self.sessions_dir.mkdir(exist_ok=True)
    
    def create_session(self) -> str:
        """Create a new KYC session and return session ID"""
        session_id = str(uuid.uuid4())
        session_dir = self.sessions_dir / session_id
        session_dir.mkdir(exist_ok=True)
        
        # Create subdirectories for this session
        (session_dir / "documents").mkdir(exist_ok=True)
        (session_dir / "faces").mkdir(exist_ok=True)
        
        # Initialize session data
        session_data = {
            "session_id": session_id,
            "created_at": datetime.now().isoformat(),
            "status": "in_progress",
            "documents": {},
            "verification_results": {}
        }
        
        self._save_json(session_dir / "session.json", session_data)
        return session_id
    
    def save_document(self, session_id: str, document_type: str, 
                     file_path: str, ocr_text: str = "", 
                     extracted_details: Dict = None) -> Dict:
        """Save uploaded document and its extracted data"""
        session_dir = self.sessions_dir / session_id
        
        if not session_dir.exists():
            raise ValueError(f"Session {session_id} not found")
        
        # Copy document to session folder
        doc_filename = f"{document_type}{Path(file_path).suffix}"
        doc_destination = session_dir / "documents" / doc_filename
        shutil.copy2(file_path, doc_destination)
        
        # Load session data
        session_data = self._load_json(session_dir / "session.json")
        
        # Update document info
        session_data["documents"][document_type] = {
            "file_path": str(doc_destination),
            "uploaded_at": datetime.now().isoformat(),
            "ocr_text": ocr_text,
            "extracted_details": extracted_details or {}
        }
        
        # Save updated session
        self._save_json(session_dir / "session.json", session_data)
        
        return session_data["documents"][document_type]
    
    def save_face(self, session_id: str, face_type: str, face_image_path: str) -> str:
        """Save extracted face image"""
        session_dir = self.sessions_dir / session_id
        
        if not session_dir.exists():
            raise ValueError(f"Session {session_id} not found")
        
        # Copy face to session folder
        face_filename = f"{face_type}_face.jpg"
        face_destination = session_dir / "faces" / face_filename
        shutil.copy2(face_image_path, face_destination)
        
        return str(face_destination)
    
    def save_verification_result(self, session_id: str, 
                                verification_type: str, 
                                result: Dict) -> None:
        """Save verification results (face match, liveness, loan risk)"""
        session_dir = self.sessions_dir / session_id
        
        if not session_dir.exists():
            raise ValueError(f"Session {session_id} not found")
        
        # Load session data
        session_data = self._load_json(session_dir / "session.json")
        
        # Update verification results
        session_data["verification_results"][verification_type] = {
            "result": result,
            "verified_at": datetime.now().isoformat()
        }
        
        # Save updated session
        self._save_json(session_dir / "session.json", session_data)
    
    def get_session(self, session_id: str) -> Optional[Dict]:
        """Retrieve session data"""
        session_dir = self.sessions_dir / session_id
        
        if not session_dir.exists():
            return None
        
        return self._load_json(session_dir / "session.json")
    
    def list_sessions(self, status: Optional[str] = None) -> list:
        """List all sessions, optionally filtered by status"""
        sessions = []
        
        for session_dir in self.sessions_dir.iterdir():
            if session_dir.is_dir():
                session_file = session_dir / "session.json"
                if session_file.exists():
                    session_data = self._load_json(session_file)
                    
                    if status is None or session_data.get("status") == status:
                        sessions.append(session_data)
        
        return sorted(sessions, key=lambda x: x.get("created_at", ""), reverse=True)
    
    def complete_session(self, session_id: str) -> Dict:
        """Mark session as complete"""
        session_dir = self.sessions_dir / session_id
        
        if not session_dir.exists():
            raise ValueError(f"Session {session_id} not found")
        
        # Load session data
        session_data = self._load_json(session_dir / "session.json")
        session_data["status"] = "completed"
        session_data["completed_at"] = datetime.now().isoformat()
        
        # Save updated session
        self._save_json(session_dir / "session.json", session_data)
        
        return session_data
    
    def _save_json(self, filepath: Path, data: Dict) -> None:
        """Save data to JSON file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def _load_json(self, filepath: Path) -> Dict:
        """Load data from JSON file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)