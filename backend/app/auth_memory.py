"""
In-memory authentication storage (no database)
"""
from typing import Dict, Optional
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import uuid

from app.config import settings

# In-memory user storage
users_storage: Dict[str, Dict] = {}

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = settings.jwt_secret_key or settings.admin_token
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(email: str) -> Optional[Dict]:
    """Get user by email from in-memory storage"""
    for user in users_storage.values():
        if user["email"] == email:
            return user
    return None


def create_user(email: str, password: str) -> Dict:
    """Create a new user in in-memory storage"""
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(password)
    
    user = {
        "id": user_id,
        "email": email,
        "hashed_password": hashed_password,
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    users_storage[user_id] = user
    return user


def authenticate_user(email: str, password: str) -> Optional[Dict]:
    """Authenticate a user"""
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    if not user.get("is_active", True):
        return None
    return user


def get_user_by_id(user_id: str) -> Optional[Dict]:
    """Get user by ID from in-memory storage"""
    return users_storage.get(user_id)

