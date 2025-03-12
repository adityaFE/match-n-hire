import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  version?: string;
  lastUsed?: string;
  experience?: string;
}

export interface IEducation extends Document {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isFullTime?: boolean;
  description?: string;
}

export interface IProject extends Document {
  name: string;
  description?: string;
  url?: string;
  skills?: string[];
  startDate?: string;
  endDate?: string;
}

export interface IEmployment extends Document {
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

export interface IUserProfile extends Document {
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
  skills: ISkill[];
  education: IEducation[];
  employment: IEmployment[];
  projects: IProject[];
  lastUpdated?: Date;
}

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  version: String,
  lastUsed: String,
  experience: String
});

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: String,
  url: String,
  skills: [String],
  startDate: String,
  endDate: String
});

const educationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  institution: { type: String, required: true },
  location: String,
  startDate: String,
  endDate: String,
  isFullTime: Boolean,
  description: String
});

const employmentSchema = new Schema<IEmployment>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: String,
  endDate: String,
  isCurrentPosition: Boolean,
  isFullTime: Boolean,
  description: String,
  noticePeroid: String,
  projects: [projectSchema]
});

const userProfileSchema = new Schema<IUserProfile>({
  firebaseUid: { type: String, required: true, unique: true },
  fullName: String,
  displayName: String,
  jobTitle: String,
  company: String,
  location: String,
  phoneNumber: String,
  phoneVerified: { type: Boolean, default: false },
  email: String,
  emailVerified: { type: Boolean, default: false },
  experience: String,
  profilePicture: String,
  resume: String,
  resumeHeadline: String,
  noticePeroid: String,
  ctc: String,
  profileSummary: String,
  skills: [skillSchema],
  education: [educationSchema],
  employment: [employmentSchema],
  projects: [projectSchema],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema); 