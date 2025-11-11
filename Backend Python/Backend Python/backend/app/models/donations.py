import uuid
from sqlalchemy import Column, String, Text, DateTime, func, Numeric, Integer
from sqlalchemy.dialects.postgresql import UUID
from .base import Base


class ManualDonationSubmission(Base):
	__tablename__ = "manual_donation_submissions"

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	payer_name = Column(String(255), nullable=False)
	amount = Column(Numeric(12, 2), nullable=False)
	currency = Column(String(10), nullable=False, server_default='INR')
	reference_id = Column(String(255), nullable=False)
	paid_at = Column(DateTime(timezone=False), nullable=False)
	notes = Column(Text, nullable=True)
	screenshot_path = Column(Text, nullable=True)
	status = Column(String(50), nullable=False, server_default='pending')
	created_at = Column(DateTime(timezone=False), server_default=func.now(), nullable=False)


class DonationSettings(Base):
	__tablename__ = "donation_settings"

	id = Column(Integer, primary_key=True, autoincrement=False, default=1)
	upi_id = Column(String(255), nullable=False, server_default='')
	qr_image_path = Column(Text, nullable=False, server_default='uploads/qr.png')
	bank_name = Column(String(255), nullable=False, server_default='')
	account_name = Column(String(255), nullable=False, server_default='')
	account_number = Column(String(255), nullable=False, server_default='')
	ifsc = Column(String(50), nullable=False, server_default='')
	updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now(), nullable=False)



