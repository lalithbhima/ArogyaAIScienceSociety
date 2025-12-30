import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Assuming App.jsx is in the same src directory
import './index.css'     // Your main CSS file with Tailwind directives

// This is the standard way to render a React application using React 18+
// It finds the HTML element with the id 'root' (in public/index.html)
// and renders the App component inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode is a tool for highlighting potential problems in an application.
  // It activates additional checks and warnings for its descendants.
  // It does not render any visible UI and only runs in development mode.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
