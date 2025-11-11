from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    start_date: datetime
    end_date: Optional[datetime] = None
    location: str
    max_attendees: Optional[int] = None
    image_url: Optional[str] = None
    organizer_id: Optional[UUID] = None
    is_public: bool = True
    requires_approval: bool = False

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventResponse(EventBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
