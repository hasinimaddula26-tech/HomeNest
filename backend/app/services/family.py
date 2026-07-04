from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.family import FamilyMember
from app.schemas.family import FamilyMemberCreate
from app.services.activity import log_activity

def get_family_members(db: Session, user_id: int) -> List[FamilyMember]:
    return db.query(FamilyMember).filter(FamilyMember.user_id == user_id).order_by(FamilyMember.name.asc()).all()

def get_member_by_id(db: Session, member_id: int) -> Optional[FamilyMember]:
    return db.query(FamilyMember).filter(FamilyMember.id == member_id).first()

def create_family_member(db: Session, user_id: int, member: FamilyMemberCreate) -> FamilyMember:
    db_member = FamilyMember(
        user_id=user_id,
        name=member.name,
        relation=member.relation.value if hasattr(member.relation, 'value') else member.relation,
        blood_group=member.blood_group.value if hasattr(member.blood_group, 'value') else member.blood_group,
        birthday=member.birthday,
        emergency_contact=member.emergency_contact,
        photo_url=member.photo_url
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    log_activity(db, f"Family member '{db_member.name}' ({db_member.relation}) added to directory")
    return db_member

def delete_family_member(db: Session, db_member: FamilyMember) -> None:
    name = db_member.name
    db.delete(db_member)
    db.commit()
    log_activity(db, f"Family member '{name}' removed from directory")
