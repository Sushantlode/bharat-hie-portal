import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/portal.css';
import './styles/visibility.css';
import './styles/motion.css';
import './styles/skeleton.css';

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

// Make relative legacy asset URLs (assets/...) resolve under GitHub Pages base
if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
  const existing = document.querySelector('base');
  if (!existing) {
    const base = document.createElement('base');
    base.href = import.meta.env.BASE_URL;
    document.head.prepend(base);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename === '/' ? undefined : basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
