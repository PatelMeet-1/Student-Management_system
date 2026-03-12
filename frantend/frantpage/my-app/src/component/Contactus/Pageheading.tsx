import React from "react";

const PageHeader: React.FC<{ subtitle?: string }> = ({ 
   
  subtitle = "Get in touch with us for any queries or support" 
}) => {
  return (
    <section 
      className="py-4 py-md-5 py-lg-6 position-relative overflow-hidden text-center"
      style={{ 
        backgroundColor: "#A9D6E5",
        minHeight: "clamp(200px, 35vh, 300px)",
        color: "white",
        position: "relative"
      }}
    >
      {/* Background Pattern */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
        style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }}
      />

      <div className="container position-relative z-index-1 h-100 d-flex align-items-center">
        <div className="w-100">
          {/* Main Icon */}
          <div 
            className="mx-auto mb-3 mb-md-4"
            style={{
              width: "clamp(60px, 12vw, 80px)",
              height: "clamp(60px, 12vw, 80px)",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(255,255,255,0.2)"
            }}
          >
            <span style={{ 
              fontSize: "clamp(2rem, 5vw, 2.8rem)", 
              fontWeight: "bold" 
            }}>
              📞
            </span>
          </div>

          {/* Main Title */}
          <h1 
            className="fw-bold mb-3 mb-md-4 display-4"
            style={{ 
                color:"#19747E",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              lineHeight: 1.1,
              fontWeight: "900",
              textShadow: "0 4px 15px rgba(0,0,0,0.2)",
              marginBottom: "clamp(1rem, 3vw, 1.5rem)"
            }}
          >
            Contact Us
          </h1>

          {/* Subtitle */}
          <p 
            className="lead mb-0 px-3 px-md-0"
            style={{ 
                color:"#19747E",
              fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
              fontWeight: "500",
              maxWidth: "600px",
              margin: "0 auto",
              opacity: 0.95,
              lineHeight: 1.6
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
