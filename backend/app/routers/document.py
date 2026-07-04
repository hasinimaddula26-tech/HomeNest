from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import Any
import os
from app.core.database import get_db
from app.services import document as document_service
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/documents", tags=["Document Vault"])

@router.post("/upload")
async def upload_document(
    category: str = Form("Others"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Read file content
    content = await file.read()
    
    # Save document record
    doc = document_service.save_uploaded_file(
        db=db,
        user_id=current_user.id,
        file_name=file.filename or "unnamed",
        file_type=file.content_type or "application/octet-stream",
        file_content=content,
        category=category
    )
    return {"success": True, "data": doc}

@router.get("")
def read_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    items = document_service.get_user_documents(db, current_user.id)
    return {"success": True, "data": items}

@router.get("/{doc_id}/file")
def get_file(doc_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_doc = document_service.get_document_by_id(db, doc_id)
    if not db_doc or db_doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if not os.path.exists(db_doc.file_path):
        raise HTTPException(status_code=404, detail="File missing on disk")
        
    return FileResponse(db_doc.file_path, media_type=db_doc.file_type, filename=db_doc.file_name)

@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_doc = document_service.get_document_by_id(db, doc_id)
    if not db_doc or db_doc.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Document not found"}
        )
    document_service.remove_document(db, db_doc)
    return {"success": True, "message": "Document deleted successfully"}
