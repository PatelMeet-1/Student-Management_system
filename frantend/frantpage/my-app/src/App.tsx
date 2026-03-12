import React from "react";
import { Routes, Route } from "react-router-dom";  // BrowserRouter NHI import karein

import Home from "./pages/Home";
import Navbar from "./pages/navbar";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Contactus from "./pages/Contactus";

function App() {
  return (
    <div className="App">
   
      <Navbar/>
      {/* Navbar fixed hai to padding add karein */}
      <div className="mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Courses" element={<Courses />} />
          <Route path="/Contactus" element={<Contactus />} />


          
        </Routes>
      </div>
    </div>
  );
}

export default App;
