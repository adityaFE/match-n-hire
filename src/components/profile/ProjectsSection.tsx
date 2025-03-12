
import { useState } from 'react';
import { Edit, Save, X, Plus, Trash2, Link, Github, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, Project, addProject, deleteProject } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProjectsSectionProps {
  profile: UserProfile;
  uid: string;
  refreshProfile: () => void;
}

export const ProjectsSection = ({ profile, uid, refreshProfile }: ProjectsSectionProps) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    name: '',
    description: '',
    url: '',
    skills: [],
    startDate: '',
    endDate: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const { toast } = useToast();

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setNewProject((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setNewProject((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill)
    }));
  };

  const handleAddProject = async () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await addProject(uid, newProject);
      
      toast({
        title: "Project added",
        description: "Your project has been added successfully."
      });
      
      refreshProfile();
      setIsAddingProject(false);
      setNewProject({
        name: '',
        description: '',
        url: '',
        skills: [],
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add project",
        description: "An error occurred while adding the project.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string | undefined) => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      await deleteProject(uid, projectId);
      
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully."
      });
      
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete project",
        description: "An error occurred while deleting the project.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandProject = (id: string | undefined) => {
    if (!id) return;
    setExpandedProject(expandedProject === id ? null : id);
  };

  return (
    <div id="projects" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingProject(true)}
          disabled={isAddingProject}
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Project</span>
        </Button>
      </div>

      {isAddingProject && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Project</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={newProject.name}
                onChange={handleProjectChange}
                className="auth-input"
                placeholder="e.g. E-commerce Website"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Project URL
              </label>
              <input
                id="url"
                name="url"
                type="text"
                value={newProject.url}
                onChange={handleProjectChange}
                className="auth-input"
                placeholder="e.g. https://github.com/username/project"
              />
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
                  value={newProject.startDate}
                  onChange={handleProjectChange}
                  className="auth-input"
                  placeholder="e.g. Jan 2023"
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
                  value={newProject.endDate}
                  onChange={handleProjectChange}
                  className="auth-input"
                  placeholder="e.g. Mar 2023 or Ongoing"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProject.description}
                onChange={handleProjectChange}
                className="auth-input"
                rows={3}
                placeholder="Describe the project, your role, and technologies used"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="skills" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills Used
              </label>
              <div className="flex items-center">
                <input
                  id="skills"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="auth-input"
                  placeholder="e.g. React, Node.js"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button 
                  type="button"
                  variant="outline"
                  className="ml-2"
                  onClick={handleAddSkill}
                >
                  Add
                </Button>
              </div>
              
              {newProject.skills && newProject.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {skill}
                      <button 
                        type="button"
                        className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsAddingProject(false);
                setNewProject({
                  name: '',
                  description: '',
                  url: '',
                  skills: [],
                  startDate: '',
                  endDate: ''
                });
                setSkillInput('');
              }}
              disabled={loading}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddProject}
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

      {profile.projects && profile.projects.length > 0 ? (
        <div className="space-y-4">
          {profile.projects.map((project, index) => (
            <div key={project._id || index} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => toggleExpandProject(project._id)}
              >
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">{project.name}</h3>
                  {(project.startDate || project.endDate) && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.startDate || ''} - {project.endDate || 'Present'}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project._id);
                    }}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedProject === project._id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedProject === project._id && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  {project.url && (
                    <div className="mb-3">
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Link className="h-4 w-4 mr-1" />
                        <span>{project.url}</span>
                      </a>
                    </div>
                  )}
                  
                  {project.description && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{project.description}</p>
                    </div>
                  )}
                  
                  {project.skills && project.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No projects added yet. Add your projects to showcase your work and skills.</p>
        </div>
      )}
    </div>
  );
};
