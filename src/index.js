import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import reportWebVitals from './reportWebVitals';


const container = document.getElementById('root');
const root = createRoot(container); // Create a root

root.render( // Use root.render()
  <React.StrictMode>
  
        <App />
     
  </React.StrictMode>
);

reportWebVitals();