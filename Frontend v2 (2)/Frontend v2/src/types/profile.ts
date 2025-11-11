// Profile type definitions for Alumni and Student profiles

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface Project {
  title: string;
  description: string;
  url?: string;
}

export interface AlumniProfile {
  id?: string;
  user_id?: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  department: string;
  graduation_year: string;
  current_position?: string;
  current_company?: string;
  achievements?: string[];
  social_links?: SocialLinks;
  is_mentor: boolean;
  mentorship_areas?: string[];
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StudentProfile {
  id?: string;
  user_id?: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  department: string;
  current_year: string;
  enrollment_year: string;
  expected_graduation_year: string;
  skills?: string[];
  interests?: string[];
  projects?: Project[];
  social_links?: SocialLinks;
  looking_for_mentorship: boolean;
  mentorship_interests?: string[];
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export type Profile = AlumniProfile | StudentProfile;

export interface ProfileResponse {
  profile: AlumniProfile | StudentProfile;
  role: 'alumni' | 'student';
}
