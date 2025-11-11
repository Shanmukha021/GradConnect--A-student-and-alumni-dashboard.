from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
from ..config import settings

router = APIRouter()


def _save_file(file: UploadFile, subdir: str) -> str:
	filename = f"{uuid.uuid4()}_{file.filename}"
	dir_path = os.path.join(settings.UPLOAD_DIR, subdir)
	os.makedirs(dir_path, exist_ok=True)
	path = os.path.join(dir_path, filename)
	with open(path, "wb") as f:
		f.write(file.file.read())
	# Return relative path starting with uploads/
	rel = os.path.relpath(path, start=os.path.dirname(settings.UPLOAD_DIR))
	if not rel.replace("\\", "/").startswith("uploads/"):
		rel = os.path.join("uploads", subdir, filename)
	return rel.replace("\\", "/")


@router.post("/avatars")
async def upload_avatar(file: UploadFile = File(...)):
	if not file.content_type.startswith("image/"):
		raise HTTPException(status_code=400, detail="Only image uploads allowed")
	rel = _save_file(file, "avatars")
	return {"success": True, "data": {"path": rel}}


@router.post("/events")
async def upload_event_image(file: UploadFile = File(...)):
	if not file.content_type.startswith("image/"):
		raise HTTPException(status_code=400, detail="Only image uploads allowed")
	rel = _save_file(file, "events")
	return {"success": True, "data": {"path": rel}}


@router.post("/donations")
async def upload_donation_proof(file: UploadFile = File(...)):
	if not file.content_type.startswith("image/"):
		raise HTTPException(status_code=400, detail="Only image uploads allowed")
	rel = _save_file(file, "donations")
	return {"success": True, "data": {"path": rel}}



