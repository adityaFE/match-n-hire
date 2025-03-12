import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { logout, updateUserPassword } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Briefcase, FileCheck } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ResumeSection } from '@/components/profile/ResumeSection';
import { KeySkillsSection } from '@/components/profile/KeySkillsSection';
import { EmploymentSection } from '@/components/profile/EmploymentSection';
import { EducationSection } from '@/components/profile/EducationSection';
import { ProfileSummarySection } from '@/components/profile/ProfileSummarySection';
import { ProjectsSection } from '@/components/profile/ProjectsSection';
import { QuickLinks } from '@/components/profile/QuickLinks';
import { getUserProfile, initializeUserProfile } from '@/services/profileService';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProfilePage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [lastUpdatedSection, setLastUpdatedSection] = useState<string | null>(null);
  
  // References for scrolling to sections
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const employmentRef = useRef(null);
  const educationRef = useRef(null);
  const projectsRef = useRef(null);
  const resumeRef = useRef(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Effect to handle scrolling after profile updates
  useEffect(() => {
    if (lastUpdatedSection && !profileLoading) {
      const sectionRefs = {
        'summary': summaryRef,
        'skills': skillsRef,
        'employment': employmentRef,
        'education': educationRef,
        'projects': projectsRef,
        'resume': resumeRef
      };
      
      const ref = sectionRefs[lastUpdatedSection];
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setLastUpdatedSection(null);
    }
  }, [profile, profileLoading, lastUpdatedSection]);

  const loadUserProfile = async (sectionId?: string) => {
    if (!user) return;
    
    if (sectionId) {
      setLastUpdatedSection(sectionId);
    }
    
    setProfileLoading(true);
    try {
      console.log('Attempting to fetch profile for user:', user.uid);
      console.log('Using API URL:', API_BASE_URL);
      const profileData = await getUserProfile(user.uid);
      console.log('Profile loaded successfully:', profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error in profile loading process:', error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response,
        config: error.config
      });
      
      let errorMessage = "We couldn't load your profile information. ";
      if (error.response?.status === 404) {
        errorMessage += "Your profile was not found. Creating a new profile...";
        try {
          const newProfile = await initializeUserProfile(user.uid, user.email || '');
          setProfile(newProfile);
          toast({
            title: "Profile created",
            description: "A new profile has been created for you."
          });
          return;
        } catch (initError) {
          console.error('Failed to create initial profile:', initError);
          errorMessage += " Failed to create a new profile.";
        }
      } else if (error.response?.status === 500) {
        errorMessage += "There was a server error.";
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please try refreshing the page.";
      }
      
      toast({
        title: "Failed to load profile",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive"
      });
      return;
    }

    setUpdating(true);

    try {
      const { success, error } = await updateUserPassword(
        user,
        currentPassword,
        newPassword
      );

      if (success) {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully."
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowPasswordForm(false);
      } else {
        toast({
          title: "Password update failed",
          description: error || "Please check your current password and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    setLoggingOut(true);

    try {
      const { success, error } = await logout();
      
      if (success) {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully."
        });
        navigate('/');
      } else {
        toast({
          title: "Logout failed",
          description: error || "An error occurred during logout.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    if (!showPasswordForm) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  // Determine if the user has a password (email providers) or not (OAuth providers)
  const canUpdatePassword = !!user.providerData.find(
    (provider) => provider.providerId === 'password'
  );

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
              disabled={loggingOut}
            >
              {loggingOut ? <LoadingSpinner /> : 'Logout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}
      
      <div className="container mx-auto px-4">
        <ProfileHeader 
          profile={profile || {}} 
          uid={user?.uid || ''} 
          refreshProfile={() => loadUserProfile('header')} 
        />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <QuickLinks className="mb-6" />
              
              <div className="mt-6 space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900 dark:text-white">Account Actions</h3>
                
                <div className="space-y-3">
                  {/* Display user email */}
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{user.email}</p>
                    {user.emailVerified && (
                      <span className="inline-flex items-center mt-1 text-xs text-green-600 dark:text-green-400">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => navigate('/applications')}
                    className="w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileCheck size={16} />
                      <span>My Applications</span>
                    </div>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => navigate('/jobs')}
                    className="w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase size={16} />
                      <span>Browse Jobs</span>
                    </div>
                  </Button>

                  {canUpdatePassword && (
                    <Button
                      type="button"
                      onClick={togglePasswordForm}
                      variant="outline"
                      className="w-full"
                    >
                      {showPasswordForm ? 'Cancel Password Update' : 'Update Password'}
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={handleLogoutClick}
                    variant="outline"
                    className="w-full"
                    disabled={loggingOut}
                  >
                    {loggingOut ? <LoadingSpinner /> : 'Sign Out'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            {/* Password update form (if shown) */}
            {showPasswordForm && canUpdatePassword && (
              <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Update Password</h2>
                
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      placeholder="•••••••••"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      placeholder="•••••••••"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      placeholder="•••••••••"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updating}
                  >
                    {updating ? <LoadingSpinner /> : 'Update Password'}
                  </Button>
                </form>
              </div>
            )}
            
            {/* Profile sections - now with proper null checks */}
            <div className="space-y-6">
              {profileLoading ? (
                <div className="flex justify-center py-10">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <>
                  <div ref={summaryRef} id="profile-summary">
                    <ProfileSummarySection 
                      profile={profile || {}} 
                      uid={user?.uid || ''} 
                      refreshProfile={() => loadUserProfile('summary')} 
                    />
                  </div>
                  
                  <div ref={skillsRef} id="skills">
                    <KeySkillsSection 
                      profile={profile || {}} 
                      uid={user?.uid || ''} 
                      refreshProfile={() => loadUserProfile('skills')} 
                    />
                  </div>
                  
                  <div ref={employmentRef} id="employment">
                    <EmploymentSection 
                      profile={profile || {}} 
                      uid={user?.uid || ''} 
                      refreshProfile={() => loadUserProfile('employment')} 
                    />
                  </div>
                  
                  <div ref={educationRef} id="education">
                    <EducationSection 
                      profile={profile || {}} 
                      uid={user?.uid || ''} 
                      refreshProfile={() => loadUserProfile('education')} 
                    />
                  </div>
                  
                  <div ref={projectsRef} id="projects">
                    <ProjectsSection 
                      profile={profile || {}} 
                      uid={user?.uid || ''} 
                      refreshProfile={() => loadUserProfile('projects')} 
                    />
                  </div>
                  
                  <div ref={resumeRef} id="resume">
                    <ResumeSection 
                      profile={profile || {}} 
                      uid={user?.uid || ''} 
                      refreshProfile={() => loadUserProfile('resume')} 
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
