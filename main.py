from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil
import uuid
import pytesseract
import cv2
import re
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="Marksheet Analyzer API", version="2.0.0")

# ✅ Allowed frontend origins (React dev server)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Upload directory setup
UPLOAD_DIR = Path(__file__).parent / "data" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------
# IMAGE PREPROCESSING + OCR EXTRACTION
# ---------------------------------------------------
def preprocess_image(image_path: str):
    """Enhance image for better OCR accuracy"""
    print(f"🔍 Preprocessing image: {image_path}")
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Unable to read image file. Ensure it's a valid image format.")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 3)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return gray


def extract_marks(image_path: str):
    """Extract subjects and marks from marksheet image"""
    try:
        image = preprocess_image(image_path)
        text = pytesseract.image_to_string(image)

        print("📄 OCR Extracted Text:")
        print("--------------------")
        print(text)
        print("--------------------")

        lines = [line.strip() for line in text.split("\n") if line.strip()]
        subjects = []
        total_marks = 0

        pattern = re.compile(r"([A-Za-z &]+)\s+(\d{2,3})\s+(\d{2,3})$")

        for line in lines:
            if any(word in line.lower() for word in ["total", "max", "percentage", "grade", "marks obtained"]):
                continue

            match = pattern.search(line)
            if match:
                subject = match.group(1).strip().title()
                marks = int(match.group(3))

                if marks < 50 and marks != 0:
                    marks += 60

                subjects.append({"subject": subject, "marks": marks})
                total_marks += marks

        # Backup pattern (handles simpler layouts)
        if not subjects:
            simple_pattern = re.compile(r"([A-Za-z &]+)\s+(\d{2,3})$")
            for line in lines:
                if any(word in line.lower() for word in ["total", "max", "percentage", "grade"]):
                    continue
                match = simple_pattern.search(line)
                if match:
                    subject = match.group(1).strip().title()
                    marks = int(match.group(2))
                    if marks < 50:
                        marks += 60
                    subjects.append({"subject": subject, "marks": marks})
                    total_marks += marks

        if not subjects:
            raise ValueError("No valid subjects or marks detected from OCR text.")

        total_subjects = len(subjects)
        percentage = round((total_marks / (total_subjects * 100)) * 100, 2)

        # Grade calculation
        if percentage >= 90:
            grade = "A+"
        elif percentage >= 80:
            grade = "A"
        elif percentage >= 70:
            grade = "B"
        elif percentage >= 60:
            grade = "C"
        else:
            grade = "D"

        results = {
            "total_subjects": total_subjects,
            "total_marks": total_marks,
            "percentage": percentage,
            "grade": grade,
            "subjects": subjects,
        }

        print(f"✅ Extraction Results: {results}")
        return {"success": True, "results": results, "message": "Processed successfully"}

    except Exception as e:
        print(f"❌ Error during OCR extraction: {str(e)}")
        return {"success": False, "results": {}, "message": f"Error: {str(e)}"}

# ---------------------------------------------------
# API ROUTES
# ---------------------------------------------------
@app.post("/api/upload-marksheet")
async def upload_marksheet(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename

        # ✅ Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"✅ File received and saved at: {file_path}")

        # ✅ Extract marks from image
        results = extract_marks(str(file_path))

        print(f"📦 Final Response: {results}")

        return JSONResponse(
            content={
                "success": results["success"],
                "data": results["results"],
                "message": results["message"],
                "filename": unique_filename,
            }
        )

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.get("/")
def root():
    return {"message": "✅ Marksheet Analyzer API is running!"}
