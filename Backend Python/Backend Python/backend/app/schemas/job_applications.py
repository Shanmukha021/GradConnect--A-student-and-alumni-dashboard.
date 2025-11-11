from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class JobApplicationBase(BaseModel):
    job_id: UUID
    user_id: UUID
    cover_letter: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplicationUpdate(JobApplicationBase):
    pass

class JobApplicationResponse(JobApplicationBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True
