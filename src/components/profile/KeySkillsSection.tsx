
import { useState } from 'react';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, Skill, addSkill, deleteSkill } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface KeySkillsSectionProps {
  profile: UserProfile;
  uid: string;
  refreshProfile: () => void;
}

export const KeySkillsSection = ({ profile, uid, refreshProfile }: KeySkillsSectionProps) => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    version: '',
    lastUsed: new Date().getFullYear().toString(),
    experience: ''
  });
  const { toast } = useToast();

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast({
        title: "Skill name required",
        description: "Please enter a skill name.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await addSkill(uid, newSkill);
      
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully."
      });
      
      refreshProfile();
      setIsAddingSkill(false);
      setNewSkill({
        name: '',
        version: '',
        lastUsed: new Date().getFullYear().toString(),
        experience: ''
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add skill",
        description: "An error occurred while adding the skill.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string | undefined) => {
    if (!skillId) return;
    
    setLoading(true);
    try {
      await deleteSkill(uid, skillId);
      
      toast({
        title: "Skill deleted",
        description: "The skill has been deleted successfully."
      });
      
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete skill",
        description: "An error occurred while deleting the skill.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="skills" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Skills</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingSkill(true)}
          disabled={isAddingSkill}
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Skill</span>
        </Button>
      </div>

      {isAddingSkill && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={newSkill.name}
                onChange={handleSkillChange}
                className="auth-input"
                placeholder="e.g. JavaScript, Python"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="version" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Version/Framework
              </label>
              <input
                id="version"
                name="version"
                type="text"
                value={newSkill.version}
                onChange={handleSkillChange}
                className="auth-input"
                placeholder="e.g. ES6, React, 3.9"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastUsed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Used
              </label>
              <input
                id="lastUsed"
                name="lastUsed"
                type="text"
                value={newSkill.lastUsed}
                onChange={handleSkillChange}
                className="auth-input"
                placeholder="e.g. 2024"
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
                value={newSkill.experience}
                onChange={handleSkillChange}
                className="auth-input"
                placeholder="e.g. 3 Years 6 Months"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsAddingSkill(false);
                setNewSkill({
                  name: '',
                  version: '',
                  lastUsed: new Date().getFullYear().toString(),
                  experience: ''
                });
              }}
              disabled={loading}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddSkill}
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

      {profile.skills && profile.skills.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skill</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Used</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Experience</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {profile.skills.map((skill, index) => (
                <tr key={skill._id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{skill.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{skill.version || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{skill.lastUsed || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{skill.experience || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSkill(skill._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No skills added yet. Add your key skills to showcase your expertise.</p>
        </div>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <span 
              key={skill._id || index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
