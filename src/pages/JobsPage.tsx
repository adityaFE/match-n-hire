import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getAllJobs } from '@/services/jobService';
import { createApplication } from '@/services/applicationService';
import { IJob } from 'models/Job';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const JobsPage = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadJobs();
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentJobIndex, jobs.length]);

  const loadJobs = async () => {
    try {
      const fetchedJobs = await getAllJobs(user?.uid);
      setJobs(fetchedJobs);
    } catch (error) {
      toast({
        title: "Error loading jobs",
        description: "Failed to load job listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = useCallback(() => {
    if (currentJobIndex > 0) {
      setCurrentJobIndex(prev => prev - 1);
    }
  }, [currentJobIndex]);

  const handleNext = useCallback(() => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1);
    }
  }, [currentJobIndex, jobs.length]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'right') {
      if (applying) return;

      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to apply for jobs.",
          variant: "default"
        });
        navigate('/login', { state: { from: '/jobs' } });
        return;
      }

      try {
        setApplying(true);
        const currentJob = jobs[currentJobIndex];
        await createApplication(user.uid, currentJob._id.toString());
        
        toast({
          title: "Application submitted",
          description: `You've applied to ${currentJob.title} at ${currentJob.company}`,
        });

        // Remove the current job from the list after successful application
        setJobs(prevJobs => prevJobs.filter((_, index) => index !== currentJobIndex));
        
        // If there are more jobs and we removed a job that wasn't last,
        // we don't need to change the index as the next job will slide into position
        if (currentJobIndex >= jobs.length - 1) {
          // If we're at or beyond the last job after removal, move the index back
          setCurrentJobIndex(Math.max(0, jobs.length - 2));
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      } finally {
        setApplying(false);
      }
    } else if (direction === 'left') {
      if (currentJobIndex < jobs.length - 1) {
        setCurrentJobIndex(prev => prev + 1);
      }
    }
  };

  // Add swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    delta: 50,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true
  });

  if (!jobs.length && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            
            <div className="flex space-x-3">
              <ThemeToggle />
              {user && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              )}
            </div>
          </div>

          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">No Jobs Available</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {user ? "You've applied to all available jobs!" : "Check back later for new opportunities."}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/applications')}
                className="flex items-center gap-2"
              >
                View My Applications
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                Go to Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <div className="flex space-x-3">
            <ThemeToggle />
            {user && (
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="relative" {...swipeHandlers}>
            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentJobIndex === 0}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 rounded-full",
                "hidden md:flex",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400",
                "transition-all duration-200"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous job</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentJobIndex === jobs.length - 1}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 rounded-full",
                "hidden md:flex",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400",
                "transition-all duration-200"
              )}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next job</span>
            </Button>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {jobs[currentJobIndex] && (
                <div>
                  <div className="mb-6 text-center">
                    <img 
                      src={jobs[currentJobIndex].imageUrl} 
                      alt={jobs[currentJobIndex].company}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2 dark:text-white">
                      {jobs[currentJobIndex].title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {jobs[currentJobIndex].company} • {jobs[currentJobIndex].location}
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {jobs[currentJobIndex].salary}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {jobs[currentJobIndex].description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      {jobs[currentJobIndex].requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={handleNext}
                      disabled={currentJobIndex === jobs.length - 1}
                      className="flex items-center gap-2"
                    >
                      Skip
                      <ChevronRight size={16} />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleSwipe('right')}
                      disabled={applying}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {applying ? <LoadingSpinner /> : 'Apply Now'}
                    </Button>
                  </div>

                  {/* Job navigation indicator */}
                  <div className="mt-6 flex justify-center items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Job {currentJobIndex + 1} of {jobs.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
