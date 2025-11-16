import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# ✅ Ensure model directory exists
os.makedirs("model", exist_ok=True)

# ✅ Sample dataset
data = {
    "math": [90, 70, 50, 95, 30, 60, 80, 45],
    "science": [85, 65, 40, 90, 35, 55, 75, 50],
    "english": [88, 60, 45, 92, 25, 50, 70, 40],
    "performance": ["Excellent", "Average", "Poor", "Excellent", "Poor", "Average", "Excellent", "Poor"]
}

df = pd.DataFrame(data)

# ✅ Split data
X = df[["math", "science", "english"]]
y = df["performance"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ✅ Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# ✅ Save model
joblib.dump(model, "model/model.pkl")
print("✅ Model trained and saved successfully at model/model.pkl")
