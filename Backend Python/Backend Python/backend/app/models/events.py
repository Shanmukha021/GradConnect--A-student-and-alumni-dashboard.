import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, Integer, func, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from .base import Base


class Event(Base):
	__tablename__ = "events"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	title = Column(String(255), nullable=False)
	description = Column(Text, nullable=True)
	type = Column(String(50), nullable=False)
	start_date = Column(DateTime(timezone=False), nullable=False)
	end_date = Column(DateTime(timezone=False), nullable=True)
	location = Column(String(255), nullable=False)
	max_attendees = Column(Integer, nullable=True)
	image_url = Column(Text, nullable=True)
	organizer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
	is_public = Column(Boolean, nullable=False, server_default="true")
	requires_approval = Column(Boolean, nullable=False, server_default="false")
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
	updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)

	__table_args__ = (
		CheckConstraint("type in ('reunion','networking','workshop','seminar')", name="ck_events_type"),
	)


class EventAttendee(Base):
	__tablename__ = "event_attendees"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	event_id = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
	user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	status = Column(String(50), nullable=False, server_default="confirmed")
	rsvp_date = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)

	__table_args__ = (
		CheckConstraint("status in ('confirmed','pending','cancelled')", name="ck_event_attendees_status"),
	)



