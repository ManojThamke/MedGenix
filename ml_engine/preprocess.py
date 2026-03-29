import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# -------------------------------
# CONFIG
# -------------------------------
DATA_PATH = "../data/parkinsons.csv"
MODEL_DIR = "../backend/models"

os.makedirs(MODEL_DIR, exist_ok=True)

# -------------------------------
# STEP 1: LOAD DATA
# -------------------------------
df = pd.read_csv(DATA_PATH)

print("="*50)
print("📊 DATA LOADED")
print("Shape:", df.shape)

# -------------------------------
# STEP 2: DROP USELESS COLUMNS
# -------------------------------
if 'name' in df.columns:
    df = df.drop(columns=['name'])

# -------------------------------
# STEP 3: DATA VALIDATION
# -------------------------------
print("\n🔍 Checking Missing Values...")
missing = df.isnull().sum()

if missing.sum() == 0:
    print("✅ No missing values")
else:
    print("⚠ Missing values found:")
    print(missing)
    df = df.fillna(df.mean())

# -------------------------------
# STEP 4: OUTLIER HANDLING (ADVANCED)
# -------------------------------
print("\n📉 Handling Outliers (IQR Method)...")

def remove_outliers(df):
    df_clean = df.copy()
    
    for col in df_clean.columns:
        if col == 'status':
            continue
        
        Q1 = df_clean[col].quantile(0.25)
        Q3 = df_clean[col].quantile(0.75)
        IQR = Q3 - Q1
        
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        
        df_clean[col] = np.clip(df_clean[col], lower, upper)
    
    return df_clean

df = remove_outliers(df)

print("✅ Outliers handled")

# -------------------------------
# STEP 5: SPLIT FEATURES & TARGET
# -------------------------------
X = df.drop(columns=['status'])
y = df['status']

print("\n📌 Features:", X.shape)
print("📌 Target:", y.shape)

# -------------------------------
# STEP 6: SAVE FEATURE NAMES
# -------------------------------
feature_names = X.columns.tolist()
joblib.dump(feature_names, os.path.join(MODEL_DIR, "feature_names.pkl"))

print("✅ Feature names saved")

# -------------------------------
# STEP 7: TRAIN-TEST SPLIT
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\n📊 Data Split:")
print("Train:", X_train.shape)
print("Test:", X_test.shape)

# -------------------------------
# STEP 8: FEATURE SCALING
# -------------------------------
print("\n⚙ Applying StandardScaler...")

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

print("✅ Scaler saved")

# -------------------------------
# STEP 9: SAVE PROCESSED DATA
# -------------------------------
joblib.dump(
    (X_train_scaled, X_test_scaled, y_train, y_test),
    "processed_data.pkl"
)

print("✅ Processed data saved")

# -------------------------------
# STEP 10: SUMMARY REPORT
# -------------------------------
print("\n" + "="*50)
print("🚀 PREPROCESSING COMPLETED")

print("\n📌 FINAL DETAILS:")
print("Total Features:", len(feature_names))
print("Feature Names:", feature_names[:5], "...")

print("\n🎯 Ready for Model Training!")
print("="*50)