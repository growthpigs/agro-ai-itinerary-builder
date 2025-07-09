import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// DIAGNOSTIC: Track script execution
console.log('[MAIN] Script starting...');
console.log('[MAIN] Current URL:', window.location.href);
console.log('[MAIN] Document readyState:', document.readyState);

// DIAGNOSTIC: Check if we're running too early
if (document.readyState === 'loading') {
  console.log('[MAIN] Document still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  console.log('[MAIN] Document ready, mounting immediately');
  mountApp();
}

function mountApp() {
  console.log('[MAIN] Attempting to mount React app...');
  
  // DIAGNOSTIC: Check DOM state
  console.log('[MAIN] Document body exists:', !!document.body);
  console.log('[MAIN] Body innerHTML length:', document.body.innerHTML.length);
  
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('[MAIN] FATAL: Root element not found!');
    console.error('[MAIN] Document body:', document.body.innerHTML);
    return;
  }
  
  console.log('[MAIN] Root element found:', rootElement);
  console.log('[MAIN] Root element tag:', rootElement.tagName);
  console.log('[MAIN] Root element ID:', rootElement.id);
  
  try {
    const root = createRoot(rootElement);
    console.log('[MAIN] React root created successfully');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('[MAIN] React render method called');
  } catch (error) {
    console.error('[MAIN] FATAL: Failed to create/render React app:', error);
    if (error instanceof Error) {
      console.error('[MAIN] Error stack:', error.stack);
    }
  }
}