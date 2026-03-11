import React from "react";

const missionVisionData = {
  title: "Our Mission & Vision",
  subtitle: "Dedicated to transforming academic management",
  cards: [
    {
      icon: "🎯",
      title: "Our Mission",
      description: "To simplify student data management for educational institutions with intuitive tools and seamless workflows.",
      color: "#19747E"
    },
    {
      icon: "👁️",
      title: "Our Vision",
      description: "To build a secure and modern academic management platform that sets new standards in educational technology.",
      color: "#19747E"
    }
  ]
};

const MissionVisionSection: React.FC = () => {
  return (
    <section className="py-5" style={{ backgroundColor: "#D1E8E2" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 
            className="fw-bold mb-4"
            style={{ 
              color: "#19747E",
              fontSize: "2.8rem"
            }}
          >
            {missionVisionData.title}
          </h2>
          <p style={{ 
            color: "#19747E", 
            fontSize: "1.2rem",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {missionVisionData.subtitle}
          </p>
        </div>

        <div className="row g-5 justify-content-center">
          {missionVisionData.cards.map((card, index) => (
            <div key={index} className="col-lg-5 col-md-6">
              <div 
                className="p-5 text-center h-100 position-relative overflow-hidden rounded-4"
                style={{
                  background: `linear-gradient(145deg, white 0%, #F8F9FA 100%)`,
                  boxShadow: "0 20px 40px rgba(25,116,126,0.15)",
                  border: "1px solid rgba(25,116,126,0.1)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 30px 60px rgba(25,116,126,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(25,116,126,0.15)";
                }}
              >
                {/* Icon - Fixed Position */}
                <div 
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "90px",
                    height: "90px",
                    backgroundColor: card.color,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(25,116,126,0.3)",
                    zIndex: 10,
                    
                  }}
                >
                  <span style={{ 
                    color: "white", 
                    fontSize: "2.5rem" 
                  }}>
                    {card.icon}
                  </span>
                </div>

                <h3 
                  className="fw-bold mb-4 mt-5" 
                  style={{ 
                    color: card.color,
                    fontSize: "1.8rem",
                    marginTop: "120px"
                  }}
                >
                  {card.title}
                </h3>
                
                <p 
                  className="lead mb-4"
                  style={{ 
                    color: card.color,
                    fontSize: "1.15rem",
                    lineHeight: 1.7,
                    fontWeight: "400"
                  }}
                >
                  {card.description}
                </p>

                {/* Decorative Line */}
                <div 
                  className="mt-4 mx-auto"
                  style={{
                    width: "60px",
                    height: "4px",
                    backgroundColor: card.color,
                    borderRadius: "2px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
