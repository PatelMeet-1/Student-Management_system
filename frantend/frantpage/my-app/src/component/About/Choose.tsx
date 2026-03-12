import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const whyChooseData = {
  title: "Why Choose Our System",
  subtitle: "Trusted by thousands of educational institutions worldwide",
  features: [
    {
      icon: "✅",
      title: "Easy to Use",
      description: "Intuitive interface jo koi bhi easily samajh sakta hai"
    },
    {
      icon: "🔒",
      title: "Secure System", 
      description: "Advanced encryption aur role-based access control"
    },
    {
      icon: "⚡",
      title: "Fast Performance",
      description: "Lightning fast loading aur smooth user experience"
    },
    {
      icon: "☁️",
      title: "Cloud Based",
      description: "Anywhere access with automatic backups"
    },
    {
      icon: "📱",
      title: "Mobile Responsive",
      description: "Perfect on desktop, tablet aur mobile devices"
    },
    {
      icon: "💰",
      title: "Affordable Pricing",
      description: "Best value for money with no hidden charges"
    }
  ]
};

const WhyChooseSection: React.FC = () => {
  useEffect(() => {
  AOS.init({
    duration: 1000,
    once: false
  });

  AOS.refresh();
}, []);
  return (
    <section className="py-5" style={{ backgroundColor: "#E2E2E2" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 
            className="fw-bold mb-4"
            style={{ 
              color: "#19747E",
              fontSize: "2.8rem"
            }}
          >
            {whyChooseData.title}
          </h2>
          <p 
            className="lead"
            style={{ 
              color: "#19747E", 
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            {whyChooseData.subtitle}
          </p>
        </div>

        <div className="row g-4" data-aos="zoom-in">
          {whyChooseData.features.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div 
                className="p-4 h-100 text-center position-relative"
                style={{
                  background: `linear-gradient(145deg, white 0%, #F8F9FA 100%)`,
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(25,116,126,0.1)",
                  border: "1px solid rgba(25,116,126,0.05)",
                  transition: "all 0.3s ease",
                  height: "100%"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(25,116,126,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(25,116,126,0.1)";
                }}
              >
                {/* Feature Icon */}
                <div 
                  style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "70px",
                    height: "70px",
                    backgroundColor: "#19747E",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(25,116,126,0.3)",
                    fontSize: "2rem"
                  }}
                >
                  <span style={{ color: "white" }}>
                    {feature.icon}
                  </span>
                </div>

                {/* Feature Content */}
                <div style={{ paddingTop: "50px" }}>
                  <h4 
                    className="fw-bold mb-3"
                    style={{ 
                      color: "#19747E",
                      fontSize: "1.3rem"
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p 
                    style={{ 
                      color: "#19747E",
                      fontSize: "0.95rem",
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Line */}
                <div 
                  className="mt-3 mx-auto"
                  style={{
                    width: "50px",
                    height: "3px",
                    backgroundColor: "#19747E",
                    borderRadius: "2px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="row mt-5 pt-5" style={{ borderTop: "1px solid rgba(25,116,126,0.1)", backgroundColor:"#A9D6E5" }}>
          <div className="col-md-3 text-center mb-4">
            <h3 style={{ color: "#19747E", fontSize: "2.5rem", fontWeight: "bold" }}>10K+</h3>
            <p style={{ color: "#19747E", fontSize: "1rem" }}>Happy Institutions</p>
          </div>
          <div className="col-md-3 text-center mb-4">
            <h3 style={{ color: "#19747E", fontSize: "2.5rem", fontWeight: "bold" }}>50K+</h3>
            <p style={{ color: "#19747E", fontSize: "1rem" }}>Active Students</p>
          </div>
          <div className="col-md-3 text-center mb-4">
            <h3 style={{ color: "#19747E", fontSize: "2.5rem", fontWeight: "bold" }}>99.9%</h3>
            <p style={{ color: "#19747E", fontSize: "1rem" }}>Uptime Guarantee</p>
          </div>
          <div className="col-md-3 text-center mb-4">
            <h3 style={{ color: "#19747E", fontSize: "2.5rem", fontWeight: "bold" }}>24/7</h3>
            <p style={{ color: "#19747E", fontSize: "1rem" }}>Support Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
