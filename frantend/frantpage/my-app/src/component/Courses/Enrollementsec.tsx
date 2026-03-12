import React from "react";
import CountUp from "react-countup";
const EnrollmentCTA: React.FC = () => {
  return (
    <section 
      className="py-5 py-md-6 position-relative overflow-hidden"
      style={{ 
        background: "#E2E2E2",
        minHeight: "clamp(320px, 45vh, 500px)",
        display: "flex",
        alignItems: "center",
        position: "relative"
      }}
    >
    

      <div className="container position-relative z-index-1 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6 px-3 px-md-4">
            
            {/* Main Icon */}
            <div 
              className="mx-auto mb-4"
              style={{
                width: "clamp(85px, 16vw, 110px)",
                height: "clamp(85px, 16vw, 110px)",
                backgroundColor: "#19747E",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 15px 35px rgba(25,116,126,0.4)",
                border: "4px solid white"
              }}
            >
              <span style={{ 
                fontSize: "clamp(2.8rem, 7vw, 4rem)", 
                fontWeight: "bold",
                color: "white"
              }}>
                🎓
              </span>
            </div>

            {/* Main Heading - English */}
            <h1 
              className="fw-bold mb-4 display-4"
              style={{ 
                fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
                lineHeight: 1.15,
                fontWeight: "900",
                color: "#19747E",
                textShadow: "0 3px 10px rgba(0,0,0,0.2)"
              }}
            >
              Enroll in Your Favorite
              <br className="d-none d-md-block" />
              Course Today!
            </h1>

            {/* Subtext - English */}
            <p 
              className="lead mb-5 px-3 px-md-0"
              style={{ 
                fontSize: "clamp(1rem, 2.8vw, 1.25rem)",
                fontWeight: "500",
                maxWidth: "520px",
                margin: "0 auto",
                color: "#19747E",
                lineHeight: 1.6
              }}
            >
              Take the first step towards your dream career. 
              Join 5000+ students already transforming their future.
            </p>

            {/* Stats Row */}
        
<div className="container">
  <div className="row g-4 mb-5 justify-content-center text-center">

    {/* Students */}
    <div className="col-12 col-sm-4 col-lg-2">
      <div
        className="fw-bold mx-auto"
        style={{
          fontSize: "clamp(1.6rem, 4.5vw, 2.3rem)",
          color: "#19747E",
          backgroundColor: "white",
          display: "inline-block",
          padding: "8px 16px",
          borderRadius: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
      >
<CountUp 
  end={5000} 
  duration={3} 
  enableScrollSpy={true} 
  scrollSpyOnce={false}
/>+      </div>
      <div className="small fw-semibold mt-2" style={{ color: "#19747E" }}>
        Students Enrolled
      </div>
    </div>

    {/* Courses */}
    <div className="col-12 col-sm-4 col-lg-2 ms-md-5">
      <div
        className="fw-bold mx-auto ms-md-5"
        style={{
          fontSize: "clamp(1.6rem, 4.5vw, 2.3rem)",
          color: "#19747E", 
          backgroundColor: "white",
          display: "inline-block",
          padding: "8px 16px",
          borderRadius: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
      >
<CountUp 
  end={12} 
  duration={2} 
  enableScrollSpy={true} 
  scrollSpyOnce={false}
/>      </div>
      <div className="small fw-semibold mt-2 ms-md-5" style={{ color: "#19747E" }}>
        Courses Offered
      </div>
    </div>

    {/* Placement */}
    <div className="col-12 col-sm-4 col-lg-2">
      <div
        className="fw-bold mx-auto ms-md-5"
        style={{
          fontSize: "clamp(1.6rem, 4.5vw, 2.3rem)",
          color: "#19747E",
          backgroundColor: "white",
          display: "inline-block",
          padding: "8px 16px",
          borderRadius: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
      >
<CountUp 
  end={95} 
  duration={2} 
  enableScrollSpy={true} 
  scrollSpyOnce={false}
/>%  
 </div>
      <div className="small fw-semibold mt-2 ms-md-5" style={{ color: "#19747E" }}>
        Placement Rate
      </div>
    </div>

  </div>
</div>


            {/* CTA Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center flex-wrap">
              <a 
                href="https://student-management-system-1frantuser.onrender.com"
                className="btn btn-lg fw-bold px-4 px-md-5 py-3 rounded-pill shadow-lg flex-fill"
                style={{
                  backgroundColor: "#19747E",
                  color: "white",
                  fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)",
                  boxShadow: "0 12px 30px rgba(25,116,126,0.4)",
                  border: "none",
                  transition: "all 0.3s ease"
                }}
              >
                🔐 Login Now
              </a>
              
              <a 
                href="/register"
                className="btn btn-lg fw-bold px-4 px-md-5 py-3 rounded-pill shadow-lg flex-fill"
                style={{
                  backgroundColor: "white",
                  color: "#19747E",
                  fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)",
                  border: "2px solid #19747E",
                  boxShadow: "0 12px 30px rgba(25,116,126,0.3)",
                  transition: "all 0.3s ease"
                }}
              >
                📝 Register Free
              </a>
            </div>

            {/* Trust Badge */}
            <div className="mt-5 pt-4" style={{ 
              borderTop: "1px solid rgba(25,116,126,0.3)",
              paddingTop: "1.5rem"
            }}>
              <p className="mb-0 fw-semibold" style={{ 
                fontSize: "clamp(0.9rem, 2.2vw, 1rem)", 
                color: "#19747E" 
              }}>
                ✅ Trusted by 50+ Educational Institutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnrollmentCTA;
