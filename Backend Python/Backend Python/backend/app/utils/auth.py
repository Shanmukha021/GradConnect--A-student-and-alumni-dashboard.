from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
http_bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
	return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
	return pwd_context.verify(password, hashed)


def _parse_duration(duration: str) -> timedelta:
	# supports e.g. 24h, 7d, 30m
	amount = int(duration[:-1])
	unit = duration[-1]
	if unit == 'h':
		return timedelta(hours=amount)
	if unit == 'd':
		return timedelta(days=amount)
	if unit == 'm':
		return timedelta(minutes=amount)
	raise ValueError("Unsupported duration format")


def create_token(subject: str, expires_in: str, token_type: str) -> str:
	expires_delta = _parse_duration(expires_in)
	now = datetime.now(timezone.utc)
	payload = {
		"sub": subject,
		"type": token_type,
		"iat": int(now.timestamp()),
		"exp": int((now + expires_delta).timestamp()),
	}
	return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def decode_token(token: str) -> dict:
	try:
		return jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
	except jwt.ExpiredSignatureError:
		raise HTTPException(status_code=401, detail="Token expired")
	except jwt.InvalidTokenError:
		raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user_id(credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer)) -> str:
	if credentials is None:
		raise HTTPException(status_code=401, detail="Not authenticated")
	payload = decode_token(credentials.credentials)
	if payload.get("type") != "access":
		raise HTTPException(status_code=401, detail="Invalid token type")
	return payload.get("sub")


def require_roles(*allowed_roles: str):
	def dependency(user_role: str = Depends(lambda: None), credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer)):
		if credentials is None:
			raise HTTPException(status_code=401, detail="Not authenticated")
		payload = decode_token(credentials.credentials)
		role = payload.get("role")
		if role not in allowed_roles:
			raise HTTPException(status_code=403, detail="Forbidden")
		return True
	return dependency



