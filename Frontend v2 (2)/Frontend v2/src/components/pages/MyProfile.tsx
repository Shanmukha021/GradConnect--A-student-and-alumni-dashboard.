import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { Edit, Eye, Briefcase, GraduationCap, MapPin, Mail, Phone, Linkedin, Github, Twitter } from 'lucide-react';
import AlumniProfileForm from './AlumniProfileForm';
import StudentProfileForm from './StudentProfileForm';
import { AlumniProfile, StudentProfile } from '../../types/profile';

const MyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'alumni' | 'student' | null>(null);
  const [alumniData, setAlumniData] = useState<AlumniProfile | null>(null);
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user role from localStorage
      const role = localStorage.getItem('role') as 'alumni' | 'student' | null;
      setUserRole(role);

      if (!role) {
        setError('User role not found. Please log in again.');
        return;
      }

      // Fetch profile based on role
      const endpoint = role === 'alumni' ? '/profiles/me/alumni' : '/profiles/me/student';
      const response = await api.get(endpoint);
      
      if (role === 'alumni') {
        setAlumniData(response.data);
      } else {
        setStudentData(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.detail || 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const endpoint = userRole === 'alumni' ? '/profiles/me/alumni' : '/profiles/me/student';
      const data = userRole === 'alumni' ? alumniData : studentData;

      await api.put(endpoint, data);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      await fetchProfile();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userRole || (!alumniData && !studentData)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found. Please complete your profile setup.</p>
      </div>
    );
  }

  const profile = userRole === 'alumni' ? alumniData! : studentData!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">My Profile</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-[#90EE90] hover:bg-[#7FDD7F]'}
        >
          {isEditing ? (
            <>
              <Eye size={20} className="mr-2" />
              View Mode
            </>
          ) : (
            <>
              <Edit size={20} className="mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        /* Edit Mode */
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            {userRole === 'alumni' && alumniData ? (
              <AlumniProfileForm
                formData={alumniData}
                onChange={setAlumniData}
                onSubmit={handleSubmit}
                isLoading={saving}
              />
            ) : studentData ? (
              <StudentProfileForm
                formData={studentData}
                onChange={setStudentData}
                onSubmit={handleSubmit}
                isLoading={saving}
              />
            ) : null}
          </CardContent>
        </Card>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-32 h-32 mb-4">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-[#ADD8E6] text-black">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="capitalize">{userRole}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone size={16} className="text-gray-500" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <GraduationCap size={16} className="text-gray-500" />
                <span>{profile.department}</span>
              </div>
              {userRole === 'alumni' && 'current_position' in profile && profile.current_position && (
                <div className="flex items-center space-x-2 text-sm">
                  <Briefcase size={16} className="text-gray-500" />
                  <span>
                    {profile.current_position}
                    {profile.current_company && ` at ${profile.current_company}`}
                  </span>
                </div>
              )}
              
              {/* Social Links */}
              {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">Social Links</p>
                  <div className="flex space-x-3">
                    {profile.social_links.linkedin && (
                      <a
                        href={`https://${profile.social_links.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#90EE90] hover:text-[#7FDD7F]"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {profile.social_links.github && (
                      <a
                        href={`https://${profile.social_links.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#90EE90] hover:text-[#7FDD7F]"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {profile.social_links.twitter && (
                      <a
                        href={`https://${profile.social_links.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#90EE90] hover:text-[#7FDD7F]"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bio */}
              {profile.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}

              {/* Alumni-specific fields */}
              {userRole === 'alumni' && 'graduation_year' in profile && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Graduation Year</h3>
                      <p className="text-gray-700">{profile.graduation_year}</p>
                    </div>
                    {profile.is_mentor && (
                      <div>
                        <h3 className="font-semibold mb-2">Mentor Status</h3>
                        <p className="text-green-600">Available as Mentor</p>
                      </div>
                    )}
                  </div>

                  {profile.achievements && profile.achievements.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Achievements</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {profile.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {profile.is_mentor && profile.mentorship_areas && profile.mentorship_areas.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Mentorship Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentorship_areas.map((area, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#ADD8E6] text-black rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Student-specific fields */}
              {userRole === 'student' && 'current_year' in profile && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Current Year</h3>
                      <p className="text-gray-700">{profile.current_year}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Enrollment Year</h3>
                      <p className="text-gray-700">{profile.enrollment_year}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Expected Graduation</h3>
                      <p className="text-gray-700">{profile.expected_graduation_year}</p>
                    </div>
                  </div>

                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#90EE90] text-black rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#ADD8E6] text-black rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.projects && profile.projects.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Projects</h3>
                      <div className="space-y-3">
                        {profile.projects.map((project, idx) => (
                          <div key={idx} className="border rounded-lg p-3">
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#90EE90] hover:underline mt-1 inline-block"
                              >
                                View Project →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.looking_for_mentorship && profile.mentorship_interests && profile.mentorship_interests.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Looking for Mentorship In</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentorship_interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
