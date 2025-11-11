import React from 'react';
import { useAuth } from '../AuthContext';
import StudentDashboard from './StudentDashboard';
import AlumniDashboard from './AlumniDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Show welcome message and route to appropriate dashboard
  if (!user) {
    return <div>Loading...</div>;
  }

  const welcome = (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Welcome Back {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </h2>
    </div>
  );

  let dashboard;
  switch (user.role) {
    case 'student':
      dashboard = <StudentDashboard />;
      break;
    case 'alumni':
      dashboard = <AlumniDashboard />;
      break;
    case 'recruiter':
      dashboard = <RecruiterDashboard />;
      break;
    case 'admin':
      dashboard = <AdminDashboard />;
      break;
    default:
      dashboard = <AdminDashboard />;
  }

  return (
    <>
      {welcome}
      {dashboard}
    </>
  );

};

export default Dashboard;