from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict
from uuid import UUID

class AlumniBase(BaseModel):
    name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    department: str
    graduation_year: str
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    achievements: Optional[List[str]] = None
    social_links: Optional[Dict[str, str]] = Field(default_factory=dict)
    is_mentor: bool = False
    mentorship_areas: Optional[List[str]] = None
    is_public: bool = True

class AlumniCreate(AlumniBase):
    user_id: UUID

class AlumniUpdate(AlumniBase):
    pass

class AlumniResponse(AlumniBase):
    id: UUID
    user_id: UUID
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
