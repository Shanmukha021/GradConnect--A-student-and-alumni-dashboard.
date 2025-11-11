from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class ManualDonationSubmissionBase(BaseModel):
    payer_name: str
    amount: float
    currency: str = 'INR'
    reference_id: str
    paid_at: str
    notes: Optional[str] = None
    screenshot_path: Optional[str] = None
    status: str = 'pending'

class ManualDonationSubmissionCreate(ManualDonationSubmissionBase):
    pass

class ManualDonationSubmissionUpdate(ManualDonationSubmissionBase):
    pass

class ManualDonationSubmissionResponse(ManualDonationSubmissionBase):
    id: UUID
    created_at: str

    class Config:
        from_attributes = True
