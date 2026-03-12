import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const StatisticsSection: React.FC = () => {
    useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });

    AOS.refresh();
  }, []);
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    security: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  const targetStats = {
    students: 500,
    faculty: 50,
    courses: 10,
    security: 100
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.querySelector('#stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        students: prev.students < targetStats.students 
          ? prev.students + Math.ceil((targetStats.students - prev.students) / 10)
          : targetStats.students,
        faculty: prev.faculty < targetStats.faculty 
          ? prev.faculty + 1
          : targetStats.faculty,
        courses: prev.courses < targetStats.courses 
          ? prev.courses + 1
          : targetStats.courses,
        security: prev.security < targetStats.security 
          ? prev.security + 1
          : targetStats.security
      }));
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible]);

  const statsData = [
    {
      value: stats.students,
      suffix: "+",
      label: "Students",
      icon: "👨‍🎓",
      color: "#19747E"
    },
    {
      value: stats.faculty,
      suffix: "+",
      label: "Faculty",
      icon: "👨‍🏫",
      color: "#28A745"
    },
    {
      value: stats.courses,
      suffix: "+",
      label: "Courses",
      icon: "📚",
      color: "#FFC107"
    },
    {
      value: stats.security,
      suffix: "%",
      label: "Secure System",
      icon: "🔒",
      color: "#DC3545"
    }
  ];

  return (
    <section 
      id="stats-section"
      className="py-5"
      style={{ 
        backgroundColor: "#A9D6E5",
          
        // position: "relative",
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
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3" style={{ 
            color: "#19747E",
            fontSize: "2.5rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            Our Achievements
          </h2>
          <p style={{ 
            color: "#19747E", 
            fontSize: "1.2rem",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Excellence in education with proven track record
          </p>
        </div>

        <div className="row g-4 justify-content-center" data-aos="zoom-in">
          {statsData.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 col-sm-6">
              <div 
                className="text-center p-5 rounded-4 position-relative overflow-hidden h-100"
                style={{
                  background: `linear-gradient(145deg, white 0%, #F8F9FA 100%)`,
                  boxShadow: "0 20px 40px rgba(25,116,126,0.15)",
                  border: "1px solid rgba(25,116,126,0.1)",
                  transition: "all 0.5s ease",
                  transform: isVisible ? "translateY(0)" : "translateY(50px)",
                  opacity: isVisible ? 1 : 0,
                  animationDelay: `${index * 0.2}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 30px 60px rgba(25,116,126,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(25,116,126,0.15)";
                }}
              >
                {/* Icon */}
                <div 
                  className="mb-4"
                  style={{
                    fontSize: "4rem",
                    lineHeight: 1
                  }}
                >
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>

                {/* Counter */}
                <div className="mb-4">
                  <h1 
                    className="fw-bold mb-1"
                    style={{ 
                      color: stat.color,
                      fontSize: "3rem",
                      fontWeight: "800"
                    }}
                  >
                    {stat.value.toLocaleString()}
                    <span style={{ 
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: stat.color
                    }}>
                      {stat.suffix}
                    </span>
                  </h1>
                </div>

                {/* Label */}
                <p 
                  className="fw-semibold mb-0"
                  style={{ 
                    color: "#19747E",
                    fontSize: "1.1rem"
                  }}
                >
                  {stat.label}
                </p>

                {/* Bottom Line */}
                <div 
                  className="position-absolute bottom-0 start-50 translate-middle-x"
                  style={{
                    width: "60px",
                    height: "4px",
                    backgroundColor: stat.color,
                    borderRadius: "2px",
                    marginBottom: "1rem"
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

export default StatisticsSection;
