# face_match.py

from deepface import DeepFace
import cv2

def compare_faces(doc_face_path, selfie_path, threshold=0.35):
    """
    Compare the face on the document with the selfie.
    Returns: { 'match': True/False, 'distance': float }
    """

    try:
        result = DeepFace.verify(
            img1_path=doc_face_path,
            img2_path=selfie_path,
            model_name="Facenet512",
            distance_metric="cosine"
        )

        distance = result["distance"]
        match = distance < threshold

        return {
            "match": match,
            "distance": distance
        }

    except Exception as e:
        return {"error": str(e)}
