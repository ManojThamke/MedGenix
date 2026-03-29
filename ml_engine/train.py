import joblib
import json
import time
import numpy as np
import os

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score
)

from sklearn.model_selection import cross_val_score

# -------------------------------
# CONFIG
# -------------------------------
MODEL_DIR = "../backend/models"
os.makedirs(MODEL_DIR, exist_ok=True)

# -------------------------------
# Step 1: Load processed data
# -------------------------------
X_train, X_test, y_train, y_test = joblib.load("processed_data.pkl")
feature_names = joblib.load("../backend/models/feature_names.pkl")

print("✅ Data Loaded")

# -------------------------------
# Step 2: Initialize models
# -------------------------------
models = {
    "Random Forest": RandomForestClassifier(n_estimators=200, random_state=42),
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

    train_time = time.time() - start_time

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    # Metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)

    # Cross Validation (VERY IMPORTANT)
    cv_scores = cross_val_score(model, X_train, y_train, cv=5)

    print(f"{name} Accuracy: {acc:.4f} | CV Mean: {cv_scores.mean():.4f}")

    results[name] = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "cv_mean": round(cv_scores.mean(), 4),
        "train_time_sec": round(train_time, 4),
        "confusion_matrix": cm.tolist()
    }

# -------------------------------
# Step 4: Learning Curve (Improved)
# -------------------------------
data_sizes = np.linspace(0.4, 1.0, 6)

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

        print(f"{name} | {int(size*100)}% → {acc:.4f}")

        learning_results[name].append({
            "data_percent": int(size * 100),
            "accuracy": round(acc, 4)
        })

# -------------------------------
# Step 5: Best Model Selection
# -------------------------------
best_model_name = max(results, key=lambda x: results[x]["accuracy"])
best_model = models[best_model_name]

print("\n🏆 Best Model:", best_model_name)

# -------------------------------
# Step 6: Feature Importance (RF only)
# -------------------------------
rf_model = models["Random Forest"]

importances = rf_model.feature_importances_

feature_importance = sorted(
    zip(feature_names, importances),
    key=lambda x: x[1],
    reverse=True
)

print("\n🔥 Top Features:")
for f, score in feature_importance[:5]:
    print(f"{f}: {score:.4f}")

# Save feature importance
with open("feature_importance.json", "w") as f:
    json.dump(
        [{"feature": f, "importance": float(score)} for f, score in feature_importance],
        f,
        indent=4
    )

# -------------------------------
# Step 7: Save Models
# -------------------------------
joblib.dump(best_model, os.path.join(MODEL_DIR, "best_model.pkl"))
joblib.dump(models["Random Forest"], os.path.join(MODEL_DIR, "random_forest.pkl"))
joblib.dump(models["SVM"], os.path.join(MODEL_DIR, "svm.pkl"))
joblib.dump(models["Logistic Regression"], os.path.join(MODEL_DIR, "logistic_regression.pkl"))

print("✅ Models saved")

# -------------------------------
# Step 8: Save Results
# -------------------------------
with open("model_results.json", "w") as f:
    json.dump(results, f, indent=4)

with open("learning_curve.json", "w") as f:
    json.dump(learning_results, f, indent=4)

print("📁 Results saved")

# -------------------------------
# DONE
# -------------------------------
print("\n🚀 Training + Analysis Completed Successfully!")