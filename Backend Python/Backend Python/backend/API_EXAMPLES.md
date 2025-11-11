# API Endpoints - JSON Request Examples

This document provides complete JSON request examples for all API endpoints in the Alumni Management Platform.

---

## 🔐 Authentication

### Register New User
```http
POST /api/auth/register
Content-Type: application/json
```
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student"
}
```
**Available Roles:** `admin`, `alumni`, `student`, `recruiter`

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Login
```http
POST /api/auth/login
Content-Type: application/json
```
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 👥 Alumni Management

### Create Alumni Profile
```http
POST /api/alumni/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "phone": "+1234567890",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Software Engineer with 5 years experience in full-stack development",
  "location": "San Francisco, CA",
  "department": "Computer Science",
  "graduation_year": "2018",
  "current_position": "Senior Software Engineer",
  "current_company": "Tech Corp",
  "achievements": [
    "Published 3 research papers",
    "Won hackathon 2020",
    "Speaker at Tech Conference 2023"
  ],
  "social_links": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "twitter": "https://twitter.com/johndoe"
  },
  "is_mentor": true,
  "mentorship_areas": ["Web Development", "Career Guidance", "System Design"],
  "is_public": true
}
```

### Update Alumni Profile
```http
PUT /api/alumni/{alumni_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "name": "John Doe",
  "current_position": "Lead Software Engineer",
  "current_company": "New Tech Corp",
  "bio": "Updated bio with new achievements"
}
```
*Note: All fields are optional in update requests*

### Get Alumni by ID
```http
GET /api/alumni/{alumni_id}
Authorization: Bearer <token>
```

### List All Alumni
```http
GET /api/alumni/
Authorization: Bearer <token>
```

### Delete Alumni Profile
```http
DELETE /api/alumni/{alumni_id}
Authorization: Bearer <token>
```

---

## 📅 Events Management

### Create Event
```http
POST /api/events/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Annual Alumni Meetup 2025",
  "description": "Join us for an evening of networking, fun activities, and reconnecting with fellow alumni. Dinner and refreshments will be provided.",
  "type": "networking",
  "start_date": "2025-12-15T18:00:00",
  "end_date": "2025-12-15T22:00:00",
  "location": "Main Campus Auditorium, Building A",
  "max_attendees": 100,
  "image_url": "https://example.com/event-banner.jpg",
  "organizer_id": "123e4567-e89b-12d3-a456-426614174000",
  "is_public": true,
  "requires_approval": false
}
```

**Event Types:** `networking`, `workshop`, `seminar`, `reunion`, `career-fair`, `webinar`

### Update Event
```http
PUT /api/events/{event_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Updated Event Title",
  "max_attendees": 150,
  "location": "New Venue"
}
```

### List All Events
```http
GET /api/events/
Authorization: Bearer <token>
```

### Get Event by ID
```http
GET /api/events/{event_id}
Authorization: Bearer <token>
```

### Delete Event
```http
DELETE /api/events/{event_id}
Authorization: Bearer <token>
```

---

## 🎟️ Event Attendees

### Add Event Attendee
```http
POST /api/event-attendees/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "event_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "123e4567-e89b-12d3-a456-426614174001",
  "status": "confirmed",
  "rsvp_date": "2025-10-30T12:00:00"
}
```

**Status Options:** `confirmed`, `pending`, `cancelled`, `waitlist`

### List Event Attendees
```http
GET /api/event-attendees/
Authorization: Bearer <token>
```

### Update Attendee Status
```http
PUT /api/event-attendees/{attendee_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "status": "cancelled"
}
```

---

## 💼 Jobs & Applications

### Create Job Posting
```http
POST /api/jobs/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Senior Software Engineer",
  "company": "Tech Innovations Inc",
  "location": "Remote",
  "type": "full-time",
  "description": "We are looking for an experienced software engineer to join our growing team. You will work on cutting-edge technologies and lead important projects.",
  "requirements": [
    "5+ years of experience in software development",
    "Proficiency in Python, JavaScript, or Java",
    "Experience with cloud platforms (AWS/Azure/GCP)",
    "Strong problem-solving skills",
    "Excellent communication abilities"
  ],
  "salary": "$120,000 - $150,000",
  "poster_id": "123e4567-e89b-12d3-a456-426614174000",
  "is_active": true,
  "application_deadline": "2025-12-31T23:59:59"
}
```

**Job Types:** `full-time`, `part-time`, `contract`, `internship`, `freelance`

### Update Job Posting
```http
PUT /api/jobs/{job_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "is_active": false,
  "salary": "$130,000 - $160,000"
}
```

### List All Jobs
```http
GET /api/jobs/
Authorization: Bearer <token>
```

### Get Job by ID
```http
GET /api/jobs/{job_id}
Authorization: Bearer <token>
```

### Delete Job Posting
```http
DELETE /api/jobs/{job_id}
Authorization: Bearer <token>
```

---

## 📝 Job Applications

### Apply for Job
```http
POST /api/job-applications/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "123e4567-e89b-12d3-a456-426614174001",
  "cover_letter": "Dear Hiring Manager,\n\nI am excited to apply for the Senior Software Engineer position. With over 6 years of experience in full-stack development and a proven track record of delivering high-quality software solutions, I believe I would be a great fit for your team.\n\nBest regards,\nJohn Doe"
}
```

### List Job Applications
```http
GET /api/job-applications/
Authorization: Bearer <token>
```

### Update Application
```http
PUT /api/job-applications/{application_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "cover_letter": "Updated cover letter content"
}
```

---

## 💰 Donations

### Submit Manual Donation
```http
POST /api/donations/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "payer_name": "John Doe",
  "amount": 5000.00,
  "currency": "INR",
  "reference_id": "TXN123456789",
  "paid_at": "2025-10-30T10:30:00",
  "notes": "Donation for scholarship fund to support underprivileged students",
  "screenshot_path": "/uploads/donations/receipt_20251030.jpg",
  "status": "pending"
}
```

**Status Options:** `pending`, `approved`, `rejected`

**Supported Currencies:** `INR`, `USD`, `EUR`, `GBP`

### List Donations
```http
GET /api/donations/
Authorization: Bearer <token>
```

### Update Donation Status
```http
PUT /api/donations/{donation_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "status": "approved",
  "notes": "Verified and approved by admin"
}
```

---

## 📢 Announcements

### Create Announcement
```http
POST /api/announcements/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Important Update: Campus Reopening",
  "content": "We are pleased to announce that the campus will be reopening for alumni visits starting December 1st, 2025. Please register in advance for your visit.",
  "created_by": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Update Announcement
```http
PUT /api/announcements/{announcement_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Updated: Campus Reopening",
  "content": "Updated content with new information"
}
```

### List Announcements
```http
GET /api/announcements/
Authorization: Bearer <token>
```

### Get Announcement by ID
```http
GET /api/announcements/{announcement_id}
Authorization: Bearer <token>
```

### Delete Announcement
```http
DELETE /api/announcements/{announcement_id}
Authorization: Bearer <token>
```

---

## 🎓 Mentorship System

### Register as Mentor
```http
POST /api/mentors/mentors/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "areas": [
    "Web Development",
    "Career Guidance",
    "Data Science",
    "Machine Learning",
    "System Design"
  ],
  "is_active": true
}
```

### Update Mentor Profile
```http
PUT /api/mentors/mentors/{mentor_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "areas": ["Web Development", "Cloud Architecture", "DevOps"],
  "is_active": true
}
```

### List All Mentors
```http
GET /api/mentors/mentors/
Authorization: Bearer <token>
```

### Get Mentor by ID
```http
GET /api/mentors/mentors/{mentor_id}
Authorization: Bearer <token>
```

---

## 🤝 Mentorship Requests

### Create Mentorship Request
```http
POST /api/mentorship-requests/mentorship_requests/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "mentee_id": "123e4567-e89b-12d3-a456-426614174001",
  "mentor_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "pending",
  "message": "Hello! I am a recent graduate interested in transitioning to data science. I would greatly appreciate your guidance on building the necessary skills and navigating the job market."
}
```

**Status Options:** `pending`, `accepted`, `rejected`, `completed`

### Update Mentorship Request
```http
PUT /api/mentorship-requests/mentorship_requests/{request_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "status": "accepted",
  "message": "Request accepted. Looking forward to working with you!"
}
```

### List Mentorship Requests
```http
GET /api/mentorship-requests/mentorship_requests/
Authorization: Bearer <token>
```

---

## 📆 Mentorship Sessions

### Create Mentorship Session
```http
POST /api/mentorship-sessions/mentorship_sessions/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "mentor_id": "123e4567-e89b-12d3-a456-426614174000",
  "mentee_id": "123e4567-e89b-12d3-a456-426614174001",
  "scheduled_at": "2025-11-05T15:00:00",
  "duration_minutes": 60,
  "notes": "Career guidance session - Topics: Resume review, interview preparation, and job search strategies"
}
```

### Update Mentorship Session
```http
PUT /api/mentorship-sessions/mentorship_sessions/{session_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "scheduled_at": "2025-11-06T16:00:00",
  "duration_minutes": 90,
  "notes": "Rescheduled session - Extended duration for project review"
}
```

### List Mentorship Sessions
```http
GET /api/mentorship-sessions/mentorship_sessions/
Authorization: Bearer <token>
```

### Get Session by ID
```http
GET /api/mentorship-sessions/mentorship_sessions/{session_id}
Authorization: Bearer <token>
```

---

## 💬 Chats & Messages

### Create Chat
```http
POST /api/chats/chats/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Project Discussion",
  "is_group": false
}
```

**For Group Chat:**
```json
{
  "title": "Alumni 2018 Batch Group",
  "is_group": true
}
```

### Update Chat
```http
PUT /api/chats/chats/{chat_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Updated Chat Title"
}
```

### List All Chats
```http
GET /api/chats/chats/
Authorization: Bearer <token>
```

### Get Chat by ID
```http
GET /api/chats/chats/{chat_id}
Authorization: Bearer <token>
```

### Delete Chat
```http
DELETE /api/chats/chats/{chat_id}
Authorization: Bearer <token>
```

---

## 💌 Messages

### Send Message
```http
POST /api/messages/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "chat_id": "123e4567-e89b-12d3-a456-426614174000",
  "sender_id": "123e4567-e89b-12d3-a456-426614174001",
  "content": "Hello! How are you? I wanted to discuss the upcoming alumni event."
}
```

### List Messages
```http
GET /api/messages/
Authorization: Bearer <token>
```

### Get Message by ID
```http
GET /api/messages/{message_id}
Authorization: Bearer <token>
```

### Update Message
```http
PUT /api/messages/{message_id}
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "content": "Updated message content"
}
```

### Delete Message
```http
DELETE /api/messages/{message_id}
Authorization: Bearer <token>
```

---

## 📤 File Uploads

### Upload Avatar
```http
POST /api/uploads/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
```
file: [binary file data]
```

### Upload Event Image
```http
POST /api/uploads/event
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
```
file: [binary file data]
```

### Upload Donation Receipt
```http
POST /api/uploads/donation
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
```
file: [binary file data]
```

---

## 🏥 Health Check

### Check API Health
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

---

## 📝 Important Notes

### Authentication
- All endpoints except `/api/auth/register`, `/api/auth/login`, and `/api/health` require authentication
- Include the JWT token in the Authorization header: `Authorization: Bearer <your_token>`
- Tokens expire after 24 hours (configurable in `.env`)

### UUIDs
- Replace example UUIDs like `123e4567-e89b-12d3-a456-426614174000` with actual UUIDs from your database
- UUIDs are automatically generated when creating new resources

### Date Formats
- Use ISO 8601 format for all dates: `YYYY-MM-DDTHH:MM:SS`
- Example: `2025-10-30T15:30:00`

### Optional Fields
- Fields marked as `Optional` in schemas can be omitted from requests
- When updating resources, only include fields you want to change

### Response Codes
- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error

### CORS
- CORS is enabled for all origins in development
- Configure `CORS_ALLOW_ORIGINS` in `.env` for production

### Base URL
- Development: `http://localhost:8000`
- Production: Configure according to your deployment

---

## 🔧 Testing with cURL

### Example: Register and Login
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Example: Create Alumni Profile
```bash
curl -X POST http://localhost:8000/api/alumni/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "name": "John Doe",
    "department": "Computer Science",
    "graduation_year": "2018"
  }'
```

---

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **GitHub Repository**: [Your Repo URL]
- **Support**: [Your Support Email]

---

*Last Updated: October 30, 2025*
