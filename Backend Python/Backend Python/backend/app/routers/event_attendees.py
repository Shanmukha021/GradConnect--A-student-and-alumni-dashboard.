
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models.events import EventAttendee
from ..schemas.event_attendees import EventAttendeeCreate, EventAttendeeUpdate, EventAttendeeResponse
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=list[EventAttendeeResponse])
async def list_event_attendees(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EventAttendee))
    attendees = result.scalars().all()
    return attendees

@router.post("/", response_model=EventAttendeeResponse, status_code=status.HTTP_201_CREATED)
async def create_event_attendee(payload: EventAttendeeCreate, db: AsyncSession = Depends(get_db)):
    attendee = EventAttendee(**payload.model_dump())
    db.add(attendee)
    await db.commit()
    await db.refresh(attendee)
    return attendee

@router.get("/{attendee_id}", response_model=EventAttendeeResponse)
async def get_event_attendee(attendee_id: UUID, db: AsyncSession = Depends(get_db)):
    attendee = await db.get(EventAttendee, attendee_id)
    if not attendee:
        raise HTTPException(status_code=404, detail="Event attendee not found")
    return attendee

@router.put("/{attendee_id}", response_model=EventAttendeeResponse)
async def update_event_attendee(attendee_id: UUID, payload: EventAttendeeUpdate, db: AsyncSession = Depends(get_db)):
    attendee = await db.get(EventAttendee, attendee_id)
    if not attendee:
        raise HTTPException(status_code=404, detail="Event attendee not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(attendee, key, value)
    await db.commit()
    await db.refresh(attendee)
    return attendee

@router.delete("/{attendee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event_attendee(attendee_id: UUID, db: AsyncSession = Depends(get_db)):
    attendee = await db.get(EventAttendee, attendee_id)
    if not attendee:
        raise HTTPException(status_code=404, detail="Event attendee not found")
    await db.delete(attendee)
    await db.commit()
    return None
