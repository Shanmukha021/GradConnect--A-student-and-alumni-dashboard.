
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from ..database import get_db
from ..models.announcements_mentorship import MentorshipRequest
from ..schemas.mentorship_requests import MentorshipRequestCreate, MentorshipRequestUpdate, MentorshipRequestResponse

router = APIRouter()

@router.get("/", response_model=list[MentorshipRequestResponse])
async def list_mentorship_requests(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MentorshipRequest))
    return result.scalars().all()

@router.post("/", response_model=MentorshipRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_mentorship_request(request: MentorshipRequestCreate, db: AsyncSession = Depends(get_db)):
    db_request = MentorshipRequest(**request.model_dump())
    db.add(db_request)
    await db.commit()
    await db.refresh(db_request)
    return db_request

@router.get("/{request_id}", response_model=MentorshipRequestResponse)
async def get_mentorship_request(request_id: UUID, db: AsyncSession = Depends(get_db)):
    request = await db.get(MentorshipRequest, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Mentorship request not found")
    return request

@router.put("/{request_id}", response_model=MentorshipRequestResponse)
async def update_mentorship_request(request_id: UUID, update: MentorshipRequestUpdate, db: AsyncSession = Depends(get_db)):
    request = await db.get(MentorshipRequest, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Mentorship request not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(request, key, value)
    await db.commit()
    await db.refresh(request)
    return request

@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mentorship_request(request_id: UUID, db: AsyncSession = Depends(get_db)):
    request = await db.get(MentorshipRequest, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Mentorship request not found")
    await db.delete(request)
    await db.commit()
    return None
