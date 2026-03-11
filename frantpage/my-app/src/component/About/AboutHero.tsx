import React from "react";

const PageHeader = ({ title = "About Us", subtitle = "Learn more about our Student Management System" }) => {
  return (
    <section 
      className="py-5 text-center"  // ✅ py-4 se py-5 kiya (thoda height badhaya)
      style={{ 
        backgroundColor: "#19747E",
        color: "white",
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
          className="fw-bold mb-4"  // ✅ mb-3 se mb-4 kiya
          style={{ 
            fontSize: "3.5rem",  // ✅ 2.8rem se 3.5rem (BADA TEXT)
            color: "white",
            textShadow: "0 3px 12px rgba(0,0,0,0.4)",  // ✅ Shadow bhi thoda strong
            marginBottom: "1.5rem",  // ✅ Extra spacing
            lineHeight: 1.1  // ✅ Better line height
          }}
        >
          {title}
        </h1>
        
        <p 
          className="lead mb-0 display-6"  // ✅ display-6 class add kiya
          style={{ 
            fontSize: "1.6rem",  // ✅ 1.3rem se 1.6rem (BADA TEXT)
            color: "rgba(255,255,255,0.98)",  // ✅ Thoda brighter
            maxWidth: "700px",
            margin: "0 auto 2rem",  // ✅ Extra bottom spacing
            fontWeight: "400",
            letterSpacing: "-0.02em"  // ✅ Professional touch
          }}
        >
          {subtitle}
        </p>
        
        {/* Decorative Line - Thoda bada */}
        <div 
          className="mt-4 mx-auto"
          style={{
            width: "120px",  // ✅ 80px se 120px
            height: "6px",   // ✅ 4px se 6px
            backgroundColor: "#19747E",
            borderRadius: "3px",
            boxShadow: "0 4px 12px rgba(25,116,126,0.5)"  // ✅ Stronger shadow
          }}
        />
      </div>
    </section>
  );
};

export default PageHeader;
