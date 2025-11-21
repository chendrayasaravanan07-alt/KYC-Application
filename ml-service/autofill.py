# autofill.py
import re

def extract_fields_from_text(text):
    """
    Extract basic fields: Aadhaar (XXXX XXXX XXXX), PAN (AAAAA9999A), DOB (DD-MM-YYYY or DD/MM/YYYY)
    Also attempt to guess Name using simple heuristics.
    """
    res = {}
    # Aadhaar: 12 digits, allow spaces
    aad = re.search(r"\b(\d{4}\s?\d{4}\s?\d{4})\b", text)
    if aad:
        res["aadhaar"] = aad.group(1)

    pan = re.search(r"\b([A-Z]{5}\d{4}[A-Z])\b", text)
    if pan:
        res["pan"] = pan.group(1)

    dob = re.search(r"\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b", text)
    if dob:
        res["dob"] = dob.group(1)

    # Name: fallback - line with letters and spaces between 3 and 40 chars and likely uppercase (heuristic)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    for ln in lines[:8]:  # search first few lines
        if re.match(r'^[A-Z][A-Za-z .]{2,40}$', ln):
            # avoid lines that look like labels (contain ':' or 'DOB' etc)
            if not re.search(r':', ln) and not re.search(r'DOB|PAN|Aadhaar|AADHAAR', ln, re.I):
                res.setdefault("possible_name", ln)
                break

    return res
