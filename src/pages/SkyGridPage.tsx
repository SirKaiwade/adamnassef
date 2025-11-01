import { useEffect } from 'react';
import SkyGridApp from '../skygrid/App';
import '../skygrid/index.css';

export default function SkyGridPage() {
  useEffect(() => {
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

    return () => {
      // Cleanup when leaving SkyGrid
      // No need to restore body styles since they're scoped to .skygrid-app now
    };
  }, []);

  return (
    <div className="skygrid-app">
      <SkyGridApp />
    </div>
  );
}

