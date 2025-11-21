# liveness.py
import cv2
import numpy as np
import tempfile
import os

def liveness_check_from_video_path(video_path, min_frames=8, motion_threshold=50000):
    """
    Simple liveness: count frames and measure frame differences.
    If there are multiple frames and some motion detected -> likely live.
    """
    if not os.path.exists(video_path):
        return {"error": "video not found"}

    cap = cv2.VideoCapture(video_path)
    prev_gray = None
    motion_sum = 0
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (5,5), 0)

        if prev_gray is not None:
            diff = cv2.absdiff(prev_gray, gray)
            non_zero = np.sum(diff)
            motion_sum += non_zero
        prev_gray = gray

    cap.release()

    avg_motion = motion_sum / max(1, frame_count-1)
    live = (frame_count >= min_frames) and (avg_motion > motion_threshold)

    return {"liveness": bool(live), "frames": frame_count, "avg_motion": float(avg_motion)}
