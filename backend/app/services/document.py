from sqlalchemy.orm import Session
from typing import List, Optional
import os
from app.models.document import Document
from app.schemas.document import DocumentCategory
from app.services.activity import log_activity

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_user_documents(db: Session, user_id: int) -> List[Document]:
    return db.query(Document).filter(Document.user_id == user_id).order_by(Document.created_at.desc()).all()

def get_document_by_id(db: Session, doc_id: int) -> Optional[Document]:
    return db.query(Document).filter(Document.id == doc_id).first()

def save_uploaded_file(db: Session, user_id: int, file_name: str, file_type: str, file_content: bytes, category: str) -> Document:
    # Sanitize file name by pre-pending timestamp to avoid collisions
    import time
    sanitized_name = f"{int(time.time())}_{file_name}"
    file_path = os.path.join(UPLOAD_DIR, sanitized_name)
    
    # Save file contents
    with open(file_path, "wb") as f:
        f.write(file_content)
        
    db_doc = Document(
        user_id=user_id,
        file_name=file_name,
        file_type=file_type,
        file_path=file_path,
        category=category
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    log_activity(db, f"Document '{db_doc.file_name}' ({db_doc.category}) uploaded to vault")
    return db_doc

def remove_document(db: Session, db_doc: Document) -> None:
    # Delete from filesystem if exists
    if os.path.exists(db_doc.file_path):
        try:
            os.remove(db_doc.file_path)
        except Exception as e:
            print(f"Error removing file from disk: {e}")
            
    name = db_doc.file_name
    db.delete(db_doc)
    db.commit()
    log_activity(db, f"Document '{name}' deleted from vault")
