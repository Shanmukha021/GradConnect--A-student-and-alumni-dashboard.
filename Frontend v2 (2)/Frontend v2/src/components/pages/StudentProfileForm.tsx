import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { X, Plus } from 'lucide-react';
import { StudentProfile, Project } from '../../types/profile';

interface StudentProfileFormProps {
  formData: StudentProfile;
  onChange: (data: StudentProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handleArrayChange = (field: 'skills' | 'interests' | 'mentorship_interests', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    onChange({ ...formData, [field]: items });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    onChange({
      ...formData,
      social_links: {
        ...formData.social_links,
        [platform]: value,
      },
    });
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const projects = [...(formData.projects || [])];
    projects[index] = { ...projects[index], [field]: value };
    onChange({ ...formData, projects });
  };

  const addProject = () => {
    const projects = [...(formData.projects || []), { title: '', description: '', url: '' }];
    onChange({ ...formData, projects });
  };

  const removeProject = (index: number) => {
    const projects = formData.projects?.filter((_, i) => i !== index) || [];
    onChange({ ...formData, projects });
  };

  return (
    <form onSubmit={onSubmit}>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional Info</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => onChange({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => onChange({ ...formData, department: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio || ''}
            onChange={(e) => onChange({ ...formData, bio: e.target.value })}
            rows={3}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_year">Current Year *</Label>
            <Input
              id="current_year"
              value={formData.current_year}
              onChange={(e) => onChange({ ...formData, current_year: e.target.value })}
              placeholder="e.g., 2nd Year"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="enrollment_year">Enrollment Year *</Label>
            <Input
              id="enrollment_year"
              value={formData.enrollment_year}
              onChange={(e) => onChange({ ...formData, enrollment_year: e.target.value })}
              placeholder="e.g., 2022"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_graduation_year">Expected Graduation *</Label>
            <Input
              id="expected_graduation_year"
              value={formData.expected_graduation_year}
              onChange={(e) => onChange({ ...formData, expected_graduation_year: e.target.value })}
              placeholder="e.g., 2026"
              required
            />
          </div>
        </div>
      </div>

      {/* Skills & Interests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills & Interests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => handleArrayChange('skills', e.target.value)}
              rows={3}
              placeholder="Python, React, Machine Learning, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Textarea
              id="interests"
              value={formData.interests?.join(', ') || ''}
              onChange={(e) => handleArrayChange('interests', e.target.value)}
              rows={3}
              placeholder="Web Development, AI, Robotics, etc."
            />
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Projects</h3>
          <Button
            type="button"
            onClick={addProject}
            variant="outline"
            size="sm"
            className="text-[#90EE90] border-[#90EE90] hover:bg-[#90EE90] hover:text-black"
          >
            <Plus size={16} className="mr-1" />
            Add Project
          </Button>
        </div>
        {formData.projects?.map((project, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3 relative">
            <Button
              type="button"
              onClick={() => removeProject(index)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                <Input
                  id={`project-title-${index}`}
                  value={project.title}
                  onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`project-url-${index}`}>Project URL</Label>
                <Input
                  id={`project-url-${index}`}
                  value={project.url || ''}
                  onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                rows={2}
                placeholder="Describe your project..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.social_links?.linkedin || ''}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={formData.social_links?.github || ''}
              onChange={(e) => handleSocialLinkChange('github', e.target.value)}
              placeholder="github.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.social_links?.twitter || ''}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="twitter.com/username"
            />
          </div>
        </div>
      </div>

      {/* Mentorship */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mentorship</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="looking_for_mentorship"
            checked={formData.looking_for_mentorship}
            onCheckedChange={(checked: boolean) => onChange({ ...formData, looking_for_mentorship: checked })}
          />
          <Label htmlFor="looking_for_mentorship" className="cursor-pointer">
            I am looking for mentorship
          </Label>
        </div>
        {formData.looking_for_mentorship && (
          <div className="space-y-2">
            <Label htmlFor="mentorship_interests">Mentorship Interests (comma-separated)</Label>
            <Textarea
              id="mentorship_interests"
              value={formData.mentorship_interests?.join(', ') || ''}
              onChange={(e) => handleArrayChange('mentorship_interests', e.target.value)}
              rows={2}
              placeholder="Career guidance, Technical skills, Interview prep, etc."
            />
          </div>
        )}
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Privacy</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_public"
            checked={formData.is_public}
            onCheckedChange={(checked: boolean) => onChange({ ...formData, is_public: checked })}
          />
          <Label htmlFor="is_public" className="cursor-pointer">
            Make my profile public in the directory
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default StudentProfileForm;
