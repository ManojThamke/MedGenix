import joblib
import pandas as pd
import matplotlib.pyplot as plt
import json

# -------------------------------
# Step 1: Load original dataset (for column names)
# -------------------------------
df = pd.read_csv("../data/parkinsons.csv")

# Drop unnecessary column
df = df.drop(columns=['name'])

feature_names = df.drop(columns=['status']).columns

# -------------------------------
# Step 2: Load trained Random Forest model
# -------------------------------
rf_model = joblib.load("../backend/models/random_forest.pkl")

print("✅ Random Forest model loaded")

# -------------------------------
# Step 3: Get feature importance
# -------------------------------
importances = rf_model.feature_importances_

# Create DataFrame
feature_df = pd.DataFrame({
    "feature": feature_names,
    "importance": importances
})

# Sort descending
feature_df = feature_df.sort_values(by="importance", ascending=False)

# -------------------------------
# Step 4: Save top features JSON
# -------------------------------
top_features = feature_df.head(10)

top_features_list = top_features.to_dict(orient="records")

with open("feature_importance.json", "w") as f:
    json.dump(top_features_list, f, indent=4)

print("📁 Feature importance saved")

# -------------------------------
# Step 5: Plot graph
# -------------------------------
plt.figure(figsize=(10,6))
plt.barh(top_features["feature"], top_features["importance"])
plt.xlabel("Importance Score")
plt.title("Top 10 Important Features")
plt.gca().invert_yaxis()

plt.tight_layout()
plt.show()

# -------------------------------
# DONE
# -------------------------------
print("\n✅ Feature Importance Analysis Completed!")