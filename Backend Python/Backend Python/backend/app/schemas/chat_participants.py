from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class ChatParticipantBase(BaseModel):
    chat_id: UUID
    user_id: UUID
    joined_at: Optional[str] = None

class ChatParticipantCreate(ChatParticipantBase):
    pass

class ChatParticipantUpdate(ChatParticipantBase):
    pass

class ChatParticipantResponse(ChatParticipantBase):
    id: UUID

    class Config:
        from_attributes = True
