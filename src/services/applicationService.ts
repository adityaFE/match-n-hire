import { IApplication } from 'models/Application';
import { IJob } from 'models/Job';
import { API_BASE_URL } from '../config';

export interface PopulatedApplication extends Omit<IApplication, 'jobId'> {
  _id: string;
  jobId: IJob;
}

export const getUserApplications = async (userId: string): Promise<PopulatedApplication[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    const applications = await response.json();
    return applications;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
};

export const createApplication = async (userId: string, jobId: string): Promise<IApplication> => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, jobId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create application');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

export const withdrawApplication = async (applicationId: string, userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/user/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error withdrawing application:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: 'pending' | 'accepted' | 'rejected'
): Promise<IApplication | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to update application status');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};
