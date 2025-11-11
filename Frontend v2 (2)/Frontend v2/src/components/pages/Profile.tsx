import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Edit, Camera, Save, Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  graduation_year?: number;
  branch?: string;
  current_position?: string;
  company?: string;
  location?: string;
  bio?: string;
  phone?: string;
  linkedin?: string;
  avatar_url?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    graduation_year: '',
    branch: '',
    current_position: '',
    company: '',
    location: '',
    bio: '',
    phone: '',
    linkedin: '',
  });

  const branches = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Finance',
    'Marketing',
    'Psychology',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Since we don't have a dedicated profile endpoint, we'll use the user data
      // and simulate additional profile fields
      if (user) {
        const mockProfile: UserProfile = {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          // These would come from a real profile endpoint
          graduation_year: 2020,
          branch: 'Computer Science',
          current_position: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          bio: 'Passionate software engineer with expertise in web development.',
          phone: '+1 (555) 123-4567',
          linkedin: 'linkedin.com/in/johndoe',
        };
        setProfile(mockProfile);
        setFormData({
          full_name: mockProfile.full_name,
          email: mockProfile.email,
          graduation_year: mockProfile.graduation_year?.toString() || '',
          branch: mockProfile.branch || '',
          current_position: mockProfile.current_position || '',
          company: mockProfile.company || '',
          location: mockProfile.location || '',
          bio: mockProfile.bio || '',
          phone: mockProfile.phone || '',
          linkedin: mockProfile.linkedin || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, this would call a profile update endpoint
      const updatedProfile = {
        ...profile,
        ...formData,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : undefined,
      };
      
      setProfile(updatedProfile as UserProfile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // In a real app, you would upload to the /upload/ endpoint
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Mock upload - in reality this would call the backend upload endpoint
        alert('Avatar upload would be processed here. Feature coming soon!');
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name || typeof name !== 'string') return '';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">My Profile</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-[#90EE90] hover:bg-[#7FDD7F]'}
        >
          {isEditing ? (
            <>
              <Save size={20} className="mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit size={20} className="mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto w-32 h-32 mb-4">
              <Avatar className="w-full h-full">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback className="text-2xl bg-[#ADD8E6] text-black">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#90EE90] rounded-full p-2 cursor-pointer hover:bg-[#7FDD7F] transition-colors">
                  <Camera size={16} className="text-black" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.current_position && (
                <div className="flex items-center space-x-2">
                  <Briefcase size={16} className="text-gray-500" />
                  <span className="text-sm">
                    {profile.current_position}
                    {profile.company && ` at ${profile.company}`}
                  </span>
                </div>
              )}
              {profile.graduation_year && profile.branch && (
                <div className="flex items-center space-x-2">
                  <GraduationCap size={16} className="text-gray-500" />
                  <span className="text-sm">
                    {profile.branch}, Class of {profile.graduation_year}
                  </span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="professional">Professional Info</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                      Save Changes
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Full Name</Label>
                        <p className="font-medium">{profile.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Email</Label>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Phone</Label>
                        <p className="font-medium">{profile.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Location</Label>
                        <p className="font-medium">{profile.location || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Bio</Label>
                      <p className="font-medium">{profile.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="graduation_year">Graduation Year</Label>
                        <Select value={formData.graduation_year} onValueChange={(value) => setFormData({ ...formData, graduation_year: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch} value={branch}>
                                {branch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_position">Current Position</Label>
                        <Input
                          id="current_position"
                          value={formData.current_position}
                          onChange={(e) => setFormData({ ...formData, current_position: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                    <Button type="submit" className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                      Save Changes
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Graduation Year</Label>
                        <p className="font-medium">{profile.graduation_year || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Branch</Label>
                        <p className="font-medium">{profile.branch || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Current Position</Label>
                        <p className="font-medium">{profile.current_position || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Company</Label>
                        <p className="font-medium">{profile.company || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">LinkedIn</Label>
                      <p className="font-medium">
                        {profile.linkedin ? (
                          <a 
                            href={`https://${profile.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#90EE90] hover:underline"
                          >
                            {profile.linkedin}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Privacy Settings</h4>
              <p className="text-sm text-gray-600">
                Control who can see your profile information and contact you.
              </p>
              <Button variant="outline" size="sm">
                Manage Privacy
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Notification Preferences</h4>
              <p className="text-sm text-gray-600">
                Choose what notifications you want to receive via email.
              </p>
              <Button variant="outline" size="sm">
                Notification Settings
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Security</h4>
              <p className="text-sm text-gray-600">
                Update your password and enable two-factor authentication.
              </p>
              <Button variant="outline" size="sm">
                Security Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;