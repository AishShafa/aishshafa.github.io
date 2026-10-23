// Keep React's development checks enabled while mounting the application.
import { StrictMode } from 'react'
// Use React DOM's client renderer to attach the application to the HTML root.
import { createRoot } from 'react-dom/client'
// Load global tokens, layout rules, and component styles before rendering.
import './index.css'
// Import the root component that composes the portfolio page.
import App from './App.jsx'

// Mount the portfolio into the element declared in index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
