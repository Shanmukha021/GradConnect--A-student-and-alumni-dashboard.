from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class AnnouncementBase(BaseModel):
    title: str
    content: str
    created_by: Optional[UUID] = None

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(AnnouncementBase):
    pass

class AnnouncementResponse(AnnouncementBase):
    id: UUID
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
