import type { components } from '../../types/api';
type Job = components["schemas"]["JobResponse"];
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Briefcase, Building, MapPin, Plus, Send } from 'lucide-react';

// ...existing code...

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: [''],
    salary: '',
    poster_id: '',
    is_active: true,
    application_deadline: '',
  });

  const [application, setApplication] = useState({
    cover_letter: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let deadline = newJob.application_deadline;
      if (deadline) {
        deadline = new Date(deadline).toISOString();
      } else {
        deadline = '';
      }
      const jobPayload = {
        ...newJob,
        requirements: newJob.requirements.filter((r) => r.trim() !== ''),
        poster_id: newJob.poster_id || uuidv4(),
        application_deadline: deadline,
      };
      console.log('Job payload:', jobPayload);
      await api.post('/jobs/', jobPayload);
      setNewJob({
        title: '',
        company: '',
        location: '',
        type: '',
        description: '',
        requirements: [''],
        salary: '',
        poster_id: '',
        is_active: true,
        application_deadline: '',
      });
      setIsJobDialogOpen(false);
      fetchJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleApplyJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) return;
    try {
      await api.post('/job-applications/job_applications/', {
        job_id: selectedJobId,
        cover_letter: application.cover_letter,
      });
      setApplication({ cover_letter: '' });
      setIsApplicationDialogOpen(false);
      setSelectedJobId(null);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const openApplicationDialog = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsApplicationDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Job Opportunities</h1>
        <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
              <Plus size={20} className="mr-2" />
              Post Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post New Job</DialogTitle>
              <DialogDescription>
                Post a new job opportunity for the alumni community.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    required
                    placeholder="e.g., Full-time, Internship"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="e.g., $60,000 - $80,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={newJob.application_deadline}
                    onChange={(e) => setNewJob({ ...newJob, application_deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Requirements</Label>
                {newJob.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={req}
                      onChange={(e) => {
                        const updated = [...newJob.requirements];
                        updated[idx] = e.target.value;
                        setNewJob({ ...newJob, requirements: updated });
                      }}
                      placeholder={`Requirement ${idx + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setNewJob({ ...newJob, requirements: newJob.requirements.filter((_, i) => i !== idx) });
                      }}
                      disabled={newJob.requirements.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewJob({ ...newJob, requirements: [...newJob.requirements, ''] })}
                >
                  Add Requirement
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_active">Is Active</Label>
                <input
                  id="is_active"
                  type="checkbox"
                  checked={newJob.is_active}
                  onChange={(e) => setNewJob({ ...newJob, is_active: e.target.checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poster_id">Poster ID</Label>
                <Input
                  id="poster_id"
                  value={newJob.poster_id}
                  onChange={(e) => setNewJob({ ...newJob, poster_id: e.target.value })}
                  placeholder="Leave blank to auto-generate"
                />
              </div>
              <Button type="submit" className="w-full bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                Post Job
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Job Application Dialog */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
            <DialogDescription>
              Submit your application with a cover letter.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApplyJob} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cover_letter">Cover Letter</Label>
              <Textarea
                id="cover_letter"
                value={application.cover_letter}
                onChange={(e) => setApplication({ cover_letter: e.target.value })}
                placeholder="Write your cover letter here..."
                required
                rows={6}
              />
            </div>
            <Button type="submit" className="w-full bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
              <Send size={16} className="mr-2" />
              Submit Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Building size={16} />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-2">Job Description</h4>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </div>
                
                 {job.requirements && job.requirements.length > 0 && (
                   <div>
                     <h4 className="font-medium text-black mb-2">Requirements</h4>
                     <ul className="text-sm text-gray-600 list-disc ml-4">
                       {job.requirements.map((req: string, idx: number) => (
                         <li key={idx}>{req}</li>
                       ))}
                     </ul>
                   </div>
                 )}
                 {job.salary && (
                   <div>
                     <h4 className="font-medium text-black mb-2">Salary</h4>
                     <p className="text-sm text-gray-600">{job.salary}</p>
                   </div>
                 )}
                
                <div className="flex items-center justify-between pt-4">
                  <span className="text-xs text-gray-500">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <Button
                    onClick={() => openApplicationDialog(job.id)}
                    className="bg-[#ADD8E6] hover:bg-[#9BC9E6] text-black"
                  >
                    <Briefcase size={16} className="mr-2" />
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No job opportunities available at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Jobs;