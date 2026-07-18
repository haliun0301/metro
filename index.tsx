/*
  index.tsx
  - Application entry point. Mounts the React app into the DOM element with id 'root'.
  - If the root node is missing the app throws to make the problem obvious during development.
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // Fail fast during development if the expected DOM element is missing
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);