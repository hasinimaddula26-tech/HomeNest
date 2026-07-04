from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.schemas.expense import GroceryCategory  # wait, import the correct schemas
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.services import expense as expense_service

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.get("/summary")
def read_expenses_summary(db: Session = Depends(get_db)) -> Any:
    summary = expense_service.get_expenses_summary(db)
    return {"success": True, "data": summary}

@router.get("")
def read_expenses(db: Session = Depends(get_db)) -> Any:
    items = expense_service.get_all_expenses(db)
    return {"success": True, "data": items}

@router.post("")
def create_expense_item(expense: ExpenseCreate, db: Session = Depends(get_db)) -> Any:
    new_item = expense_service.create_expense(db, expense)
    return {"success": True, "data": new_item}

@router.put("/{expense_id}")
def update_expense_item(expense_id: int, expense_update: ExpenseUpdate, db: Session = Depends(get_db)) -> Any:
    db_expense = expense_service.get_expense_by_id(db, expense_id)
    if not db_expense:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Expense not found"}
        )
    updated_item = expense_service.update_expense(db, db_expense, expense_update)
    return {"success": True, "data": updated_item}

@router.delete("/{expense_id}")
def delete_expense_item(expense_id: int, db: Session = Depends(get_db)) -> Any:
    db_expense = expense_service.get_expense_by_id(db, expense_id)
    if not db_expense:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Expense not found"}
        )
    expense_service.delete_expense(db, db_expense)
    return {"success": True, "message": "Expense deleted successfully"}
