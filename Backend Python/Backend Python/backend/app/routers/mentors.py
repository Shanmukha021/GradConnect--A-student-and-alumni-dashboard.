
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from ..database import get_db
from ..models.announcements_mentorship import Mentor
from ..schemas.mentors import MentorCreate, MentorUpdate, MentorResponse

router = APIRouter()

@router.get("/", response_model=list[MentorResponse])
async def list_mentors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mentor))
    return result.scalars().all()

@router.post("/", response_model=MentorResponse, status_code=status.HTTP_201_CREATED)
async def create_mentor(mentor: MentorCreate, db: AsyncSession = Depends(get_db)):
    db_mentor = Mentor(**mentor.model_dump())
    db.add(db_mentor)
    await db.commit()
    await db.refresh(db_mentor)
    return db_mentor

@router.get("/{mentor_id}", response_model=MentorResponse)
async def get_mentor(mentor_id: UUID, db: AsyncSession = Depends(get_db)):
    mentor = await db.get(Mentor, mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return mentor

@router.put("/{mentor_id}", response_model=MentorResponse)
async def update_mentor(mentor_id: UUID, update: MentorUpdate, db: AsyncSession = Depends(get_db)):
    mentor = await db.get(Mentor, mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(mentor, key, value)
    await db.commit()
    await db.refresh(mentor)
    return mentor

@router.delete("/{mentor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mentor(mentor_id: UUID, db: AsyncSession = Depends(get_db)):
    mentor = await db.get(Mentor, mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    await db.delete(mentor)
    await db.commit()
    return None
