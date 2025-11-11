from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from ..database import get_db
from ..models.jobs import JobApplication
from ..schemas.job_applications import JobApplicationCreate, JobApplicationUpdate, JobApplicationResponse

router = APIRouter(prefix="/job_applications", tags=["Job Applications"])

@router.get("/", response_model=list[JobApplicationResponse])
async def list_job_applications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobApplication))
    return result.scalars().all()

@router.post("/", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_job_application(application: JobApplicationCreate, db: AsyncSession = Depends(get_db)):
    db_application = JobApplication(**application.model_dump())
    db.add(db_application)
    await db.commit()
    await db.refresh(db_application)
    return db_application

@router.get("/{application_id}", response_model=JobApplicationResponse)
async def get_job_application(application_id: UUID, db: AsyncSession = Depends(get_db)):
    application = await db.get(JobApplication, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Job application not found")
    return application

@router.put("/{application_id}", response_model=JobApplicationResponse)
async def update_job_application(application_id: UUID, update: JobApplicationUpdate, db: AsyncSession = Depends(get_db)):
    application = await db.get(JobApplication, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Job application not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(application, key, value)
    await db.commit()
    await db.refresh(application)
    return application

@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_application(application_id: UUID, db: AsyncSession = Depends(get_db)):
    application = await db.get(JobApplication, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Job application not found")
    await db.delete(application)
    await db.commit()
    return None
