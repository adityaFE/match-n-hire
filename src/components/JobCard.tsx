
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { IJob } from '../../models/Job';
import { useAuthStore } from '@/store/authStore';
import { applyToJob, declineJob } from '@/services/jobService';
import { useToast } from '@/hooks/use-toast';

interface JobCardProps {
  job: IJob;
  onNext: () => void;
}

export const JobCard = ({ job, onNext }: JobCardProps) => {
  const [applying, setApplying] = useState(false);
  const [declining, setDeclining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const result = await applyToJob(job.id, user.uid);
      if (result.success) {
        toast({
          title: "Application submitted",
          description: result.message
        });
        setTimeout(onNext, 500);
      } else {
        toast({
          title: "Application failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
    }
  };

  const handleDecline = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to interact with jobs",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setDeclining(true);
    try {
      const result = await declineJob(job.id);
      if (result.success) {
        toast({
          title: "Job declined",
          description: result.message
        });
        setTimeout(onNext, 500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline job",
        variant: "destructive"
      });
    } finally {
      setDeclining(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl w-full mx-auto transition-all duration-200 border border-gray-200">
      <div className="p-6">
        <div className="flex items-start mb-4">
          {job.imageUrl && (
            <img 
              src={job.imageUrl} 
              alt={job.company} 
              className="w-16 h-16 rounded-md object-cover mr-4"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <h3 className="text-lg text-gray-600">{job.company}</h3>
            <p className="text-gray-500">{job.location}</p>
            <p className="font-medium text-gray-800 mt-1">{job.salary}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-bold mb-2">Job Description</h4>
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-bold mb-2">Requirements</h4>
          <ul className="list-disc pl-5 text-gray-700">
            {job.requirements.map((req, index) => (
              <li key={index} className="mb-1">{req}</li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-4">Posted on {job.postedDate}</p>
      </div>

      <div className="grid grid-cols-2 border-t border-gray-200">
        <button 
          onClick={handleDecline}
          disabled={declining}
          className="py-3 text-red-500 font-medium hover:bg-red-50 transition-colors flex items-center justify-center"
        >
          Decline
        </button>
        <button 
          onClick={handleApply}
          disabled={applying}
          className="py-3 text-blue-500 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center border-l border-gray-200"
        >
          Apply
        </button>
      </div>

      <div className="flex justify-center space-x-8 p-4">
        <button 
          onClick={handleDecline}
          className="w-14 h-14 flex items-center justify-center bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
        >
          <XCircle size={30} />
        </button>
        <button 
          onClick={handleApply}
          className="w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
        >
          <CheckCircle size={30} />
        </button>
      </div>
    </div>
  );
};
