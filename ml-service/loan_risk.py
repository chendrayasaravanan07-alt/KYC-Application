# loan_risk.py

import joblib
import numpy as np

model_path = "risk_model.pkl"

def loan_risk_prediction(income, age, loan_amount):
    try:
        model = joblib.load(model_path)

        features = np.array([[income, age, loan_amount]])
        score = model.predict_proba(features)[0][1]

        return {
            "risk_score": float(score),
            "risk_level": "HIGH" if score > 0.6 else "LOW"
        }

    except Exception as e:
        return {"error": str(e)}