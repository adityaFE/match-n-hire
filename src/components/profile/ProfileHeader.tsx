import { useState } from 'react';
import { Edit, Check, MapPin, Calendar, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, updateUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProfilePictureUpload } from './ProfilePictureUpload';

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
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          <ProfilePictureUpload
            uid={uid}
            currentPicture={profile?.profilePicture}
            onUploadSuccess={handleProfilePictureUpdate}
          />
          <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-green-500 border border-gray-200 dark:border-gray-600">
            <span className="font-bold text-sm">{getProfileCompleteness()}%</span>
          </div>
        </div>
        
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
              
              <div className="flex items-center justify-end space-x-2 pt-2">
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
              <div className="flex justify-between items-start">
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
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {profile?.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile?.experience && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{profile.experience}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
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
