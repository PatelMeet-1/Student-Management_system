import React from "react";

const AboutSystemSection: React.FC = () => {
  return (
    <section className="py-5" style={{ backgroundColor: "#E2E2E2" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          
          {/* Left - Image (FIXED) */}
          <div className="col-lg-6 col-md-12">
            <div 
              style={{
                height: "450px",
                background: "linear-gradient(135deg, #D1E8E2 0%, white 100%)",
                borderRadius: "25px",
                boxShadow: "0 25px 50px rgba(25,116,126,0.15)",
                overflow: "visible",  // ✅ KEY FIX: hidden se visible kiya
                position: "relative",
                border: "1px solid rgba(25,116,126,0.1)"
              }}
            >
              {/* Mock Dashboard - POSITION FIXED */}
              <div 
                style={{
                  position: "absolute",
                  top: "25%",      // ✅ Fixed top position
                  left: "10%",     // ✅ Fixed left position (right: -10% remove)
                  width: "80%",
                  height: "55%",
                  background: `linear-gradient(45deg, 
                    rgba(25,116,126,0.2) 0%, 
                    rgba(25,116,126,0.1) 50%, 
                    rgba(25,116,126,0.15) 100%)`,
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(25,116,126,0.25), inset 0 0 40px rgba(255,255,255,0.7)",
                  border: "2px solid rgba(255,255,255,0.9)"
                }}
              />
              
              {/* Multiple Dashboard Elements */}
              <div 
                style={{
                  position: "absolute",
                  top: "35%",
                  right: "15%",
                  width: "35%",
                  height: "20%",
                  background: `linear-gradient(135deg, 
                    rgba(25,116,126,0.15) 0%, 
                    rgba(255,255,255,0.3) 100%)`,
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(25,116,126,0.2)"
                }}
              />
              
              <div 
                style={{
                  position: "absolute",
                  bottom: "25%",
                  left: "20%",
                  width: "45%",
                  height: "15%",
                  background: "rgba(255,255,255,0.4)",
                  borderRadius: "10px",
                  boxShadow: "0 8px 20px rgba(25,116,126,0.15)"
                }}
              />

              {/* Dashboard Label */}
              <div 
                className="position-absolute bottom-0 start-0 p-4"
                style={{ zIndex: 20 }}
              >
                <h4 style={{ 
                  color: "#19747E", 
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  marginBottom: "0.25rem"
                }}>
                  📊 Admin Dashboard
                </h4>
                <p style={{ 
                  color: "#19747E", 
                  fontSize: "0.95rem",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  Real-time analytics & insights
                </p>
              </div>
            </div>
          </div>

          {/* Right - Text */}
          <div className="col-lg-6 col-md-12">
            <div>
              <h2 
                className="fw-bold mb-4"
                style={{ 
                  color: "#19747E",
                  fontSize: "2.8rem",
                  lineHeight: 1.2
                }}
              >
                About Our 
                <span style={{ color: "#19747E", fontWeight: "900" }}>Student</span> 
                <br />
                Management System
              </h2>

              <p 
                className="lead mb-5"
                style={{ 
                  color: "#19747E",
                  fontSize: "1.2rem",
                  lineHeight: 1.7
                }}
              >
                Complete academic management solution jo aapke institution ko 
                next level pe le jayega.
              </p>

              {/* Features List */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#19747E",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "15px",
                        flexShrink: 0,
                        boxShadow: "0 5px 15px rgba(25,116,126,0.2)"
                      }}
                    >
                      <span style={{ color: "white", fontSize: "1.4rem" }}>👤</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#19747E" }}>
                        Student Data Management
                      </h5>
                      <p className="mb-0" style={{ color: "#19747E", fontSize: "0.95rem" }}>
                        Complete student profiles, enrollment, aur records
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#19747E",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "15px",
                        flexShrink: 0,
                        boxShadow: "0 5px 15px rgba(25,116,126,0.2)"
                      }}
                    >
                      <span style={{ color: "white", fontSize: "1.4rem" }}>📚</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#19747E" }}>
                        Course Management
                      </h5>
                      <p className="mb-0" style={{ color: "#19747E", fontSize: "0.95rem" }}>
                        Timetable, assignments, aur course allocation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#19747E",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "15px",
                        flexShrink: 0,
                        boxShadow: "0 5px 15px rgba(25,116,126,0.2)"
                      }}
                    >
                      <span style={{ color: "white", fontSize: "1.4rem" }}>🏢</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#19747E" }}>
                        Department Management
                      </h5>
                      <p className="mb-0" style={{ color: "#19747E", fontSize: "0.95rem" }}>
                        Faculty allocation aur department-wise reports
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div 
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#19747E",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "15px",
                        flexShrink: 0,
                        boxShadow: "0 5px 15px rgba(25,116,126,0.2)"
                      }}
                    >
                      <span style={{ color: "white", fontSize: "1.4rem" }}>📊</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#19747E" }}>
                        Result & Attendance
                      </h5>
                      <p className="mb-0" style={{ color: "#19747E", fontSize: "0.95rem" }}>
                        Real-time marks entry aur attendance tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  className="btn fw-bold px-5 py-3"
                  style={{ 
                    backgroundColor: "#19747E",
                    color: "white",
                    borderRadius: "30px",
                    border: "none",
                    fontSize: "1.1rem",
                    boxShadow: "0 10px 30px rgba(25,116,126,0.3)"
                  }}
                >
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSystemSection;
