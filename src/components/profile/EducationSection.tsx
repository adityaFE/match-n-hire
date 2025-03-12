
import { useState } from 'react';
import { Edit, Save, X, Plus, Trash2, Calendar, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, Education, addEducation, deleteEducation } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface EducationSectionProps {
  profile: UserProfile;
  uid: string;
  refreshProfile: () => void;
}

export const EducationSection = ({ profile, uid, refreshProfile }: EducationSectionProps) => {
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedEducation, setExpandedEducation] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    degree: '',
    fieldOfStudy: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    isFullTime: true,
    description: ''
  });
  const { toast } = useToast();

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setNewEducation((prev) => ({ ...prev, [name]: checked }));
    } else {
      setNewEducation((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddEducation = async () => {
    if (!newEducation.degree.trim() || !newEducation.institution.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter both degree and institution.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await addEducation(uid, newEducation);
      
      toast({
        title: "Education added",
        description: "Your education record has been added successfully."
      });
      
      refreshProfile();
      setIsAddingEducation(false);
      setNewEducation({
        degree: '',
        fieldOfStudy: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        isFullTime: true,
        description: ''
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add education",
        description: "An error occurred while adding the education record.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (educationId: string | undefined) => {
    if (!educationId) return;
    
    setLoading(true);
    try {
      await deleteEducation(uid, educationId);
      
      toast({
        title: "Education deleted",
        description: "The education record has been deleted successfully."
      });
      
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete education",
        description: "An error occurred while deleting the education record.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandEducation = (id: string | undefined) => {
    if (!id) return;
    setExpandedEducation(expandedEducation === id ? null : id);
  };

  return (
    <div id="education" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingEducation(true)}
          disabled={isAddingEducation}
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Education</span>
        </Button>
      </div>

      {isAddingEducation && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Education</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="degree" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Degree*
                </label>
                <input
                  id="degree"
                  name="degree"
                  type="text"
                  value={newEducation.degree}
                  onChange={handleEducationChange}
                  className="auth-input"
                  placeholder="e.g. Bachelor of Science"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fieldOfStudy" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Field of Study
                </label>
                <input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  type="text"
                  value={newEducation.fieldOfStudy}
                  onChange={handleEducationChange}
                  className="auth-input"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="institution" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Institution*
                </label>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  value={newEducation.institution}
                  onChange={handleEducationChange}
                  className="auth-input"
                  placeholder="e.g. Stanford University"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={newEducation.location}
                  onChange={handleEducationChange}
                  className="auth-input"
                  placeholder="e.g. California, USA"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="text"
                  value={newEducation.startDate}
                  onChange={handleEducationChange}
                  className="auth-input"
                  placeholder="e.g. 2018"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="text"
                  value={newEducation.endDate}
                  onChange={handleEducationChange}
                  className="auth-input"
                  placeholder="e.g. 2022"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="isFullTime"
                name="isFullTime"
                type="checkbox"
                checked={newEducation.isFullTime}
                onChange={handleEducationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isFullTime" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Full Time
              </label>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newEducation.description}
                onChange={handleEducationChange}
                className="auth-input"
                rows={3}
                placeholder="Describe your studies, achievements, and activities"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsAddingEducation(false);
                setNewEducation({
                  degree: '',
                  fieldOfStudy: '',
                  institution: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  isFullTime: true,
                  description: ''
                });
              }}
              disabled={loading}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddEducation}
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
      )}

      {profile.education && profile.education.length > 0 ? (
        <div className="space-y-4">
          {profile.education.map((education, index) => (
            <div key={education._id || index} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => toggleExpandEducation(education._id)}
              >
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                    {education.degree}
                    {education.fieldOfStudy && <span> in {education.fieldOfStudy}</span>}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{education.institution}</span>
                      {education.isFullTime !== undefined && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                          ({education.isFullTime ? 'Full-time' : 'Part-time'})
                        </span>
                      )}
                    </div>
                    {(education.startDate || education.endDate) && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {education.startDate || '-'} - {education.endDate || '-'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEducation(education._id);
                    }}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedEducation === education._id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedEducation === education._id && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  {education.location && (
                    <div className="mb-2 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Location:</span> {education.location}
                    </div>
                  )}
                  
                  {education.description && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{education.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No education records added yet. Add your educational background to showcase your qualifications.</p>
        </div>
      )}
    </div>
  );
};
