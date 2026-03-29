import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# -------------------------------
# Step 1: Load dataset
# -------------------------------
df = pd.read_csv("../data/parkinsons.csv")

print("Original Shape:", df.shape)

# -------------------------------
# Step 2: Drop unnecessary column
# -------------------------------
df = df.drop(columns=['name'])

# -------------------------------
# Step 3: Separate features & target
# -------------------------------
X = df.drop(columns=['status'])
y = df['status']

print("\nFeatures Shape:", X.shape)
print("Target Shape:", y.shape)

# -------------------------------
# Step 4: Train-Test Split
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y   # VERY IMPORTANT
)

print("\nAfter Split:")
print("X_train:", X_train.shape)
print("X_test:", X_test.shape)

print("\nTrain Target Distribution:")
print(y_train.value_counts())

print("\nTest Target Distribution:")
print(y_test.value_counts())

# -------------------------------
# Step 5: Feature Scaling
# -------------------------------
scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

print("\nScaling Applied Successfully")

# -------------------------------
# Step 6: Save scaler (IMPORTANT for backend)
# -------------------------------
joblib.dump(scaler, "../backend/models/scaler.pkl")

print("Scaler saved at backend/models/scaler.pkl")

# -------------------------------
# Step 7: Save processed data (optional but useful)
# -------------------------------
joblib.dump((X_train, X_test, y_train, y_test), "processed_data.pkl")

print("Processed data saved as processed_data.pkl")

# -------------------------------
# DONE
# -------------------------------
print("\n✅ Preprocessing Completed Successfully!")