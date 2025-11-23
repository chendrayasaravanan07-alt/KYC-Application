# liveness.py

import cv2
import mediapipe as mp
import numpy as np

mp_face = mp.solutions.face_mesh

def detect_liveness(image_path):
    img = cv2.imread(image_path)
    h, w, _ = img.shape

    with mp_face.FaceMesh(static_image_mode=True, max_num_faces=1) as face_mesh:
        result = face_mesh.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

        if not result.multi_face_landmarks:
            return {"liveness": False, "reason": "No face detected"}

        face = result.multi_face_landmarks[0]

        # Extract eye coords
        left_eye = [face.landmark[i] for i in [33, 160, 158, 133]]
        right_eye = [face.landmark[i] for i in [362, 385, 387, 263]]

        def eye_ratio(eye):
            p1 = np.array([eye[0].x * w, eye[0].y * h])
            p2 = np.array([eye[3].x * w, eye[3].y * h])
            vertical = np.linalg.norm(
                np.array([eye[1].x*w, eye[1].y*h]) -
                np.array([eye[2].x*w, eye[2].y*h])
            )
            horizontal = np.linalg.norm(p1 - p2)
            return vertical / horizontal

        left_ratio = eye_ratio(left_eye)
        right_ratio = eye_ratio(right_eye)

        EAR = (left_ratio + right_ratio) / 2

        if EAR < 0.18:
            return {"liveness": False, "reason": "Eyes too small (photo detection)"}

        return {"liveness": True, "EAR": EAR}