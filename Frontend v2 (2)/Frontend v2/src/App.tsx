import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LinkedInAuthHandler from './components/pages/LinkedInAuthHandler';
import Dashboard from './components/pages/Dashboard';
import Alumni from './components/pages/Alumni';
import Events from './components/pages/Events';
import Jobs from './components/pages/Jobs';
import Donations from './components/pages/Donations';
import Announcements from './components/pages/Announcements';
import Mentorship from './components/pages/Mentorship';
import Chats from './components/pages/Chats';
import Profile from './components/pages/Profile';
import MyProfile from './components/pages/MyProfile';
import Directory from './components/pages/Directory';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/linkedin-auth-handler" element={<LinkedInAuthHandler />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="alumni" element={<Alumni />} />
              <Route path="events" element={<Events />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="donations" element={<Donations />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="mentorship" element={<Mentorship />} />
              <Route path="chats" element={<Chats />} />
              <Route path="profile" element={<Profile />} />
              <Route path="my-profile" element={<MyProfile />} />
              <Route path="directory" element={<Directory />} />
            </Route>
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;