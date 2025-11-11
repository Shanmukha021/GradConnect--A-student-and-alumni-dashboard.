# Alumni Management Backend API

This is a FastAPI backend for an alumni management platform. It provides a RESTful API for user authentication, alumni profiles, events, jobs, donations, chats, announcements, mentorship, and more.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Setup & Running](#setup--running)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Database Models](#database-models)
- [File Uploads](#file-uploads)
- [Contact](#contact)

---

## Project Overview
This backend manages alumni, events, jobs, donations, chats, announcements, mentorship, and related resources. It is designed for integration with a frontend (web/mobile) via RESTful endpoints.

## Tech Stack
- **Python 3.10+**
- **FastAPI** (web framework)
- **SQLAlchemy (async)** (ORM)
- **PostgreSQL** (database)
- **Alembic** (migrations)
- **Pydantic v2** (data validation)
- **Uvicorn** (ASGI server)
- **JWT** (authentication)

## Setup & Running
1. **Clone the repo**
2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in DB/JWT settings.
4. **Run migrations:**
   ```sh
   alembic upgrade head
   ```
5. **Start the server:**
   ```sh
   uvicorn app.main:app --reload
   ```
6. **API docs:**
   - Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Authentication
- Uses JWT Bearer tokens.
- Register/login to receive a token.
- Pass `Authorization: Bearer <token>` in headers for protected endpoints.

## API Endpoints
All endpoints are prefixed by `/api` (if set in `main.py`).



### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login, returns JWT

### Alumni
- `GET /alumni/` — List alumni
- `POST /alumni/` — Create alumni
- `GET /alumni/{id}` — Get alumni by ID
- `PUT /alumni/{id}` — Update alumni
- `DELETE /alumni/{id}` — Delete alumni

### Events & Attendees
- `GET /events/` — List events
- `POST /events/` — Create event
- `GET /event_attendees/` — List event attendees
- `POST /event_attendees/` — Add attendee

### Jobs & Applications
- `GET /jobs/` — List jobs
- `POST /jobs/` — Create job
- `GET /job_applications/` — List applications
- `POST /job_applications/` — Apply for job

### Donations
- `GET /donations/` — List donations
- `POST /donations/` — Create donation

### Announcements & Mentorship
- `GET /announcements/` — List announcements
- `POST /announcements/` — Create announcement
- `GET /mentors/` — List mentors
- `POST /mentors/` — Register mentor
- `GET /mentorship_requests/` — List requests
- `POST /mentorship_requests/` — Create mentorship request
- `GET /mentorship_sessions/` — List mentorship sessions
- `POST /mentorship_sessions/` — Create mentorship session

### Chats & Messages
- `GET /chats/` — List chats
- `POST /chats/` — Create chat
- `GET /messages/` — List messages
- `POST /messages/` — Send message

> **All endpoints support full CRUD.**

## Frontend Integration
- **Base URL:** `http://localhost:8000/`
- **Auth:** Obtain JWT via `/auth/login`, include in `Authorization` header.
- **Data:** Send/receive JSON. Use OpenAPI docs for request/response formats.
- **File Uploads:** Use `/upload/` endpoints (see docs for details).
- **CORS:** Enabled for frontend development.

## Database Models
- See `app/models/` for SQLAlchemy models.
- See `app/schemas/` for Pydantic request/response models.

## File Uploads
- Files (avatars, event images, etc.) are stored on the server in `/uploads/`.
- Use `/upload/` endpoints to upload and retrieve files.

## Contact
For questions or issues, contact the backend maintainer.

---

_This README was auto-generated. Please refer to the code and OpenAPI docs for the most up-to-date details._
