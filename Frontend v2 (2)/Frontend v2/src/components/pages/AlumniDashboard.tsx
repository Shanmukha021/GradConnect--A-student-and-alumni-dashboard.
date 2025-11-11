import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, Briefcase, Heart, MessageCircle, Bell, UserCircle, TrendingUp, Award } from 'lucide-react';

const AlumniDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickNavCards = [
    {
      title: 'Alumni Network',
      description: 'Connect with fellow alumni',
      icon: Users,
      path: '/alumni',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Events',
      description: 'Attend & host events',
      icon: Calendar,
      path: '/events',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'Job Board',
      description: 'Post & find opportunities',
      icon: Briefcase,
      path: '/jobs',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Give Back',
      description: 'Support your alma mater',
      icon: Heart,
      path: '/donations',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'Mentorship',
      description: 'Mentor students',
      icon: TrendingUp,
      path: '/mentorship',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Messages',
      description: 'Stay in touch',
      icon: MessageCircle,
      path: '/chats',
      color: 'bg-[#ADD8E6]',
    },
  ];

  const mentorshipRequests = [
    { name: 'Sarah Johnson', field: 'Software Engineering', date: '2024-01-20' },
    { name: 'Mike Chen', field: 'Data Science', date: '2024-01-18' },
    { name: 'Lisa Rodriguez', field: 'Marketing', date: '2024-01-15' },
  ];

  const upcomingEvents = [
    { title: 'Alumni Networking Mixer', date: '2024-02-15', location: 'Downtown Campus' },
    { title: 'Career Panel Discussion', date: '2024-02-22', location: 'Virtual' },
    { title: 'Fundraising Gala', date: '2024-03-10', location: 'Grand Hotel' },
  ];

  const recentActivities = [
    'Welcome back! Update your professional profile.',
    'New students are seeking mentors in your field.',
    'Your class reunion is coming up this year.',
    'Share your career journey with current students.',
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section Removed */}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {quickNavCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.path} to={card.path}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-gray-300">
                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${card.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={24} className="sm:w-7 sm:h-7 text-black" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm">{card.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Mentorship Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Mentorship Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mentorshipRequests.map((request, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{request.name}</p>
                    <p className="text-xs text-gray-600">{request.field}</p>
                  </div>
                  <div className="text-xs text-[#90EE90] font-medium">
                    {request.date}
                  </div>
                </div>
              ))}
              <Link to="/mentorship" className="block text-center text-sm text-[#90EE90] hover:underline">
                View all requests
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.date}</p>
                  <p className="text-xs text-[#ADD8E6]">{event.location}</p>
                </div>
              ))}
              <Link to="/events" className="block text-center text-sm text-[#90EE90] hover:underline">
                View all events
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Your Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award size={20} />
              <span>Your Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#90EE90]">12</div>
                <div className="text-sm text-gray-600">Students Mentored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ADD8E6]">8</div>
                <div className="text-sm text-gray-600">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#90EE90]">$2,500</div>
                <div className="text-sm text-gray-600">Total Donations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ADD8E6]">5</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell size={20} />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#90EE90] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">{activity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniDashboard;