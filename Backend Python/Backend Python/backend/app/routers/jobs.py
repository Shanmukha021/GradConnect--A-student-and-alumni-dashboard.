
from fastapi import APIRouter, HTTPException, Depends, status
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models.jobs import Job
from fastapi import Depends
from ..utils.auth import get_current_user_id
from ..database import get_db
from ..schemas.jobs import JobCreate, JobUpdate, JobResponse
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=list[JobResponse])
async def list_jobs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job))
    jobs = result.scalars().all()
    job_list = []
    for job in jobs:
        job_dict = job.__dict__.copy()
        if "created_at" in job_dict and hasattr(job_dict["created_at"], "isoformat"):
            job_dict["created_at"] = job_dict["created_at"].isoformat()
        if "updated_at" in job_dict and hasattr(job_dict["updated_at"], "isoformat"):
            job_dict["updated_at"] = job_dict["updated_at"].isoformat()
        job_list.append(job_dict)
    return job_list

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    payload: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    job_data = payload.model_dump()
    deadline = job_data.get("application_deadline")
    if deadline and hasattr(deadline, 'tzinfo') and deadline.tzinfo:
        job_data["application_deadline"] = deadline.replace(tzinfo=None)
    job = Job(
        title=job_data.get("title"),
        company=job_data.get("company"),
        location=job_data.get("location"),
        type=job_data.get("type").lower(),
        description=job_data.get("description"),
        requirements=job_data.get("requirements"),
        salary=job_data.get("salary"),
        poster_id=uuid.UUID(current_user_id),
        is_active=True,
        application_deadline=job_data.get("application_deadline")
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    # Convert created_at and updated_at to ISO strings for response validation
    job_dict = job.__dict__.copy()
    if "created_at" in job_dict and hasattr(job_dict["created_at"], "isoformat"):
        job_dict["created_at"] = job_dict["created_at"].isoformat()
    if "updated_at" in job_dict and hasattr(job_dict["updated_at"], "isoformat"):
        job_dict["updated_at"] = job_dict["updated_at"].isoformat()
    return job_dict

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: UUID, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(job_id: UUID, payload: JobUpdate, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, key, value)
    await db.commit()
    await db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: UUID, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    await db.delete(job)
    await db.commit()
    return None
