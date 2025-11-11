from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class ChatBase(BaseModel):
    title: Optional[str] = None
    is_group: bool = False

class ChatCreate(ChatBase):
    pass

class ChatUpdate(ChatBase):
    pass

class ChatResponse(ChatBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True
