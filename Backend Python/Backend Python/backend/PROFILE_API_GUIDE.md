# Profile Management API Guide

## Overview
This guide explains how to use the profile management endpoints for both alumni and student users.

## Features Implemented

### ✅ Profile Management
- **Get My Profile**: Retrieve the authenticated user's profile (auto-detects alumni/student)
- **Update Alumni Profile**: Update professional information for alumni users
- **Update Student Profile**: Update academic information for student users
- **Profile Directory**: View all public alumni and student profiles
- **Individual Profile View**: View specific alumni or student profiles

### ✅ Key Features
- Automatic profile type detection based on user role
- Create profile on first update if it doesn't exist
- Privacy controls (public/private profiles)
- Professional information tracking for alumni
- Academic information tracking for students

---

## API Endpoints

### 1. Get My Profile
**GET** `/api/profiles/me`

Get the authenticated user's profile (automatically detects if alumni or student).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Alumni):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "John Doe",
  "phone": "+1234567890",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Experienced software engineer...",
  "location": "San Francisco, CA",
  "department": "Computer Science",
  "graduation_year": "2020",
  "current_position": "Senior Software Engineer",
  "current_company": "Tech Corp",
  "achievements": ["Award 1", "Award 2"],
  "social_links": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  },
  "is_mentor": true,
  "mentorship_areas": ["Software Development", "Career Guidance"],
  "is_public": true,
  "created_at": "2025-01-01T00:00:00",
  "updated_at": "2025-01-01T00:00:00"
}
```

**Response (Student):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Jane Smith",
  "phone": "+1234567890",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Computer Science student...",
  "location": "Boston, MA",
  "department": "Computer Science",
  "current_year": "3rd Year",
  "enrollment_year": "2022",
  "expected_graduation_year": "2026",
  "interests": ["AI", "Web Development"],
  "skills": ["Python", "JavaScript", "React"],
  "projects": [
    {
      "title": "Project 1",
      "description": "Description",
      "url": "https://github.com/..."
    }
  ],
  "social_links": {
    "linkedin": "https://linkedin.com/in/janesmith",
    "github": "https://github.com/janesmith"
  },
  "looking_for_mentorship": true,
  "mentorship_interests": ["Career Guidance", "Technical Skills"],
  "is_public": true,
  "created_at": "2025-01-01T00:00:00",
  "updated_at": "2025-01-01T00:00:00"
}
```

---

### 2. Update Alumni Profile
**PUT** `/api/profiles/me/alumni`

Update the authenticated alumni user's profile. Creates profile if it doesn't exist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Experienced software engineer with 5 years in the industry",
  "location": "San Francisco, CA",
  "department": "Computer Science",
  "graduation_year": "2020",
  "current_position": "Senior Software Engineer",
  "current_company": "Tech Corp",
  "achievements": [
    "Best Employee Award 2023",
    "Published 3 research papers"
  ],
  "social_links": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "twitter": "https://twitter.com/johndoe"
  },
  "is_mentor": true,
  "mentorship_areas": [
    "Software Development",
    "Career Guidance",
    "Interview Preparation"
  ],
  "is_public": true
}
```

**Note:** All fields are optional. Only send the fields you want to update.

**Response:** Same as "Get My Profile" for alumni

---

### 3. Update Student Profile
**PUT** `/api/profiles/me/student`

Update the authenticated student user's profile. Creates profile if it doesn't exist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "+1234567890",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Computer Science student passionate about AI and web development",
  "location": "Boston, MA",
  "department": "Computer Science",
  "current_year": "3rd Year",
  "enrollment_year": "2022",
  "expected_graduation_year": "2026",
  "interests": [
    "Artificial Intelligence",
    "Web Development",
    "Mobile Apps"
  ],
  "skills": [
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "Machine Learning"
  ],
  "projects": [
    {
      "title": "AI Chatbot",
      "description": "Built a chatbot using NLP",
      "url": "https://github.com/janesmith/chatbot"
    },
    {
      "title": "E-commerce Website",
      "description": "Full-stack e-commerce platform",
      "url": "https://github.com/janesmith/ecommerce"
    }
  ],
  "social_links": {
    "linkedin": "https://linkedin.com/in/janesmith",
    "github": "https://github.com/janesmith"
  },
  "looking_for_mentorship": true,
  "mentorship_interests": [
    "Career Guidance",
    "Technical Skills",
    "Industry Insights"
  ],
  "is_public": true
}
```

**Note:** All fields are optional. Only send the fields you want to update.

**Response:** Same as "Get My Profile" for students

---

### 4. Get All Alumni Profiles (Directory)
**GET** `/api/profiles/alumni`

Get all public alumni profiles for the directory.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "John Doe",
    "department": "Computer Science",
    "graduation_year": "2020",
    "current_position": "Senior Software Engineer",
    "current_company": "Tech Corp",
    ...
  },
  ...
]
```

---

### 5. Get All Student Profiles (Directory)
**GET** `/api/profiles/students`

Get all public student profiles for the directory.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Jane Smith",
    "department": "Computer Science",
    "current_year": "3rd Year",
    "expected_graduation_year": "2026",
    ...
  },
  ...
]
```

---

### 6. Get All Profiles (Combined Directory)
**GET** `/api/profiles/directory`

Get all public profiles (both alumni and students) in one request.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "alumni": [
    {
      "id": "uuid",
      "name": "John Doe",
      ...
    }
  ],
  "students": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      ...
    }
  ]
}
```

---

### 7. Get Specific Alumni Profile
**GET** `/api/profiles/alumni/{profile_id}`

Get a specific alumni profile by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** Alumni profile object

---

### 8. Get Specific Student Profile
**GET** `/api/profiles/students/{profile_id}`

Get a specific student profile by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** Student profile object

---

## Usage Examples

### Example 1: Alumni Updates Their Profile

```javascript
// 1. Login as alumni
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'alumni@example.com',
    password: 'password123'
  })
});
const { access_token } = await loginResponse.json();

// 2. Update profile
const updateResponse = await fetch('http://localhost:8000/api/profiles/me/alumni', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    name: 'John Doe',
    current_position: 'Senior Software Engineer',
    current_company: 'Tech Corp',
    bio: 'Experienced engineer...',
    is_mentor: true
  })
});
const profile = await updateResponse.json();
console.log('Profile updated:', profile);

// 3. View directory (see all students and alumni)
const directoryResponse = await fetch('http://localhost:8000/api/profiles/directory', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const directory = await directoryResponse.json();
console.log('Alumni:', directory.alumni);
console.log('Students:', directory.students);
```

### Example 2: Student Updates Their Profile

```javascript
// 1. Login as student
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'password123'
  })
});
const { access_token } = await loginResponse.json();

// 2. Update profile
const updateResponse = await fetch('http://localhost:8000/api/profiles/me/student', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    name: 'Jane Smith',
    current_year: '3rd Year',
    skills: ['Python', 'JavaScript', 'React'],
    looking_for_mentorship: true,
    mentorship_interests: ['Career Guidance', 'Technical Skills']
  })
});
const profile = await updateResponse.json();
console.log('Profile updated:', profile);

// 3. View all alumni profiles
const alumniResponse = await fetch('http://localhost:8000/api/profiles/alumni', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const alumni = await alumniResponse.json();
console.log('All alumni:', alumni);
```

---

## Frontend Integration

### Profile Page Component Structure

```jsx
// MyProfile.jsx
import React, { useState, useEffect } from 'react';

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:8000/api/profiles/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setProfile(data);
    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role'); // 'alumni' or 'student'
    
    const response = await fetch(`http://localhost:8000/api/profiles/me/${role}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const updated = await response.json();
      setProfile(updated);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div>
      <h1>My Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <button type="submit">Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          {/* Display profile */}
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}
```

---

## Database Migration

To apply the new student_profiles table:

```bash
cd "D:\SANIA SEP\Backend Python\Backend Python\backend"
alembic upgrade head
```

---

## Summary

### What's Been Implemented:

1. ✅ **StudentProfile Model** - Database model for student profiles
2. ✅ **Profile Schemas** - Pydantic schemas for validation
3. ✅ **Profile Router** - Complete API endpoints for profile management
4. ✅ **Directory Endpoints** - View all alumni and student profiles
5. ✅ **Auto-create on Update** - Profiles are created automatically on first update
6. ✅ **Privacy Controls** - Public/private profile settings
7. ✅ **Role-based Access** - Alumni can only update alumni profiles, students can only update student profiles

### Key Benefits:

- **Unified Profile Management**: Single endpoint (`/api/profiles/me`) auto-detects user type
- **Persistent Updates**: All profile changes are saved to the database
- **Directory Feature**: Both alumni and students can view each other's profiles
- **Professional Tracking**: Alumni can showcase their career progression
- **Academic Tracking**: Students can display their skills and projects
