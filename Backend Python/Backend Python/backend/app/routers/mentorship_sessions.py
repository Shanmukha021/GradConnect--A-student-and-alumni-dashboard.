
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from ..database import get_db
from ..models.announcements_mentorship import MentorshipSession
from ..schemas.mentorship_sessions import MentorshipSessionCreate, MentorshipSessionUpdate, MentorshipSessionResponse

router = APIRouter()

@router.get("/", response_model=list[MentorshipSessionResponse])
async def list_mentorship_sessions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MentorshipSession))
    return result.scalars().all()

@router.post("/", response_model=MentorshipSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_mentorship_session(session: MentorshipSessionCreate, db: AsyncSession = Depends(get_db)):
    db_session = MentorshipSession(**session.model_dump())
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)
    return db_session

@router.get("/{session_id}", response_model=MentorshipSessionResponse)
async def get_mentorship_session(session_id: UUID, db: AsyncSession = Depends(get_db)):
    session = await db.get(MentorshipSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Mentorship session not found")
    return session

@router.put("/{session_id}", response_model=MentorshipSessionResponse)
async def update_mentorship_session(session_id: UUID, update: MentorshipSessionUpdate, db: AsyncSession = Depends(get_db)):
    session = await db.get(MentorshipSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Mentorship session not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(session, key, value)
    await db.commit()
    await db.refresh(session)
    return session

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mentorship_session(session_id: UUID, db: AsyncSession = Depends(get_db)):
    session = await db.get(MentorshipSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Mentorship session not found")
    await db.delete(session)
    await db.commit()
    return None
