
import { useEffect, useState } from 'react';
import { FileText, Briefcase, GraduationCap, Code, FileCode, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickLinksProps {
  className?: string;
}

export const QuickLinks = ({ className }: QuickLinksProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Handle scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'resume',
        'profile-summary',
        'skills',
        'employment',
        'education',
        'projects'
      ];
      
      // Find the section that is currently in view
      const currentSection = sections.find((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        // Consider the section in view if it's near the top of the viewport
        return rect.top <= 150 && rect.bottom >= 150;
      });
      
      setActiveSection(currentSection || null);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll to the element with some offset from the top
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const linkItems = [
    { id: 'resume', label: 'Resume', icon: <FileText className="h-4 w-4" /> },
    { id: 'profile-summary', label: 'Profile Summary', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'skills', label: 'Key Skills', icon: <Code className="h-4 w-4" /> },
    { id: 'employment', label: 'Employment', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'projects', label: 'Projects', icon: <FileCode className="h-4 w-4" /> }
  ];

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md p-4", className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
      <ul className="space-y-1">
        {linkItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                activeSection === item.id
                  ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
