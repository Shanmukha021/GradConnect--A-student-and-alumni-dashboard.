import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from .base import Base


class StudentProfile(Base):
	__tablename__ = "student_profiles"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
	name = Column(String(255), nullable=False)
	phone = Column(String(50), nullable=True)
	avatar_url = Column(Text, nullable=True)
	bio = Column(Text, nullable=True)
	location = Column(String(255), nullable=True)
	department = Column(String(255), nullable=False)
	current_year = Column(String(20), nullable=False)  # e.g., "1st Year", "2nd Year", etc.
	enrollment_year = Column(String(4), nullable=False)
	expected_graduation_year = Column(String(4), nullable=False)
	interests = Column(ARRAY(Text), nullable=True)
	skills = Column(ARRAY(Text), nullable=True)
	projects = Column(JSONB, nullable=True)  # Array of {title, description, url}
	social_links = Column(JSONB, nullable=False, server_default='{}')
	looking_for_mentorship = Column(Boolean, nullable=False, server_default="false")
	mentorship_interests = Column(ARRAY(Text), nullable=True)
	is_public = Column(Boolean, nullable=False, server_default="true")
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
	updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)


