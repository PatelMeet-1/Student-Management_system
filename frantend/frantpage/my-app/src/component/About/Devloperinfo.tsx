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
    <section className="py-3 py-md-4 py-lg-5" style={{ backgroundColor: "#A9D6E5" }}>
      <div className="container px-2 px-sm-3 px-md-4 px-lg-5">
        {/* Section Header - FIXED */}
        <div className="text-center mb-4 mb-md-5 px-2 px-sm-3">
          <h2 
            className="fw-bold mb-3 mb-md-4"
            style={{ 
              color: "#19747E", 
              fontSize: "clamp(1.75rem, 5vw, 2.8rem)",
              background: "linear-gradient(45deg, #19747E, rgba(25,116,126,0.8))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2
            }}
          >
            👨‍💻 Developer Information
          </h2>
        </div>

        <div className="row g-3 g-sm-4 g-md-5 align-items-lg-start">
          
          {/* Developer Profile - MOBILE PERFECT */}
          <div className="col-12 col-lg-4 text-center mb-4 mb-lg-0">
            <div 
              style={{
                position: "relative",
                width: "clamp(150px, 32vw, 220px)",
                height: "clamp(150px, 32vw, 220px)",
                margin: "0 auto 1.25rem auto",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(25,116,126,0.25)",
                border: "4px solid white"
              }}
            >
              <img 
                src={developerPhoto} 
                alt="Imtiyaj Rafikbhai Pathan"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              <div 
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  width: "clamp(16px, 2.8vw, 22px)",
                  height: "clamp(16px, 2.8vw, 22px)",
                  backgroundColor: "#19747E",
                  borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow: "0 3px 10px rgba(25,116,126,0.4)"
                }}
              />
            </div>
            
            <h3 
              className="fw-bold mb-3 px-2"
              style={{ 
                color: "#19747E", 
                fontSize: "clamp(1.35rem, 4vw, 1.8rem)",
                lineHeight: 1.2,
                wordBreak: "break-word"
              }}
            >
              {projectData.developer.name}
            </h3>
            
            <div 
              style={{
                backgroundColor: "rgba(25,116,126,0.1)",
                padding: "clamp(0.7rem, 2vw, 0.95rem) clamp(0.9rem, 3vw, 1.4rem)",
                borderRadius: "25px",
                marginBottom: "0.875rem",
                border: "2px solid #19747E"
              }}
            >
              <p 
                className="mb-0 fw-semibold px-2" 
                style={{ 
                  color: "#19747E", 
                  fontSize: "clamp(0.9rem, 2.7vw, 1.15rem)",
                  lineHeight: 1.3
                }}
              >
                {projectData.developer.qualification}
              </p>
            </div>
            
            <p 
              style={{ 
                color: "#19747E", 
                fontSize: "clamp(0.85rem, 2.4vw, 1.05rem)",
                fontWeight: "500",
                backgroundColor: "white",
                padding: "0.65rem 1.1rem",
                borderRadius: "16px",
                margin: 0,
                display: "inline-block",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
            >
              📍 {projectData.developer.address}
            </p>
          </div>

          {/* Project Info - MOBILE PERFECT */}
          <div className="col-12 col-lg-8">
            <div 
              style={{ 
                padding: "clamp(1.25rem, 3.5vw, 2.25rem)", 
                backgroundColor: "white",
                borderRadius: "18px", 
                boxShadow: "0 10px 28px rgba(25,116,126,0.12)",
                border: "1px solid rgba(25,116,126,0.08)"
              }}
            >
              {/* Project Title */}
              <div className="text-center mb-3 mb-md-4 mb-lg-5 px-2">
                <h1 
                  className="fw-bold mb-2 mb-md-3"
                  style={{ 
                    color: "#19747E", 
                    fontSize: "clamp(1.75rem, 4.5vw, 2.4rem)",
                    lineHeight: 1.2
                  }}
                >
                  {projectData.projectName}
                </h1>
                <div 
                  style={{
                    width: "clamp(55px, 11vw, 90px)",
                    height: "3px",
                    backgroundColor: "#19747E",
                    borderRadius: "2px",
                    margin: "0 auto"
                  }}
                />
              </div>

              {/* Technologies */}
              <div className="mb-3 mb-md-4 mb-lg-5 text-center text-lg-start px-1 px-sm-2">
                <h5 
                  className="fw-bold mb-2 mb-md-3" 
                  style={{ 
                    color: "#19747E",
                    fontSize: "clamp(1.05rem, 2.8vw, 1.35rem)"
                  }}
                >
                  🛠️ Technologies Used
                </h5>
                <div 
                  className="d-flex flex-wrap gap-1 gap-sm-2 gap-md-3 justify-content-center justify-content-lg-start"
                  style={{ padding: "0 0.5rem" }}
                >
                  {projectData.technologies.map((tech, index) => (
                    <div 
                      key={index}
                      className="px-2 px-sm-3 py-1 py-sm-1.5 fw-semibold rounded-pill shadow-sm"
                      style={{
                        backgroundColor: "#19747E",
                        color: "white",
                        fontSize: "clamp(0.75rem, 2.1vw, 0.92rem)",
                        boxShadow: "0 3px 10px rgba(25,116,126,0.22)"
                      }}
                    >
                      <span style={{ 
                        marginRight: "3px", 
                        fontSize: "clamp(0.85rem, 2.3vw, 1.05rem)" 
                      }}>
                        {tech.icon}
                      </span>
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="px-1 px-sm-2">
                <h5 
                  className="fw-bold mb-2 mb-md-3" 
                  style={{ 
                    color: "#19747E",
                    fontSize: "clamp(1.05rem, 2.8vw, 1.35rem)"
                  }}
                >
                  ✨ Key Features
                </h5>
                <div className="row g-2 g-sm-3">
                  {projectData.features.map((feature, index) => (
                    <div key={index} className="col-12 col-sm-6 px-1 px-sm-1.5">
                      <div 
                        className="p-2 p-sm-2.5 d-flex align-items-start w-100"
                        style={{ 
                          backgroundColor: "rgba(25,116,126,0.05)",
                          borderRadius: "10px",
                          borderLeft: "3px solid #19747E",
                          boxShadow: "0 2px 12px rgba(25,116,126,0.08)",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(5px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span 
                          style={{ 
                            color: "#19747E", 
                            fontSize: "clamp(1rem, 2.8vw, 1.35rem)", 
                            marginRight: "8px",
                            marginTop: "1px",
                            flexShrink: 0,
                            minWidth: "28px"
                          }}
                        >
                          ✨
                        </span>
                        <div 
                          className="fw-semibold lh-sm pe-2" 
                          style={{ 
                            color: "#19747E",
                            fontSize: "clamp(0.82rem, 2.2vw, 0.98rem)"
                          }}
                        >
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
