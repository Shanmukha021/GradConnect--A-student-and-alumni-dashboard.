from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class EventAttendeeBase(BaseModel):
    event_id: UUID
    user_id: UUID
    status: str = 'confirmed'
    rsvp_date: Optional[str] = None

class EventAttendeeCreate(EventAttendeeBase):
    pass

class EventAttendeeUpdate(EventAttendeeBase):
    pass

class EventAttendeeResponse(EventAttendeeBase):
    id: UUID

    class Config:
        from_attributes = True
