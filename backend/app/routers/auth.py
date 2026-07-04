from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    # Fetch user
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if not db_user or not verify_password(user_in.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password"
        )
    
    # Create token
    access_token = create_access_token(subject=db_user.username)
    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username
    }
