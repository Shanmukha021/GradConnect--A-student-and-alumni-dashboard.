from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class MentorshipSessionBase(BaseModel):
    mentor_id: UUID
    mentee_id: UUID
    scheduled_at: str
    duration_minutes: int
    notes: Optional[str] = None

class MentorshipSessionCreate(MentorshipSessionBase):
    pass

class MentorshipSessionUpdate(MentorshipSessionBase):
    pass

class MentorshipSessionResponse(MentorshipSessionBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True
