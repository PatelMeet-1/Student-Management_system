import React, { useState } from "react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const { name, email, contact, subject, message } = formData;

    if (!name.trim()) return "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter valid email address";

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) return "Contact must be exactly 10 digits";

    if (!subject.trim()) return "Subject is required";

    if (!message.trim()) return "Message is required";

    return null;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          contact: "",
          subject: "",
          message: ""
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to send message");
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-5" style={{ backgroundColor: "#A9D6E5" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">

            <div className="text-center mb-4">
              <h2 style={{ color: "#19747E" }}>Send us a Message</h2>
            </div>

            <div className="p-4 bg-white rounded shadow">
              <form onSubmit={handleSubmit} noValidate>

                {/* Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="form-control mb-3"
                  value={formData.name}
                  onChange={handleChange}
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control mb-3"
                  value={formData.email}
                  onChange={handleChange}
                />

                {/* Contact */}
                <input
                  type="tel"
                  name="contact"
                  placeholder="10 digit Contact"
                  className="form-control mb-3"
                  value={formData.contact}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setFormData({ ...formData, contact: value });
                    }
                  }}
                />

                {/* Subject */}
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="form-control mb-3"
                  value={formData.subject}
                  onChange={handleChange}
                />

                {/* Message */}
                <textarea
                  name="message"
                  placeholder="Message"
                  className="form-control mb-3"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                />

                {/* Status */}
                {status === "error" && (
                  <div className="alert alert-danger">{error}</div>
                )}
                {status === "success" && (
                  <div className="alert alert-success">
                    ✅ Message sent successfully!
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ background: "#19747E", color: "#fff" }}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
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