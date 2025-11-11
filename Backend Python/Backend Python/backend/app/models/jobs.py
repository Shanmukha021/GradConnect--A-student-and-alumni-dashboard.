import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, func, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from .base import Base


class Job(Base):
	__tablename__ = "jobs"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	title = Column(String(255), nullable=False)
	company = Column(String(255), nullable=False)
	location = Column(String(255), nullable=False)
	type = Column(String(20), nullable=False)
	description = Column(Text, nullable=False)
	requirements = Column(ARRAY(Text), nullable=False, server_default='{}')
	salary = Column(String(255), nullable=True)
	poster_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
	is_active = Column(Boolean, nullable=False, server_default="true")
	application_deadline = Column(DateTime(timezone=False), nullable=True)
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
	updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)

	__table_args__ = (
		CheckConstraint("type in ('full-time','part-time','internship','contract')", name="ck_jobs_type"),
	)


class JobApplication(Base):
	__tablename__ = "job_applications"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
	user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	cover_letter = Column(Text, nullable=True)
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)



