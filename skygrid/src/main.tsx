import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: red;">
      <div>
        <h1>Application Error</h1>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Check the browser console for more details.</p>
      </div>
    </div>
  `;
}
