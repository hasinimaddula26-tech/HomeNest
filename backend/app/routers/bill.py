from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.schemas.bill import BillCreate, BillUpdate, BillResponse
from app.services import bill as bill_service

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/bills", tags=["Bills"])

@router.get("")
def read_bills(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    items = bill_service.get_all_bills(db, current_user.id)
    return {"success": True, "data": [BillResponse.model_validate(item).model_dump(mode="json") for item in items]}

@router.post("")
def create_bill_item(bill: BillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    new_item = bill_service.create_bill(db, current_user.id, bill)
    return {"success": True, "data": BillResponse.model_validate(new_item).model_dump(mode="json")}

@router.put("/{bill_id}")
def update_bill_item(bill_id: int, bill_update: BillUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_bill = bill_service.get_bill_by_id(db, bill_id)
    if not db_bill or db_bill.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Bill not found"}
        )
    updated_item = bill_service.update_bill(db, db_bill, bill_update)
    return {"success": True, "data": BillResponse.model_validate(updated_item).model_dump(mode="json")}

@router.delete("/{bill_id}")
def delete_bill_item(bill_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_bill = bill_service.get_bill_by_id(db, bill_id)
    if not db_bill or db_bill.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Bill not found"}
        )
    bill_service.delete_bill(db, db_bill)
    return {"success": True, "message": "Bill deleted successfully"}
