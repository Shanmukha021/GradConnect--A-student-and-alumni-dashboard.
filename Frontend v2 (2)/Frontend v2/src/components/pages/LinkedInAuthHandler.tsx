import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkedInAuthHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const role = params.get('role');
    const user = params.get('user');
    if (accessToken) {
      localStorage.setItem('authToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (role) localStorage.setItem('role', role);
      if (user) localStorage.setItem('user', user);
      // Redirect to dashboard based on role
      if (role === 'student') navigate('/student-dashboard');
      else if (role === 'alumni') navigate('/alumni-dashboard');
      else navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Authenticating with LinkedIn...</div>;
};

export default LinkedInAuthHandler;
