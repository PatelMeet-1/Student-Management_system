// App.js - Main Router Setup
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './component/Navbar';
import HomePage from './component/HomePage';
import AboutPage from './component/AboutPage';
import ContactPage from './component/ContactPage';


function App() {
  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <Routes> 
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
     
        </Routes>
      </div>
    </Router>
  );
}

export default App;
