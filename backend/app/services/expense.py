from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict
from datetime import date, timedelta
from decimal import Decimal
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

from app.services.activity import log_activity

def get_all_expenses(db: Session, user_id: int) -> List[Expense]:
    return db.query(Expense).filter(Expense.user_id == user_id).order_by(Expense.date.desc(), Expense.created_at.desc()).all()

def get_expense_by_id(db: Session, expense_id: int) -> Optional[Expense]:
    return db.query(Expense).filter(Expense.id == expense_id).first()

def create_expense(db: Session, user_id: int, expense: ExpenseCreate) -> Expense:
    db_expense = Expense(
        user_id=user_id,
        title=expense.title,
        amount=expense.amount,
        category=expense.category.value if hasattr(expense.category, 'value') else expense.category,
        date=expense.date,
        notes=expense.notes
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    log_activity(db, message=f"Logged expense '{db_expense.title}' (₹{db_expense.amount})", activity_type="Expense", user_id=user_id)
    return db_expense

def update_expense(db: Session, db_expense: Expense, expense_update: ExpenseUpdate) -> Expense:
    update_data = expense_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "category" and value is not None:
            setattr(db_expense, key, value.value if hasattr(value, 'value') else value)
        else:
            setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    
    log_activity(db, message=f"Updated expense '{db_expense.title}' details", activity_type="Expense", user_id=db_expense.user_id)
    return db_expense

def delete_expense(db: Session, db_expense: Expense) -> None:
    title = db_expense.title
    amount = db_expense.amount
    user_id = db_expense.user_id
    db.delete(db_expense)
    db.commit()
    log_activity(db, message=f"Deleted expense '{title}' (₹{amount})", activity_type="Expense", user_id=user_id)

def get_expenses_summary(db: Session, user_id: int) -> Dict[str, float]:
    today_val = date.today()
    start_of_week = today_val - timedelta(days=6)  # Last 7 days rolling
    start_of_month = date(today_val.year, today_val.month, 1)  # Current calendar month

    # Queries
    today_sum = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id, Expense.date == today_val).scalar() or Decimal('0.00')
    week_sum = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id, Expense.date >= start_of_week).scalar() or Decimal('0.00')
    month_sum = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id, Expense.date >= start_of_month).scalar() or Decimal('0.00')
    total_sum = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id).scalar() or Decimal('0.00')

    return {
        "today": float(today_sum),
        "week": float(week_sum),
        "month": float(month_sum),
        "total": float(total_sum)
    }
