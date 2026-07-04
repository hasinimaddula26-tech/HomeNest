from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.schemas.grocery import GroceryCreate, GroceryUpdate, GroceryResponse
from app.services import grocery as grocery_service

router = APIRouter(prefix="/groceries", tags=["Groceries"])

@router.get("")
def read_groceries(db: Session = Depends(get_db)) -> Any:
    items = grocery_service.get_all_groceries(db)
    return {"success": True, "data": items}

@router.post("")
def create_grocery_item(grocery: GroceryCreate, db: Session = Depends(get_db)) -> Any:
    new_item = grocery_service.create_grocery(db, grocery)
    return {"success": True, "data": new_item}

@router.put("/{grocery_id}")
def update_grocery_item(grocery_id: int, grocery_update: GroceryUpdate, db: Session = Depends(get_db)) -> Any:
    db_grocery = grocery_service.get_grocery_by_id(db, grocery_id)
    if not db_grocery:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Grocery item not found"}
        )
    updated_item = grocery_service.update_grocery(db, db_grocery, grocery_update)
    return {"success": True, "data": updated_item}

@router.delete("/{grocery_id}")
def delete_grocery_item(grocery_id: int, db: Session = Depends(get_db)) -> Any:
    db_grocery = grocery_service.get_grocery_by_id(db, grocery_id)
    if not db_grocery:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Grocery item not found"}
        )
    grocery_service.delete_grocery(db, db_grocery)
    return {"success": True, "message": "Item deleted successfully"}
