from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.grocery import Grocery
from app.schemas.grocery import GroceryCreate, GroceryUpdate

def get_all_groceries(db: Session) -> List[Grocery]:
    return db.query(Grocery).order_by(Grocery.created_at.desc()).all()

def get_grocery_by_id(db: Session, grocery_id: int) -> Optional[Grocery]:
    return db.query(Grocery).filter(Grocery.id == grocery_id).first()

def create_grocery(db: Session, grocery: GroceryCreate) -> Grocery:
    db_grocery = Grocery(
        item_name=grocery.item_name,
        quantity=grocery.quantity,
        unit=grocery.unit,
        category=grocery.category.value if hasattr(grocery.category, 'value') else grocery.category
    )
    db.add(db_grocery)
    db.commit()
    db.refresh(db_grocery)
    return db_grocery

def update_grocery(db: Session, db_grocery: Grocery, grocery_update: GroceryUpdate) -> Grocery:
    update_data = grocery_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "category" and value is not None:
            setattr(db_grocery, key, value.value if hasattr(value, 'value') else value)
        else:
            setattr(db_grocery, key, value)
    
    db.commit()
    db.refresh(db_grocery)
    return db_grocery

def delete_grocery(db: Session, db_grocery: Grocery) -> None:
    db.delete(db_grocery)
    db.commit()
