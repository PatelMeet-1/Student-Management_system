import React from "react";

const LocationMap: React.FC = () => {
  // 🎨 YOUR COLORS - PERFECT SYSTEM
  const colors = {
    primary: "#19747E",
    primaryLight: "#A9D6E5", 
    secondary: "#D1E8E2",
    accent: "#E2E2E2",
    white: "#FFFFFF",
    lightGray: "#F8FAFC",
    shadow: "rgba(25,116,126,0.12)",
    shadowLg: "rgba(25,116,126,0.2)"
  };

  // Surendranagar exact location
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.789849614614!2d71.65539997603468!3d22.67819997924791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3958c8f4b8b8b8b8%3A0x1234567890abcdef!2sSurendranagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1699999999999";

  return (
    <section className="py-5 py-md-6 py-lg-7 position-relative overflow-hidden" style={{backgroundColor:"#E2E2E2"}}>
      {/* Background Pattern */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 opacity-20"
        style={{
        //   backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.primaryLight}10 0%, transparent 50%), 
        //                    radial-gradient(circle at 75% 75%, ${colors.secondary}10 0%, transparent 50%)`,
          backgroundSize: "100% 100%"
        }}
      />
      
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            
            {/* ✨ Enhanced Section Header */}
            <div className="text-center mb-5 position-relative">
              <div 
                className="mx-auto mb-4 p-3 rounded-circle d-inline-block"
                style={{
                  width: "80px",
                  height: "80px",
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                  boxShadow: `0 10px 30px ${colors.shadow}`
                }}
              >
                <span style={{ fontSize: "2.2rem" }}>🏫</span>
              </div>
              
              <h2 
                className="display-5 fw-bold mb-3" 
                style={{ 
                  color: colors.primary,
                  backgroundColor: `#19747E`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Institution Location
              </h2>
              <p 
                className="lead mb-0 px-4 px-md-0" 
                style={{ 
                  color: "#666", 
                  maxWidth: "600px", 
                  margin: "0 auto",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)"
                }}
              >
                Find us at Surendranagar, Gujarat. Easily accessible location for students and visitors.
              </p>
            </div>

            {/* ✨ Premium Map Container */}
            <div 
              className="position-relative rounded-5 overflow-hidden mb-4"
              style={{ 
                boxShadow: `0 35px 80px ${colors.shadow}`,
                border: `1px solid ${colors.secondary}`,
                borderTop: `8px solid ${colors.primary}`,
                background: colors.white
              }}
            >
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="500"
                style={{ 
                  border: 0, 
                  minHeight: "clamp(400px, 50vh, 500px)",
                  filter: "grayscale(0.05) contrast(1.05) brightness(1.02)",
                  borderRadius: "24px",
                  transition: "filter 0.3s ease"
                }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Institution Location"
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "grayscale(0) contrast(1.1) brightness(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "grayscale(0.05) contrast(1.05) brightness(1.02)";
                }}
              />

              {/* ✨ Enhanced Overlay */}
              <div 
                className="position-absolute bottom-0 start-0 w-100 py-3 px-4"
                style={{
                  background: `linear-gradient(transparent, ${colors.primary}10)`,
                  pointerEvents: "none"
                }}
              >
                <h6 className="text-white mb-0 fw-bold" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                  📍 Surendranagar, Gujarat
                </h6>
              </div>
            </div>

            {/* ✨ Premium Location Card */}
            <div 
              className="p-4 p-md-5 rounded-4 text-center position-relative overflow-hidden"
              style={{ 
                backgroundColor: "#A9D6E5",
                boxShadow: `0 20px 50px ${colors.shadow}`,
                border: `1px solid ${colors.secondary}`,
                borderTop: `6px solid ${colors.primary}`,
                transform: "translateY(-10px)"
              }}
            >
              {/* Icon Container */}
              <div 
                className="mx-auto mb-4 position-relative"
                style={{
                  width: "90px",
                  backgroundColor:"#19747E",
                  height: "90px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 15px 35px ${colors.shadowLg}`,
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05) rotate(5deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>📍</span>
              </div>
              
              <h3 className="h4 fw-bold mb-4" style={{ color: colors.primary }}>
                Visit Our Campus
              </h3>
              
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <p className="fw-semibold mb-1" style={{ color: colors.primary, fontSize: "1.15rem" }}>
                    📍 Surendranagar, Gujarat, India
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="fw-semibold mb-1" style={{ color: colors.primary, fontSize: "1.15rem" }}>
                    🕒 Mon-Sat: 9 AM - 6 PM
                  </p>
                </div>
              </div>
              
              <p className="text-muted mb-4">
                Easily accessible from all major transport routes. Ample parking available.
              </p>
              
              {/* CTA Button */}
              <a 
                href={mapEmbedUrl.replace("embed", "maps")} 
                target="_blank"
                className="btn btn-lg fw-bold px-4 py-2 text-decoration-none"
                style={{
                  background: `#19747E`,
                  color: colors.white,
                  borderRadius: "50px",
                  boxShadow: `0 10px 30px ${colors.shadow}`,
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 15px 40px ${colors.shadowLg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadow}`;
                }}
              >
                🗺️ Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
