from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
import datetime

router = APIRouter()

SECRET_KEY = "medgenix_secret"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# TEMP DB (replace with Mongo later)
users_db = {}

class User(BaseModel):
    email: str
    password: str

# ---------------- SIGNUP ----------------
@router.post("/signup")
def signup(user: User):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = pwd_context.hash(user.password)

    users_db[user.email] = {
        "email": user.email,
        "password": hashed
    }

    return {"message": "User created successfully"}

# ---------------- LOGIN ----------------
@router.post("/login")
def login(user: User):
    db_user = users_db.get(user.email)

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = jwt.encode({
        "sub": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token}