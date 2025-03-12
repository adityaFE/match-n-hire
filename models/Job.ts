import mongoose, { Document, Schema } from 'mongoose';

// Base interface for Job data
export interface IJobBase {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  imageUrl: string;
  postedDate: string;
}

// Interface for Job document (includes Mongoose document properties)
export interface IJob extends IJobBase, Document {}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  imageUrl: { type: String, required: true },
  postedDate: { type: String, required: true }
}, {
  timestamps: true
});

// Create and export the model
const JobModel = mongoose.model<IJob>('Job', JobSchema);
export default JobModel;

// Seed data function
// export const seedJobs = async () => {
//   try {
//     // Check if jobs already exist
//     const count = await JobModel.countDocuments();
//     if (count > 0) {
//       console.log('Jobs already seeded');
//       return;
//     }

//     // Import the static data
//     const { jobsData } = await import('../data/jobsData');
    
//     // Insert the jobs
//     await JobModel.insertMany(jobsData);
//     console.log('Jobs seeded successfully');
//   } catch (error) {
//     console.error('Error seeding jobs:', error);
//   }
// };
