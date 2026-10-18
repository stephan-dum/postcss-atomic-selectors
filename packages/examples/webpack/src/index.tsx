import React from 'react';
import { createRoot } from 'react-dom/client';
import Example from './components/Example';
import './root.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error(
    'Failed to find the root element. Make sure index.html has a <div id="root"></div>',
  );
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>,
);
