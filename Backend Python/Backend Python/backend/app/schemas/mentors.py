from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID

class MentorBase(BaseModel):
    user_id: UUID
    areas: List[str]
    is_active: bool = True

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class MentorResponse(MentorBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True
