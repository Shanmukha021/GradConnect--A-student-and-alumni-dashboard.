from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import uuid


class RegisterRequest(BaseModel):
	email: EmailStr
	password: str = Field(min_length=6)
	role: Optional[str] = None


class LoginRequest(BaseModel):
	email: EmailStr
	password: str


class TokenPair(BaseModel):
	access_token: str
	refresh_token: str
	token_type: str = "bearer"


class UserResponse(BaseModel):
	id: uuid.UUID
	email: EmailStr
	role: str
	is_active: bool
	email_verified: bool

	class Config:
		from_attributes = True
