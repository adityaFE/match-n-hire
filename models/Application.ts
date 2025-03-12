import mongoose, { Schema, Document } from 'mongoose';
import { IJob } from './Job.js';

export interface IApplication extends Document {
  userId: string;
  jobId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  appliedDate: Date;
  job?: IJob;
  notes?: string;
}

const ApplicationSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Create compound index for unique applications per user per job
ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
