import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 p-4 relative">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="max-w-4xl w-full text-center text-white">
        <h1 className="text-6xl font-bold mb-6">Match'n'Hire</h1>
        
        <div className="mb-12">
          <p className="text-xl mb-2">
            Find your perfect job match with our Tinder-style job matching platform.
          </p>
          <p className="text-xl">
            Swipe right for opportunities that excite you!
          </p>
        </div>
        
        <div className="flex justify-center gap-4 mb-16">
          <button 
            onClick={() => navigate('/login')} 
            className="px-8 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Get Started
          </button>
          
          <button 
            onClick={() => navigate('/jobs')} 
            className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Browse Jobs
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg dark:bg-gray-800/50">
            <h2 className="text-2xl font-bold mb-3">Create Your Profile</h2>
            <p className="text-gray-100 dark:text-gray-200">
              Build a comprehensive profile showcasing your skills, experience, and projects.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg dark:bg-gray-800/50">
            <h2 className="text-2xl font-bold mb-3">Swipe Through Jobs</h2>
            <p className="text-gray-100 dark:text-gray-200">
              Discover job opportunities with our intuitive swipe interface. Right for yes, left for no.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg dark:bg-gray-800/50">
            <h2 className="text-2xl font-bold mb-3">Track Your Applications</h2>
            <p className="text-gray-100 dark:text-gray-200">
              Keep track of all the jobs you've applied for in one organized place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
