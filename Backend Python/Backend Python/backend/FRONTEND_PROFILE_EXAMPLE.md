# Frontend Profile Page with Submit Button

## Complete React Component Example

### MyProfile.jsx - Profile Page with Submit Button

```jsx
import React, { useState, useEffect } from 'react';
import './MyProfile.css';

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const role = localStorage.getItem('role'); // 'alumni' or 'student'
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } else if (response.status === 404) {
        // Profile doesn't exist yet, will be created on first submit
        setIsEditing(true);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (e, fieldName) => {
    const value = e.target.value;
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [fieldName]: array });
  };

  // SUBMIT BUTTON HANDLER - This saves professional info to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = role === 'alumni' 
        ? 'http://localhost:8000/api/profiles/me/alumni'
        : 'http://localhost:8000/api/profiles/me/student';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setIsEditing(false);
        alert('✓ Professional information saved successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile && !isEditing) {
    return (
      <div className="profile-container">
        <h1>My Profile</h1>
        <p>You haven't created your profile yet.</p>
        <button onClick={() => setIsEditing(true)} className="btn-primary">
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {error && <div className="error-message">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <h2>Professional Information</h2>

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="City, State/Country"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Alumni-specific fields */}
          {role === 'alumni' && (
            <>
              <div className="form-section">
                <h3>Professional Details</h3>
                
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>Graduation Year *</label>
                  <input
                    type="text"
                    name="graduation_year"
                    value={formData.graduation_year || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2020"
                    maxLength="4"
                  />
                </div>

                <div className="form-group">
                  <label>Current Position</label>
                  <input
                    type="text"
                    name="current_position"
                    value={formData.current_position || ''}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div className="form-group">
                  <label>Current Company</label>
                  <input
                    type="text"
                    name="current_company"
                    value={formData.current_company || ''}
                    onChange={handleChange}
                    placeholder="e.g., Tech Corp"
                  />
                </div>

                <div className="form-group">
                  <label>Achievements (comma-separated)</label>
                  <textarea
                    name="achievements"
                    value={formData.achievements?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'achievements')}
                    rows="3"
                    placeholder="Award 1, Award 2, Published paper, etc."
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_mentor"
                      checked={formData.is_mentor || false}
                      onChange={handleChange}
                    />
                    Available as a mentor
                  </label>
                </div>

                {formData.is_mentor && (
                  <div className="form-group">
                    <label>Mentorship Areas (comma-separated)</label>
                    <input
                      type="text"
                      name="mentorship_areas"
                      value={formData.mentorship_areas?.join(', ') || ''}
                      onChange={(e) => handleArrayChange(e, 'mentorship_areas')}
                      placeholder="Career Guidance, Technical Skills, etc."
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Student-specific fields */}
          {role === 'student' && (
            <>
              <div className="form-section">
                <h3>Academic Details</h3>
                
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>Current Year *</label>
                  <input
                    type="text"
                    name="current_year"
                    value={formData.current_year || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 3rd Year"
                  />
                </div>

                <div className="form-group">
                  <label>Enrollment Year *</label>
                  <input
                    type="text"
                    name="enrollment_year"
                    value={formData.enrollment_year || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2022"
                    maxLength="4"
                  />
                </div>

                <div className="form-group">
                  <label>Expected Graduation Year *</label>
                  <input
                    type="text"
                    name="expected_graduation_year"
                    value={formData.expected_graduation_year || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2026"
                    maxLength="4"
                  />
                </div>

                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'skills')}
                    placeholder="Python, JavaScript, React, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Interests (comma-separated)</label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'interests')}
                    placeholder="AI, Web Development, etc."
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="looking_for_mentorship"
                      checked={formData.looking_for_mentorship || false}
                      onChange={handleChange}
                    />
                    Looking for mentorship
                  </label>
                </div>

                {formData.looking_for_mentorship && (
                  <div className="form-group">
                    <label>Mentorship Interests (comma-separated)</label>
                    <input
                      type="text"
                      name="mentorship_interests"
                      value={formData.mentorship_interests?.join(', ') || ''}
                      onChange={(e) => handleArrayChange(e, 'mentorship_interests')}
                      placeholder="Career Guidance, Technical Skills, etc."
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Social Links */}
          <div className="form-section">
            <h3>Social Links</h3>
            
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.social_links?.linkedin || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="form-group">
              <label>GitHub</label>
              <input
                type="url"
                name="github"
                value={formData.social_links?.github || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, github: e.target.value }
                })}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="form-group">
              <label>Twitter</label>
              <input
                type="url"
                name="twitter"
                value={formData.social_links?.twitter || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/yourusername"
              />
            </div>
          </div>

          {/* Privacy */}
          <div className="form-section">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public !== false}
                  onChange={handleChange}
                />
                Make my profile public (visible in directory)
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON - This saves all professional info to database */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : '✓ Save Professional Information'}
            </button>
            
            {profile && (
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        // View Mode - Display saved profile
        <div className="profile-view">
          <div className="profile-header">
            {profile.avatar_url && (
              <img src={profile.avatar_url} alt={profile.name} className="avatar" />
            )}
            <div>
              <h2>{profile.name}</h2>
              {role === 'alumni' && (
                <p className="subtitle">
                  {profile.current_position} at {profile.current_company}
                </p>
              )}
              {role === 'student' && (
                <p className="subtitle">
                  {profile.current_year} - Graduating {profile.expected_graduation_year}
                </p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3>About</h3>
            <p>{profile.bio || 'No bio provided'}</p>
          </div>

          {role === 'alumni' && (
            <>
              <div className="profile-section">
                <h3>Professional Information</h3>
                <p><strong>Department:</strong> {profile.department}</p>
                <p><strong>Graduation Year:</strong> {profile.graduation_year}</p>
                <p><strong>Location:</strong> {profile.location}</p>
                {profile.achievements && profile.achievements.length > 0 && (
                  <>
                    <strong>Achievements:</strong>
                    <ul>
                      {profile.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {profile.is_mentor && (
                <div className="profile-section">
                  <h3>Mentorship</h3>
                  <p>Available as a mentor in:</p>
                  <div className="tags">
                    {profile.mentorship_areas?.map((area, idx) => (
                      <span key={idx} className="tag">{area}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {role === 'student' && (
            <>
              <div className="profile-section">
                <h3>Academic Information</h3>
                <p><strong>Department:</strong> {profile.department}</p>
                <p><strong>Current Year:</strong> {profile.current_year}</p>
                <p><strong>Expected Graduation:</strong> {profile.expected_graduation_year}</p>
              </div>

              {profile.skills && profile.skills.length > 0 && (
                <div className="profile-section">
                  <h3>Skills</h3>
                  <div className="tags">
                    {profile.skills.map((skill, idx) => (
                      <span key={idx} className="tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <div className="profile-section">
                  <h3>Interests</h3>
                  <div className="tags">
                    {profile.interests.map((interest, idx) => (
                      <span key={idx} className="tag">{interest}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {profile.social_links && Object.keys(profile.social_links).length > 0 && (
            <div className="profile-section">
              <h3>Social Links</h3>
              <div className="social-links">
                {profile.social_links.linkedin && (
                  <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {profile.social_links.github && (
                  <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {profile.social_links.twitter && (
                  <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}

          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
```

### MyProfile.css - Styling

```css
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="tel"],
.form-group input[type="url"],
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-primary {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-submit {
  background: #28a745;
  font-weight: 600;
}

.btn-submit:hover {
  background: #218838;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #5a6268;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.profile-view {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.subtitle {
  color: #666;
  font-size: 18px;
}

.profile-section {
  margin-bottom: 25px;
}

.profile-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #495057;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.social-links a:hover {
  text-decoration: underline;
}
```

## Key Points

1. **Submit Button** is at the bottom of the form with class `btn-submit`
2. **handleSubmit** function sends PUT request to backend API
3. **Professional information is saved** to the database when submit is clicked
4. **Updated profile displays** after successful save
5. **Works for both alumni and students** - automatically uses correct endpoint based on role

The backend API endpoints I created earlier handle all the database operations when this submit button is clicked!
