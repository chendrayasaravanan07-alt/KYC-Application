# face_match.py
import cv2
import numpy as np
import os

# Use Haar cascade to detect face region (bundled with OpenCV)
CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

def _detect_face_and_crop(gray_img):
    face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    faces = face_cascade.detectMultiScale(gray_img, scaleFactor=1.1, minNeighbors=4)
    if len(faces) == 0:
        return None
    # take the largest face
    faces = sorted(faces, key=lambda x: x[2]*x[3], reverse=True)
    x,y,w,h = faces[0]
    face = gray_img[y:y+h, x:x+w]
    face_resized = cv2.resize(face, (200,200))
    return face_resized

def face_match(id_image_path, selfie_image_path):
    """
    Performs LBPH face recognition by training on the ID face and predicting on selfie.
    Returns a match boolean and confidence score (0-100, higher = better).
    """

    # read images as grayscale
    id_img = cv2.imread(id_image_path)
    selfie_img = cv2.imread(selfie_image_path)
    if id_img is None or selfie_img is None:
        return {"error": "Could not read one or both images."}

    id_gray = cv2.cvtColor(id_img, cv2.COLOR_BGR2GRAY)
    selfie_gray = cv2.cvtColor(selfie_img, cv2.COLOR_BGR2GRAY)

    id_face = _detect_face_and_crop(id_gray)
    selfie_face = _detect_face_and_crop(selfie_gray)

    if id_face is None or selfie_face is None:
        return {"match": False, "score": 0.0, "reason": "face_not_detected"}

    # create LBPH recognizer (needs opencv-contrib)
    try:
        recognizer = cv2.face.LBPHFaceRecognizer_create()
    except Exception as e:
        return {"error": "cv2.face not available; ensure opencv-contrib-python installed.", "detail": str(e)}

    # Train using the single ID image (label 0)
    # LBPH accepts list of training images + labels
    recognizer.train([id_face], np.array([0], dtype=np.int32))

    label, confidence = recognizer.predict(selfie_face)
    # LBPH confidence -> lower is better (distance). We'll convert to similarity.
    # We'll map a reasonable scale: similarity = max(0, 100 - confidence)
    score = max(0.0, 100.0 - confidence)
    is_match = score >= 60.0  # threshold: 60

    return {"match": bool(is_match), "score": float(round(score,2)), "raw_confidence": float(round(confidence,2))}
