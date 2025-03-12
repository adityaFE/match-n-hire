import axios from 'axios';
import { API_BASE_URL } from '../config';

// Define types for our profile data
export interface Skill {
  _id?: string;
  name: string;
  version?: string;
  lastUsed?: string;
  experience?: string;
}

export interface Education {
  _id?: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isFullTime?: boolean;
  description?: string;
}

export interface Project {
  _id?: string;
  name: string;
  description?: string;
  url?: string;
  skills?: string[];
  startDate?: string;
  endDate?: string;
}

export interface Employment {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrentPosition?: boolean;
  isFullTime?: boolean;
  description?: string;
  noticePeroid?: string;
  projects?: Project[];
}

export interface UserProfile {
  _id?: string;
  firebaseUid: string;
  fullName?: string;
  displayName?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  email?: string;
  emailVerified?: boolean;
  experience?: string;
  profilePicture?: string;
  resume?: string;
  resumeHeadline?: string;
  noticePeroid?: string;
  ctc?: string;
  profileSummary?: string;
  skills: Skill[];
  education: Education[];
  employment: Employment[];
  projects: Project[];
  lastUpdated?: Date;
}

// Get user profile by Firebase UID
export const getUserProfile = async (firebaseUid: string): Promise<UserProfile> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${firebaseUid}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // If profile doesn't exist, create it silently
      console.log('Profile not found, creating new profile...');
      return initializeUserProfile(firebaseUid, ''); // We'll update the email later if needed
    }
    // For other errors, log and throw
    console.error('Error in getUserProfile:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

// Create or get user profile when user first signs up
export const initializeUserProfile = async (firebaseUid: string, email: string): Promise<UserProfile> => {
  try {
    const initialProfile = {
      firebaseUid,
      email: email || '',
      skills: [],
      education: [],
      employment: [],
      projects: [],
      lastUpdated: new Date()
    };
    
    const response = await axios.put(`${API_BASE_URL}/profile/${firebaseUid}`, initialProfile);
    return response.data;
  } catch (error) {
    console.error('Failed to initialize user profile:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', {
        data: error.response?.data,
        status: error.response?.status
      });
    }
    throw new Error('Failed to initialize user profile');
  }
};

// Update user profile with better error handling
export const updateUserProfile = async (firebaseUid: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    console.log('Updating profile for user:', firebaseUid);
    console.log('Update data:', profileData);
    
    const response = await axios.put(`${API_BASE_URL}/profile/${firebaseUid}`, {
      ...profileData,
      firebaseUid,
      skills: profileData.skills || [],
      education: profileData.education || [],
      employment: profileData.employment || [],
      projects: profileData.projects || [],
      lastUpdated: new Date()
    });
    
    console.log('Profile update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        // Profile doesn't exist, create it
        return createInitialProfile(firebaseUid, profileData.email || '');
      }
      throw new Error(`Profile update failed: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// Add employment
export const addEmployment = async (firebaseUid: string, employment: Employment): Promise<UserProfile> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/profile/${firebaseUid}/employment`, employment);
    return response.data;
  } catch (error) {
    console.error('Error adding employment:', error);
    throw error;
  }
};

// Add education
export const addEducation = async (firebaseUid: string, education: Education): Promise<UserProfile> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/profile/${firebaseUid}/education`, education);
    return response.data;
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

// Add skill
export const addSkill = async (firebaseUid: string, skill: Skill): Promise<UserProfile> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/profile/${firebaseUid}/skills`, skill);
    return response.data;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

// Add project
export const addProject = async (firebaseUid: string, project: Project): Promise<UserProfile> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/profile/${firebaseUid}/projects`, project);
    return response.data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Delete employment
export const deleteEmployment = async (firebaseUid: string, employmentId: string): Promise<UserProfile> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${firebaseUid}/employment/${employmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employment:', error);
    throw error;
  }
};

// Delete education
export const deleteEducation = async (firebaseUid: string, educationId: string): Promise<UserProfile> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${firebaseUid}/education/${educationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

// Delete skill
export const deleteSkill = async (firebaseUid: string, skillId: string): Promise<UserProfile> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${firebaseUid}/skills/${skillId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (firebaseUid: string, projectId: string): Promise<UserProfile> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${firebaseUid}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Create initial user profile with better error handling
export const createInitialProfile = async (firebaseUid: string, email: string): Promise<UserProfile> => {
  try {
    console.log('Creating initial profile for:', firebaseUid);
    
    const initialProfile = {
      firebaseUid,
      email: email || '',
      skills: [],
      education: [],
      employment: [],
      projects: [],
      lastUpdated: new Date()
    };

    console.log('Creating profile with data:', initialProfile);
    
    const response = await axios.put(`${API_BASE_URL}/profile/${firebaseUid}`, initialProfile);
    console.log('Profile created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create initial profile:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', {
        data: error.response?.data,
        status: error.response?.status
      });
    }
    throw new Error('Failed to create initial profile');
  }
};
