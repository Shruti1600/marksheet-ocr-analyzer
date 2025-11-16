import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api/upload-marksheet";
const HEALTH_URL = "http://127.0.0.1:8000/";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");

  // Check if backend is reachable on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(HEALTH_URL);
      if (response.ok) {
        setBackendStatus("online");
        console.log("✅ Backend is reachable");
      } else {
        setBackendStatus("offline");
        console.error("❌ Backend returned non-200 status");
      }
    } catch (error) {
      setBackendStatus("offline");
      console.error("❌ Cannot reach backend:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // Check backend status before uploading
    if (backendStatus === "offline") {
      setError("Backend server is not reachable. Please make sure it's running on http://127.0.0.1:8000");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    console.log("📤 Uploading file:", file.name);
    console.log("📡 API URL:", API_URL);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Response data:", data);

      if (data.success && data.data) {
        setResult(data.data);
        console.log("✅ Successfully extracted marks:", data.data);
      } else {
        setError(data.message || "Server returned no data");
        console.error("⚠️ No data in response:", data);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      
      // Provide specific error messages
      if (error.message.includes("Failed to fetch")) {
        setError(
          "Cannot connect to backend server. Please ensure:\n" +
          "1. Backend is running (uvicorn main:app --reload)\n" +
          "2. Backend is on http://127.0.0.1:8000\n" +
          "3. No firewall is blocking the connection"
        );
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2
  style={{
    color: "#000",          // Dark text for better contrast
    fontWeight: "700",      // Bold
    fontSize: "28px",       // Larger and readable
    textAlign: "center",    // Centered
    marginBottom: "20px",   // Some spacing below
    textTransform: "uppercase", // Optional for emphasis
    letterSpacing: "1px",
  }}
>
  📄 Upload Marksheet
</h2>

      
      {/* Backend Status Indicator */}
      <div style={{ 
        padding: "10px", 
        marginBottom: "20px",
        borderRadius: "4px",
        backgroundColor: backendStatus === "online" ? "#d4edda" : 
                        backendStatus === "offline" ? "#f8d7da" : "#fff3cd",
        border: `1px solid ${backendStatus === "online" ? "#c3e6cb" : 
                              backendStatus === "offline" ? "#f5c6cb" : "#ffeaa7"}`
      }}>
        <strong>Backend Status:</strong>{" "}
        {backendStatus === "online" && "🟢 Online"}
        {backendStatus === "offline" && "🔴 Offline - Start your backend server!"}
        {backendStatus === "checking" && "🟡 Checking..."}
        <button 
          onClick={checkBackendHealth}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            fontSize: "12px",
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: "3px",
            backgroundColor: "white"
          }}
        >
          Refresh Status
        </button>
      </div>

      {/* File Upload Section */}
      <div style={{ 
        marginBottom: "20px",
        padding: "20px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setError(null);
            setResult(null);
            if (e.target.files[0]) {
              console.log("📄 File selected:", e.target.files[0].name);
            }
          }}
          style={{ 
            marginBottom: "10px", 
            display: "block",
            padding: "10px",
            width: "100%"
          }}
        />
        
        {file && (
          <p style={{ color: "#666", fontSize: "14px" }}>
            Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
        
        <button 
          onClick={handleUpload} 
          disabled={loading || !file || backendStatus === "offline"}
          style={{
            padding: "12px 24px",
            backgroundColor: loading || !file || backendStatus === "offline" ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading || !file || backendStatus === "offline" ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {loading ? "🔄 Processing..." : "📤 Upload & Analyze"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          borderRadius: "4px",
          marginBottom: "20px",
          border: "1px solid #f5c6cb",
          whiteSpace: "pre-line"
        }}>
          <strong>❌ Error:</strong><br/>{error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div style={{ 
          border: "2px solid #28a745", 
          padding: "20px", 
          borderRadius: "8px",
          backgroundColor: "#d4edda"
        }}>
          <h3 style={{ color: "#155724", marginTop: "0" }}>✅ Analysis Results</h3>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "20px",
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "4px"
          }}>
            <div style={{ color: "#000", fontSize: "16px" }}>
              <strong style={{ color: "#000" }}>Total Subjects:</strong> {result.total_subjects}
            </div>
            <div style={{ color: "#000", fontSize: "16px" }}>
              <strong style={{ color: "#000" }}>Total Marks:</strong> {result.total_marks}
            </div>
            <div style={{ color: "#000", fontSize: "16px" }}>
              <strong style={{ color: "#000" }}>Percentage:</strong> <span style={{ fontSize: "20px", fontWeight: "bold", color: "#0066cc" }}>{result.percentage}%</span>
            </div>
            <div style={{ color: "#000", fontSize: "16px" }}>
              <strong style={{ color: "#000" }}>Grade:</strong> <span style={{ fontSize: "20px", fontWeight: "bold", color: "#0a8a0a" }}>{result.grade}</span>
            </div>
          </div>

          {result.subjects && result.subjects.length > 0 && (
            <>
              <h4 style={{ color: "#000", marginBottom: "10px" }}>Subject-wise Marks:</h4>
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                backgroundColor: "white",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #0056b3" }}>Subject</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #0056b3" }}>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((s, i) => (
                    <tr key={i} style={{ 
                      borderBottom: "1px solid #ddd",
                      backgroundColor: i % 2 === 0 ? "white" : "#f8f9fa"
                    }}>
                      <td style={{ padding: "10px", color: "#000", fontSize: "16px" }}>{s.subject}</td>
                      <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold", color: "#000", fontSize: "16px" }}>{s.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* Debug Info */}
      <details style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <summary style={{ cursor: "pointer", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
          🔧 Debug Information
        </summary>
        <div style={{ padding: "10px", backgroundColor: "#f9f9f9", marginTop: "5px", borderRadius: "4px" }}>
          <p><strong>API URL:</strong> {API_URL}</p>
          <p><strong>Health Check URL:</strong> {HEALTH_URL}</p>
          <p><strong>Backend Status:</strong> {backendStatus}</p>
          <p><strong>Selected File:</strong> {file ? file.name : "None"}</p>
          <p style={{ fontSize: "11px", marginTop: "10px" }}>
            💡 <strong>Tip:</strong> Open browser console (F12) to see detailed logs
          </p>
        </div>
      </details>
    </div>
  );
}

export default UploadPage;
