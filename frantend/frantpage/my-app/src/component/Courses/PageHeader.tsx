import React from "react";

const CoursesHeader: React.FC = () => {
  return (
    <section 
      className="py-5 position-relative overflow-hidden"
      style={{ 
        backgroundColor: "#A9D6E5",
        minHeight: "400px",
        display: "flex",
        alignItems: "center"
      }}
    >
      {/* Optional Background Pattern */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
        style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2319747E' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }}
      />

      <div className="container position-relative z-index-1">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8 col-md-10">
            
            {/* Main Icon */}
            <div 
              className="mb-4 mx-auto"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "rgba(25,116,126,0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 15px 35px rgba(25,116,126,0.15)",
                border: "3px solid rgba(25,116,126,0.2)"
              }}
            >
              <span style={{ 
                fontSize: "4rem", 
                color: "#19747E" 
              }}>
                📚
              </span>
            </div>

            {/* Title */}
            <h1 
              className="fw-bold mb-4 display-4"
              style={{ 
                color: "#19747E",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.2,
                fontWeight: "900"
              }}
            >
              Our Courses
            </h1>

            {/* Short Description */}
            <p 
              className="lead mb-5"
              style={{ 
                color: "#19747E",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                fontWeight: "500",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              "Explore the academic programs available in our institution."
            </p>

            {/* Decorative Line */}
            <div 
              style={{
                width: "100px",
                height: "4px",
                background: "linear-gradient(90deg, transparent, #19747E, transparent)",
                margin: "0 auto 2rem",
                borderRadius: "2px"
              }}
            />

            {/* CTA Button */}
            <div>
              <button
                className="btn fw-bold px-5 py-3"
                style={{ 
                  backgroundColor: "#19747E",
                  color: "white",
                  borderRadius: "50px",
                  fontSize: "1.1rem",
                  boxShadow: "0 15px 35px rgba(25,116,126,0.3)",
                  border: "none"
                }}
              >
                View All Courses →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesHeader;
