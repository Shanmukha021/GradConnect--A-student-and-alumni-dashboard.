
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models.donations import ManualDonationSubmission
from ..database import get_db
from ..schemas.donations import ManualDonationSubmissionCreate, ManualDonationSubmissionUpdate, ManualDonationSubmissionResponse
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=list[ManualDonationSubmissionResponse])
async def list_donations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ManualDonationSubmission))
    donations = result.scalars().all()
    return donations

@router.post("/", response_model=ManualDonationSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_donation(payload: ManualDonationSubmissionCreate, db: AsyncSession = Depends(get_db)):
    data = payload.model_dump()
    import datetime
    paid_at = data.get("paid_at")
    if isinstance(paid_at, str):
        if paid_at.strip() == "" or paid_at.strip().lower() == "null":
            data["paid_at"] = None
        else:
            try:
                data["paid_at"] = datetime.datetime.fromisoformat(paid_at.replace("Z", "+00:00"))
            except Exception:
                data["paid_at"] = None
    donation = ManualDonationSubmission(**data)
    db.add(donation)
    await db.commit()
    await db.refresh(donation)
    return donation

@router.get("/{donation_id}", response_model=ManualDonationSubmissionResponse)
async def get_donation(donation_id: UUID, db: AsyncSession = Depends(get_db)):
    donation = await db.get(ManualDonationSubmission, donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation

@router.put("/{donation_id}", response_model=ManualDonationSubmissionResponse)
async def update_donation(donation_id: UUID, payload: ManualDonationSubmissionUpdate, db: AsyncSession = Depends(get_db)):
    donation = await db.get(ManualDonationSubmission, donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(donation, key, value)
    await db.commit()
    await db.refresh(donation)
    return donation

@router.delete("/{donation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_donation(donation_id: UUID, db: AsyncSession = Depends(get_db)):
    donation = await db.get(ManualDonationSubmission, donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    await db.delete(donation)
    await db.commit()
    return None
