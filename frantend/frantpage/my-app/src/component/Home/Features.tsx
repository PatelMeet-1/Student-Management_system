import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const featuresData: Feature[] = [
  {
    id: 1,
    icon: "bi-person-check",
    title: "Student Management",
    description: "Manage student records and academic information easily."
  },
  {
    id: 2,
    icon: "bi-building", 
    title: "Department Management",
    description: "Organize departments and manage faculty members."
  },
  {
    id: 3,
    icon: "bi-book",
    title: "Course Management",
    description: "Maintain course details and academic programs."
  },
  {
    id: 4,
    icon: "bi-bar-chart",
    title: "Result Management",
    description: "Track and manage students academic performance."
  },
  {
    id: 5,
    icon: "bi-shield-lock",
    title: "Secure Login",
    description: "Secure authentication system for all users."
  },
  {
    id: 6,
    icon: "bi-folder",
    title: "Data Management",
    description: "Efficiently store and manage academic data."
  }
];

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
<div className="col-md-4 col-sm-6" data-aos="fade-up">
        <div 
        className="p-4 shadow rounded h-100" 
        style={{ 
          backgroundColor: "#D1E8E2",
          border: "2px solid #A9D6E5",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
          transform: isHovered ? "translateY(-10px)" : "translateY(0)",
          boxShadow: isHovered 
            ? "0 20px 40px rgba(25,116,126,0.2)" 
            : "0 8px 25px rgba(0,0,0,0.1)"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          backgroundColor: "#19747E",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 8px 25px rgba(25,116,126,0.3)"
        }}>
          <i className={`bi ${feature.icon}`} style={{ fontSize: "35px", color: "white" }}></i>
        </div>
        <h5 className="fw-bold mb-3" style={{ color: "#19747E" }}>
          {feature.title}
        </h5>
        <p style={{ color: "#19747E" }}>{feature.description}</p>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
 useEffect(() => {
  AOS.init({
    duration: 1000,
    once: false
  });

  AOS.refresh();
}, []);
  return (
    <section className="py-5" data-aos="" style={{ backgroundColor: "#A9D6E5" }}>
      <div className="container text-center">
        <h2 className="fw-bold mb-3" style={{ color: "#19747E" }}>
          System Features
        </h2>
        <p className="mb-5" style={{ color: "#19747E", fontSize: "1.1rem" }}>
          Our student management system provides powerful tools to manage
          academic activities efficiently.
        </p>

        <div className="row g-4">
          {featuresData.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
