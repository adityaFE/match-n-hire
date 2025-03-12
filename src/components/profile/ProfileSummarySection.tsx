import { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, updateUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProfileSummarySectionProps {
  profile: UserProfile | null;
  uid: string;
  refreshProfile: () => void;
}

export const ProfileSummarySection = ({ profile, uid, refreshProfile }: ProfileSummarySectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileSummary, setProfileSummary] = useState(profile?.profileSummary || '');
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(uid, {
        profileSummary,
        email: profile?.email,
        lastUpdated: new Date(),
      });
      
      toast({
        title: "Profile summary updated",
        description: "Your profile summary has been updated successfully."
      });
      
      refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="profile-summary" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Summary</h2>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span>Edit</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={profileSummary}
            onChange={(e) => setProfileSummary(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={6}
            placeholder="Write a summary of your professional background, skills, and career objectives..."
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsEditing(false);
                setProfileSummary(profile?.profileSummary || '');
              }}
              disabled={loading}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              size="sm"
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
        <div>
          {profile?.profileSummary ? (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profile.profileSummary}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Add a summary to highlight your professional background, skills, and career objectives.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
