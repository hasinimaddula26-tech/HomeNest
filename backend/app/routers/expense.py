from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.services import expense as expense_service

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.get("/summary")
def read_expenses_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    summary = expense_service.get_expenses_summary(db, current_user.id)
    return {"success": True, "data": jsonable_encoder(summary)}

@router.get("")
def read_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    items = expense_service.get_all_expenses(db, current_user.id)
    return {"success": True, "data": [ExpenseResponse.model_validate(item).model_dump(mode="json") for item in items]}

@router.post("")
def create_expense_item(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    new_item = expense_service.create_expense(db, current_user.id, expense)
    return {"success": True, "data": ExpenseResponse.model_validate(new_item).model_dump(mode="json")}

@router.put("/{expense_id}")
def update_expense_item(expense_id: int, expense_update: ExpenseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_expense = expense_service.get_expense_by_id(db, expense_id)
    if not db_expense or db_expense.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Expense not found"}
        )
    updated_item = expense_service.update_expense(db, db_expense, expense_update)
    return {"success": True, "data": ExpenseResponse.model_validate(updated_item).model_dump(mode="json")}

@router.delete("/{expense_id}")
def delete_expense_item(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_expense = expense_service.get_expense_by_id(db, expense_id)
    if not db_expense or db_expense.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Expense not found"}
        )
    expense_service.delete_expense(db, db_expense)
    return {"success": True, "message": "Expense deleted successfully"}
