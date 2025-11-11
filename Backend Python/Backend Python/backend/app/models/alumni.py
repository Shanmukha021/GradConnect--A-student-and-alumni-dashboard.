import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from .base import Base


class AlumniProfile(Base):
	__tablename__ = "alumni_profiles"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
	name = Column(String(255), nullable=False)
	phone = Column(String(50), nullable=True)
	avatar_url = Column(Text, nullable=True)
	bio = Column(Text, nullable=True)
	location = Column(String(255), nullable=True)
	department = Column(String(255), nullable=False)
	graduation_year = Column(String(4), nullable=False)
	current_position = Column(String(255), nullable=True)
	current_company = Column(String(255), nullable=True)
	achievements = Column(ARRAY(Text), nullable=True)
	social_links = Column(JSONB, nullable=False, server_default='{}')
	is_mentor = Column(Boolean, nullable=False, server_default="false")
	mentorship_areas = Column(ARRAY(Text), nullable=True)
	is_public = Column(Boolean, nullable=False, server_default="true")
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
	updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)



