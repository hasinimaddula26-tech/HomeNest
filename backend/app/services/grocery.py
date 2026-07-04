from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.grocery import Grocery
from app.schemas.grocery import GroceryCreate, GroceryUpdate

from app.services.activity import log_activity

def get_all_groceries(db: Session, user_id: int) -> List[Grocery]:
    return db.query(Grocery).filter(Grocery.user_id == user_id).order_by(Grocery.created_at.desc()).all()

def get_grocery_by_id(db: Session, grocery_id: int) -> Optional[Grocery]:
    return db.query(Grocery).filter(Grocery.id == grocery_id).first()

def create_grocery(db: Session, user_id: int, grocery: GroceryCreate) -> Grocery:
    db_grocery = Grocery(
        user_id=user_id,
        item_name=grocery.item_name,
        quantity=grocery.quantity,
        unit=grocery.unit,
        category=grocery.category.value if hasattr(grocery.category, 'value') else grocery.category
    )
    db.add(db_grocery)
    db.commit()
    db.refresh(db_grocery)
    
    log_activity(db, message=f"Added '{db_grocery.item_name}' to grocery list", activity_type="Grocery", user_id=user_id)
    return db_grocery

def update_grocery(db: Session, db_grocery: Grocery, grocery_update: GroceryUpdate) -> Grocery:
    old_completed = db_grocery.is_completed
    update_data = grocery_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "category" and value is not None:
            setattr(db_grocery, key, value.value if hasattr(value, 'value') else value)
        else:
            setattr(db_grocery, key, value)
    
    db.commit()
    db.refresh(db_grocery)
    
    if old_completed != db_grocery.is_completed:
        status_text = "completed" if db_grocery.is_completed else "active"
        log_activity(db, message=f"Marked '{db_grocery.item_name}' as {status_text}", activity_type="Grocery", user_id=db_grocery.user_id)
        
    return db_grocery

def delete_grocery(db: Session, db_grocery: Grocery) -> None:
    item_name = db_grocery.item_name
    user_id = db_grocery.user_id
    db.delete(db_grocery)
    db.commit()
    log_activity(db, message=f"Removed '{item_name}' from grocery list", activity_type="Grocery", user_id=user_id)
