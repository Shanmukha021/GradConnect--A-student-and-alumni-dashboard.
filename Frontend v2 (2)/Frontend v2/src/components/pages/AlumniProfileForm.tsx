import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { X } from 'lucide-react';
import { AlumniProfile } from '../../types/profile';

interface AlumniProfileFormProps {
  formData: AlumniProfile;
  onChange: (data: AlumniProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AlumniProfileForm: React.FC<AlumniProfileFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handleArrayChange = (field: 'achievements' | 'mentorship_areas', value: string) => {
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
          <div className="space-y-2">
            <Label htmlFor="graduation_year">Graduation Year *</Label>
            <Input
              id="graduation_year"
              value={formData.graduation_year}
              onChange={(e) => onChange({ ...formData, graduation_year: e.target.value })}
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
      {/* Professional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_position">Current Position</Label>
            <Input
              id="current_position"
              value={formData.current_position || ''}
              onChange={(e) => onChange({ ...formData, current_position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_company">Current Company</Label>
            <Input
              id="current_company"
              value={formData.current_company || ''}
              onChange={(e) => onChange({ ...formData, current_company: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="achievements">Achievements (comma-separated)</Label>
          <Textarea
            id="achievements"
            value={formData.achievements?.join(', ') || ''}
            onChange={(e) => handleArrayChange('achievements', e.target.value)}
            rows={3}
            placeholder="Published research paper, Won hackathon, etc."
          />
        </div>
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
            id="is_mentor"
            checked={formData.is_mentor}
            onCheckedChange={(checked: boolean) => onChange({ ...formData, is_mentor: checked })}
          />
          <Label htmlFor="is_mentor" className="cursor-pointer">
            I am available as a mentor
          </Label>
        </div>
        {formData.is_mentor && (
          <div className="space-y-2">
            <Label htmlFor="mentorship_areas">Mentorship Areas (comma-separated)</Label>
            <Textarea
              id="mentorship_areas"
              value={formData.mentorship_areas?.join(', ') || ''}
              onChange={(e) => handleArrayChange('mentorship_areas', e.target.value)}
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

export default AlumniProfileForm;
