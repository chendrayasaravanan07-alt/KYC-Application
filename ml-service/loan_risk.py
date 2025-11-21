# loan_risk.py

def predict_loan_risk(features: dict):
    """
    Simple rule-based scoring.
    expected features: {"monthly_income": int, "existing_liabilities": int, "credit_score": int}
    returns risk_score (0-100) and a risk_level.
    """
    income = features.get("monthly_income", 0)
    liabilities = features.get("existing_liabilities", 0)
    credit = features.get("credit_score", 500)

    score = 0
    # income weight
    if income >= 50000:
        score += 50
    elif income >= 30000:
        score += 30
    elif income >= 15000:
        score += 15

    # liabilities (lower is better)
    if liabilities <= 5000:
        score += 30
    elif liabilities <= 20000:
        score += 10

    # credit score
    if credit >= 750:
        score += 20
    elif credit >= 650:
        score += 10

    risk_level = "LOW" if score >= 60 else ("MEDIUM" if score >= 35 else "HIGH")
    return {"risk_score": int(score), "risk_level": risk_level}
