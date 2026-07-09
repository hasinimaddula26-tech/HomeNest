from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers.grocery import router as grocery_router
from app.routers.expense import router as expense_router
from app.routers.bill import router as bill_router
from app.routers.reminder import router as reminder_router
from app.routers.dashboard import router as dashboard_router
from app.routers.auth import router as auth_router
from app.routers.family import router as family_router
from app.routers.document import router as document_router

# Auto-create database tables (SQLAlchemy models)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    import sys
    print(f"Warning: Database connection failed during startup table creation: {e}", file=sys.stderr)

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
app.include_router(bill_router, prefix="/api")
app.include_router(reminder_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(family_router, prefix="/api")
app.include_router(document_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the HomeNest API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
