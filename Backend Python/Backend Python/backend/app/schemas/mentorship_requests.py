from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class MentorshipRequestBase(BaseModel):
    mentee_id: UUID
    mentor_id: UUID
    status: str = 'pending'
    message: Optional[str] = None

class MentorshipRequestCreate(MentorshipRequestBase):
    pass

class MentorshipRequestUpdate(MentorshipRequestBase):
    pass

class MentorshipRequestResponse(MentorshipRequestBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True
