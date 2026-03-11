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
    <section className="py-4 py-md-5" style={{ backgroundColor: "#A9D6E5" }}>
      <div className="container px-3 px-md-4">
        {/* Header - PERFECT RESPONSIVE */}
        <div className="text-center mb-4 mb-md-5">
          <h2 
            className="fw-bold mb-3 mb-md-4 display-5"
            style={{ 
              color: "#19747E",
              fontSize: "clamp(1.75rem, 4.5vw, 2.8rem)",
              lineHeight: 1.2,
              fontWeight: "900"
            }}
          >
            {missionVisionData.title}
          </h2>
          <p 
            className="lead mx-auto"
            style={{ 
              color: "#19747E", 
              fontSize: "clamp(1rem, 2.8vw, 1.25rem)",
              maxWidth: "550px",
              fontWeight: "500"
            }}
          >
            {missionVisionData.subtitle}
          </p>
        </div>

        {/* Cards - PERFECT MOBILE LAYOUT */}
        <div className="row g-4 g-lg-5 justify-content-center">
          {missionVisionData.cards.map((card, index) => (
            <div 
              key={index} 
              className="col-12 col-sm-10 col-md-6 col-lg-5"
            >
              <div 
                className="mission-card h-100 position-relative text-center p-4 p-md-5 rounded-4"
                style={{
                  background: `linear-gradient(145deg, #FFFFFF 0%, #F8FBFF 100%)`,
                  boxShadow: "0 20px 40px rgba(25,116,126,0.12)",
                  border: "1px solid rgba(25,116,126,0.15)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  minHeight: "clamp(260px, 35vh, 320px)",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 30px 60px rgba(25,116,126,0.25)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(25,116,126,0.12)";
                }}
              >
                {/* Icon Container */}
                <div 
                  className="mx-auto mb-4 position-relative"
                  style={{
                    width: "clamp(80px, 18vw, 100px)",
                    height: "clamp(80px, 18vw, 100px)",
                    background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 15px 35px rgba(25,116,126,0.3)",
                    border: "4px solid white",
                    zIndex: 2
                  }}
                >
                  <span 
                    style={{ 
                      color: "white", 
                      fontSize: "clamp(2rem, 6vw, 2.8rem)",
                      fontWeight: "bold"
                    }}
                  >
                    {card.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-grow-1 d-flex flex-column justify-content-center">
                  <h3 
                    className="fw-bold mb-3"
                    style={{ 
                      color: card.color,
                      fontSize: "clamp(1.35rem, 3.5vw, 1.85rem)",
                      lineHeight: 1.3,
                      marginBottom: "1rem !important"
                    }}
                  >
                    {card.title}
                  </h3>
                  
                  <p 
                    className="mb-4 flex-grow-1"
                    style={{ 
                      color: "#19747E",
                      fontSize: "clamp(0.95rem, 2.5vw, 1.18rem)",
                      lineHeight: 1.65,
                      fontWeight: "400"
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                {/* Decorative Line */}
                <div 
                  style={{
                    width: "clamp(55px, 12vw, 70px)",
                    height: "4px",
                    background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                    borderRadius: "2px",
                    margin: "0 auto",
                    boxShadow: "0 2px 8px rgba(25,116,126,0.2)"
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
