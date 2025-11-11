# API Endpoints Documentation

This document lists all the backend API endpoints and their correct paths for the Alumni Management System.

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require JWT Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login, returns JWT
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh tokens
- `GET /auth/linkedin/login` - LinkedIn OAuth login
- `GET /auth/linkedin/callback` - LinkedIn OAuth callback

### Alumni
- `GET /alumni/` - List alumni
- `POST /alumni/` - Create alumni
- `GET /alumni/{id}` - Get alumni by ID
- `PUT /alumni/{id}` - Update alumni
- `DELETE /alumni/{id}` - Delete alumni

### Events
- `GET /events/` - List events
- `POST /events/` - Create event
- `GET /events/{id}` - Get event by ID
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event

### Event Attendees
- `GET /event-attendees/` - List event attendees
- `POST /event-attendees/` - Add attendee
- `GET /event-attendees/{id}` - Get attendee by ID
- `PUT /event-attendees/{id}` - Update attendee
- `DELETE /event-attendees/{id}` - Delete attendee

### Jobs
- `GET /jobs/` - List jobs
- `POST /jobs/` - Create job
- `GET /jobs/{id}` - Get job by ID
- `PUT /jobs/{id}` - Update job
- `DELETE /jobs/{id}` - Delete job

### Job Applications
- `GET /job-applications/job_applications/` - List job applications
- `POST /job-applications/job_applications/` - Apply for job
- `GET /job-applications/job_applications/{id}` - Get application by ID
- `PUT /job-applications/job_applications/{id}` - Update application
- `DELETE /job-applications/job_applications/{id}` - Delete application

### Donations
- `GET /donations/` - List donations
- `POST /donations/` - Create donation
- `GET /donations/{id}` - Get donation by ID
- `PUT /donations/{id}` - Update donation
- `DELETE /donations/{id}` - Delete donation

### Chats
- `GET /chats/chats/` - List chats
- `POST /chats/chats/` - Create chat
- `GET /chats/chats/{id}` - Get chat by ID
- `PUT /chats/chats/{id}` - Update chat
- `DELETE /chats/chats/{id}` - Delete chat

### Messages
- `GET /messages/messages` - List messages (use ?chat_id={id} to filter)
- `POST /messages/messages` - Send message
- `GET /messages/messages/{id}` - Get message by ID
- `PUT /messages/messages/{id}` - Update message
- `DELETE /messages/messages/{id}` - Delete message

### Announcements
- `GET /announcements/` - List announcements
- `POST /announcements/` - Create announcement
- `GET /announcements/{id}` - Get announcement by ID
- `PUT /announcements/{id}` - Update announcement
- `DELETE /announcements/{id}` - Delete announcement

### Mentors
- `GET /mentors/mentors/` - List mentors
- `POST /mentors/mentors/` - Register as mentor
- `GET /mentors/mentors/{id}` - Get mentor by ID
- `PUT /mentors/mentors/{id}` - Update mentor
- `DELETE /mentors/mentors/{id}` - Delete mentor

### Mentorship Requests
- `GET /mentorship-requests/mentorship_requests/` - List mentorship requests
- `POST /mentorship-requests/mentorship_requests/` - Create mentorship request
- `GET /mentorship-requests/mentorship_requests/{id}` - Get request by ID
- `PUT /mentorship-requests/mentorship_requests/{id}` - Update request
- `DELETE /mentorship-requests/mentorship_requests/{id}` - Delete request

### Mentorship Sessions
- `GET /mentorship-sessions/mentorship_sessions/` - List mentorship sessions
- `POST /mentorship-sessions/mentorship_sessions/` - Create mentorship session
- `GET /mentorship-sessions/mentorship_sessions/{id}` - Get session by ID
- `PUT /mentorship-sessions/mentorship_sessions/{id}` - Update session
- `DELETE /mentorship-sessions/mentorship_sessions/{id}` - Delete session

### File Uploads
- `POST /uploads/avatars` - Upload avatar image
- `POST /uploads/events` - Upload event image
- `POST /uploads/donations` - Upload donation proof

### Profiles
- `GET /profiles/me/alumni` - Get current user's alumni profile
- `PUT /profiles/me/alumni` - Update current user's alumni profile
- `GET /profiles/me/student` - Get current user's student profile
- `PUT /profiles/me/student` - Update current user's student profile
- `GET /profiles/directory` - Get all profiles (alumni + students)
- `GET /profiles/alumni` - Get all alumni profiles
- `GET /profiles/students` - Get all student profiles

### Health Check
- `GET /health` - Health check endpoint

## Notes

1. **Centralized API Service**: All API calls should use the centralized `api` service from `src/components/api.ts` which automatically handles JWT token authentication.

2. **Endpoint Paths**: Note that some endpoints have nested paths. **IMPORTANT:** Trailing slash behavior varies by endpoint:
   - **WITH trailing slash**: `/chats/chats/`, `/mentors/mentors/`, `/mentorship-requests/mentorship_requests/`, `/mentorship-sessions/mentorship_sessions/`
   - **WITHOUT trailing slash**: `/messages/messages` (redirects occur if trailing slash is used)
   - Check the endpoint list above for the correct format for each endpoint.

3. **Mock Data Removed**: All mock data has been removed from the frontend. The application now relies entirely on backend API responses.

4. **Error Handling**: All API calls include try-catch blocks for proper error handling.

5. **TypeScript Types**: Type definitions are available in `src/types/api.d.ts` generated from the OpenAPI specification.

## Example Usage

```typescript
import api from '../api';

// GET request
const response = await api.get('/alumni/');
const alumni = response.data;

// POST request
const newAlumni = await api.post('/alumni/', {
  name: 'John Doe',
  department: 'Computer Science',
  graduation_year: '2020',
  // ... other fields
});

// PUT request
const updated = await api.put(`/alumni/${id}`, updatedData);

// DELETE request
await api.delete(`/alumni/${id}`);
```
