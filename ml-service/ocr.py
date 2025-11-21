# ocr.py
from PIL import Image
import pytesseract
import cv2
import numpy as np
import os

# IMPORTANT: set this to your actual tesseract exe path after installation
# Common paths:
# 64-bit: r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# 32-bit: r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe"
# Update below if needed.
TESSERACT_PATH = r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe"
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def perform_ocr_from_path(image_path):
    """
    Read an image file and return extracted text.
    """
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    return {"text": text}
