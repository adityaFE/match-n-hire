import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose, { Document, Model } from 'mongoose';
import cors from 'cors';
import UserProfile from './models/UserProfile.js';
import JobModel from './models/Job.js';
import Application from './models/Application.js';
//import { jobsData } from './data/jobsData.js';
import { Types } from 'mongoose';

// Import the interface from the model file
interface ISkill {
  name: string;
  version?: string;
  lastUsed?: string;
  experience?: string;
}

interface IEducation {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isFullTime?: boolean;
  description?: string;
}

interface IEmployment {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrentPosition?: boolean;
  isFullTime?: boolean;
  description?: string;
  noticePeroid?: string;
  projects?: IProject[];
}

interface IProject {
  name: string;
  description?: string;
  url?: string;
  skills?: string[];
  startDate?: string;
  endDate?: string;
}

interface IUserProfile {
  firebaseUid: string;
  email?: string;
  fullName?: string;
  displayName?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  experience?: string;
  profilePicture?: string;
  resume?: string | null;
  resumeHeadline?: string;
  noticePeroid?: string;
  ctc?: string;
  profileSummary?: string;
  lastUpdated?: Date;
  skills: ISkill[];
  education: IEducation[];
  employment: IEmployment[];
  projects: IProject[];
}

interface ValidationError extends Error {
  name: 'ValidationError';
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

const app = express();
const PORT = process.env.PORT || 5002;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',  // Vite default port
  'http://localhost:8082',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://match-n-hire.netlify.app',  // Production Netlify frontend
  'https://job-tinder.onrender.com',  // Render backend
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Origin not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
// Increase payload size limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(async () => {
    console.log('MongoDB connected');
    // // Seed jobs if none exist
    // const jobCount = await JobModel.countDocuments();
    // if (jobCount === 0) {
    //   await JobModel.insertMany(jobsData);
    //   console.log('Jobs seeded successfully');
    // }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Type for request parameters
interface RequestParams {
  firebaseUid?: string;
  id?: string;
}

interface ProfileParams {
  firebaseUid: string;
}

// API Routes

// Get user profile by firebaseUid
app.get<ProfileParams>('/api/profile/:firebaseUid', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ firebaseUid: req.params.firebaseUid });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update user profile with better error handling
app.put('/api/profile/:firebaseUid', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const profileData = req.body;

    console.log('Received profile update request:', {
      firebaseUid,
      profileData
    });

    // Try to find existing profile first
    let profile = await UserProfile.findOne({ firebaseUid });
    console.log('Existing profile found:', profile);

    if (!profile) {
      // For new profiles, ensure required fields are present
      if (!profileData.email || !firebaseUid) {
        console.error('Missing required fields:', { email: profileData.email, firebaseUid });
        return res.status(400).json({ 
          message: 'Email and firebaseUid are required for profile creation'
        });
      }

      console.log('Creating new profile for:', firebaseUid);
      // Create new profile with default fields
      profile = new UserProfile({
        firebaseUid,
        email: profileData.email,
        skills: [],
        education: [],
        employment: [],
        projects: [],
        lastUpdated: new Date()
      });

      // Only add additional fields after initializing required fields
      const { _id, firebaseUid: _, ...updateFields } = profileData;
      Object.assign(profile, updateFields);
    } else {
      console.log('Updating existing profile for:', firebaseUid);
      // For updates, only update the fields that are provided
      const { _id, firebaseUid: _, ...updateFields } = profileData;
      Object.assign(profile, updateFields);
      profile.lastUpdated = new Date();
    }

    try {
      await profile.save({ validateModifiedOnly: true });
      console.log('Profile saved successfully:', profile);
      res.json(profile);
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error instanceof Error && error.name === 'ValidationError' && (error as ValidationError).errors) {
        const validationError = error as ValidationError;
        return res.status(400).json({
          message: 'Invalid profile data',
          errors: Object.values(validationError.errors).map(err => err.message)
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Job routes
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await JobModel.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Application routes
app.get('/api/applications/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate('jobId')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const existingApplication = await Application.findOne({
      userId: req.body.userId,
      jobId: req.body.jobId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = new Application({
      ...req.body,
      status: 'pending',
      appliedDate: new Date()
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.delete('/api/applications/:id/user/:userId', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.params.userId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Can only withdraw pending applications' });
    }

    await Application.findByIdAndUpdate(req.params.id, { status: 'withdrawn' });
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Profile section handlers
app.post('/api/profile/:firebaseUid/employment', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $push: { employment: req.body } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.employment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.delete('/api/profile/:firebaseUid/employment/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $pull: { employment: { _id: new Types.ObjectId(req.params.id) } } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.employment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/profile/:firebaseUid/education', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $push: { education: req.body } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.education);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.delete('/api/profile/:firebaseUid/education/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $pull: { education: { _id: new Types.ObjectId(req.params.id) } } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.education);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/profile/:firebaseUid/skills', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $push: { skills: req.body } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.delete('/api/profile/:firebaseUid/skills/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $pull: { skills: { _id: new Types.ObjectId(req.params.id) } } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/profile/:firebaseUid/projects', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $push: { projects: req.body } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.delete('/api/profile/:firebaseUid/projects/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $pull: { projects: { _id: new Types.ObjectId(req.params.id) } } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile.projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
