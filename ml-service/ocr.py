import cv2
import pytesseract
import numpy as np
from fastapi import UploadFile
from PIL import Image
import io
import re
import os

# Path to tesseract (IMPORTANT for Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe"


def extract_text_from_image(image_path):
    """
    Run OCR using Tesseract from file path.
    
    Args:
        image_path: Path to the image file (string)
        
    Returns:
        Extracted text
    """
    # Check if file exists
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")
    
    # Read image from file path
    image = cv2.imread(image_path)
    
    # Check if image was loaded successfully
    if image is None:
        raise ValueError(
            f"Failed to load image from {image_path}. "
            "Check if the file is a valid image format (jpg, png, etc.)"
        )
    
    # Convert to grayscale and apply filter
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Extract text
    try:
        text = pytesseract.image_to_string(gray)
    except pytesseract.TesseractNotFoundError:
        raise Exception(
            "Tesseract is not installed. "
            "Download from: https://github.com/UB-Mannheim/tesseract/wiki "
            "and install to C:\\Program Files\\Tesseract-OCR"
        )
    
    return text


def extract_text_from_cv_image(image):
    """
    Run OCR using Tesseract from cv2 image array.
    
    Args:
        image: OpenCV image (numpy array)
        
    Returns:
        Extracted text
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    text = pytesseract.image_to_string(gray)
    return text


def detect_face(image):
    """Extract face from Aadhaar Front Document"""
    face_detector = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        return None

    # Take the largest face (most likely Aadhaar)
    faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
    (x, y, w, h) = faces[0]

    face_crop = image[y:y+h, x:x+w]

    # Save cropped face
    face_path = "document_face.jpg"
    cv2.imwrite(face_path, face_crop)

    return face_path


def extract_aadhar_details(text):
    """Extract Name, DOB, Aadhaar Number using regex"""
    details = {}

    # Aadhaar Number (XXXX XXXX XXXX)
    aadhaar = re.findall(r"\d{4}\s\d{4}\s\d{4}", text)
    if aadhaar:
        details["aadhaar_number"] = aadhaar[0]

    # DOB
    dob = re.findall(r"\d{2}/\d{2}/\d{4}", text)
    if dob:
        details["dob"] = dob[0]

    # Gender
    if "Male" in text or "MALE" in text:
        details["gender"] = "Male"
    elif "Female" in text or "FEMALE" in text:
        details["gender"] = "Female"

    # Name (first line after Government of India)
    lines = text.split("\n")
    for i in range(len(lines)):  # FIXED: was "for i, line in range"
        if "Government of India" in lines[i]:
            if i + 1 < len(lines):
                possible_name = lines[i+1].strip()
                if len(possible_name.split()) >= 2:
                    details["name"] = possible_name
            break

    return details


async def process_aadhar_front(file: UploadFile):
    """Main function: OCR + Face Extraction"""
    
    # Read file bytes
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # OCR
    text = extract_text_from_cv_image(image_cv)  # Using the cv2 image version

    # Extract Aadhaar details
    details = extract_aadhar_details(text)

    # Extract face from document
    face_path = detect_face(image_cv)

    return {
        "status": "success",
        "extracted_text": text,
        "details": details,
        "document_face_path": face_path
    }