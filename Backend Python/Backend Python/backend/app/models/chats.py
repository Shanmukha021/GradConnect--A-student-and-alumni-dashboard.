import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from .base import Base


class Chat(Base):
	__tablename__ = "chats"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	title = Column(String(255), nullable=True)
	is_group = Column(Boolean, nullable=False, server_default="false")
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)


class ChatParticipant(Base):
	__tablename__ = "chat_participants"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
	user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	joined_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)


class Message(Base):
	__tablename__ = "messages"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
	sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	content = Column(Text, nullable=False)
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)



