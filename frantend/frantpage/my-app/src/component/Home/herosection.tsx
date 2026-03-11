import React from "react";

const Hero: React.FC = () => {
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
          <div className="col-12 col-md-6">
            <h1
              className="fw-bold mb-4 display-4 display-md-3"
              style={{ color: "#19747E" }} // Dark Cyan
            >
              Student Management System
            </h1>

            <p className="lead mb-4" style={{ fontSize: "1.1rem" }}>
              A smart platform to manage students, departments and
              courses efficiently in one place.
            </p>

            <div className="d-flex flex-column flex-md-row gap-3">
              <button
                className="btn btn-primary px-4 py-2 flex-fill flex-md-fill"
                style={{
                  backgroundColor: "#19747E", // Dark Cyan
                  borderColor: "#19747E",
                  color: "white"
                }}
              >
                Login
              </button>

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
          <div className="col-12 col-md-6 text-center">
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
