from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from typing import List, Union
from uuid import UUID
import uuid

from ..database import get_db
from ..models.user import User
from ..models.alumni import AlumniProfile
from ..models.student import StudentProfile
from ..schemas.alumni import AlumniResponse, AlumniUpdate
from ..schemas.student import StudentResponse, StudentUpdate, StudentCreate
from ..schemas.auth import UserResponse
from ..utils.auth import get_current_user_id

router = APIRouter()


# Get current user's profile (auto-detects if alumni or student)
@router.get("/me", response_model=Union[AlumniResponse, StudentResponse])
async def get_my_profile(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get the authenticated user's profile (alumni or student)"""
    user_uuid = uuid.UUID(current_user_id)
    
    # Get user to check role
    user_result = await db.execute(select(User).where(User.id == user_uuid))
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if alumni profile exists
    if user.role == "alumni":
        alumni_result = await db.execute(
            select(AlumniProfile).where(AlumniProfile.user_id == user_uuid)
        )
        profile = alumni_result.scalar_one_or_none()
        if not profile:
            raise HTTPException(status_code=404, detail="Alumni profile not found. Please create your profile first.")
        return profile
    
    # Check if student profile exists
    elif user.role == "student":
        student_result = await db.execute(
            select(StudentProfile).where(StudentProfile.user_id == user_uuid)
        )
        profile = student_result.scalar_one_or_none()
        if not profile:
            raise HTTPException(status_code=404, detail="Student profile not found. Please create your profile first.")
        return profile
    
    else:
        raise HTTPException(status_code=400, detail="User role not supported for profiles")


# Update current user's alumni profile
@router.put("/me/alumni", response_model=AlumniResponse)
async def update_my_alumni_profile(
    payload: AlumniUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Update the authenticated alumni user's profile"""
    user_uuid = uuid.UUID(current_user_id)
    
    # Verify user is alumni
    user_result = await db.execute(select(User).where(User.id == user_uuid))
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role != "alumni":
        raise HTTPException(status_code=403, detail="Only alumni can update alumni profiles")
    
    # Get or create alumni profile
    alumni_result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_uuid)
    )
    alumni = alumni_result.scalar_one_or_none()
    
    if not alumni:
        # Create new profile if it doesn't exist
        alumni = AlumniProfile(user_id=user_uuid, **payload.model_dump(exclude_unset=True))
        db.add(alumni)
    else:
        # Update existing profile
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(alumni, key, value)
    
    await db.commit()
    await db.refresh(alumni)
    return alumni


# Update current user's student profile
@router.put("/me/student", response_model=StudentResponse)
async def update_my_student_profile(
    payload: StudentUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Update the authenticated student user's profile"""
    user_uuid = uuid.UUID(current_user_id)
    
    # Verify user is student
    user_result = await db.execute(select(User).where(User.id == user_uuid))
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can update student profiles")
    
    # Get or create student profile
    student_result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == user_uuid)
    )
    student = student_result.scalar_one_or_none()
    
    if not student:
        # Create new profile if it doesn't exist
        student = StudentProfile(user_id=user_uuid, **payload.model_dump(exclude_unset=True))
        db.add(student)
    else:
        # Update existing profile
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(student, key, value)
    
    await db.commit()
    await db.refresh(student)
    return student


# Get all alumni profiles (directory)
@router.get("/alumni", response_model=List[AlumniResponse])
async def get_all_alumni(
    db: AsyncSession = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get all public alumni profiles for directory"""
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.is_public == True)
    )
    alumni = result.scalars().all()
    return alumni


# Get all student profiles (directory)
@router.get("/students", response_model=List[StudentResponse])
async def get_all_students(
    db: AsyncSession = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get all public student profiles for directory"""
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.is_public == True)
    )
    students = result.scalars().all()
    return students


# Get all profiles (both alumni and students) for directory
@router.get("/directory")
async def get_all_profiles(
    db: AsyncSession = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get all public profiles (alumni and students) for directory"""
    # Get all public alumni
    alumni_result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.is_public == True)
    )
    alumni = alumni_result.scalars().all()
    
    # Get all public students
    student_result = await db.execute(
        select(StudentProfile).where(StudentProfile.is_public == True)
    )
    students = student_result.scalars().all()
    
    return {
        "alumni": [AlumniResponse.model_validate(a) for a in alumni],
        "students": [StudentResponse.model_validate(s) for s in students]
    }


# Get specific alumni profile by ID
@router.get("/alumni/{profile_id}", response_model=AlumniResponse)
async def get_alumni_profile(
    profile_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get a specific alumni profile by ID"""
    alumni = await db.get(AlumniProfile, profile_id)
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni profile not found")
    
    if not alumni.is_public:
        # Only allow viewing private profiles if it's the user's own profile
        if str(alumni.user_id) != current_user_id:
            raise HTTPException(status_code=403, detail="This profile is private")
    
    return alumni


# Get specific student profile by ID
@router.get("/students/{profile_id}", response_model=StudentResponse)
async def get_student_profile(
    profile_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get a specific student profile by ID"""
    student = await db.get(StudentProfile, profile_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    if not student.is_public:
        # Only allow viewing private profiles if it's the user's own profile
        if str(student.user_id) != current_user_id:
            raise HTTPException(status_code=403, detail="This profile is private")
    
    return student
