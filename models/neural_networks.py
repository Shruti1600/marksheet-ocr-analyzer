import pytesseract
import cv2
import re
import numpy as np

class MarksheetProcessor:
    def __init__(self):
        self.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        pytesseract.pytesseract.tesseract_cmd = self.tesseract_cmd

    def process_marksheet(self, image_path: str):
        try:
            # Load and enhance image
            img = cv2.imread(image_path)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray = cv2.medianBlur(gray, 3)
            gray = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY, 31, 2
            )

            # OCR
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(gray, config=custom_config)

            # Normalize text for parsing
            lines = [line.strip() for line in text.split("\n") if line.strip()]
            subjects = []
            total_marks = 0

            # Regex to match subjects and marks (handles cases like 'English Lng & Lit 100 92')
            pattern = r"([A-Za-z &]+)\s+(\d{2,3})\s+(\d{2,3})$"

            for line in lines:
                match = re.search(pattern, line)
                if match:
                    subject_name = match.group(1).strip().title()
                    marks_obtained = int(match.group(3))
                    subjects.append({"subject": subject_name, "marks": marks_obtained})
                    total_marks += marks_obtained

            # Fallback: try to catch lines like "English 92"
            if not subjects:
                simple_pattern = r"([A-Za-z &]+)\s+(\d{2,3})"
                for line in lines:
                    match = re.search(simple_pattern, line)
                    if match:
                        subject_name = match.group(1).strip().title()
                        marks_obtained = int(match.group(2))
                        subjects.append({"subject": subject_name, "marks": marks_obtained})
                        total_marks += marks_obtained

            if not subjects:
                return {"success": False, "results": {}, "message": "No valid subjects detected"}

            total_subjects = len(subjects)
            percentage = round(total_marks / total_subjects, 2)

            # Grading system
            if percentage >= 90:
                grade = "A+"
            elif percentage >= 80:
                grade = "A"
            elif percentage >= 70:
                grade = "B+"
            elif percentage >= 60:
                grade = "B"
            else:
                grade = "C"

            return {
                "success": True,
                "data": {
                    "total_subjects": total_subjects,
                    "total_marks": total_marks,
                    "percentage": percentage,
                    "grade": grade,
                    "subjects": subjects
                },
                "message": "Processed successfully"
            }

        except Exception as e:
            return {"success": False, "data": {}, "message": f"Error: {str(e)}"}

