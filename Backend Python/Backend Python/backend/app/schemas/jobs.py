from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    type: str
    description: str
    requirements: Optional[List[str]] = None
    salary: Optional[str] = None
    poster_id: Optional[UUID] = None
    is_active: bool = True
    application_deadline: Optional[datetime] = None

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    pass

class JobResponse(JobBase):
    id: UUID
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
