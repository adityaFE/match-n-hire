import { useState } from 'react';
import { Camera } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/services/profileService';

interface ProfilePictureUploadProps {
  uid: string;
  currentPicture?: string | null;
  onUploadSuccess: (imageUrl: string) => void;
}

export const ProfilePictureUpload = ({ uid, currentPicture, onUploadSuccess }: ProfilePictureUploadProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB",
        variant: "destructive"
      });
      return;
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would typically upload the file to your storage service
      // For now, we'll just use a mock URL
      const imageUrl = URL.createObjectURL(file);
      
      // Update the profile with the new image URL
      await updateUserProfile(uid, {
        profilePicture: imageUrl,
        lastUpdated: new Date()
      });
      
      onUploadSuccess(imageUrl);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        id="profile-picture"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />
      
      <label
        htmlFor="profile-picture"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
      >
        {loading ? (
          <LoadingSpinner className="text-white" />
        ) : (
          <Camera className="h-6 w-6 text-white" />
        )}
      </label>
      
      <div className="relative h-24 w-24 md:h-32 md:w-32">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600 animate-pulse" />
        <div className="absolute inset-[3px] rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          {currentPicture ? (
            <img 
              src={currentPicture} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
              <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">
                {/* Placeholder initial */}
                P
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 