import uuid
from sqlalchemy import Column, String, DateTime, func, Boolean, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from .base import Base


class User(Base):
	__tablename__ = "users"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	email = Column(String(255), unique=True, index=True, nullable=False)
	password_hash = Column(String(255), nullable=False)
	role = Column(String(20), nullable=False, server_default="student")
	is_active = Column(Boolean, nullable=False, server_default="true")
	email_verified = Column(Boolean, nullable=False, server_default="false")
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)
	updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)
	last_login_at = Column(DateTime(timezone=False), nullable=True)

	__table_args__ = (
		CheckConstraint("role in ('admin','alumni','student','recruiter')", name="ck_users_role"),
	)
