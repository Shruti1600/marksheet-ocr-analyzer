📄 Marksheet-ocr-analyzer


An AI-driven application that extracts, analyzes and evaluates marksheet data from scanned images or PDF documents. The system uses OpenCV, PyTesseract and OCR pipelines to detect text, numbers, symbols and structured tabular data. It automatically processes the uploaded marksheet and generates a clean, formatted analysis including total marks, percentage, grade and subject-wise scores.


✅ Key Features

Multiple File Support: JPG, PNG, JPEG and PDF marksheets

Image Preprocessing: Thresholding, noise removal, edge detection using OpenCV (cv2)

OCR Extraction: Uses PyTesseract / OCR to extract text and numerical values

Subject–Mark Mapping: Converts unstructured OCR output into structured JSON

Data Analysis:

- Total subjects
- Total marks
- Percentage calculation
- Automatic grade evaluation

Clean Output UI: Displays results similar to the sample analysis screenshot

Error Handling: Supports fuzzy text recognition and fallbacks

Fully Automated Workflow: Upload → OCR → Parse → Analyze → Output


🧠 Processing Pipeline

1. Upload marksheet (Image/PDF)
- User uploads a scanned marksheet through the UI or API.

2. Preprocessing (OpenCV)

- Grayscale conversion
- Dilation, erosion
- Noise reduction
- Thresholding
- Contour extraction

3. OCR Extraction (PyTesseract)

Extracts:                                    
- Student information
- Subject names
- Marks
- Symbols & text blocks

4. Text Parsing & Validation

- Regex-based filtering
- Mapping subjects to detected marks
- Removing OCR errors
- Structuring clean data

5. Analysis Computation

- Count subjects
- Sum marks
- Calculate percentage
- Assign grades

6. Final Output Rendered
- Clean, UI-friendly results are displayed back to the user.


🛠️ Tech Stack

1. Core Libraries:

- Python
- OpenCV
- PyTesseract
- Tesseract OCR Engine
- NumPy
- Pandas

2. Backend

- FastAPI 
- Uvicorn 

3. Frontend 

- HTML / CSS
- React + Vite


⚙️ Installation

1. Clone the Repository

- git clone https://github.com/your-username/marksheet-analyzer.git

- cd marksheet-analyzer

2. Install Dependencies

- pip install -r requirements.txt

3. Install Tesseract OCR

- For windows, download from: (https://github.com/UB-Mannheim/tesseract/wiki)


▶️ Run the Application

1. Start Backend

- uvicorn src.main:app --reload

2. Open in Browser

- http://127.0.0.1:8000

3. API Docs (Automatic Swagger UI)

- http://127.0.0.1:8000/docs

4. Start Frontend

- cd frontend

5. Install Dependencies

- npm install

6. Start the Development Server

- npm run dev

7. Open in Browser

- http://localhost:5173/


🚀 Future Enhancements

- Support for handwritten marksheets

- Deep Learning–based text extraction (CRAFT, EasyOCR)

- Layout detection using OCR + Vision Transformers

- Multi-page PDF support

- Grading insights & analytics dashboard
