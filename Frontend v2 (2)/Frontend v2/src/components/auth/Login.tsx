import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      // Use user from AuthContext for role-based redirect
      if (user && user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user && user.role === 'alumni') {
        navigate('/alumni-dashboard');
      } else if (user && user.role === 'student') {
        navigate('/student-dashboard');
      } else if (user && user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error?.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInLogin = () => {
    // Save role in localStorage for callback
    localStorage.setItem('login_role', role);
    window.location.href = `http://localhost:8000/api/auth/linkedin/login?role=${role}`;
  };

  useEffect(() => {
    // Check for LinkedIn callback code in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
        if (code && state) {
          setIsLoading(true);
          axios.post('http://localhost:8000/api/auth/linkedin/callback', { code, state })
            .then(async (res) => {
              // Save access token from callback response
              localStorage.setItem('token', res.data.access_token);
              // Remove code and state from URL after success
              window.history.replaceState({}, document.title, window.location.pathname);
              // Get user info
              const userRes = await axios.get('http://localhost:8000/api/auth/me', {
                headers: { Authorization: `Bearer ${res.data.access_token}` },
              });
              const user = userRes.data;
              if (user.role === 'admin') {
                navigate('/admin-dashboard');
              } else if (user.role === 'alumni') {
                navigate('/alumni-dashboard');
              } else if (user.role === 'student') {
                navigate('/student-dashboard');
              } else if (user.role === 'recruiter') {
                navigate('/recruiter-dashboard');
              } else {
                navigate('/dashboard');
              }
            })
            .catch((err) => {
              setError('LinkedIn login failed.');
            })
            .finally(() => setIsLoading(false));
        }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-black">
            GRAD<span className="text-[#90EE90]">connect</span>
          </CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
            {(role === 'admin' || role === 'recruiter' || role === 'student' || role === 'alumni') ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#90EE90] text-black" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <Button
                type="button"
                onClick={handleLinkedInLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-black flex items-center justify-center gap-3"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" style={{ height: 32, width: 32, background: 'white', borderRadius: 4 }} />
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{isLoading ? 'Redirecting...' : 'Continue with LinkedIn'}</span>
              </Button>
            )}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#90EE90] hover:underline">
                  Register
                </Link>
              </p>
            </div>
              {/* User list hidden as requested */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;