import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar, Clock, MapPin, Plus, Users } from 'lucide-react';

type Event = {
  id: number;
  title: string;
  description?: string;
  type: string;
  start_date: string;
  end_date?: string;
  location: string;
  max_attendees?: number;
  image_url?: string;
  organizer_id?: string;
  is_public?: boolean;
  requires_approval?: boolean;
  created_at?: string;
};

type NewEventType = {
  title: string;
  type: string;
  start_date: string;
  location: string;
  description?: string;
  end_date?: string;
  max_attendees?: number;
  image_url?: string;
  organizer_id?: string;
  is_public: boolean;
  requires_approval: boolean;
};

const Events: React.FC = () => {
  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${eventId}/`);
      setEvents(events.filter(event => event.id !== eventId));
      alert('Event deleted successfully.');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event.');
    }
  };
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEventType>({
    title: '',
    type: '',
    start_date: '',
    location: '',
    description: '',
    end_date: '',
    max_attendees: undefined,
    image_url: '',
    organizer_id: '',
    is_public: true,
    requires_approval: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: newEvent.title,
        type: newEvent.type,
        start_date: newEvent.start_date,
        location: newEvent.location,
        description: newEvent.description,
        end_date: newEvent.end_date || undefined,
        max_attendees: newEvent.max_attendees || undefined,
        image_url: newEvent.image_url || undefined,
        organizer_id: newEvent.organizer_id || undefined,
        is_public: newEvent.is_public,
        requires_approval: newEvent.requires_approval,
      };
      await api.post('/events/', payload);
      setNewEvent({
        title: '',
        type: '',
        start_date: '',
        location: '',
        description: '',
        end_date: '',
        max_attendees: undefined,
        image_url: '',
        organizer_id: '',
        is_public: true,
        requires_approval: false,
      });
      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleJoinEvent = async (eventId: number) => {
    try {
      await api.post('/event_attendees/', {
        event_id: eventId,
      });
      alert('Successfully joined the event!');
    } catch (error) {
      console.error('Failed to join event:', error);
      alert('Failed to join event. You may already be registered.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => isUpcoming(event.start_date));
  const pastEvents = events.filter(event => !isUpcoming(event.start_date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Events</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
              <Plus size={20} className="mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Create a new event for the alumni community.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select type</option>
                      <option value="reunion">Reunion</option>
                      <option value="networking">Networking</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                    </select>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                  <Label htmlFor="start_date">Start Date & Time</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={newEvent.start_date}
                    onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                    required
                  />
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={newEvent.end_date}
                    onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                  />
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    required
                  />
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={newEvent.max_attendees || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, max_attendees: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={newEvent.image_url}
                    onChange={(e) => setNewEvent({ ...newEvent, image_url: e.target.value })}
                  />
                  <Label htmlFor="organizer_id">Organizer ID</Label>
                  <Input
                    id="organizer_id"
                    value={newEvent.organizer_id}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer_id: e.target.value })}
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newEvent.is_public}
                        onChange={(e) => setNewEvent({ ...newEvent, is_public: e.target.checked })}
                      />
                      <span className="ml-2">Public Event</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newEvent.requires_approval}
                        onChange={(e) => setNewEvent({ ...newEvent, requires_approval: e.target.checked })}
                      />
                      <span className="ml-2">Requires Approval</span>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                  Create Event
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-[#90EE90]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{formatDate(event.start_date)}</span>
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-200 hover:bg-red-300 text-black h-8 px-3"
                  >
                    Delete
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{formatTime(event.start_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleJoinEvent(event.id)}
                        className="w-full bg-[#ADD8E6] hover:bg-[#9BC9E6] text-black"
                      >
                        <Users size={16} className="mr-2" />
                        Join Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No upcoming events at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-black mb-4">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75 border-l-4 border-l-gray-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{formatDate(event.start_date)}</span>
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-200 hover:bg-red-300 text-black h-8 px-3"
                  >
                    Delete
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{formatTime(event.start_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-center text-sm text-gray-500 py-2">
                        Event Completed
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;