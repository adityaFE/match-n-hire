import { useState } from 'react';
import { Edit, Check, MapPin, Calendar, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, updateUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ProfileHeaderProps {
  profile: UserProfile;
  uid: string;
  refreshProfile: () => void;
}

export const ProfileHeader = ({ profile, uid, refreshProfile }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    jobTitle: profile?.jobTitle || '',
    company: profile?.company || '',
    location: profile?.location || '',
    experience: profile?.experience || '',
    noticePeroid: profile?.noticePeroid || '',
  });
  const { toast } = useToast();

  // Update form data when profile changes
  useState(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        jobTitle: profile.jobTitle || '',
        company: profile.company || '',
        location: profile.location || '',
        experience: profile.experience || '',
        noticePeroid: profile.noticePeroid || '',
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(uid, {
        ...formData,
        email: profile?.email,
        lastUpdated: new Date(),
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
      refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    
    let filled = 0;
    const total = 6;
    
    if (profile.fullName) filled++;
    if (profile.jobTitle) filled++;
    if (profile.company) filled++;
    if (profile.location) filled++;
    if (profile.experience) filled++;
    if (profile.noticePeroid) filled++;
    
    const percentage = Math.round((filled / total) * 100);
    return percentage;
  };

  const handleProfilePictureUpdate = (imageUrl: string) => {
    refreshProfile();
  };

  return (
    <div className="relative rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md mb-6">
      {/* Theme Toggle - Positioned absolutely */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle className="bg-white dark:bg-gray-700 shadow-md" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture and Completion Section */}
        <div className="flex-shrink-0 flex flex-col items-center relative">
          <ProfilePictureUpload
            uid={uid}
            currentPicture={profile?.profilePicture}
            onUploadSuccess={handleProfilePictureUpdate}
          />
          
          {/* Profile Completion Indicator */}
          <div className="mt-2 flex items-center justify-center">
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 ease-out"
                style={{ width: `${getProfileCompleteness()}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              {getProfileCompleteness()}%
            </span>
          </div>
        </div>
        
        {/* Profile Information */}
        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Enter your company name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="text"
                    value={formData.experience}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="e.g. 3 Years 9 Months"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="noticePeroid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notice Period
                </label>
                <input
                  id="noticePeroid"
                  name="noticePeroid"
                  type="text"
                  value={formData.noticePeroid}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="e.g. 15 Days or less notice period"
                />
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : (
                    <>
                      <Save className="mr-1 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.fullName || 'Add Your Name'}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {profile?.jobTitle || 'Add Job Title'} 
                    {profile?.company && <span> at {profile.company}</span>}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div> */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.fullName || 'Add Your Name'}
                  </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {profile?.jobTitle || 'Add Job Title'} 
                      {profile?.company && <span> at {profile.company}</span>}
                    </p>
                </div>
                <div className="pr-0 pb-0 md:pr-[34px!important] md:pb-[24px!important] flex items-center gap-4"
                // style={{
                //   paddingRight:"34px",
                //   paddingBottom:"28px"
                // }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                  <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                {profile?.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{profile.location}</span>
                  </div>
                )}
                
                {profile?.experience && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{profile.experience}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  {profile?.noticePeroid && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notice Period:</span> {profile.noticePeroid}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Profile last updated - {profile?.lastUpdated ? formatDate(profile.lastUpdated) : 'Never'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
