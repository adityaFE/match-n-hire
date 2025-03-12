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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PopulatedApplication extends Omit<IApplication, 'jobId'> {
  _id: string;
  jobId: IJob;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<PopulatedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
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

  const handleWithdrawClick = (applicationId: string) => {
    setWithdrawingId(applicationId);
    setShowWithdrawConfirm(true);
  };

  const handleWithdrawConfirm = async () => {
    if (!user || !withdrawingId) return;

    try {
      const success = await withdrawApplication(withdrawingId, user.uid);
      if (success) {
        setApplications(prev => prev.filter(app => app._id !== withdrawingId));
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
    } finally {
      setShowWithdrawConfirm(false);
      setWithdrawingId(null);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const currentApplication = withdrawingId 
    ? applications.find(app => app._id === withdrawingId)
    : null;

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
                        onClick={() => handleWithdrawClick(application._id)}
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
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No applications yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start applying for jobs to see your applications here
            </p>
            <Button
              onClick={() => navigate('/jobs')}
              className="mt-4"
            >
              Browse Jobs
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showWithdrawConfirm} onOpenChange={setShowWithdrawConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw your application for{' '}
              <span className="font-medium">{currentApplication?.jobId.title}</span> at{' '}
              <span className="font-medium">{currentApplication?.jobId.company}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowWithdrawConfirm(false);
                setWithdrawingId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleWithdrawConfirm}
            >
              Withdraw Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsPage;
