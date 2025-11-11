import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from .base import Base


class Announcement(Base):
	__tablename__ = "announcements"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	title = Column(String(255), nullable=False)
	content = Column(Text, nullable=False)
	created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
	updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)


class Mentor(Base):
	__tablename__ = "mentors"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
	areas = Column(ARRAY(Text), nullable=False, server_default='{}')
	is_active = Column(Boolean, nullable=False, server_default="true")
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)


class MentorshipRequest(Base):
	__tablename__ = "mentorship_requests"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	mentee_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	mentor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	status = Column(String(50), nullable=False, server_default='pending')
	message = Column(Text, nullable=True)
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)


class MentorshipSession(Base):
	__tablename__ = "mentorship_sessions"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	mentor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	mentee_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	scheduled_at = Column(DateTime(timezone=False), nullable=False)
	duration_minutes = Column(String, nullable=False)
	notes = Column(Text, nullable=True)
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)



