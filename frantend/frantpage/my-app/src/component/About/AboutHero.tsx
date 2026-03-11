import React from "react";

const PageHeader = ({ title = "About Us", subtitle = "Learn more about our Student Management System" }) => {
  return (
    <section 
      className="py-5 text-center"
      style={{ 
        backgroundColor: "#A9D6E5",  // background light blue
        color: "#19747E",            // ✅ text color changed
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Pattern */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(25,116,126,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(25,116,126,0.05) 0%, transparent 50%)`,
          pointerEvents: "none"
        }}
      />
      
      <div className="container position-relative">
        <h1 
          className="fw-bold mb-4"
          style={{ 
            fontSize: "3.5rem",
            color: "#19747E",           // ✅ title color
            textShadow: "0 3px 12px rgba(0,0,0,0.2)", // optional: thoda subtle shadow
            marginBottom: "1.5rem",
            lineHeight: 1.1
          }}
        >
          {title}
        </h1>
        
        <p 
          className="lead mb-0 display-6"
          style={{ 
            fontSize: "1.6rem",
            color: "#19747E",           // ✅ subtitle color
            maxWidth: "700px",
            margin: "0 auto 2rem",
            fontWeight: "400",
            letterSpacing: "-0.02em"
          }}
        >
          {subtitle}
        </p>
        
        {/* Decorative Line */}
        <div 
          className="mt-4 mx-auto"
          style={{
            width: "120px",
            height: "6px",
            backgroundColor: "#19747E",
            borderRadius: "3px",
            boxShadow: "0 4px 12px rgba(25,116,126,0.5)"
          }}
        />
      </div>
    </section>
  );
};

export default PageHeader;