import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, Briefcase, MessageCircle, Bell, UserCircle, GraduationCap, BookOpen } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickNavCards = [
    {
      title: 'Alumni Network',
      description: 'Connect with graduates',
      icon: Users,
      path: '/alumni',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Career Events',
      description: 'Attend networking events',
      icon: Calendar,
      path: '/events',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'Job Opportunities',
      description: 'Find internships & jobs',
      icon: Briefcase,
      path: '/jobs',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Find Mentors',
      description: 'Get career guidance',
      icon: GraduationCap,
      path: '/mentorship',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'Messages',
      description: 'Chat with alumni',
      icon: MessageCircle,
      path: '/chats',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Announcements',
      description: 'Stay updated',
      icon: Bell,
      path: '/announcements',
      color: 'bg-[#ADD8E6]',
    },
  ];

  const upcomingDeadlines = [
    { title: 'Scholarship Application', date: '2024-02-15', type: 'Application' },
    { title: 'Career Fair Registration', date: '2024-02-20', type: 'Event' },
    { title: 'Alumni Mixer RSVP', date: '2024-02-25', type: 'Event' },
  ];

  const recentActivities = [
    'Welcome to GRADconnect! Complete your student profile.',
    'New internship opportunities posted in your field.',
    'Upcoming career workshop: Resume Building 101.',
    'Connect with alumni from your major.',
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
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{deadline.title}</p>
                    <p className="text-xs text-gray-600">{deadline.type}</p>
                  </div>
                  <div className="text-xs text-[#90EE90] font-medium">
                    {deadline.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell size={20} />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#90EE90] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen size={20} />
              <span>Your Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#90EE90]">5</div>
                <div className="text-sm text-gray-600">Alumni Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ADD8E6]">3</div>
                <div className="text-sm text-gray-600">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#90EE90]">2</div>
                <div className="text-sm text-gray-600">Job Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ADD8E6]">1</div>
                <div className="text-sm text-gray-600">Active Mentorships</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;