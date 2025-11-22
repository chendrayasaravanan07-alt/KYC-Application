# autofill.py

from rapidfuzz import fuzz

def extract_field(text, label):
    lines = text.splitlines()
    best = ""
    best_score = 0

    for line in lines:
        score = fuzz.partial_ratio(label.lower(), line.lower())
        if score > best_score:
            best_score = score
            best = line

    return best

def autofill_details(ocr_text):
    name = extract_field(ocr_text, "Name")
    dob = extract_field(ocr_text, "DOB")
    gender = extract_field(ocr_text, "Male")
    aadhar = extract_field(ocr_text, "Aadhaar")
    address = extract_field(ocr_text, "Address")

    return {
        "name": name.replace("Name", "").strip(),
        "dob": dob.replace("DOB", "").strip(),
        "gender": gender.strip(),
        "aadhar_number": ''.join(filter(str.isdigit, aadhar)),
        "address": address.strip()
    }
