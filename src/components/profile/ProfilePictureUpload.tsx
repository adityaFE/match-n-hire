import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { updateUserProfile } from '@/services/profileService';

interface ProfilePictureUploadProps {
  uid: string;
  currentPicture?: string;
  onUploadSuccess: (imageUrl: string) => void;
}

export const ProfilePictureUpload = ({ uid, currentPicture, onUploadSuccess }: ProfilePictureUploadProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.8 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, or GIF).",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 1MB.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Compress and convert image to base64
      const compressedBase64 = await compressImage(file);
      
      // Update profile with compressed base64 image
      await updateUserProfile(uid, {
        profilePicture: compressedBase64,
        lastUpdated: new Date()
      });

      onUploadSuccess(compressedBase64);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture. Please try again.",
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
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {loading ? (
          <LoadingSpinner className="text-white" />
        ) : (
          <Camera className="h-6 w-6 text-white" />
        )}
      </label>
      
      <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border-4 border-green-500">
        {currentPicture ? (
          <img 
            src={currentPicture} 
            alt="Profile" 
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-green-600">
            {/* Placeholder initial */}
            P
          </span>
        )}
      </div>
    </div>
  );
}; 