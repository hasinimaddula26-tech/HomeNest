from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.schemas.family import FamilyMemberCreate, FamilyMemberResponse
from app.services import family as family_service
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/family", tags=["Family Directory"])

@router.get("")
def read_family_members(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    items = family_service.get_family_members(db, current_user.id)
    return {"success": True, "data": jsonable_encoder(items)}

@router.post("")
def create_member(member: FamilyMemberCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    new_item = family_service.create_family_member(db, current_user.id, member)
    return {"success": True, "data": jsonable_encoder(new_item)}

@router.delete("/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_member = family_service.get_member_by_id(db, member_id)
    if not db_member or db_member.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Family member not found"}
        )
    family_service.delete_family_member(db, db_member)
    return {"success": True, "message": "Family member deleted successfully"}
