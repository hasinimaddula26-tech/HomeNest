from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers.grocery import router as grocery_router
from app.routers.expense import router as expense_router

# Auto-create database tables (SQLAlchemy models)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HomeNest API", version="0.1.0")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(grocery_router, prefix="/api")
app.include_router(expense_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the HomeNest API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
