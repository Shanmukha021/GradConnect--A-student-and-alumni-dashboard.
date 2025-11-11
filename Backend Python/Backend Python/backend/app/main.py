from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .routers import upload as upload_router
from .auth import router as auth_router
from .routers.alumni import router as alumni_router
from .routers.events import router as events_router
from .routers.jobs import router as jobs_router
from .routers.donations import router as donations_router
from .routers.chats import router as chats_router
from .routers.announcements_mentorship import router as announcements_mentorship_router
from .routers.event_attendees import router as event_attendees_router
from .routers.job_applications import router as job_applications_router
from .routers.chat_participants import router as chat_participants_router
from .routers.messages import router as messages_router
from .routers.mentors import router as mentors_router
from .routers.mentorship_requests import router as mentorship_requests_router
from .routers.mentorship_sessions import router as mentorship_sessions_router
from .routers.profiles import router as profiles_router


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
	async def dispatch(self, request: Request, call_next):
		response: Response = await call_next(request)
		response.headers["X-Content-Type-Options"] = "nosniff"
		response.headers["X-Frame-Options"] = "DENY"
		response.headers["X-XSS-Protection"] = "1; mode=block"
		response.headers["Referrer-Policy"] = "no-referrer-when-downgrade"
		response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
		return response


def create_app() -> FastAPI:
	app = FastAPI(title="Alumni Management Platform API", version="0.1.0")

	app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	app.add_middleware(SecurityHeadersMiddleware)

	# Ensure upload directories exist
	for sub in ("avatars", "events", "donations"):
		os.makedirs(os.path.join(settings.UPLOAD_DIR, sub), exist_ok=True)

	# Serve static uploads
	app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

	# Routers
	app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
	app.include_router(upload_router.router, prefix="/api/uploads", tags=["uploads"])
	app.include_router(alumni_router, prefix="/api/alumni", tags=["alumni"])
	app.include_router(events_router, prefix="/api/events", tags=["events"])
	app.include_router(jobs_router, prefix="/api/jobs", tags=["jobs"])
	app.include_router(donations_router, prefix="/api/donations", tags=["donations"])
	app.include_router(chats_router, prefix="/api/chats/chats", tags=["chats"])
	app.include_router(announcements_mentorship_router, prefix="/api/announcements", tags=["announcements"])
	app.include_router(event_attendees_router, prefix="/api/event-attendees", tags=["event-attendees"])
	app.include_router(job_applications_router, prefix="/api/job-applications", tags=["job-applications"])
	app.include_router(chat_participants_router, prefix="/api/chat-participants", tags=["chat-participants"])
	app.include_router(messages_router, prefix="/api/messages", tags=["messages"])
	app.include_router(mentors_router, prefix="/api/mentors/mentors", tags=["mentors"])
	app.include_router(mentorship_requests_router, prefix="/api/mentorship-requests/mentorship_requests", tags=["mentorship-requests"])
	app.include_router(mentorship_sessions_router, prefix="/api/mentorship-sessions/mentorship_sessions", tags=["mentorship-sessions"])
	from .routers.users import router as users_router
	app.include_router(users_router, prefix="/api/users", tags=["users"])
	app.include_router(profiles_router, prefix="/api/profiles", tags=["profiles"])

	@app.get("/api/health")
	async def health_check():
		return {"success": True, "data": {"status": "ok"}}

	return app


app = create_app()



