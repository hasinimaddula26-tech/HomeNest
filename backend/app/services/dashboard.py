from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from decimal import Decimal
from typing import Dict, Any, List
from app.models.grocery import Grocery
from app.models.expense import Expense
from app.models.bill import Bill
from app.models.reminder import Reminder
from app.services.activity import get_recent_activities

def get_dashboard_metrics(db: Session, user_id: int) -> Dict[str, Any]:
    today_val = date.today()
    current_month_start = date(today_val.year, today_val.month, 1)

    # Current month sum
    current_month_sum = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id, Expense.date >= current_month_start).scalar() or Decimal('0.00')

    # Previous month sum
    if today_val.month == 1:
        prev_month_start = date(today_val.year - 1, 12, 1)
        prev_month_end = date(today_val.year, 1, 1) - timedelta(days=1)
    else:
        prev_month_start = date(today_val.year, today_val.month - 1, 1)
        prev_month_end = current_month_start - timedelta(days=1)
        
    prev_month_sum = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == user_id,
        Expense.date >= prev_month_start,
        Expense.date <= prev_month_end
    ).scalar() or Decimal('0.00')

    # Trend calculation
    trend = 0.0
    if prev_month_sum > 0:
        trend = float(((current_month_sum - prev_month_sum) / prev_month_sum) * 100)
    elif current_month_sum > 0:
        trend = 100.0  # If last month was 0 but this month is > 0

    # Groceries
    groceries_total = db.query(func.count(Grocery.id)).filter(Grocery.user_id == user_id).scalar() or 0
    groceries_completed = db.query(func.count(Grocery.id)).filter(Grocery.user_id == user_id, Grocery.is_completed == True).scalar() or 0

    # Bills
    pending_bills_count = db.query(func.count(Bill.id)).filter(Bill.user_id == user_id, Bill.is_paid == False).scalar() or 0

    # Reminders
    active_reminders_count = db.query(func.count(Reminder.id)).filter(Reminder.user_id == user_id, Reminder.is_completed == False).scalar() or 0

    return {
        "expenses_month": float(current_month_sum),
        "expenses_trend": round(trend, 1),
        "groceries_completed": groceries_completed,
        "groceries_total": groceries_total,
        "pending_bills_count": pending_bills_count,
        "active_reminders_count": active_reminders_count
    }

def get_upcoming_bills(db: Session, user_id: int, limit: int = 5) -> List[Dict[str, Any]]:
    today_val = date.today()
    bills = db.query(Bill).filter(Bill.user_id == user_id, Bill.is_paid == False).order_by(Bill.due_date.asc()).limit(limit).all()
    
    result = []
    for b in bills:
        # Calculate dynamic status
        status = "Overdue" if b.due_date < today_val else "Pending"
        due_in_days = (b.due_date - today_val).days
        result.append({
            "id": b.id,
            "title": b.title,
            "amount": float(b.amount),
            "category": b.category,
            "due_date": b.due_date.isoformat(),
            "status": status,
            "due_in_days": due_in_days
        })
    return result

def get_today_reminders(db: Session, user_id: int) -> List[Reminder]:
    today_val = date.today()
    return db.query(Reminder).filter(
        Reminder.user_id == user_id,
        Reminder.date == today_val
    ).order_by(Reminder.is_completed.asc(), Reminder.created_at.desc()).all()

def get_recent_expenses(db: Session, user_id: int, limit: int = 5) -> List[Expense]:
    return db.query(Expense).filter(Expense.user_id == user_id).order_by(Expense.date.desc(), Expense.created_at.desc()).limit(limit).all()

def get_dashboard_notifications(db: Session, user_id: int) -> List[Dict[str, Any]]:
    today_val = date.today()
    notifications = []

    # 1. Overdue Bills (High 🔴)
    overdue_bills = db.query(Bill).filter(Bill.user_id == user_id, Bill.is_paid == False, Bill.due_date < today_val).all()
    for b in overdue_bills:
        notifications.append({
            "id": f"bill-overdue-{b.id}",
            "type": "bill",
            "priority": "high",
            "message": f"Bill '{b.title}' (₹{float(b.amount):,.2f}) is Overdue!",
            "date": b.due_date.isoformat()
        })

    # 2. Bills due tomorrow (High 🔴)
    due_tomorrow_bills = db.query(Bill).filter(Bill.user_id == user_id, Bill.is_paid == False, Bill.due_date == today_val + timedelta(days=1)).all()
    for b in due_tomorrow_bills:
        notifications.append({
            "id": f"bill-tomorrow-{b.id}",
            "type": "bill",
            "priority": "high",
            "message": f"Bill '{b.title}' (₹{float(b.amount):,.2f}) is due tomorrow!",
            "date": b.due_date.isoformat()
        })

    # 3. Bills due in 2-3 days (Medium 🟠)
    due_soon_bills = db.query(Bill).filter(
        Bill.user_id == user_id,
        Bill.is_paid == False,
        Bill.due_date >= today_val + timedelta(days=2),
        Bill.due_date <= today_val + timedelta(days=3)
    ).all()
    for b in due_soon_bills:
        days_left = (b.due_date - today_val).days
        notifications.append({
            "id": f"bill-soon-{b.id}",
            "type": "bill",
            "priority": "medium",
            "message": f"Bill '{b.title}' (₹{float(b.amount):,.2f}) is due in {days_left} days",
            "date": b.due_date.isoformat()
        })

    # 4. Reminders today (High 🔴)
    today_reminders = db.query(Reminder).filter(Reminder.user_id == user_id, Reminder.is_completed == False, Reminder.date == today_val).all()
    for r in today_reminders:
        notifications.append({
            "id": f"rem-today-{r.id}",
            "type": "reminder",
            "priority": "high",
            "message": f"Reminder: {r.title} is scheduled for today",
            "date": r.date.isoformat()
        })

    # 5. Reminders tomorrow (Medium 🟠)
    tomorrow_reminders = db.query(Reminder).filter(Reminder.user_id == user_id, Reminder.is_completed == False, Reminder.date == today_val + timedelta(days=1)).all()
    for r in tomorrow_reminders:
        notifications.append({
            "id": f"rem-tomorrow-{r.id}",
            "type": "reminder",
            "priority": "medium",
            "message": f"Reminder: {r.title} is scheduled for tomorrow",
            "date": r.date.isoformat()
        })

    # 6. Active Groceries Alert (Low 🔵)
    active_groceries = db.query(func.count(Grocery.id)).filter(Grocery.user_id == user_id, Grocery.is_completed == False).scalar() or 0
    if active_groceries > 5:
        notifications.append({
            "id": "grocery-active-alert",
            "type": "grocery",
            "priority": "low",
            "message": f"You have {active_groceries} active grocery items on your list",
            "date": today_val.isoformat()
        })

    return notifications
