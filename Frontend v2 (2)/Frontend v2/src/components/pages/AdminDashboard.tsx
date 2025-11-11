import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, Briefcase, Heart, MessageCircle, Bell, Settings, BarChart3, Shield, Database } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickNavCards = [
    {
      title: 'User Management',
      description: 'Manage all users',
      icon: Users,
      path: '/alumni',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Events',
      description: 'Manage events',
      icon: Calendar,
      path: '/events',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'Job Board',
      description: 'Oversee job postings',
      icon: Briefcase,
      path: '/jobs',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Donations',
      description: 'Track donations',
      icon: Heart,
      path: '/donations',
      color: 'bg-[#ADD8E6]',
    },
    {
      title: 'System Messages',
      description: 'Monitor communications',
      icon: MessageCircle,
      path: '/chats',
      color: 'bg-[#90EE90]',
    },
    {
      title: 'Announcements',
      description: 'Manage announcements',
      icon: Bell,
      path: '/announcements',
      color: 'bg-[#ADD8E6]',
    },
  ];

  const [stats, setStats] = useState({
    totalUsers: 0,
    alumni: 0,
    students: 0,
    recruiters: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users from DB
        const usersRes = await api.get('/users/');
        const users = usersRes.data;
        // Count by role
        const alumni = users.filter((u: any) => u.role === 'alumni').length;
        const students = users.filter((u: any) => u.role === 'student').length;
        const recruiters = users.filter((u: any) => u.role === 'recruiter').length;
        setStats({
          totalUsers: users.length,
          alumni,
          students,
          recruiters,
          loading: false,
        });
      } catch (err) {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  const recentActivity = [
    { type: 'user', message: '15 new user registrations this week', time: '2 hours ago' },
    { type: 'event', message: 'Career Fair 2024 registration opened', time: '5 hours ago' },
    { type: 'job', message: '8 new job postings approved', time: '1 day ago' },
    { type: 'donation', message: '$5,000 in donations this month', time: '2 days ago' },
  ];

  const pendingActions = [
    { type: 'User Verification', count: 12, priority: 'high' },
    { type: 'Job Post Approval', count: 8, priority: 'medium' },
    { type: 'Event Approval', count: 3, priority: 'low' },
    { type: 'Donation Processing', count: 15, priority: 'high' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Welcome {user?.full_name}. Monitor system health, manage users, and oversee platform operations.
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-[#90EE90]">
                {stats.loading ? '...' : stats.totalUsers}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-600">Active Alumni</p>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-[#ADD8E6]">
                {stats.loading ? '...' : stats.alumni}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-600">Current Students</p>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-[#90EE90]">
                {stats.loading ? '...' : stats.students}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-600">Recruiters</p>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-[#ADD8E6]">
                {stats.loading ? '...' : stats.recruiters}
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* If you have real backend data for these sections, re-add them here. */}
    </div>
  );
};

export default AdminDashboard;