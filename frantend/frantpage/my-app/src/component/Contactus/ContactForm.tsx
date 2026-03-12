import React, { useState } from "react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      // Replace with your backend API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-5 py-md-6 py-lg-7" style={{ backgroundColor:"#A9D6E5"}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            
            {/* Section Header */}
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3" style={{ color: "#19747E" }}>
                Send us a Message
              </h2>
              <p className="lead mb-0" style={{ color: "#666", maxWidth: "500px", margin: "0 auto" }}>
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Form */}
            <div 
              className="position-relative"
              style={{ 
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
                borderRadius: "24px",
                padding: "clamp(2.5rem, 5vw, 3.5rem)",
                boxShadow: "0 25px 60px rgba(25,116,126,0.12)",
                border: "1px solid #D1E8E2",
                borderTop: "6px solid #19747E"
              }}
            >
              <form onSubmit={handleSubmit} noValidate>
                
                {/* Name Field */}
                <div className="mb-4">
                  <label 
                    htmlFor="name"
                    className="form-label fw-semibold mb-2 d-block"
                    style={{ color: "#19747E" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control form-control-lg rounded-3 border-0 shadow-sm"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      padding: "0.875rem 1.25rem",
                      fontSize: "1rem"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#19747E"}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label 
                    htmlFor="email"
                    className="form-label fw-semibold mb-2 d-block"
                    style={{ color: "#19747E" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control form-control-lg rounded-3 border-0 shadow-sm"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      padding: "0.875rem 1.25rem",
                      fontSize: "1rem"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#19747E"}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </div>

                {/* Subject Field */}
                <div className="mb-4">
                  <label 
                    htmlFor="subject"
                    className="form-label fw-semibold mb-2 d-block"
                    style={{ color: "#19747E" }}
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-control form-control-lg rounded-3 border-0 shadow-sm"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      padding: "0.875rem 1.25rem",
                      fontSize: "1rem"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#19747E"}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </div>

                {/* Message Field */}
                <div className="mb-5">
                  <label 
                    htmlFor="message"
                    className="form-label fw-semibold mb-2 d-block"
                    style={{ color: "#19747E" }}
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="form-control rounded-3 border-0 shadow-sm"
                    placeholder="Tell us more about your query..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      padding: "1rem 1.25rem",
                      fontSize: "1rem",
                      resize: "vertical",
                      minHeight: "120px"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#19747E"}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="alert alert-success border-0 rounded-3 mb-4 animate__animated animate__fadeIn">
                    ✅ Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                {status === "error" && (
                  <div className="alert alert-danger border-0 rounded-3 mb-4 animate__animated animate__fadeIn">
                    ❌ {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-100 btn btn-lg fw-bold rounded-3 border-0 py-3 position-relative overflow-hidden"
                  style={{
                    background: "#19747E",
                    color: "white",
                    fontSize: "1.1rem",
                    boxShadow: "0 10px 30px rgba(25,116,126,0.3)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(25,116,126,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(25,116,126,0.3)";
                  }}
                >
                  {status === "sending" ? (
                    <>
                      <span 
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
