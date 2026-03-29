import joblib
import json
import time
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

# -------------------------------
# Step 1: Load processed data
# -------------------------------
X_train, X_test, y_train, y_test = joblib.load("processed_data.pkl")

print("✅ Data Loaded")

# -------------------------------
# Step 2: Initialize models
# -------------------------------
models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "SVM": SVC(kernel='rbf', probability=True, random_state=42),
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42)
}

results = {}
learning_results = {}

# -------------------------------
# Step 3: Train + Evaluate
# -------------------------------
for name, model in models.items():
    print(f"\n🔹 Training {name}...")

    start_time = time.time()

    model.fit(X_train, y_train)

    end_time = time.time()
    train_time = end_time - start_time

    y_pred = model.predict(X_test)

    # Metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print(f"{name} Accuracy: {acc:.4f}")

    # Store metrics
    results[name] = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "train_time_sec": round(train_time, 4),
        "confusion_matrix": cm.tolist()
    }

# -------------------------------
# Step 4: Learning Curve
# -------------------------------
data_sizes = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]

for name, model in models.items():
    print(f"\n📈 Learning Curve for {name}")

    learning_results[name] = []

    for size in data_sizes:
        subset_size = int(len(X_train) * size)

        X_subset = X_train[:subset_size]
        y_subset = y_train[:subset_size]

        model.fit(X_subset, y_subset)

        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)

        print(f"{name} | {int(size*100)}% data → {acc:.4f}")

        learning_results[name].append({
            "data_percent": int(size * 100),
            "accuracy": round(acc, 4)
        })

# -------------------------------
# Step 5: Best model selection
# -------------------------------
best_model_name = max(results, key=lambda x: results[x]["accuracy"])
best_model = models[best_model_name]

print("\n🏆 Best Model:", best_model_name)

# -------------------------------
# Step 6: Save models
# -------------------------------
joblib.dump(best_model, "../backend/models/best_model.pkl")
joblib.dump(models["Random Forest"], "../backend/models/random_forest.pkl")
joblib.dump(models["SVM"], "../backend/models/svm.pkl")
joblib.dump(models["Logistic Regression"], "../backend/models/logistic_regression.pkl")

print("✅ All models saved")

# -------------------------------
# Step 7: Save JSON results
# -------------------------------
with open("model_results.json", "w") as f:
    json.dump(results, f, indent=4)

with open("learning_curve.json", "w") as f:
    json.dump(learning_results, f, indent=4)

print("📁 JSON files saved")

# -------------------------------
# DONE
# -------------------------------
print("\n✅ Training + Analysis Completed Successfully!")