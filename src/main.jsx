import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './styles/index.css'
import App from './App.jsx'
import Projects from './Projects.jsx'
import ProjectGallery from './ProjectGallery.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />       
        <Route path="/projects" element={<Projects />} /> 
        <Route path="/project/:id" element={<ProjectGallery />} />      
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
