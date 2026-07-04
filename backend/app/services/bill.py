from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.bill import Bill
from app.schemas.bill import BillCreate, BillUpdate
from app.services.activity import log_activity

def get_all_bills(db: Session, user_id: int) -> List[Bill]:
    return db.query(Bill).filter(Bill.user_id == user_id).order_by(Bill.due_date.asc(), Bill.created_at.desc()).all()

def get_bill_by_id(db: Session, bill_id: int) -> Optional[Bill]:
    return db.query(Bill).filter(Bill.id == bill_id).first()

def create_bill(db: Session, user_id: int, bill: BillCreate) -> Bill:
    db_bill = Bill(
        user_id=user_id,
        title=bill.title,
        amount=bill.amount,
        category=bill.category.value if hasattr(bill.category, 'value') else bill.category,
        due_date=bill.due_date,
        is_paid=bill.is_paid
    )
    db.add(db_bill)
    db.commit()
    db.refresh(db_bill)
    
    log_activity(db, message=f"Added bill '{db_bill.title}' (₹{float(db_bill.amount):,.2f})", activity_type="Bill", user_id=user_id)
    return db_bill

def update_bill(db: Session, db_bill: Bill, bill_update: BillUpdate) -> Bill:
    update_data = bill_update.model_dump(exclude_unset=True)
    old_is_paid = db_bill.is_paid
    
    for key, value in update_data.items():
        if key == "category" and value is not None:
            setattr(db_bill, key, value.value if hasattr(value, 'value') else value)
        else:
            setattr(db_bill, key, value)
            
    db.commit()
    db.refresh(db_bill)
    
    # Log special activity on pay status change
    if old_is_paid != db_bill.is_paid:
        action = "paid" if db_bill.is_paid else "marked as unpaid"
        log_activity(db, message=f"Bill '{db_bill.title}' {action}", activity_type="Bill", user_id=db_bill.user_id)
    else:
        log_activity(db, message=f"Updated bill '{db_bill.title}' details", activity_type="Bill", user_id=db_bill.user_id)
        
    return db_bill

def delete_bill(db: Session, db_bill: Bill) -> None:
    title = db_bill.title
    user_id = db_bill.user_id
    db.delete(db_bill)
    db.commit()
    log_activity(db, message=f"Deleted bill '{title}'", activity_type="Bill", user_id=user_id)
