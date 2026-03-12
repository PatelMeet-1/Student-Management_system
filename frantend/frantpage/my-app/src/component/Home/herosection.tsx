import React, { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {

 useEffect(() => {
  AOS.init({
    duration: 1000,
    once: false
  });

  AOS.refresh();
}, []);
  return (
    <section
      className="py-4 py-md-5 "
      style={{ 
        backgroundColor: "#A9D6E5", 
        minHeight: "80vh" 
      }}
    >
      
      <div className="container">
        <div className="row align-items-center g-4 g-md-0">
          {/* Left Side Text */}
          
          <div className="col-12 col-md-6" data-aos="fade-up">
            <h1
              className="fw-bold mb-4 display-4 display-md-3"
              style={{ color: "#19747E" }} // Dark Cyan
            >
              Student Dashboard

            </h1>

            <p className="lead mb-4" style={{ fontSize: "1.1rem" }}>
             Login to access your complete academic dashboard -Result, timetable & exam schedule in one place.
            </p>

            <div className="d-flex flex-column flex-md-row gap-3">
          

<a href="https://student-management-system-1frantuser.onrender.com">
  <button
    className="btn btn-primary px-4 py-2 flex-fill flex-md-fill"
    style={{
      backgroundColor: "#19747E",
      borderColor: "#19747E",
      color: "white"
    }}
  >
    Login
  </button>
</a>

              <button
                className="btn btn-outline-primary px-4 py-2 flex-fill flex-md-fill"
                style={{
                  border: "2px solid #A9D6E5", // Light Blue
                  color: "#19747E", // Dark Cyan
                  backgroundColor: "transparent"
                }}
              >
                
              </button>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="col-12 col-md-6 text-center" data-aos="fade-up">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              alt="students"
              className="img-fluid"
              style={{ maxWidth: "400px", width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
