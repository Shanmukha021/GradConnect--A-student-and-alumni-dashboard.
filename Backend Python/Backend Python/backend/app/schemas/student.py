from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from uuid import UUID
from datetime import datetime


class StudentBase(BaseModel):
    name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    department: str
    current_year: str
    enrollment_year: str
    expected_graduation_year: str
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Dict[str, str]]] = None
    social_links: Optional[Dict[str, str]] = Field(default_factory=dict)
    looking_for_mentorship: bool = False
    mentorship_interests: Optional[List[str]] = None
    is_public: bool = True


class StudentCreate(StudentBase):
    user_id: UUID


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    department: Optional[str] = None
    current_year: Optional[str] = None
    enrollment_year: Optional[str] = None
    expected_graduation_year: Optional[str] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Dict[str, str]]] = None
    social_links: Optional[Dict[str, str]] = None
    looking_for_mentorship: Optional[bool] = None
    mentorship_interests: Optional[List[str]] = None
    is_public: Optional[bool] = None


class StudentResponse(StudentBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
