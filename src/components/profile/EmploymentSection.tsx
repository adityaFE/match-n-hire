
import { useState } from 'react';
import { Edit, Save, X, Plus, Trash2, Calendar, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, Employment, addEmployment, deleteEmployment } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface EmploymentSectionProps {
  profile: UserProfile;
  uid: string;
  refreshProfile: () => void;
}

export const EmploymentSection = ({ profile, uid, refreshProfile }: EmploymentSectionProps) => {
  const [isAddingEmployment, setIsAddingEmployment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedEmployment, setExpandedEmployment] = useState<string | null>(null);
  const [newEmployment, setNewEmployment] = useState<Employment>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentPosition: false,
    isFullTime: true,
    description: '',
    noticePeroid: '',
  });
  const { toast } = useToast();

  const handleEmploymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setNewEmployment((prev) => ({ ...prev, [name]: checked }));
    } else {
      setNewEmployment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddEmployment = async () => {
    if (!newEmployment.title.trim() || !newEmployment.company.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter both job title and company.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await addEmployment(uid, newEmployment);
      
      toast({
        title: "Employment added",
        description: "Your employment record has been added successfully."
      });
      
      refreshProfile();
      setIsAddingEmployment(false);
      setNewEmployment({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentPosition: false,
        isFullTime: true,
        description: '',
        noticePeroid: ''
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add employment",
        description: "An error occurred while adding the employment record.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployment = async (employmentId: string | undefined) => {
    if (!employmentId) return;
    
    setLoading(true);
    try {
      await deleteEmployment(uid, employmentId);
      
      toast({
        title: "Employment deleted",
        description: "The employment record has been deleted successfully."
      });
      
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete employment",
        description: "An error occurred while deleting the employment record.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandEmployment = (id: string | undefined) => {
    if (!id) return;
    setExpandedEmployment(expandedEmployment === id ? null : id);
  };

  return (
    <div id="employment" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employment</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingEmployment(true)}
          disabled={isAddingEmployment}
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Employment</span>
        </Button>
      </div>

      {isAddingEmployment && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Employment</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newEmployment.title}
                  onChange={handleEmploymentChange}
                  className="auth-input"
                  placeholder="e.g. Frontend Engineer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company*
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={newEmployment.company}
                  onChange={handleEmploymentChange}
                  className="auth-input"
                  placeholder="e.g. Acme Inc."
                  required
                />
              </div>
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
                  value={newEmployment.location}
                  onChange={handleEmploymentChange}
                  className="auth-input"
                  placeholder="e.g. New York, USA"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="isFullTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Employment Type
                </label>
                <select
                  id="isFullTime"
                  name="isFullTime"
                  value={newEmployment.isFullTime ? "true" : "false"}
                  onChange={handleEmploymentChange}
                  className="auth-input"
                >
                  <option value="true">Full-time</option>
                  <option value="false">Part-time</option>
                </select>
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
                  value={newEmployment.startDate}
                  onChange={handleEmploymentChange}
                  className="auth-input"
                  placeholder="e.g. Aug 2022"
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
                  value={newEmployment.endDate}
                  onChange={handleEmploymentChange}
                  className="auth-input"
                  placeholder="e.g. Present or Jun 2023"
                  disabled={newEmployment.isCurrentPosition}
                />
                <div className="flex items-center mt-1">
                  <input
                    id="isCurrentPosition"
                    name="isCurrentPosition"
                    type="checkbox"
                    checked={newEmployment.isCurrentPosition}
                    onChange={handleEmploymentChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCurrentPosition" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I currently work here
                  </label>
                </div>
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
                value={newEmployment.noticePeroid}
                onChange={handleEmploymentChange}
                className="auth-input"
                placeholder="e.g. 15 Days"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newEmployment.description}
                onChange={handleEmploymentChange}
                className="auth-input"
                rows={4}
                placeholder="Describe your responsibilities, achievements, and projects"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsAddingEmployment(false);
                setNewEmployment({
                  title: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  isCurrentPosition: false,
                  isFullTime: true,
                  description: '',
                  noticePeroid: ''
                });
              }}
              disabled={loading}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddEmployment}
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

      {profile.employment && profile.employment.length > 0 ? (
        <div className="space-y-4">
          {profile.employment.map((employment, index) => (
            <div key={employment._id || index} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => toggleExpandEmployment(employment._id)}
              >
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">{employment.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{employment.company}</span>
                      {employment.isFullTime !== undefined && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                          ({employment.isFullTime ? 'Full-time' : 'Part-time'})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {employment.startDate || 'Start'} - {employment.isCurrentPosition ? 'Present' : (employment.endDate || 'End')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEmployment(employment._id);
                    }}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedEmployment === employment._id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedEmployment === employment._id && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  {employment.location && (
                    <div className="mb-2 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Location:</span> {employment.location}
                    </div>
                  )}
                  
                  {employment.noticePeroid && (
                    <div className="mb-2 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notice Period:</span> {employment.noticePeroid}
                    </div>
                  )}
                  
                  {employment.description && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{employment.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No employment history added yet. Add your work experience to showcase your career path.</p>
        </div>
      )}
    </div>
  );
};
