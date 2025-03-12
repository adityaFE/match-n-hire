
import { IApplication } from '../../models/Application';
import { Calendar, Building2, MapPin, Banknote, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { withdrawApplication } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ApplicationCardProps {
  application: IApplication;
  onWithdraw: (applicationId: string) => void;
}

export const ApplicationCard = ({ application, onWithdraw }: ApplicationCardProps) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();
  const { job } = application;
  
  if (!job) {
    return <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-gray-300">Job details not available</div>;
  }
  
  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const result = await withdrawApplication(application.id, application.userId);
      if (result) {
        toast({
          title: "Application withdrawn",
          description: "Your application has been successfully withdrawn"
        });
        onWithdraw(application.id);
      } else {
        toast({
          title: "Error", 
          description: "Failed to withdraw application",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw application",
        variant: "destructive"
      });
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  // Format the date
  const appliedDate = new Date(application.appliedDate);
  const formattedDate = format(appliedDate, 'MMMM dd, yyyy');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {job.imageUrl && (
              <img 
                src={job.imageUrl} 
                alt={job.company} 
                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
              />
            )}
            <div>
              <h3 className="text-xl font-bold dark:text-white">{job.title}</h3>
              <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
                <Building2 size={16} className="mr-1" />
                <span className="mr-3">{job.company}</span>
                <MapPin size={16} className="mr-1" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center mt-1 text-gray-700 dark:text-gray-300">
                  <Banknote size={16} className="mr-1" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-medium
              ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Calendar size={14} className="mr-1" />
          <span>Applied on {formattedDate}</span>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="px-3 py-1 text-sm border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            {isWithdrawing ? <LoadingSpinner size="sm" /> : 'Withdraw Application'}
          </button>
        </div>
      </div>
    </div>
  );
};
