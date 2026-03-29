import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# =========================
# LOAD DATASETS
# =========================

df1 = pd.read_csv("../data/parkinsons.csv")  # small dataset
df2 = pd.read_csv("../data/parkinsons_updrs.csv")  # large dataset

print("Dataset 1 shape:", df1.shape)
print("Dataset 2 shape:", df2.shape)

# =========================
# CONVERT TELEMONITORING → CLASSIFICATION
# =========================

df2['status'] = df2['total_UPDRS'].apply(lambda x: 1 if x > 25 else 0)

# Drop unnecessary columns
df2 = df2.drop(['subject#', 'motor_UPDRS', 'total_UPDRS'], axis=1)

# =========================
# MATCH COMMON COLUMNS
# =========================

common_cols = list(set(df1.columns) & set(df2.columns))

df1 = df1[common_cols]
df2 = df2[common_cols]

# =========================
# MERGE DATA
# =========================

df = pd.concat([df1, df2], ignore_index=True)

print("\nFinal Dataset Shape:", df.shape)

# =========================
# BASIC INFO
# =========================

print("\nColumns:")
print(df.columns)

print("\nTarget Distribution:")
print(df['status'].value_counts())

print("\nMissing Values:")
print(df.isnull().sum())

# =========================
# SAMPLE DATA
# =========================

print("\nFirst 5 rows:")
print(df.head())

# =========================
# VISUALIZATION
# =========================

# Target distribution
sns.countplot(x='status', data=df)
plt.title("Parkinson's vs Healthy")
plt.show()

# Correlation heatmap
plt.figure(figsize=(12,8))
sns.heatmap(df.corr(), cmap='coolwarm')
plt.title("Feature Correlation")
plt.show()