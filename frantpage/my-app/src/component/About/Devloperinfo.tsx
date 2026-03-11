import React from "react";
import developerPhoto from './WhatsApp Image 2026-03-09 at 10.29.14 AM.jpeg'; 

const projectData = {
  developer: {
    name: "Imtiyaj Rafikbhai Pathan",
    qualification: "Mern Stack Developer",
    address: "Surendranagar, Gujarat, India"
  },
  projectName: "Student Management System",
  technologies: [
    { name: "React", icon: "⚛️" },
    { name: "TypeScript", icon: "🔤" },
    { name: "Node.js", icon: "🟢" },
    { name: "MongoDB", icon: "🟢" },
    { name: "Bootstrap", icon: "💎" },
    { name: "JWT Auth", icon: "🔐" }
  ],
  features: [
    "Multi-role authentication",
    "Student & Course Management", 
    "Real-time Attendance Tracking",
    "Result & Grade Management",
    "Responsive Dashboard Design"
  ]
};

const DeveloperInfoSection: React.FC = () => {
  return (
    <section className="py-5" style={{ backgroundColor: "#D1E8E2" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          
          {/* Left - Developer Profile */}
          <div className="col-lg-4 col-md-12 text-center">
            <div 
              style={{
                position: "relative",
                width: "220px",
                height: "220px",
                margin: "0 auto 1.5rem",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(25,116,126,0.3)",
                border: "5px solid white"
              }}
            >
              <img 
                src={developerPhoto} 
                alt="Meet Patel"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              <div 
                style={{
                  position: "absolute",
                  bottom: "15px",
                  right: "15px",
                  width: "25px",
                  height: "25px",
                  backgroundColor: "#19747E",
                  borderRadius: "50%",
                  border: "3px solid white"
                }}
              />
            </div>
            
            <h2 
              className="fw-bold mb-3"
              style={{ color: "#19747E", fontSize: "2rem" }}
            >
              {projectData.developer.name}
            </h2>
            
            <div 
              style={{
                backgroundColor: "rgba(25,116,126,0.1)",
                padding: "12px 24px",
                borderRadius: "30px",
                marginBottom: "1rem",
                border: "2px solid #19747E"
              }}
            >
              <p className="mb-0 fw-semibold" style={{ color: "#19747E", fontSize: "1.15rem" }}>
                {projectData.developer.qualification}
              </p>
            </div>
            
            <p style={{ 
              color: "#19747E", 
              fontSize: "1.1rem",
              fontWeight: "500",
              backgroundColor: "white",
              padding: "10px 20px",
              borderRadius: "20px",
              margin: 0
            }}>
              📍 {projectData.developer.address}
            </p>
          </div>

          {/* Right - Project Info */}
          <div className="col-lg-8 col-md-12">
            <div 
              style={{ 
                padding: "2.5rem", 
                backgroundColor: "white",
                borderRadius: "25px", 
                boxShadow: "0 15px 35px rgba(25,116,126,0.15)",
                border: "1px solid rgba(25,116,126,0.1)"
              }}
            >
              <div className="mb-5 text-center">
                <h1 
                  className="fw-bold mb-3"
                  style={{ color: "#19747E", fontSize: "2.5rem" }}
                >
                  {projectData.projectName}
                </h1>
                <div 
                  style={{
                    width: "100px",
                    height: "5px",
                    backgroundColor: "#19747E",
                    borderRadius: "3px",
                    margin: "0 auto"
                  }}
                />
              </div>

              <div className="mb-5">
                <h4 className="fw-bold mb-4" style={{ color: "#19747E" }}>
                  🛠️ Technologies Used
                </h4>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  {projectData.technologies.map((tech, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 fw-semibold rounded-pill shadow-sm"
                      style={{
                        backgroundColor: "#19747E",
                        color: "white",
                        fontSize: "0.95rem",
                        boxShadow: "0 5px 15px rgba(25,116,126,0.3)"
                      }}
                    >
                      <span style={{ marginRight: "6px", fontSize: "1.1rem" }}>
                        {tech.icon}
                      </span>
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="fw-bold mb-4" style={{ color: "#19747E" }}>
                  ✨ Key Features
                </h4>
                <div className="row g-3">
                  {projectData.features.map((feature, index) => (
                    <div key={index} className="col-lg-6 col-md-6">
                      <div 
                        className="p-3 d-flex align-items-start"
                        style={{ 
                          backgroundColor: "rgba(25,116,126,0.05)",
                          borderRadius: "15px",
                          borderLeft: "5px solid #19747E",
                          boxShadow: "0 5px 20px rgba(25,116,126,0.1)"
                        }}
                      >
                        <span style={{ 
                          color: "#19747E", 
                          fontSize: "1.4rem", 
                          marginRight: "15px",
                          marginTop: "2px"
                        }}>
                          ✨
                        </span>
                        <div className="fw-semibold" style={{ color: "#19747E" }}>
                          {feature}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperInfoSection;
