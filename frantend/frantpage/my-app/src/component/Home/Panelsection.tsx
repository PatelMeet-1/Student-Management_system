import React from "react";

const Panels: React.FC = () => {
  return (
    <section className="py-5" style={{backgroundColor:"#E2E2E2"}} >
      <div className="container text-center">
        <h2 className="fw-bold mb-3" style={{ color: "#19747E" }}>
          System Panels
        </h2>
        <p className="mb-5" style={{ color: "#19747E", fontSize: "1.1rem" }}>
          Our system provides dedicated panels for Admin, HOD and Students
          to manage academic activities efficiently.
        </p>

        <div
          id="panelsCarousel"
          className="carousel slide shadow mx-auto"
          data-bs-ride="carousel"
          style={{ 
            background: "linear-gradient(135deg, #D1E8E2 0%, #A9D6E5 100%)",
            borderRadius: "20px",
            maxWidth: "750px",
            height: "480px",
            boxShadow: "0 20px 40px rgba(25,116,126,0.15)"
          }}
        >
          <div className="carousel-inner h-100">
            
            {/* Admin Panel Slide */}
            <div className="carousel-item active h-100">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center px-4 py-5">
                <div style={{
                  backgroundColor: "#19747E",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "30px",
                  boxShadow: "0 10px 30px rgba(25,116,126,0.3)"
                }}>
                  <i className="bi bi-person-gear" style={{ fontSize: "50px", color: "white" }}></i>
                </div>
                <h3 className="mb-4 fw-bold" style={{ color: "#19747E", fontSize: "2.2rem" }}>
                  Admin Panel
                </h3>
                <p className="lead mb-5 px-4" style={{ color: "#19747E", maxWidth: "500px" }}>
                  Manage departments, courses and students with full administrative control.
                </p>
                <button
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: "#19747E",
                    color: "white",
                    borderRadius: "50px",
                    fontSize: "18px",
                    boxShadow: "0 8px 25px rgba(25,116,126,0.3)",
                    border: "none"
                  }}
                >
                  Explore →
                </button>
              </div>
            </div>

            {/* HOD Panel Slide */}
            <div className="carousel-item h-100">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center px-4 py-5">
                <div style={{
                  backgroundColor: "#19747E",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "30px",
                  boxShadow: "0 10px 30px rgba(25,116,126,0.3)"
                }}>
                  <i className="bi bi-building" style={{ fontSize: "50px", color: "white" }}></i>
                </div>
                <h3 className="mb-4 fw-bold" style={{ color: "#19747E", fontSize: "2.2rem" }}>
                  HOD Panel
                </h3>
                <p className="lead mb-5 px-4" style={{ color: "#19747E", maxWidth: "500px" }}>
                  Manage faculty members and monitor students in your department easily.
                </p>
                <button
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: "#19747E",
                    color: "white",
                    borderRadius: "50px",
                    fontSize: "18px",
                    boxShadow: "0 8px 25px rgba(25,116,126,0.3)",
                    border: "none"
                  }}
                >
                  Explore →
                </button>
              </div>
            </div>

            {/* Student Panel Slide */}
            <div className="carousel-item h-100">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center px-4 py-5">
                <div style={{
                  backgroundColor: "#19747E",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "30px",
                  boxShadow: "0 10px 30px rgba(25,116,126,0.3)"
                }}>
                  <i className="bi bi-mortarboard" style={{ fontSize: "50px", color: "white" }}></i>
                </div>
                <h3 className="mb-4 fw-bold" style={{ color: "#19747E", fontSize: "2.2rem" }}>
                  Student Panel
                </h3>
                <p className="lead mb-5 px-4" style={{ color: "#19747E", maxWidth: "500px" }}>
                  Students can view their courses, profile and academic results easily.
                </p>
                <button
                  className="btn px-5 py-3 fw-semibold"
                  style={{
                    backgroundColor: "#19747E",
                    color: "white",
                    borderRadius: "50px",
                    fontSize: "18px",
                    boxShadow: "0 8px 25px rgba(25,116,126,0.3)",
                    border: "none"
                  }}
                >
                  Explore →
                </button>
              </div>
            </div>

          </div>

          {/* Carousel Controls - Hidden for cleaner look */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#panelsCarousel"
            data-bs-slide="prev"
            style={{ width: "50px", opacity: 0.7 }}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: "#19747E" }}></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#panelsCarousel"
            data-bs-slide="next"
            style={{ width: "50px", opacity: 0.7 }}
          >
            <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: "#19747E" }}></span>
            <span className="visually-hidden">Next</span>
          </button>

          {/* Improved Indicators */}
          <div className="carousel-indicators" style={{ bottom: "-60px" }}>
            <button
              type="button"
              data-bs-target="#panelsCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
              style={{ 
                width: "14px", 
                height: "14px", 
                borderRadius: "50%",
                backgroundColor: "#19747E",
                margin: "0 6px",
                boxShadow: "0 4px 12px rgba(25,116,126,0.4)"
              }}
            ></button>
            <button
              type="button"
              data-bs-target="#panelsCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
              style={{ 
                width: "14px", 
                height: "14px", 
                borderRadius: "50%",
                backgroundColor: "#19747E",
                margin: "0 6px",
                boxShadow: "0 4px 12px rgba(25,116,126,0.4)"
              }}
            ></button>
            <button
              type="button"
              data-bs-target="#panelsCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
              style={{ 
                width: "14px", 
                height: "14px", 
                borderRadius: "50%",
                backgroundColor: "#19747E",
                margin: "0 6px",
                boxShadow: "0 4px 12px rgba(25,116,126,0.4)"
              }}
            ></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Panels;
