import React, { useState, useEffect } from 'react';
import api from '../api';
import type { components } from '../../types/api';

// Using inline SVG icons as a fallback for lucide-react
const Plus = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>;
const Search = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const User = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

type Alumni = components["schemas"]["AlumniResponse"];
type AlumniCreate = components["schemas"]["AlumniCreate"];
type AlumniUpdate = components["schemas"]["AlumniUpdate"];

const Alumni: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAlumniId, setCurrentAlumniId] = useState<string | null>(null);

  const [newAlumni, setNewAlumni] = useState({
  name: '',
  email: '',
  department: '',
  graduation_year: '',
  user_id: '',
  phone: '',
  avatar_url: '',
  bio: '',
  location: '',
  current_position: '',
  current_company: '',
  achievements: null,
  social_links: {},
  is_mentor: false,
  mentorship_areas: null,
  is_public: true,
  });

  const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    // Fetch alumni from backend
    setLoading(true);
    api.get('/alumni/')
      .then((res) => {
        setAlumni(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch alumni:', err);
      })
      .finally(() => setLoading(false));

      // Fetch all users as fallback
      api.get('/users/')
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch users:', err);
        });
  }, []);

  useEffect(() => {
    if (!searchTerm && (filterYear === 'all') && (filterBranch === 'all')) {
      setFilteredAlumni(alumni);
    } else {
      filterAlumniList();
    }
  }, [alumni, searchTerm, filterYear, filterBranch]);

  const filterAlumniList = () => {
    let filtered = alumni;

    if (searchTerm) {
      filtered = filtered.filter(
        (alum: Alumni) =>
          alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alum.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alum.current_company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterYear && filterYear !== 'all') {
      filtered = filtered.filter((alum: Alumni) => alum.graduation_year === filterYear);
    }

    if (filterBranch && filterBranch !== 'all') {
      filtered = filtered.filter((alum: Alumni) => alum.department === filterBranch);
    }

    setFilteredAlumni(filtered);
  };

  const resetForm = () => {
    setNewAlumni({
      name: '',
      email: '',
      department: '',
      graduation_year: '',
      user_id: '',
      phone: '',
      avatar_url: '',
      bio: '',
      location: '',
      current_position: '',
      current_company: '',
  achievements: null,
      social_links: {},
      is_mentor: false,
  mentorship_areas: null,
      is_public: true,
    });
    setIsEditMode(false);
    setCurrentAlumniId(null);
  };

  const handleAddAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: AlumniCreate = {
        ...newAlumni,
        achievements: newAlumni.achievements,
        social_links: newAlumni.social_links,
        mentorship_areas: newAlumni.mentorship_areas,
      };
      const res = await api.post('/alumni/', payload);
      setAlumni([...alumni, res.data]);
    } catch (err) {
      console.error('Failed to add alumni:', err);
    } finally {
      resetForm();
      setIsDialogOpen(false);
      setLoading(false);
    }
  };

  const handleEditAlumni = (alum: Alumni) => {
    // ...existing code...
    setNewAlumni({
      name: alum.name,
      email: '',
      department: alum.department,
      graduation_year: alum.graduation_year,
      user_id: alum.user_id,
      phone: alum.phone || '',
      avatar_url: alum.avatar_url || '',
      bio: alum.bio || '',
      location: alum.location || '',
      current_position: alum.current_position || '',
      current_company: alum.current_company || '',
      achievements: null,
      social_links: alum.social_links || {},
      is_mentor: alum.is_mentor,
      mentorship_areas: null,
      is_public: alum.is_public,
    });
    setIsEditMode(true);
    setCurrentAlumniId(alum.id);
    setIsDialogOpen(true);
  };

  const handleUpdateAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAlumniId) return;
    setLoading(true);
    try {
      const payload: AlumniUpdate = {
        ...newAlumni,
        achievements: newAlumni.achievements,
        social_links: newAlumni.social_links,
        mentorship_areas: newAlumni.mentorship_areas,
      };
      const res = await api.put(`/alumni/${currentAlumniId}`, payload);
      setAlumni(alumni.map(alum => alum.id === currentAlumniId ? res.data : alum));
    } catch (err) {
      console.error('Failed to update alumni:', err);
    } finally {
      resetForm();
      setIsDialogOpen(false);
      setLoading(false);
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this alumni record?')) {
      setLoading(true);
      try {
        await api.delete(`/alumni/${id}`);
        setAlumni(alumni.filter(alum => alum.id !== id));
      } catch (err) {
        console.error('Failed to delete alumni:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Alumni Directory</h1>
        <div className="relative">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center px-4 py-2 bg-green-400 hover:bg-green-500 text-gray-800 rounded-lg shadow-md transition-colors"
          >
            <Plus />
            <span className="ml-2">Add Alumni</span>
          </button>
          {isDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Alumni' : 'Add New Alumni'}</h2>
                  <button onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {isEditMode ? 'Edit the alumni member\'s details.' : 'Add a new alumni member to the directory.'}
                </div>
                <form onSubmit={isEditMode ? handleUpdateAlumni : handleAddAlumni} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={newAlumni.name}
                      onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={newAlumni.email}
                      onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700">Graduation Year</label>
                      <select
                        id="graduation_year"
                        value={newAlumni.graduation_year}
                        onChange={(e) => setNewAlumni({ ...newAlumni, graduation_year: e.target.value })}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                      >
                        <option value="">Select year</option>
                        {years.map((year) => (
                          <option key={year} value={year.toString()}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                      <select
                        id="department"
                        value={newAlumni.department}
                        onChange={(e) => setNewAlumni({ ...newAlumni, department: e.target.value })}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                      >
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="current_position" className="block text-sm font-medium text-gray-700">Current Position</label>
                    <input
                      id="current_position"
                      type="text"
                      value={newAlumni.current_position || ''}
                      onChange={(e) => setNewAlumni({ ...newAlumni, current_position: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      id="company"
                      type="text"
                      value={newAlumni.current_company || ''}
                      onChange={(e) => setNewAlumni({ ...newAlumni, current_company: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                    />
                  </div>
                  <button type="submit" className="w-full px-4 py-2 bg-green-400 hover:bg-green-500 text-gray-800 rounded-md shadow-sm font-medium transition-colors">
                    {isEditMode ? 'Save Changes' : 'Add Alumni'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Search & Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search /></span>
              <input
                id="search"
                type="text"
                placeholder="Search by name, company, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700">Graduation Year</label>
            <select
              id="year-filter"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
            >
              <option value="all">All years</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="branch-filter" className="block text-sm font-medium text-gray-700">Department</label>
            <select
              id="branch-filter"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
            >
              <option value="all">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map((alum) => (
            <div key={alum.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              {/* ...existing alumni card code... */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {alum.avatar_url ? (
                    <img src={alum.avatar_url} alt={`${alum.name}'s avatar`} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 shadow-sm">
                      <User />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{alum.name}</h3>
                    <p className="text-sm text-gray-500">{alum.current_position || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Department:</strong> {alum.department}</p>
                  <p><strong>Graduation Year:</strong> {alum.graduation_year}</p>
                  {alum.current_company && <p><strong>Company:</strong> {alum.current_company}</p>}
                  {alum.phone && <p><strong>Phone:</strong> <a href={`tel:${alum.phone}`} className="text-blue-600 hover:underline">{alum.phone}</a></p>}
                  {alum.social_links && Object.keys(alum.social_links).length > 0 && (
                    <div>
                      <strong>Social Links:</strong>
                      <ul className="list-disc ml-5">
                        {Object.entries(alum.social_links).map(([platform, url]) => (
                          <li key={platform}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{platform}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p><strong>Mentor:</strong> {alum.is_mentor ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEditAlumni(alum)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAlumni(alum.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          users.length > 0 ? (
            users.filter((user) => user.role === 'alumni').length > 0 ? (
              users.filter((user) => user.role === 'alumni').map((user) => (
                <div key={user.id || user.email} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 shadow-sm">
                        <User />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{user.name || user.email}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Email:</strong> {user.email}</p>
                      {user.department && <p><strong>Department:</strong> {user.department}</p>}
                      {user.graduation_year && <p><strong>Graduation Year:</strong> {user.graduation_year}</p>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="text-gray-600">No alumni users found.</p>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-600">No alumni or users found.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Alumni;
