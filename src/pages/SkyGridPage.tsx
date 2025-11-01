import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SkyGridApp from '../skygrid/App';
import '../skygrid/index.css';

export default function SkyGridPage() {
  const { theme } = useTheme();
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set page title
    document.title = 'SkyGrid – Local Flight Tracker';

    // Add the Inconsolata font for SkyGrid
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);
    
    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);
    
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Fade in when component mounts
    setIsVisible(true);

    return () => {
      // Restore original title when leaving SkyGrid
      document.title = 'Adam Nassef Personal Portfolio Website';
    };
  }, []);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    
    // Wait for fade-out animation to complete before navigating
    setTimeout(() => {
      navigate('/');
    }, 300); // Match the transition duration
  };

  return (
    <>
      {!isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
          <div className="text-gray-400 font-mono text-sm uppercase tracking-widest">
            Initializing...
          </div>
        </div>
      )}
      <div className={`skygrid-app transition-opacity duration-300 ${isExiting ? 'opacity-0' : isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handleBackClick}
          className={`absolute bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 border rounded transition-all font-medium text-sm uppercase tracking-wider ${
            theme === 'light'
              ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400'
              : 'bg-[#0a0a0a] border-[#1a1a1a] text-gray-400 hover:text-white hover:border-gray-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </button>
        <SkyGridApp />
      </div>
    </>
  );
}

