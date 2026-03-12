import React from "react";
import dashboardImage from './OIP (1).jpg';

const AboutSystemSection: React.FC = () => {
  return (
    <section className="py-3 py-md-4 py-lg-5" style={{ backgroundColor: "#E2E2E2" }}>
      <div className="container px-2 px-md-3">
        <div className="row align-items-center g-3 g-md-4 g-lg-5">
          
          {/* Left - Local Image (FULLY RESPONSIVE) */}
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <div 
              style={{
                width: "100%",
                height: "clamp(280px, 40vw, 450px)",
                position: "relative",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(25,116,126,0.15)",
                overflow: "hidden",
                border: "1px solid rgba(25,116,126,0.1)",
                marginBottom: "1.5rem"
              }}
            >
              {/* YOUR LOCAL IMAGE */}
              <img 
                src={dashboardImage}
                alt="Admin Dashboard"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              
           

              {/* Online Status Dot */}
              <div 
              
              />
            </div>
          </div>

          {/* Right - Text (MOBILE FIRST) */}
          <div className="col-12 col-lg-6 order-1 order-lg-2 text-center text-lg-start mb-4 mb-lg-0">
            <h2 
              className="fw-bold mb-3 mb-md-4"
              style={{ 
                color: "#19747E",
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                lineHeight: 1.2,
                marginBottom: "1rem !important"
              }}
            >
              About Our 
              <span style={{ color: "#19747E", fontWeight: "900" }}>Student</span>
              <br className="d-lg-none" />
              Management System
            </h2>

            <p 
              className="lead mb-4 px-2 px-md-0"
              style={{ 
                color: "#19747E",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                lineHeight: 1.7,
                marginBottom: "1.5rem !important"
              }}
            >
              Complete academic management solution jo aapke institution ko 
              next level pe le jayega.
            </p>

            {/* Features List - MOBILE STACKED */}
            <div className="row g-3 mb-4">
              {[
                { icon: "👤", title: "Student Data Management", desc: "Complete student profiles, enrollment, aur records" },
                { icon: "📚", title: "Course Management", desc: "Timetable, assignments, aur course allocation" },
                { icon: "🏢", title: "Department Management", desc: "Faculty allocation aur department-wise reports" },
                { icon: "📊", title: "Result & Attendance", desc: "Real-time marks entry aur attendance tracking" }
              ].map((feature, index) => (
                <div key={index} className="col-12 col-md-6 px-2">
                  <div className="d-flex align-items-start py-2">
                    <div 
                      style={{
                        width: "clamp(38px, 8vw, 48px)",
                        height: "clamp(38px, 8vw, 48px)",
                        backgroundColor: "#19747E",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(25,116,126,0.2)"
                      }}
                    >
                      <span style={{ color: "white", fontSize: "clamp(1rem, 4vw, 1.3rem)" }}>
                        {feature.icon}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 
                        className="fw-bold mb-1" 
                        style={{ 
                          color: "#19747E",
                          fontSize: "clamp(0.95rem, 2.8vw, 1.15rem)",
                          marginBottom: "0.25rem !important"
                        }}
                      >
                        {feature.title}
                      </h6>
                      <p 
                        className="mb-0 small lh-sm" 
                        style={{ 
                          color: "#19747E", 
                          fontSize: "clamp(0.8rem, 2.3vw, 0.9rem)"
                        }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                className="btn fw-bold px-4 px-md-5 py-2 py-md-3"
                style={{ 
                  backgroundColor: "#19747E",
                  color: "white",
                  borderRadius: "25px",
                  border: "none",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                  boxShadow: "0 8px 25px rgba(25,116,126,0.3)",
                  padding: "0.75rem 1.75rem"
                }}
              >
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSystemSection;
