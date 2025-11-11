import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogOut, Users, Calendar, Briefcase, Heart, MessageCircle, Bell, UserCircle, Home, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Role-based navigation items
  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/alumni', label: 'Alumni', icon: Users },
      { path: '/events', label: 'Events', icon: Calendar },
      { path: '/jobs', label: 'Jobs', icon: Briefcase },
    ];

    const commonItems = [
      { path: '/chats', label: 'Chats', icon: MessageCircle },
      { path: '/announcements', label: 'Announcements', icon: Bell },
      { path: '/profile', label: 'Profile', icon: UserCircle },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          { path: '/mentorship', label: 'Mentorship', icon: UserCircle },
          ...commonItems,
        ];
      case 'alumni':
        return [
          ...baseItems,
          { path: '/donations', label: 'Donations', icon: Heart },
          { path: '/mentorship', label: 'Mentorship', icon: UserCircle },
          ...commonItems,
        ];
      case 'recruiter':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/alumni', label: 'Candidates', icon: Users },
          { path: '/events', label: 'Events', icon: Calendar },
          { path: '/jobs', label: 'Job Postings', icon: Briefcase },
          ...commonItems,
        ];
      case 'admin':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/alumni', label: 'Users', icon: Users },
          { path: '/events', label: 'Events', icon: Calendar },
          { path: '/jobs', label: 'Jobs', icon: Briefcase },
          { path: '/donations', label: 'Donations', icon: Heart },
          { path: '/mentorship', label: 'Mentorship', icon: UserCircle },
          ...commonItems,
        ];
      default:
        return [
          ...baseItems,
          { path: '/donations', label: 'Donations', icon: Heart },
          { path: '/mentorship', label: 'Mentorship', icon: UserCircle },
          ...commonItems,
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl sm:text-2xl font-bold text-black" onClick={closeMobileMenu}>
                GRAD<span className="text-[#90EE90]">connect</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-4 xl:space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={`flex items-center justify-center w-10 h-10 xl:w-12 xl:h-12 rounded-md transition-colors ${
                      isActive
                        ? 'bg-[#90EE90] text-black'
                        : 'text-black hover:bg-[#ADD8E6] hover:text-black'
                    }`}
                  >
                    <Icon size={20} className="xl:w-[24px] xl:h-[24px]" />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <span className="text-black text-sm xl:text-base truncate max-w-32 xl:max-w-48">
                {user?.full_name}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center justify-center w-10 h-10 xl:w-12 xl:h-12 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                <LogOut size={20} className="xl:w-[24px] xl:h-[24px]" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <span className="text-black text-sm sm:text-base truncate max-w-24 sm:max-w-32">
                {user?.full_name?.split(' ')[0]}
              </span>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-black hover:bg-[#ADD8E6] transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="py-3">
                <div className="grid grid-cols-4 gap-4 px-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        title={item.label}
                        className={`flex items-center justify-center w-12 h-12 rounded-md transition-colors ${
                          isActive
                            ? 'bg-[#90EE90] text-black'
                            : 'text-black hover:bg-[#ADD8E6]'
                        }`}
                      >
                        <Icon size={20} />
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <span className="text-black text-sm truncate max-w-48">
                      {user?.full_name}
                    </span>
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      className="flex items-center justify-center w-10 h-10 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm sm:text-base">&copy; 2024 GRADconnect. All rights reserved.</p>
            <p className="mt-2">
              <Link to="/contact" className="text-[#90EE90] hover:underline text-sm sm:text-base">
                Contact Us
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;