# Profile Management System

This document describes the profile management system implementation for the Alumni Management System.

## Overview

The profile management system allows users to view, edit, and manage their profiles based on their role (Alumni or Student). It also provides a directory to browse all public profiles.

## Components

### 1. Type Definitions (`src/types/profile.ts`)

Defines TypeScript interfaces for:
- `AlumniProfile` - Alumni profile structure
- `StudentProfile` - Student profile structure
- `SocialLinks` - Social media links
- `Project` - Student project structure

### 2. My Profile Page (`src/components/pages/MyProfile.tsx`)

Main profile management component with two modes:

#### View Mode
- Displays user profile information in a clean, organized layout
- Shows avatar, basic info, professional/academic details
- Displays role-specific information (alumni vs student)
- Shows social links, skills, projects, etc.

#### Edit Mode
- Allows users to update their profile information
- Role-specific forms (AlumniProfileForm or StudentProfileForm)
- Real-time form validation
- Submit button with loading states

### 3. Alumni Profile Form (`src/components/pages/AlumniProfileForm.tsx`)

Form fields for alumni users:
- **Basic Information**: Name, Phone, Location, Bio
- **Academic**: Department, Graduation Year
- **Professional**: Current Position, Current Company
- **Achievements**: Array of achievements
- **Social Links**: LinkedIn, GitHub, Twitter
- **Mentorship**: Is Mentor checkbox, Mentorship Areas
- **Privacy**: Is Public checkbox

### 4. Student Profile Form (`src/components/pages/StudentProfileForm.tsx`)

Form fields for student users:
- **Basic Information**: Name, Phone, Location, Bio
- **Academic**: Department, Current Year, Enrollment Year, Expected Graduation
- **Skills & Interests**: Skills array, Interests array
- **Projects**: Array of projects with title, description, URL
- **Social Links**: LinkedIn, GitHub, Twitter
- **Mentorship**: Looking for Mentorship checkbox, Mentorship Interests
- **Privacy**: Is Public checkbox

### 5. Directory Page (`src/components/pages/Directory.tsx`)

Browse all public profiles:
- **Search**: Filter profiles by name, department, location, or company
- **Tabs**: View All, Alumni only, or Students only
- **Profile Cards**: Display key information for each profile
- **Responsive Grid**: Adapts to different screen sizes

## API Integration

### Endpoints Used

#### Get Current User Profile
```typescript
GET /api/profiles/me/alumni  // For alumni users
GET /api/profiles/me/student // For student users
```

#### Update Current User Profile
```typescript
PUT /api/profiles/me/alumni  // For alumni users
PUT /api/profiles/me/student // For student users
```

#### Get All Profiles
```typescript
GET /api/profiles/directory  // All profiles
GET /api/profiles/alumni     // Alumni only
GET /api/profiles/students   // Students only
```

### Authentication

All API calls use the centralized `api` service from `src/components/api.ts` which:
- Automatically includes JWT Bearer token from localStorage
- Uses token stored as 'token' in localStorage
- Reads user role from localStorage ('role' key)

## Routes

Two new routes added to `App.tsx`:

```typescript
/my-profile  // User's own profile (view/edit)
/directory   // Browse all public profiles
```

## Features

### My Profile Page

1. **Automatic Role Detection**
   - Reads user role from localStorage
   - Loads appropriate profile endpoint
   - Displays role-specific form fields

2. **View/Edit Toggle**
   - Switch between view and edit modes
   - Edit button in header
   - Cancel returns to view mode

3. **Form Validation**
   - Required fields marked with *
   - Client-side validation
   - Server-side error handling

4. **Submit Functionality**
   - PUT request to appropriate endpoint
   - Authorization header with Bearer token
   - Success/error messages
   - Loading states during save
   - Auto-refresh after successful save

5. **Error Handling**
   - Network error handling
   - API error messages displayed
   - User-friendly error alerts

### Directory Page

1. **Search & Filter**
   - Real-time search across multiple fields
   - Filter by role (All/Alumni/Students)
   - Search by name, department, location, company

2. **Profile Cards**
   - Avatar with fallback initials
   - Key information display
   - Role-specific badges (Mentor, Looking for Mentorship)
   - Skills preview for students
   - Hover effects for better UX

3. **Responsive Design**
   - Grid layout adapts to screen size
   - Mobile-friendly cards
   - Touch-optimized interactions

## Styling

Uses shadcn/ui components with custom color scheme:
- Primary color: `#90EE90` (Light Green)
- Secondary color: `#ADD8E6` (Light Blue)
- Consistent with existing app design
- Responsive and accessible

## Data Flow

1. **Loading Profile**
   ```
   User navigates to /my-profile
   → Component reads role from localStorage
   → Fetches profile from /profiles/me/{role}
   → Displays profile in view mode
   ```

2. **Editing Profile**
   ```
   User clicks Edit button
   → Switches to edit mode
   → Shows appropriate form (Alumni/Student)
   → User modifies fields
   → Clicks Save Profile
   → PUT request to /profiles/me/{role}
   → Success: Shows message, switches to view mode
   → Error: Shows error message
   ```

3. **Browsing Directory**
   ```
   User navigates to /directory
   → Fetches all alumni profiles
   → Fetches all student profiles
   → Displays in tabbed interface
   → User can search/filter
   → Results update in real-time
   ```

## Usage

### Accessing My Profile
Navigate to `/my-profile` or add a link in your navigation:
```tsx
<Link to="/my-profile">My Profile</Link>
```

### Accessing Directory
Navigate to `/directory` or add a link in your navigation:
```tsx
<Link to="/directory">Directory</Link>
```

### Required localStorage Items
- `token` or `access_token` - JWT authentication token
- `role` - User role ('alumni' or 'student')

## Future Enhancements

Potential improvements:
1. Profile picture upload functionality
2. Click on profile cards to view full profile
3. Direct messaging from directory
4. Advanced filtering (by graduation year, skills, etc.)
5. Profile completeness indicator
6. Export profile as PDF
7. Share profile link
8. Profile analytics (views, connections)

## Troubleshooting

### Profile Not Loading
- Check if user role is set in localStorage
- Verify JWT token is valid
- Check backend API is running
- Check network tab for API errors

### Save Not Working
- Verify all required fields are filled
- Check JWT token is valid
- Check backend validation rules
- Review error messages in console

### Directory Empty
- Check if profiles exist in database
- Verify API endpoints are correct
- Check if profiles are marked as public
- Review network requests in DevTools
