from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.db import users_collection
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# ---------------- MODELS ----------------
class User(BaseModel):
    email: EmailStr
    password: str

class GoogleUser(BaseModel):
    email: EmailStr

# ---------------- SIGNUP ----------------
@router.post("/signup")
def signup(user: User):
    existing = users_collection.find_one({"email": user.email})

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    # 🔥 FIX: bcrypt limit
    password = user.password[:72]

    hashed_password = pwd_context.hash(password)

    users_collection.insert_one({
        "email": user.email,
        "password": hashed_password
    })

    return {"message": "User created successfully"}

# ---------------- LOGIN ----------------
@router.post("/login")
def login(user: User):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    # 🔥 FIX: handle Google users + bcrypt limit
    if db_user.get("password") is None:
        raise HTTPException(status_code=400, detail="Use Google login for this account")

    password = user.password[:72]

    if not pwd_context.verify(password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = jwt.encode({
        "sub": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token}

# ---------------- GOOGLE LOGIN ----------------
@router.post("/google-login")
def google_login(user: GoogleUser):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        users_collection.insert_one({
            "email": user.email,
            "password": None
        })

    token = jwt.encode({
        "sub": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token}

# ---------------- PROTECTED ROUTE ----------------
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

@router.get("/protected")
def protected(user: str = Depends(get_current_user)):
    return {"message": f"Hello {user}, you are authorized"}