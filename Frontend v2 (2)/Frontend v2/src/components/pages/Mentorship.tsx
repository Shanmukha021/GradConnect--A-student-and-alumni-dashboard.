import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UserCheck, MessageCircle, Calendar, Plus, Star, Clock } from 'lucide-react';

interface Mentor {
  id: number;
  areas?: string[];
  expertise?: string;
  experience_years?: number;
  bio?: string;
  available: boolean;
  mentor_name?: string;
  created_at: string;
}

interface MentorshipRequest {
  id: number;
  message: string;
  status: string;
  created_at: string;
  mentor_id: number;
}

interface MentorshipSession {
  id: number;
  scheduled_date: string;
  topic: string;
  status: string;
  created_at: string;
}

const Mentorship: React.FC = () => {
  const [mentorError, setMentorError] = useState<string | null>(null);
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMentorDialogOpen, setIsMentorDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);

  const [newMentor, setNewMentor] = useState({
  areas: '', // comma-separated string for input
  bio: '',
  is_active: true,
  });

  const [newRequest, setNewRequest] = useState({
    message: '',
  });

  const [newSession, setNewSession] = useState({
    scheduled_date: '',
    topic: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mentorsRes, requestsRes, sessionsRes] = await Promise.all([
        api.get('/mentors/mentors/'),
        api.get('/mentorship-requests/mentorship_requests/'),
        api.get('/mentorship-sessions/mentorship_sessions/'),
      ]);
      
      setMentors(mentorsRes.data);
      setRequests(requestsRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      console.error('Failed to fetch mentorship data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    setMentorError(null);
    if (!user || !user.id) {
      setMentorError('You must be logged in to register as a mentor.');
      return;
    }
    if (user.role !== 'alumni') {
      setMentorError('Only alumni can register as mentors.');
      return;
    }
    const areasList = newMentor.areas.split(',').map((a: string) => a.trim()).filter((a: string) => a.length > 0);
    if (areasList.length === 0) {
      setMentorError('Please enter at least one area of expertise.');
      return;
    }
    try {
      // Prepare payload according to backend schema
      const payload = {
        user_id: user.id,
        areas: areasList,
        bio: newMentor.bio,
        is_active: newMentor.is_active,
      };
      await api.post('/mentors/mentors/', payload);
      setNewMentor({ areas: '', bio: '', is_active: true });
      setIsMentorDialogOpen(false);
      fetchData();
    } catch (error: any) {
      setMentorError(error?.response?.data?.detail || error?.response?.data || 'Failed to register as mentor.');
      console.error('Failed to register as mentor:', error);
    }
  };

  const handleRequestMentorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorId) return;
    
    try {
      await api.post('/mentorship-requests/mentorship_requests/', {
        mentor_id: selectedMentorId,
        message: newRequest.message,
      });
      setNewRequest({ message: '' });
      setIsRequestDialogOpen(false);
      setSelectedMentorId(null);
      fetchData();
      alert('Mentorship request sent successfully!');
    } catch (error) {
      console.error('Failed to send mentorship request:', error);
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/mentorship-sessions/mentorship_sessions/', newSession);
      setNewSession({ scheduled_date: '', topic: '' });
      setIsSessionDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to schedule session:', error);
    }
  };

  const openRequestDialog = (mentorId: number) => {
    setSelectedMentorId(mentorId);
    setIsRequestDialogOpen(true);
  };

  const getExpertiseTags = (expertise: string) => {
    return expertise.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Mentorship Program</h1>
        <div className="flex space-x-2">
          <Dialog open={isMentorDialogOpen} onOpenChange={setIsMentorDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#ADD8E6] hover:bg-[#9BC9E6] text-black">
                <UserCheck size={20} className="mr-2" />
                Become Mentor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register as Mentor</DialogTitle>
                <DialogDescription>
                  Share your expertise and help fellow alumni grow in their careers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRegisterMentor} className="space-y-4">
                {mentorError && (
                  <div className="p-2 mb-2 bg-red-100 border border-red-300 text-red-700 rounded-md">
                    {Array.isArray(mentorError)
                      ? (
                          <ul className="list-disc pl-4">
                            {mentorError.map((err: any, idx: number) => (
                              <li key={idx}>{err.msg || JSON.stringify(err)}</li>
                            ))}
                          </ul>
                        )
                      : (typeof mentorError === 'object' && mentorError !== null)
                        ? JSON.stringify(mentorError)
                        : mentorError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise Areas</Label>
                  <Input
                    id="areas"
                    value={newMentor.areas}
                    onChange={(e) => setNewMentor({ ...newMentor, areas: e.target.value })}
                    placeholder="e.g., Software Engineering, Marketing, Finance"
                    required
                  />
                  <p className="text-xs text-gray-500">Separate multiple areas with commas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={newMentor.bio}
                    onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
                    placeholder="Tell others about your background and what you can help with..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#ADD8E6] hover:bg-[#9BC9E6] text-black">
                  Register as Mentor
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                <Calendar size={20} className="mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Mentorship Session</DialogTitle>
                <DialogDescription>
                  Schedule a mentorship session with your mentor.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleScheduleSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Date & Time</Label>
                  <Input
                    id="scheduled_date"
                    type="datetime-local"
                    value={newSession.scheduled_date}
                    onChange={(e) => setNewSession({ ...newSession, scheduled_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Session Topic</Label>
                  <Input
                    id="topic"
                    value={newSession.topic}
                    onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                    placeholder="What would you like to discuss?"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                  Schedule Session
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="mentors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user?.role === 'admin' ? mentors : mentors.filter(mentor => mentor.available))
              .map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {mentor.mentor_name || 'Anonymous Mentor'}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="text-[#90EE90]" size={16} />
                        <span className="text-sm text-gray-600">{mentor.experience_years ? `${mentor.experience_years}y exp` : ''}</span>
                      </div>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mentor.areas && Array.isArray(mentor.areas) && mentor.areas.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mentor.bio && (
                        <p className="text-sm text-gray-600">{mentor.bio}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Available since {new Date(mentor.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          onClick={() => openRequestDialog(mentor.id)}
                          size="sm"
                          className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black"
                        >
                          <MessageCircle size={14} className="mr-1" />
                          Request
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {(user?.role === 'admin' ? mentors.length === 0 : mentors.filter(mentor => mentor.available).length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <UserCheck className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No mentors available at the moment.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Consider becoming a mentor yourself!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {(user?.role === 'admin' ? requests.length > 0 : requests.length > 0) ? (
            <div className="space-y-4">
              {(user?.role === 'admin' ? requests : requests).map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Mentorship Request</CardTitle>
                      <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                        {request.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Requested on {new Date(request.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">"{request.message}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No mentorship requests yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {(user?.role === 'admin' ? sessions.length > 0 : sessions.length > 0) ? (
            <div className="space-y-4">
              {(user?.role === 'admin' ? sessions : sessions).map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{session.topic}</CardTitle>
                      <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span>
                        {new Date(session.scheduled_date).toLocaleDateString()} at{' '}
                        {new Date(session.scheduled_date).toLocaleTimeString()}
                      </span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No scheduled sessions yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Mentorship Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              Send a message to the mentor explaining what you'd like help with.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestMentorship} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newRequest.message}
                onChange={(e) => setNewRequest({ message: e.target.value })}
                placeholder="Hi, I'd like to connect with you about..."
                required
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
              Send Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mentorship;