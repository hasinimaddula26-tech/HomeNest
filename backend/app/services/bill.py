from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.bill import Bill
from app.schemas.bill import BillCreate, BillUpdate
from app.services.activity import log_activity

def get_all_bills(db: Session) -> List[Bill]:
    return db.query(Bill).order_by(Bill.due_date.asc(), Bill.created_at.desc()).all()

def get_bill_by_id(db: Session, bill_id: int) -> Optional[Bill]:
    return db.query(Bill).filter(Bill.id == bill_id).first()

def create_bill(db: Session, bill: BillCreate) -> Bill:
    db_bill = Bill(
        title=bill.title,
        amount=bill.amount,
        category=bill.category.value if hasattr(bill.category, 'value') else bill.category,
        due_date=bill.due_date,
        is_paid=bill.is_paid
    )
    db.add(db_bill)
    db.commit()
    db.refresh(db_bill)
    
    log_activity(db, f"Bill '{db_bill.title}' of ₹{float(db_bill.amount):,.2f} added")
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
        action = "marked as Paid" if db_bill.is_paid else "marked as Unpaid"
        log_activity(db, f"Bill '{db_bill.title}' {action}")
    else:
        log_activity(db, f"Bill '{db_bill.title}' updated")
        
    return db_bill

def delete_bill(db: Session, db_bill: Bill) -> None:
    title = db_bill.title
    db.delete(db_bill)
    db.commit()
    log_activity(db, f"Bill '{title}' deleted")
