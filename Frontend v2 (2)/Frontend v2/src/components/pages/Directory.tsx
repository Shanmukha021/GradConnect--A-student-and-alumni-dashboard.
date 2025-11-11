import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Search, MapPin, Briefcase, GraduationCap, Users, BookOpen } from 'lucide-react';
import { AlumniProfile, StudentProfile } from '../../types/profile';

const Directory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alumniProfiles, setAlumniProfiles] = useState<AlumniProfile[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both alumni and student profiles
      const [alumniResponse, studentResponse] = await Promise.all([
        api.get('/profiles/alumni').catch(() => ({ data: [] })),
        api.get('/profiles/students').catch(() => ({ data: [] })),
      ]);

      setAlumniProfiles(alumniResponse.data || []);
      setStudentProfiles(studentResponse.data || []);
    } catch (err: any) {
      console.error('Failed to fetch profiles:', err);
      setError('Failed to load directory. Please try again.');
    } finally {
      setLoading(false);
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

  const filterProfiles = <T extends AlumniProfile | StudentProfile>(profiles: T[]): T[] => {
    if (!searchQuery) return profiles;
    
    const query = searchQuery.toLowerCase();
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(query) ||
      profile.department.toLowerCase().includes(query) ||
      profile.location?.toLowerCase().includes(query) ||
      ('current_position' in profile && profile.current_position?.toLowerCase().includes(query)) ||
      ('current_company' in profile && profile.current_company?.toLowerCase().includes(query))
    );
  };

  const filteredAlumni = filterProfiles(alumniProfiles);
  const filteredStudents = filterProfiles(studentProfiles);
  const allProfiles = [...filteredAlumni, ...filteredStudents];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Directory</h1>
        <p className="text-gray-600">Connect with alumni and students</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search by name, department, location, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({allProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="alumni">
            Alumni ({filteredAlumni.length})
          </TabsTrigger>
          <TabsTrigger value="students">
            Students ({filteredStudents.length})
          </TabsTrigger>
        </TabsList>

        {/* All Profiles */}
        <TabsContent value="all" className="space-y-4">
          {allProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No profiles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlumni.map((profile) => (
                <AlumniCard key={profile.id} profile={profile} />
              ))}
              {filteredStudents.map((profile) => (
                <StudentCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Alumni Profiles */}
        <TabsContent value="alumni" className="space-y-4">
          {filteredAlumni.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No alumni profiles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlumni.map((profile) => (
                <AlumniCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Student Profiles */}
        <TabsContent value="students" className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No student profiles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((profile) => (
                <StudentCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Alumni Profile Card Component
const AlumniCard: React.FC<{ profile: AlumniProfile }> = ({ profile }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
            <AvatarFallback className="bg-[#ADD8E6] text-black">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{profile.name}</CardTitle>
            <CardDescription className="text-sm">Alumni</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {profile.current_position && (
          <div className="flex items-start space-x-2 text-sm">
            <Briefcase size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="truncate">
              {profile.current_position}
              {profile.current_company && ` at ${profile.current_company}`}
            </span>
          </div>
        )}
        <div className="flex items-start space-x-2 text-sm">
          <GraduationCap size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="truncate">
            {profile.department}, {profile.graduation_year}
          </span>
        </div>
        {profile.location && (
          <div className="flex items-start space-x-2 text-sm">
            <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
        )}
        {profile.is_mentor && (
          <div className="pt-2">
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Available as Mentor
            </span>
          </div>
        )}
        {profile.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">{profile.bio}</p>
        )}
      </CardContent>
    </Card>
  );
};

// Student Profile Card Component
const StudentCard: React.FC<{ profile: StudentProfile }> = ({ profile }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
            <AvatarFallback className="bg-[#90EE90] text-black">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{profile.name}</CardTitle>
            <CardDescription className="text-sm">Student</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start space-x-2 text-sm">
          <GraduationCap size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="truncate">
            {profile.department}, {profile.current_year}
          </span>
        </div>
        {profile.location && (
          <div className="flex items-start space-x-2 text-sm">
            <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
        )}
        {profile.skills && profile.skills.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-1">
              {profile.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="inline-block px-2 py-1 bg-[#90EE90] text-black text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{profile.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        {profile.looking_for_mentorship && (
          <div className="pt-2">
            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Looking for Mentorship
            </span>
          </div>
        )}
        {profile.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">{profile.bio}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Directory;
