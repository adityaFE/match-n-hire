import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getUserApplications, withdrawApplication } from '@/services/applicationService';
import { IApplication } from 'models/Application';
import { IJob } from 'models/Job';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  User,
  MapPin,
  Calendar,
  Banknote,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PopulatedApplication extends Omit<IApplication, 'jobId'> {
  _id: string;
  jobId: IJob;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<PopulatedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userApplications = await getUserApplications(user.uid);
      setApplications(userApplications as PopulatedApplication[]);
    } catch (error) {
      toast({
        title: "Error loading applications",
        description: "Failed to load your job applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!user) return;

    try {
      const success = await withdrawApplication(applicationId, user.uid);
      if (success) {
        setApplications(prev => prev.filter(app => app._id !== applicationId));
        toast({
          title: "Application withdrawn",
          description: "Your application has been withdrawn successfully"
        });
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
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/jobs')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to Jobs
            </Button>
            
            <div className="flex space-x-3">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold dark:text-white">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and manage your job applications
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map(application => (
              <div
                key={application._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold dark:text-white">
                      {application.jobId.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Building2 size={16} />
                        <span>{application.jobId.company}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{application.jobId.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Banknote size={16} />
                        <span>{application.jobId.salary}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Applied {format(new Date(application.appliedDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        {
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":
                            application.status === "pending",
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":
                            application.status === "accepted",
                          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":
                            application.status === "rejected",
                        }
                      )}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>

                    {application.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWithdraw(application._id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <XCircle size={16} className="mr-1" />
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Briefcase size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">No applications yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't applied to any jobs yet. Browse available opportunities to get started.
            </p>
            <Button onClick={() => navigate('/jobs')} className="inline-flex items-center gap-2">
              <Briefcase size={16} />
              Browse Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
