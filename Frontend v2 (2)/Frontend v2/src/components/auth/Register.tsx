import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import axios from 'axios';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Registration API call
      let payload;
      if (role === 'student') {
        payload = {
          email: `${email}@cutmap.ac.in`,
          password,
          role,
        };
      } else {
        payload = {
          email,
          password,
          role,
        };
      }
      const res = await axios.post('http://localhost:8000/api/auth/register', payload);
      if (res.data && res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        // Get user info
        const userRes = await axios.get('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
        });
        // Use userRes.data.role from backend for redirect after registration
        if (userRes.data.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (userRes.data.role === 'alumni') {
          navigate('/alumni-dashboard');
        } else if (userRes.data.role === 'student') {
          navigate('/student-dashboard');
        } else if (userRes.data.role === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid token received. Please try again.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]);

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

  const handleLinkedInSignup = () => {
  localStorage.setItem('register_role', role);
  window.location.href = `http://localhost:8000/api/auth/linkedin/login?role=${role}`;
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
          setError('LinkedIn registration failed.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [navigate]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-black">
            GRAD<span className="text-[#90EE90]">connect</span>
          </CardTitle>
          <CardDescription>Create your account</CardDescription>
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
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
            {(role === 'student' || role === 'alumni') ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {role === 'student' ? (
                    <div className="flex">
                      <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
                        required
                        className="w-full border rounded-l px-3 py-2"
                        placeholder="username"
                      />
                      <span className="inline-flex items-center px-3 py-2 border border-l-0 rounded-r bg-gray-100 text-gray-600">@cutmap.ac.in</span>
                    </div>
                  ) : (
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter your email"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#90EE90] text-black" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            ) : (
              <Button
                type="button"
                onClick={handleLinkedInSignup}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-black flex items-center justify-center gap-3"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" style={{ height: 32, width: 32, background: 'white', borderRadius: 4 }} />
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{isLoading ? 'Redirecting...' : 'Continue with LinkedIn'}</span>
              </Button>
            )}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#90EE90] hover:underline">
                  Sign in
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

export default Register;