import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, Briefcase, MessageCircle, Bell, UserCircle, Building, Target } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickNavCards = [
    {
      title: 'Alumni Network',
      description: 'Find qualified candidates',
      icon: Users,
      path: '/alumni',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Career Events',
      description: 'Host recruiting events',
      icon: Calendar,
      path: '/events',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'Job Postings',
      description: 'Manage job listings',
      icon: Briefcase,
      path: '/jobs',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Messages',
      description: 'Connect with candidates',
      icon: MessageCircle,
      path: '/chats',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'Announcements',
      description: 'Company updates',
      icon: Bell,
      path: '/announcements',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Profile',
      description: 'Company profile',
      icon: Building,
      path: '/profile',
      color: 'bg-[#ADD8E6]',
    },
  ];

  const activeJobPostings = [
    { title: 'Senior Software Engineer', applications: 24, posted: '2024-01-15', status: 'Active' },
    { title: 'Product Manager', applications: 18, posted: '2024-01-20', status: 'Active' },
    { title: 'UX Designer', applications: 12, posted: '2024-01-25', status: 'Active' },
  ];

  const upcomingEvents = [
    { title: 'Tech Career Fair', date: '2024-02-15', type: 'Career Fair' },
    { title: 'Company Info Session', date: '2024-02-20', type: 'Info Session' },
    { title: 'Alumni Networking', date: '2024-02-25', type: 'Networking' },
  ];

  const recentActivities = [
    'Welcome to GRADconnect! Set up your company profile.',
    'New applications received for your Software Engineer position.',
    'Alumni from Computer Science are actively job searching.',
    'Your company info session has 25 RSVPs.',
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
          Welcome, {user?.full_name}!
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Your recruiter dashboard to connect with talented alumni and manage your hiring pipeline.
        </p>
      </div>

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
        {/* Active Job Postings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase size={20} />
              <span>Active Job Postings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeJobPostings.map((job, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">{job.title}</p>
                    <span className="text-xs bg-[#90EE90] text-black px-2 py-1 rounded">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">{job.applications} applications</p>
                    <p className="text-xs text-[#ADD8E6]">{job.posted}</p>
                  </div>
                </div>
              ))}
              <Link to="/jobs" className="block text-center text-sm text-[#90EE90] hover:underline">
                Manage all postings
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
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-gray-600">{event.type}</p>
                  </div>
                  <div className="text-xs text-[#90EE90] font-medium">
                    {event.date}
                  </div>
                </div>
              ))}
              <Link to="/events" className="block text-center text-sm text-[#90EE90] hover:underline">
                View all events
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target size={20} />
              <span>Recruitment Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#90EE90]">54</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ADD8E6]">12</div>
                <div className="text-sm text-gray-600">Interviews Scheduled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#90EE90]">3</div>
                <div className="text-sm text-gray-600">Active Job Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ADD8E6]">125</div>
                <div className="text-sm text-gray-600">Profile Views</div>
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

export default RecruiterDashboard;