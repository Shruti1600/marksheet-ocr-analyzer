import React, { useState, useEffect } from "react";
import axios from "axios";

const ManualEntryPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [percentage, setPercentage] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/subjects")
      .then((res) => setSubjects(res.data.data))
      .catch(() => alert("Failed to fetch subjects"));
  }, []);

  const handleAddSubject = (subject) => {
    if (marksData.find((s) => s.subject === subject)) return;
    setMarksData([...marksData, { subject, marks: "" }]);
  };

  const handleChange = (index, value) => {
    const updated = [...marksData];
    updated[index].marks = value;
    setMarksData(updated);
  };

  const handleCalculate = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/calculate-percentage", marksData);
      setPercentage(res.data.data.percentage);
    } catch (err) {
      alert("Error calculating percentage");
    }
  };

  return (
    <div className="container">
      <h2>Manual Entry</h2>
      <select onChange={(e) => handleAddSubject(e.target.value)}>
        <option value="">Select Subject</option>
        {subjects.map((sub) => (
          <option key={sub}>{sub}</option>
        ))}
      </select>

      {marksData.map((s, i) => (
        <div key={i}>
          <label>{s.subject}:</label>
          <input
            type="number"
            value={s.marks}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder="Enter marks"
          />
        </div>
      ))}

      <button onClick={handleCalculate}>Calculate Percentage</button>

      {percentage && (
        <div className="result">
          <h3>Total Percentage: {percentage}%</h3>
        </div>
      )}
    </div>
  );
};

export default ManualEntryPage;
