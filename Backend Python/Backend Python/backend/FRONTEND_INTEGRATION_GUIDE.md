# Frontend Integration Guide - Profile Page

This guide shows how to connect your React frontend to the backend API for the profile page with proper data persistence.

---

## 🔧 Setup

### 1. Install Required Dependencies

```bash
npm install axios
# or
yarn add axios
```

---

## 📁 Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance with interceptors
│   └── alumniApi.js      # Alumni API functions
├── components/
│   └── ProfilePage.jsx   # Profile page component
├── context/
│   └── AuthContext.jsx   # Authentication context
└── utils/
    └── storage.js        # Local storage utilities
```

---

## 1️⃣ Create Axios Instance with Auth Interceptor

**File: `src/api/axios.js`**

```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 2️⃣ Create Alumni API Functions

**File: `src/api/alumniApi.js`**

```javascript
import api from './axios';

export const alumniApi = {
  // Get all alumni
  getAllAlumni: async () => {
    const response = await api.get('/alumni/');
    return response.data;
  },

  // Get alumni by ID
  getAlumniById: async (id) => {
    const response = await api.get(`/alumni/${id}`);
    return response.data;
  },

  // Get alumni by user ID
  getAlumniByUserId: async (userId) => {
    const response = await api.get(`/alumni/`);
    const alumni = response.data.find(a => a.user_id === userId);
    return alumni;
  },

  // Create alumni profile
  createAlumni: async (data) => {
    const response = await api.post('/alumni/', data);
    return response.data;
  },

  // Update alumni profile
  updateAlumni: async (id, data) => {
    const response = await api.put(`/alumni/${id}`, data);
    return response.data;
  },

  // Delete alumni profile
  deleteAlumni: async (id) => {
    await api.delete(`/alumni/${id}`);
  },
};
```

---

## 3️⃣ Create Authentication Context

**File: `src/context/AuthContext.jsx`**

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // Get user info (you might need to decode JWT or call a /me endpoint)
      const userInfo = { email }; // Add more user info as needed
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 4️⃣ Create Profile Page Component

**File: `src/components/ProfilePage.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { alumniApi } from '../api/alumniApi';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    location: '',
    department: '',
    graduation_year: '',
    current_position: '',
    current_company: '',
    avatar_url: '',
    achievements: [],
    social_links: {},
    is_mentor: false,
    mentorship_areas: [],
    is_public: true,
  });

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's alumni profile
      const userId = user?.id; // Adjust based on your user object structure
      const alumniProfile = await alumniApi.getAlumniByUserId(userId);
      
      if (alumniProfile) {
        setProfile(alumniProfile);
        setFormData({
          name: alumniProfile.name || '',
          phone: alumniProfile.phone || '',
          bio: alumniProfile.bio || '',
          location: alumniProfile.location || '',
          department: alumniProfile.department || '',
          graduation_year: alumniProfile.graduation_year || '',
          current_position: alumniProfile.current_position || '',
          current_company: alumniProfile.current_company || '',
          avatar_url: alumniProfile.avatar_url || '',
          achievements: alumniProfile.achievements || [],
          social_links: alumniProfile.social_links || {},
          is_mentor: alumniProfile.is_mentor || false,
          mentorship_areas: alumniProfile.mentorship_areas || [],
          is_public: alumniProfile.is_public ?? true,
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayChange = (field, value) => {
    // Convert comma-separated string to array
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      let updatedProfile;
      
      if (profile?.id) {
        // Update existing profile
        updatedProfile = await alumniApi.updateAlumni(profile.id, formData);
        setSuccessMessage('Profile updated successfully!');
      } else {
        // Create new profile
        const userId = user?.id;
        updatedProfile = await alumniApi.createAlumni({
          ...formData,
          user_id: userId,
        });
        setSuccessMessage('Profile created successfully!');
      }
      
      // Update local state with saved data
      setProfile(updatedProfile);
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.detail || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current profile data
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        department: profile.department || '',
        graduation_year: profile.graduation_year || '',
        current_position: profile.current_position || '',
        current_company: profile.current_company || '',
        avatar_url: profile.avatar_url || '',
        achievements: profile.achievements || [],
        social_links: profile.social_links || {},
        is_mentor: profile.is_mentor || false,
        mentorship_areas: profile.mentorship_areas || [],
        is_public: profile.is_public ?? true,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Alumni Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Graduation Year *</label>
                <input
                  type="text"
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Position</label>
                <input
                  type="text"
                  name="current_position"
                  value={formData.current_position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Company</label>
                <input
                  type="text"
                  name="current_company"
                  value={formData.current_company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Achievements (comma-separated)
              </label>
              <input
                type="text"
                value={formData.achievements.join(', ')}
                onChange={(e) => handleArrayChange('achievements', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Published papers, Won awards, etc."
              />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium mb-2">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={formData.social_links.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  value={formData.social_links.github || ''}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  placeholder="GitHub URL"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  value={formData.social_links.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="Twitter URL"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mentorship */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_mentor"
                  checked={formData.is_mentor}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Available as Mentor</label>
              </div>

              {formData.is_mentor && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mentorship Areas (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.mentorship_areas.join(', ')}
                    onChange={(e) => handleArrayChange('mentorship_areas', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Web Development, Career Guidance, etc."
                  />
                </div>
              )}
            </div>

            {/* Privacy */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Make profile public</label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // View Mode
          <div className="space-y-6">
            {profile ? (
              <>
                {formData.avatar_url && (
                  <div className="flex justify-center">
                    <img
                      src={formData.avatar_url}
                      alt={formData.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{formData.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">{formData.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Graduation Year</p>
                    <p className="font-semibold">{formData.graduation_year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Position</p>
                    <p className="font-semibold">{formData.current_position || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Company</p>
                    <p className="font-semibold">{formData.current_company || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{formData.location || 'N/A'}</p>
                  </div>
                </div>

                {formData.bio && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Bio</p>
                    <p className="text-gray-800">{formData.bio}</p>
                  </div>
                )}

                {formData.achievements.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Achievements</p>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-800">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Object.keys(formData.social_links).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Social Links</p>
                    <div className="flex gap-4">
                      {Object.entries(formData.social_links).map(([platform, url]) => (
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline capitalize"
                          >
                            {platform}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {formData.is_mentor && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mentorship Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.mentorship_areas.map((area, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No profile found</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
```

---

## 5️⃣ Wrap Your App with AuthProvider

**File: `src/App.jsx`**

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage'; // You'll need to create this

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Add more routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

## 🔑 Key Features Implemented

### ✅ Data Persistence
- Profile data is fetched from backend on page load
- Changes are saved to the database via API
- Data persists after page reload

### ✅ State Management
- Local state for form data
- Separate edit/view modes
- Loading and error states

### ✅ Authentication
- JWT token stored in localStorage
- Automatic token injection in API requests
- Token expiration handling

### ✅ User Experience
- Loading indicators
- Success/error messages
- Form validation
- Cancel functionality that resets form

---

## 🧪 Testing the Integration

1. **Start your backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Start your frontend:**
   ```bash
   npm start
   ```

3. **Test flow:**
   - Login with your credentials
   - Navigate to profile page
   - Edit profile and save
   - Reload the page - data should persist
   - Check browser DevTools Network tab to see API calls

---

## 🐛 Common Issues & Solutions

### Issue: CORS errors
**Solution:** Ensure CORS is enabled in your backend (already configured in your `main.py`)

### Issue: 401 Unauthorized
**Solution:** Check that JWT token is being sent in Authorization header

### Issue: Data not persisting
**Solution:** Verify that:
- API calls are successful (check Network tab)
- Backend is saving to database
- Profile ID is correctly used in update calls

### Issue: Profile not loading
**Solution:** Ensure user ID is correctly extracted from auth context

---

## 📝 Next Steps

1. **Add file upload for avatar:**
   ```javascript
   const handleAvatarUpload = async (file) => {
     const formData = new FormData();
     formData.append('file', file);
     const response = await api.post('/uploads/avatar', formData, {
       headers: { 'Content-Type': 'multipart/form-data' }
     });
     return response.data.url;
   };
   ```

2. **Add form validation:**
   - Use libraries like `react-hook-form` or `formik`
   - Add client-side validation before API calls

3. **Add loading skeletons:**
   - Better UX during data loading

4. **Add optimistic updates:**
   - Update UI immediately, rollback on error

---

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [React Context API](https://react.dev/reference/react/useContext)
- [JWT Best Practices](https://jwt.io/introduction)

---

*Last Updated: October 30, 2025*
