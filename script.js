document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById("marksheet");
  const file = fileInput.files[0];
  if (!file) return alert("Please select a marksheet image.");

  const formData = new FormData();
  formData.append("file", file);

  document.getElementById("result").innerText = "Processing...";

  try {
    const response = await fetch("http://127.0.0.1:5000/extract_marks/", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    document.getElementById("result").innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("result").innerText = "Error: " + err.message;
  }
});
