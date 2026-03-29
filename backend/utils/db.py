from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsAllowInvalidCertificates=True,  # 🔥 FIX SSL issue
        serverSelectionTimeoutMS=5000      # faster error detection
    )

    # Test connection
    client.server_info()

    print("✅ MongoDB Connected Successfully")

    db = client["medgenix"]
    reports_collection = db["reports"]
    users_collection = db["users"]

except Exception as e:
    print("❌ MongoDB Connection Error:", e)

    # Fallback (so app doesn't crash)
    reports_collection = None
    users_collection = None