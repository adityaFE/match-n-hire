import { IJobBase } from '../../models/Job';

export const jobsData: IJobBase[] = [
  {
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$100,000 - $130,000',
    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for developing and implementing user interface components using React.js and other frontend technologies. The ideal candidate has experience with modern JavaScript frameworks and responsive design.',
    requirements: [
      '3+ years of React experience',
      'TypeScript knowledge',
      'CSS/SCSS proficiency'
    ],
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    postedDate: '15/06/2023'
  },
  {
    title: 'Backend Engineer',
    company: 'DataSystems Inc.',
    location: 'New York, NY',
    salary: '$120,000 - $150,000',
    description: 'We are seeking a Backend Engineer to design and implement scalable APIs and services. You will work closely with frontend developers and product managers to ensure our systems meet business requirements and performance goals.',
    requirements: [
      'Experience with Node.js or Python',
      'Knowledge of SQL and NoSQL databases',
      'Familiarity with cloud services (AWS/Azure/GCP)'
    ],
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    postedDate: '02/07/2023'
  },
  {
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    location: 'Remote',
    salary: '$90,000 - $115,000',
    description: 'Join our design team to create intuitive and engaging user experiences. You will collaborate with product managers and developers to design wireframes, prototypes, and high-fidelity mockups for web and mobile applications.',
    requirements: [
      'Portfolio demonstrating UI/UX skills',
      'Proficiency in Figma or Adobe XD',
      'Understanding of user-centered design principles'
    ],
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    postedDate: '20/06/2023'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    salary: '$110,000 - $140,000',
    description: 'We need a skilled DevOps Engineer to implement and manage our CI/CD pipelines and infrastructure. You will automate deployment processes and ensure system reliability and scalability.',
    requirements: [
      'Experience with Docker and Kubernetes',
      'Knowledge of infrastructure as code (Terraform/CloudFormation)',
      'Experience with monitoring and logging tools'
    ],
    imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    postedDate: '08/07/2023'
  },
  {
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'Boston, MA',
    salary: '$130,000 - $160,000',
    description: 'We are looking for a Data Scientist to join our AI team. You will analyze complex datasets, build machine learning models, and develop algorithms to solve business problems.',
    requirements: [
      'MS or PhD in Computer Science, Statistics, or related field',
      'Experience with Python, R, and ML frameworks',
      'Knowledge of statistical analysis and data visualization'
    ],
    imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    postedDate: '12/06/2023'
  }
];
