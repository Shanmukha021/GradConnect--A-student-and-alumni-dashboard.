
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from ..models.alumni import AlumniProfile
from ..database import get_db
from ..schemas.alumni import AlumniCreate, AlumniUpdate, AlumniResponse
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=list[AlumniResponse])
async def list_alumni(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AlumniProfile))
    alumni = result.scalars().all()
    return alumni

@router.post("/", response_model=AlumniResponse, status_code=status.HTTP_201_CREATED)
async def create_alumni(payload: AlumniCreate, db: AsyncSession = Depends(get_db)):
    alumni = AlumniProfile(**payload.model_dump())
    db.add(alumni)
    await db.commit()
    await db.refresh(alumni)
    return alumni

@router.get("/{alumni_id}", response_model=AlumniResponse)
async def get_alumni(alumni_id: UUID, db: AsyncSession = Depends(get_db)):
    alumni = await db.get(AlumniProfile, alumni_id)
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    return alumni

@router.put("/{alumni_id}", response_model=AlumniResponse)
async def update_alumni(alumni_id: UUID, payload: AlumniUpdate, db: AsyncSession = Depends(get_db)):
    alumni = await db.get(AlumniProfile, alumni_id)
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(alumni, key, value)
    await db.commit()
    await db.refresh(alumni)
    return alumni

@router.delete("/{alumni_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alumni(alumni_id: UUID, db: AsyncSession = Depends(get_db)):
    alumni = await db.get(AlumniProfile, alumni_id)
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    await db.delete(alumni)
    await db.commit()
    return None
