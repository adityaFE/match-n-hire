import { useState } from 'react';
import { Edit, Save, X, Upload, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, updateUserProfile, getUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ResumeSectionProps {
  profile: UserProfile | null;
  uid: string;
  refreshProfile: () => void;
}

export const ResumeSection = ({ profile, uid, refreshProfile }: ResumeSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeHeadline, setResumeHeadline] = useState(profile?.resumeHeadline || '');
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      // Get current profile data first
      const currentProfile = await getUserProfile(uid);
      
      // Update only the resumeHeadline field while preserving other fields
      await updateUserProfile(uid, {
        ...currentProfile,
        resumeHeadline,
        lastUpdated: new Date()
      });
      
      toast({
        title: "Resume headline updated",
        description: "Your resume headline has been updated successfully."
      });
      
      refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update resume headline. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!profile?.resume) return;
    
    setLoading(true);
    try {
      // Get the current profile first
      const currentProfile = await getUserProfile(uid);
      
      // Update only the resume field while preserving other fields
      await updateUserProfile(uid, {
        ...currentProfile,
        resume: null,
        lastUpdated: new Date()
      });
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully."
      });
      
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      // Get current profile data first
      const currentProfile = await getUserProfile(uid);
      
      // Update only the resume field while preserving other fields
      await updateUserProfile(uid, {
        ...currentProfile,
        resume: file.name,
        lastUpdated: new Date()
      });
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully."
      });
      
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="resume" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resume</h2>
      </div>

      {profile?.resume ? (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-2">
              <FileText className="h-6 w-6 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <div className="min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-200 break-all">{profile.resume}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded on {profile.lastUpdated ? new Date(profile.lastUpdated).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                <input 
                  type="file" 
                  id="resume-upload" 
                  className="hidden"
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="resume-upload"
                  className="flex items-center cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  <span>Update</span>
                </label>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-md flex flex-col items-center justify-center">
          <FileText className="h-12 w-12 text-gray-400 mb-2" />
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-center">Upload your resume (PDF, DOC, DOCX) up to 2MB</p>
          <Button>
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden"
              accept=".pdf,.doc,.docx" 
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="resume-upload"
              className="flex items-center cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              <span>Upload Resume</span>
            </label>
          </Button>
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Resume Headline</h3>
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
              value={resumeHeadline}
              onChange={(e) => setResumeHeadline(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="A brief headline describing your professional background and expertise"
            />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false);
                  setResumeHeadline(profile?.resumeHeadline || '');
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
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {profile?.resumeHeadline || 'Add a resume headline to highlight your expertise and experience.'}
          </p>
        )}
      </div>
    </div>
  );
};
