import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Bell, Calendar, Plus, User } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_name?: string;
}

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setError(null);
    try {
      const response = await api.get('/announcements/');
      setAnnouncements(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      setError('Failed to fetch announcements. Please try again later.');
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/announcements/', {
        ...newAnnouncement,
        created_by: user?.id?.toString()
      });
      setNewAnnouncement({ title: '', content: '' });
      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (error) {
      setError('Failed to create announcement. Please try again later.');
      console.error('Failed to create announcement:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  
  // Show error message if fetch fails
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        <Button onClick={fetchAnnouncements}>Retry</Button>
      </div>
    );
  }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Announcements</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
              <Plus size={20} className="mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Share important news with the alumni community.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  required
                  placeholder="Write your announcement here..."
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                <Bell size={16} className="mr-2" />
                Post Announcement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {Array.isArray(announcements) && announcements.length > 0 ? (
          announcements
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-[#ADD8E6] rounded-full flex items-center justify-center mt-1">
                        <Bell className="text-black" size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{announcement.author_name || 'Admin'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{getTimeAgo(announcement.created_at)}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Posted on {formatDate(announcement.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">No announcements yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Check back later for important updates from the alumni community.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#90EE90] text-black">
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Follow our announcements to stay informed about:
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Alumni events and reunions</li>
              <li>• Career opportunities</li>
              <li>• University news and updates</li>
              <li>• Community achievements</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#ADD8E6] text-black">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Want to receive notifications for new announcements? 
              Visit your profile settings to customize your notification preferences.
            </p>
            <Button variant="outline" className="mt-3 border-black text-black hover:bg-white">
              Manage Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Announcements;