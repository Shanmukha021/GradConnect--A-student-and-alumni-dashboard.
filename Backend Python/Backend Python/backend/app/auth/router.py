from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import uuid
from datetime import datetime
import os
import httpx

from ..database import get_db
from ..models.user import User
from ..schemas.auth import RegisterRequest, LoginRequest, TokenPair, UserResponse
from ..utils.auth import hash_password, verify_password, create_token, get_current_user_id, decode_token
from ..config import settings
from fastapi.responses import RedirectResponse


router = APIRouter()


@router.post("/register")
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
        res = await db.execute(select(User).where(User.email == payload.email))
        if res.scalar_one_or_none() is not None:
            raise HTTPException(status_code=400, detail="Email already registered")

        role = payload.role or "student"
        user = User(
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=role,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Create JWT access token
        access_token = create_token(str(user.id), settings.JWT_EXPIRES_IN, "access")
        return {"access_token": access_token}


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == payload.email))
    user = res.scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Update last_login_at
    await db.execute(
        update(User).where(User.id == user.id).values(last_login_at=datetime.utcnow())
    )
    await db.commit()

    access = create_token(str(user.id), settings.JWT_EXPIRES_IN, "access")
    refresh = create_token(str(user.id), settings.REFRESH_TOKEN_EXPIRES_IN, "refresh")
    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
        "role": user.role
    }


@router.post("/refresh", response_model=TokenPair)
async def refresh_tokens(token: str):
	payload = decode_token(token)
	if payload.get("type") != "refresh":
		raise HTTPException(status_code=400, detail="Invalid token type")
	user_id = payload.get("sub")
	access = create_token(user_id, settings.JWT_EXPIRES_IN, "access")
	refresh = create_token(user_id, settings.REFRESH_TOKEN_EXPIRES_IN, "refresh")
	return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}


@router.get("/me")
async def me(current_user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
	res = await db.execute(select(User).where(User.id == uuid.UUID(current_user_id)))
	user = res.scalar_one_or_none()
	if user is None:
		raise HTTPException(status_code=404, detail="User not found")
	return {"success": True, "data": UserResponse.model_validate(user).model_dump()}


@router.post("/logout")
async def logout():
	return {"success": True, "message": "Logged out"}


@router.get("/select-role")
async def select_role(role: str):
    """
    Frontend should call this before LinkedIn login, passing ?role=student or ?role=alumni.
    Store role in session/cookie or pass as state in OAuth.
    """
    # For now, just return role (frontend should use this to start LinkedIn OAuth)
    return {"role": role}


@router.get("/linkedin/login")
async def linkedin_login(role: str, request: Request):
    """
    Redirect user to LinkedIn OAuth with role as state param.
    """
    from ..config import settings
    client_id = settings.LINKEDIN_CLIENT_ID
    redirect_uri = settings.LINKEDIN_REDIRECT_URI
    state = role
    linkedin_auth_url = (
        f"https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={client_id}"
        f"&redirect_uri={redirect_uri}&scope=openid%20profile%20email&state={state}"
    )
    return RedirectResponse(linkedin_auth_url)


@router.get("/linkedin/callback")
async def linkedin_callback(code: str, state: str, request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle LinkedIn OAuth callback, exchange code for token, fetch profile, work, skills, and store user.
    """
    from ..config import settings
    # 1. Exchange code for access token
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
        "client_id": settings.LINKEDIN_CLIENT_ID,
        "client_secret": settings.LINKEDIN_CLIENT_SECRET,
    }
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(token_url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
        token_resp.raise_for_status()
        access_token = token_resp.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get LinkedIn access token")

        # 2. Fetch user info from OpenID endpoint
        userinfo_url = "https://api.linkedin.com/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_resp = await client.get(userinfo_url, headers=headers)
        userinfo_resp.raise_for_status()
        userinfo = userinfo_resp.json()
        # Use sub (subject) as unique id, and email if available
        email = userinfo.get("email") or f"linkedin_{userinfo.get('sub')}@example.com"
        profile = userinfo

    # 3. Create or update user in DB
    from ..models.user import User
    from ..schemas.auth import UserResponse
    from ..utils.auth import create_token
    from ..config import settings
    from sqlalchemy import select
    import uuid
    res = await db.execute(select(User).where(User.email == email))
    user = res.scalar_one_or_none()
    if not user:
        user = User(
            email=email,
            password_hash="linkedin_oauth",  # Not used
            role=state,
            is_active=True,
            email_verified=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    # 4. Issue JWT
    access = create_token(str(user.id), settings.JWT_EXPIRES_IN, "access")
    refresh = create_token(str(user.id), settings.REFRESH_TOKEN_EXPIRES_IN, "refresh")
    # Redirect to role-based dashboard with tokens as query params
    # Redirect to frontend LinkedInAuthHandler for token handling
    redirect_url = f"http://localhost:3000/linkedin-auth-handler?access_token={access}&refresh_token={refresh}&role={user.role}"
    return RedirectResponse(url=redirect_url)
