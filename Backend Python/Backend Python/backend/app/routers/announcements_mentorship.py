
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models.announcements_mentorship import Announcement
from ..database import get_db
from ..schemas.announcements import AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=list[AnnouncementResponse])
async def list_announcements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Announcement))
    announcements = result.scalars().all()
    # Convert created_at and updated_at to ISO strings
    for a in announcements:
        if hasattr(a, "created_at") and isinstance(a.created_at, (str, type(None))) is False:
            a.created_at = a.created_at.isoformat()
        if hasattr(a, "updated_at") and isinstance(a.updated_at, (str, type(None))) is False:
            a.updated_at = a.updated_at.isoformat()
    return announcements

@router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
async def create_announcement(payload: AnnouncementCreate, db: AsyncSession = Depends(get_db)):
    announcement = Announcement(**payload.model_dump())
    db.add(announcement)
    await db.commit()
    await db.refresh(announcement)
    # Convert created_at and updated_at to ISO strings
    if hasattr(announcement, "created_at") and isinstance(announcement.created_at, (str, type(None))) is False:
        announcement.created_at = announcement.created_at.isoformat()
    if hasattr(announcement, "updated_at") and isinstance(announcement.updated_at, (str, type(None))) is False:
        announcement.updated_at = announcement.updated_at.isoformat()
    return announcement

@router.get("/{announcement_id}", response_model=AnnouncementResponse)
async def get_announcement(announcement_id: UUID, db: AsyncSession = Depends(get_db)):
    announcement = await db.get(Announcement, announcement_id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement

@router.put("/{announcement_id}", response_model=AnnouncementResponse)
async def update_announcement(announcement_id: UUID, payload: AnnouncementUpdate, db: AsyncSession = Depends(get_db)):
    announcement = await db.get(Announcement, announcement_id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(announcement, key, value)
    await db.commit()
    await db.refresh(announcement)
    return announcement

@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_announcement(announcement_id: UUID, db: AsyncSession = Depends(get_db)):
    announcement = await db.get(Announcement, announcement_id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    await db.delete(announcement)
    await db.commit()
    return None
