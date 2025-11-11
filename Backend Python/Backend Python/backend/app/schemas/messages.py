from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class MessageBase(BaseModel):
    chat_id: UUID
    sender_id: UUID
    content: str

class MessageCreate(MessageBase):
    pass

class MessageUpdate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True
