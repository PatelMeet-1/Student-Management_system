import React from "react";

const ContactInfo: React.FC = () => {
  return (
    <section className="py-5 py-md-6 py-lg-7" style={{backgroundColor:"#E2E2E2"}}>
      <div className="container">
        <div className="row g-4 g-md-5 justify-content-center">
          
          {/* Email Card */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div 
              className="h-100 text-center p-4 p-md-5 rounded-4 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
                border: "1px solid #D1E8E2",
                boxShadow: "0 15px 35px rgba(25,116,126,0.1)",
                borderTop: "6px solid #19747E",
                transition: "all 0.3s ease",
                minHeight: "clamp(220px, 25vh, 260px)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 25px 50px rgba(25,116,126,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(25,116,126,0.1)";
              }}
            >
              {/* Icon */}
              <div 
                className="mx-auto mb-3"
                style={{
                  width: "clamp(65px, 14vw, 80px)",
                  height: "clamp(65px, 14vw, 80px)",
                  background: "linear-gradient(135deg, #19747E, #A9D6E5)",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(25,116,126,0.3)"
                }}
              >
                <span style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)" }}>📧</span>
              </div>

              {/* Content */}
              <h5 className="fw-bold mb-2" style={{ color: "#19747E", fontSize: "clamp(1.1rem, 2.8vw, 1.3rem)" }}>
                Email
              </h5>
              <a 
                href="mailto:info@studentms.com"
                className="fw-semibold text-decoration-none"
                style={{ 
                  color: "#19747E", 
                  fontSize: "clamp(0.95rem, 2.3vw, 1.1rem)",
                  display: "block"
                }}
              >
                info@studentms.com
              </a>
            </div>
          </div>

          {/* Phone Card */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div 
              className="h-100 text-center p-4 p-md-5 rounded-4 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
                border: "1px solid #D1E8E2",
                boxShadow: "0 15px 35px rgba(25,116,126,0.1)",
                borderTop: "6px solid #19747E",
                transition: "all 0.3s ease",
                minHeight: "clamp(220px, 25vh, 260px)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 25px 50px rgba(25,116,126,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(25,116,126,0.1)";
              }}
            >
              {/* Icon */}
              <div 
                className="mx-auto mb-3"
                style={{
                  width: "clamp(65px, 14vw, 80px)",
                  height: "clamp(65px, 14vw, 80px)",
                  background: "linear-gradient(135deg, #19747E, #A9D6E5)",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(25,116,126,0.3)"
                }}
              >
                <span style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)" }}>📞</span>
              </div>

              {/* Content */}
              <h5 className="fw-bold mb-2" style={{ color: "#19747E", fontSize: "clamp(1.1rem, 2.8vw, 1.3rem)" }}>
                Phone
              </h5>
              <a 
                href="tel:+919876543210"
                className="fw-semibold text-decoration-none"
                style={{ 
                  color: "#19747E", 
                  fontSize: "clamp(0.95rem, 2.3vw, 1.1rem)",
                  display: "block"
                }}
              >
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Address Card */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div 
              className="h-100 text-center p-4 p-md-5 rounded-4 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
                border: "1px solid #D1E8E2",
                boxShadow: "0 15px 35px rgba(25,116,126,0.1)",
                borderTop: "6px solid #19747E",
                transition: "all 0.3s ease",
                minHeight: "clamp(220px, 25vh, 260px)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 25px 50px rgba(25,116,126,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(25,116,126,0.1)";
              }}
            >
              {/* Icon */}
              <div 
                className="mx-auto mb-3"
                style={{
                  width: "clamp(65px, 14vw, 80px)",
                  height: "clamp(65px, 14vw, 80px)",
                  background: "linear-gradient(135deg, #19747E, #A9D6E5)",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(25,116,126,0.3)"
                }}
              >
                <span style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)" }}>📍</span>
              </div>

              {/* Content */}
              <h5 className="fw-bold mb-2" style={{ color: "#19747E", fontSize: "clamp(1.1rem, 2.8vw, 1.3rem)" }}>
                Address
              </h5>
              <div 
                className="fw-semibold"
                style={{ 
                  color: "#19747E", 
                  fontSize: "clamp(0.9rem, 2.2vw, 1.05rem)",
                  lineHeight: 1.5
                }}
              >
                Surendranagar,<br className="d-none d-md-block" />
                Gujarat, India
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
