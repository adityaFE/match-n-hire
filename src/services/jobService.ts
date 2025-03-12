import { IJob } from '../../models/Job';
import { createApplication } from './applicationService';
import type { PopulatedApplication } from './applicationService';
import { API_BASE_URL } from '../config';

export const getAllJobs = async (userId?: string): Promise<IJob[]> => {
  try {
    // First try to fetch all jobs
    const response = await fetch(`${API_BASE_URL}/jobs`);
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error('Server returned non-JSON response:', 
        await response.text(),
        'Content-Type:', contentType,
        'Status:', response.status
      );
      throw new Error(`Server returned non-JSON response (${response.status})`);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
    }

    const jobs = await response.json();

    // If no userId (not logged in), return all jobs
    if (!userId) {
      return jobs;
    }

    // For logged in users, try to fetch their applications
    try {
      const applicationsResponse = await fetch(`${API_BASE_URL}/applications/${userId}`);
      
      // If applications request fails, just return all jobs
      if (!applicationsResponse.ok) {
        console.warn('Failed to fetch applications, showing all jobs');
        return jobs;
      }

      const applications = await applicationsResponse.json() as PopulatedApplication[];
      const appliedJobIds = new Set(applications.map(app => 
        typeof app.jobId === 'string' ? app.jobId : app.jobId._id
      ));

      // Filter out jobs that the user has already applied to
      return jobs.filter((job: IJob) => !appliedJobIds.has(job._id));
    } catch (error) {
      // If there's any error with applications, log it and return all jobs
      console.warn('Error fetching applications:', error);
      return jobs;
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return empty array instead of throwing to prevent app from breaking
    return [];
  }
};

export const getJobById = async (id: string): Promise<IJob | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch job');
    }
    const job = await response.json();
    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

export const createJob = async (jobData: Partial<IJob>): Promise<IJob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    const job = await response.json();
    return job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (id: string, jobData: Partial<IJob>): Promise<IJob | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to update job');
    }
    const job = await response.json();
    return job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const applyToJob = async (jobId: string, userId: string) => {
  try {
    await createApplication(userId, jobId);
    return { success: true, message: 'Application submitted successfully!' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Failed to apply' };
  }
};

export const declineJob = (jobId: string): { success: boolean; message: string } => {
  // In a real app, this would make an API call to record the decline
  console.log(`Declined job with ID: ${jobId}`);
  return { 
    success: true, 
    message: 'Job declined' 
  };
};
