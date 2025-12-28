/**
 * Template Data
 * 3 Department-specific templates (HTML based)
 */

export interface PortfolioTemplate {
  id: number;
  name: string;
  department: 'IT' | 'CSE' | 'MECH';
  category: string;
  color: string;
  rating: number;
  uses: number;
  description: string;
  templatePath: string; // Path to the index.html in public folder
  previewImage: string;
  style: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: 'modern' | 'classic' | 'minimal' | 'bold' | 'creative';
  };
}

export interface SavedPortfolio {
  id: string;
  templateId: number;
  templateName: string;
  previewImage: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  htmlContent: string; // The full HTML content of the portfolio
  style: PortfolioTemplate['style'];
  shareLink: string;
  isPublic: boolean;
  views: number;
  visitors: number;
}

// Default user data placeholder (kept for reference, though new editor extracts from HTML)
export const defaultUserData = {
  name: 'Poovi',
  title: 'Full Stack Developer',
  email: 'poovi@example.com',
  phone: '+91 98765 43210',
  location: 'Chennai, India',
};

export const categories = ['All', 'IT', 'CSE', 'MECH'];

// The new 3 HTML templates
export const templates: PortfolioTemplate[] = [
  {
    id: 1,
    name: 'Hudson',
    department: 'IT',
    category: 'IT Professional',
    color: 'from-blue-500 to-cyan-500',
    rating: 4.9,
    uses: 120,
    description: 'Clean and modern design for IT professionals. Features a dark mode aesthetic and clean typography.',
    templatePath: '/templates/Hudson/index.html',
    previewImage: '/templates/Hudson/images/intro-bg.jpg',
    style: { primaryColor: '#3B82F6', secondaryColor: '#06B6D4', fontFamily: 'Inter', layout: 'modern' },
  },
  {
    id: 2,
    name: 'iPortfolio',
    department: 'CSE',
    category: 'Computer Science',
    color: 'from-indigo-600 to-purple-600',
    rating: 4.8,
    uses: 340,
    description: 'Minimalist and academic design suitable for Computer Science engineers and researchers.',
    templatePath: '/templates/iPortfolio/index.html',
    previewImage: '/templates/iPortfolio/assets/img/hero-bg.jpg',
    style: { primaryColor: '#4F46E5', secondaryColor: '#7C3AED', fontFamily: 'Poppins', layout: 'minimal' },
  },
  {
    id: 3,
    name: 'Mark',
    department: 'MECH',
    category: 'Mechanical Engineering',
    color: 'from-orange-500 to-amber-600',
    rating: 4.7,
    uses: 210,
    description: 'Robust and structured layout designed for Mechanical Engineers and industry portfolios.',
    templatePath: '/templates/mark/index.html', // Note: mark folder was empty, user should ensure content exists
    previewImage: '/templates/Hudson/images/intro-bg.jpg', // Fallback to Hudson bg for now since mark is empty
    style: { primaryColor: '#F59E0B', secondaryColor: '#D97706', fontFamily: 'Roboto', layout: 'classic' },
  },
];
