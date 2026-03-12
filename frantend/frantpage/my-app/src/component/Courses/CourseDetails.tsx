import React, { useState } from "react";

const coursesData = [
  {
    id: 1,
    title: "BBA",
    description: "Bachelor of Business Administration",
    image: "https://img.freepik.com/free-vector/business-management-vector-illustration_53876-44131.jpg",
    departments: ["Finance", "Marketing", "Human Resource", "Operations", "International Business"],
    duration: "3 Years",
    highlights: ["Digital Marketing", "Business Analytics", "Leadership Skills"],
    careers: ["Business Analyst", "Marketing Manager", "HR Manager"]
  },
  {
    id: 2,
    title: "BCA",
    description: "Bachelor of Computer Applications",
    image: "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg",
    departments: ["Software Development", "Web Technology", "Database Management", "Networking", "Mobile App Development"],
    duration: "3 Years",
    highlights: ["JavaScript", "Python Programming", "Database Design"],
    careers: ["Software Developer", "Web Developer", "Database Admin"]
  },
  {
    id: 3,
    title: "B.Tech",
    description: "Bachelor of Technology",
    image: "https://img.freepik.com/free-vector/engineering-concept-illustration_114360-1546.jpg",
    departments: ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"],
    duration: "4 Years",
    highlights: ["AI & ML", "Data Structures", "System Design"],
    careers: ["Software Engineer", "DevOps Engineer", "Systems Architect"]
  },
  {
    id: 4,
    title: "B.Sc",
    description: "Bachelor of Science",
    image: "https://img.freepik.com/free-vector/science-concept-illustration_114360-2094.jpg",
    departments: ["Physics", "Chemistry", "Mathematics", "Biology", "Statistics"],
    duration: "3 Years",
    highlights: ["Advanced Mathematics", "Research Methods", "Lab Techniques"],
    careers: ["Research Scientist", "Data Analyst", "Lab Technician"]
  },
  {
    id: 5,
    title: "B.Com",
    description: "Bachelor of Commerce",
    image: "https://img.freepik.com/free-vector/finance-concept-illustration_114360-2824.jpg",
    departments: ["Accounting", "Banking", "Taxation", "Auditing", "Economics"],
    duration: "3 Years",
    highlights: ["Financial Accounting", "Cost Accounting", "Tax Planning"],
    careers: ["Accountant", "Financial Analyst", "Tax Consultant"]
  },
  {
    id: 6,
    title: "BA",
    description: "Bachelor of Arts",
    image: "https://img.freepik.com/free-vector/education-concept-illustration_114360-473.jpg",
    departments: ["English", "History", "Economics", "Political Science", "Sociology"],
    duration: "3 Years",
    highlights: ["Critical Thinking", "Research Writing", "Public Speaking"],
    careers: ["Content Writer", "Journalist", "Civil Services"]
  },
  {
    id: 7,
    title: "MBA",
    description: "Master of Business Administration",
    image: "https://img.freepik.com/free-vector/business-management-vector-illustration_53876-44131.jpg",
    departments: ["Finance", "Marketing", "HR", "Operations", "Strategy"],
    duration: "2 Years",
    highlights: ["Strategic Management", "Leadership", "Global Business"],
    careers: ["CEO", "Consultant", "Business Development"]
  },
  {
    id: 8,
    title: "MCA",
    description: "Master of Computer Applications",
    image: "https://img.freepik.com/free-vector/software-development-concept_114360-748.jpg",
    departments: ["Software Engineering", "Data Science", "Cyber Security", "Cloud Computing", "AI/ML"],
    duration: "2 Years",
    highlights: ["Advanced Programming", "AI/ML", "Cyber Security"],
    careers: ["Software Architect", "Data Scientist", "Security Analyst"]
  },
  {
    id: 9,
    title: "M.Tech",
    description: "Master of Technology",
    image: "https://img.freepik.com/free-vector/engineering-concept-illustration_114360-1546.jpg",
    departments: ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"],
    duration: "2 Years",
    highlights: ["Research Projects", "Advanced Engineering", "Industry Projects"],
    careers: ["Research Engineer", "Project Manager", "Technical Lead"]
  },
  {
    id: 10,
    title: "M.Sc",
    description: "Master of Science",
    image: "https://img.freepik.com/free-vector/science-concept-illustration_114360-2094.jpg",
    departments: ["Physics", "Chemistry", "Mathematics", "Biotechnology", "Environmental Science"],
    duration: "2 Years",
    highlights: ["Advanced Research", "Lab Work", "Thesis Writing"],
    careers: ["Research Fellow", "Scientist", "Academic Researcher"]
  },
  {
    id: 11,
    title: "M.Com",
    description: "Master of Commerce",
    image: "https://img.freepik.com/free-vector/finance-concept-illustration_114360-2824.jpg",
    departments: ["Advanced Accounting", "Banking", "Taxation", "Finance", "International Business"],
    duration: "2 Years",
    highlights: ["Advanced Finance", "International Trade", "Risk Management"],
    careers: ["Financial Controller", "Investment Banker", "CFO"]
  },
  {
    id: 12,
    title: "MA",
    description: "Master of Arts",
    image: "https://img.freepik.com/free-vector/education-concept-illustration_114360-473.jpg",
    departments: ["English Literature", "History", "Economics", "Psychology", "Sociology"],
    duration: "2 Years",
    highlights: ["Research Methodology", "Advanced Theory", "Dissertation"],
    careers: ["Professor", "Researcher", "Policy Analyst"]
  }
];



const CourseHighlights: React.FC = () => {
  const [showMore, setShowMore] = useState(false);

  const firstThreeCourses = coursesData.slice(0, 3);
  const remainingCourses = coursesData.slice(3);

  const getIcon = (title: string) => {
    const icons: { [key: string]: string } = {
      'BBA': '📈', 'BCA': '💻', 'B.Tech': '🔧', 'B.Sc': '🔬',
      'B.Com': '💰', 'BA': '📚', 'MBA': '👔', 'MCA': '⚙️',
      'M.Tech': '🚀', 'M.Sc': '🧪', 'M.Com': '💼', 'MA': '✍️'
    };
    return icons[title] || '📖';
  };

  return (
    <section className="py-3 py-sm-4 py-md-5 py-lg-6" style={{ backgroundColor: "#A9D6E5" }}>
      <div className="container px-2 px-sm-3 px-md-4 px-lg-5">
        {/* Header - PERFECT RESPONSIVE */}
        <div className="text-center mb-4 mb-sm-5 mb-md-6">
          <h2 
            className="fw-bold mb-3 mb-sm-4"
            style={{ 
              color: "#19747E",
              fontSize: "clamp(1.6rem, 4.5vw, 2.8rem)",
              lineHeight: 1.2,
              fontWeight: "900"
            }}
          >
            Course Highlights
          </h2>
          <p 
            className="lead mx-auto px-2 px-sm-3"
            style={{ 
              color: "#19747E",
              fontSize: "clamp(0.95rem, 2.6vw, 1.2rem)",
              maxWidth: "550px",
              fontWeight: "500"
            }}
          >
            Discover what makes our programs stand out
          </p>
        </div>

        {/* First 3 Courses - Always Visible */}
        <div className="row g-3 g-sm-4 g-md-5 mb-4 mb-sm-5">
          {firstThreeCourses.map((course) => (
            <div key={course.id} className="col-12 col-sm-6 col-md-6 col-lg-4 px-1 px-sm-2">
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* Show More / Show Less - Remaining Courses */}
        {showMore && (
          <div className="row g-3 g-sm-4 g-md-5 mb-4 mb-sm-5 animate__animated animate__fadeIn">
            {remainingCourses.map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-md-6 col-lg-4 px-1 px-sm-2">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}

        {/* Show More Button - MOBILE CENTERED */}
        {coursesData.length > 3 && (
            <div className="text-end mt-1 mt-sm-1">
              <button
                className="btn px-1 px-sm- py- py-sm- fw-bold rounded-pill shadow-lg"
                style={{
                  backgroundColor: showMore ? "rgba(25,116,126,0.15)" : "#19747E",
                  color: showMore ? "#19747E" : "white",
                  border: `2px solid ${showMore ? "#19747E" : "transparent"}`,
                  fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)",
                  boxShadow: "0 8px 25px rgba(25,116,126,0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  width: ""
                }}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "− Show Less" : "+ Show More"}
                <span 
                  style={{
                    marginLeft: "8px",
                    fontSize: "1.2rem",
                    display: "inline-block",
                    transition: "transform 0.3s ease",
                    transform: showMore ? "rotate(180deg)" : "rotate(0deg)"
                  }}
                >
                  ▼
                </span>
              </button>
            </div>
        )}
      </div>
    </section>
  );
};

// PERFECT RESPONSIVE CourseCard
const CourseCard: React.FC<{ course: typeof coursesData[0] }> = ({ course }) => {
  const getIcon = (title: string) => {
    const icons: { [key: string]: string } = {
      'BBA': '📈', 'BCA': '💻', 'B.Tech': '🔧', 'B.Sc': '🔬',
      'B.Com': '💰', 'BA': '📚', 'MBA': '👔', 'MCA': '⚙️',
      'M.Tech': '🚀', 'M.Sc': '🧪', 'M.Com': '💼', 'MA': '✍️'
    };
    return icons[title] || '📖';
  };

  return (
    <div 
      className="h-100 position-relative rounded-3 rounded-md-4 p-3 p-sm-4 p-md-5 text-center"
      style={{
        background: `linear-gradient(145deg, #FFFFFF 0%, #F0F8FF 100%)`,
        boxShadow: "0 12px 35px rgba(25,116,126,0.12)",
        border: "1px solid rgba(25,116,126,0.15)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        borderTop: `6px solid #19747E`,
        cursor: "pointer",
        minHeight: "clamp(280px, 38vh, 340px)"
      }}
      onMouseEnter={(e) => {
        if (window.innerWidth >= 768) {
          e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 25px 50px rgba(25,116,126,0.22)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 12px 35px rgba(25,116,126,0.12)";
      }}
    >
      {/* Course Icon - MOBILE PERFECT */}
      <div 
        className="mx-auto mb-2 mb-sm-3"
        style={{
          width: "clamp(55px, 14vw, 75px)",
          height: "clamp(55px, 14vw, 75px)",
          background: `linear-gradient(135deg, #19747E 0%, #19747E88 100%)`,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(25,116,126,0.25)",
          border: "3px solid white"
        }}
      >
        <span style={{ 
          fontSize: "clamp(1.5rem, 4.5vw, 2.2rem)",
          fontWeight: "bold"
        }}>
          {getIcon(course.title)}
        </span>
      </div>

      {/* Course Name */}
      <h3 
        className="fw-bold mb-2 mb-sm-3"
        style={{ 
          color: "#19747E",
          fontSize: "clamp(1.15rem, 3.2vw, 1.5rem)",
          lineHeight: 1.25,
          marginBottom: "clamp(0.75rem, 2vw, 1rem)"
        }}
      >
        {course.title}
      </h3>
      
      {/* Description */}
      <p 
        className="mb-2 mb-sm-3 small lead"
        style={{ 
          color: "#19747E",
          fontSize: "clamp(0.85rem, 2.3vw, 1rem)",
          lineHeight: 1.45
        }}
      >
        {course.description}
      </p>

      {/* Duration Badge */}
      <div 
        className="mx-auto mb-2 mb-sm-3 px-2 px-sm-3 py-1 py-sm-2 fw-bold rounded-pill"
        style={{
          backgroundColor: "#19747E",
          color: "white",
          fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
          width: "fit-content",
          boxShadow: "0 4px 12px rgba(25,116,126,0.3)"
        }}
      >
        ⏱️ {course.duration}
      </div>

      {/* Highlights */}
      <div className="mb-3 mb-sm-4 px-1 px-sm-2">
        <h6 className="fw-bold mb-2" style={{ 
          color: "#19747E", 
          fontSize: "clamp(0.8rem, 2.1vw, 0.9rem)",
          lineHeight: 1.2
        }}>
          📖 Highlights
        </h6>
        <ul className="list-unstyled mb-0 small px-1">
          {course.highlights.slice(0, 2).map((highlight, i) => (
            <li key={i} className="d-flex align-items-start mb-1 fw-medium" style={{ fontSize: "clamp(0.78rem, 2vw, 0.88rem)" }}>
              <span style={{ 
                color: "#19747E", 
                marginRight: "6px", 
                fontSize: "clamp(0.85rem, 2.2vw, 1rem)",
                marginTop: "2px"
              }}>✓</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button 
        className="btn w-100 fw-bold mt-auto"
        style={{
          backgroundColor: "#19747E",
          color: "white",
          borderRadius: "22px",
          border: "none",
          fontSize: "clamp(0.82rem, 2.1vw, 0.95rem)",
          padding: "clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.4rem)",
          boxShadow: "0 6px 20px rgba(25,116,126,0.3)",
          lineHeight: 1.3,
          minHeight: "clamp(40px, 9vw, 48px)"
        }}
      >
        Explore Course →
      </button>
    </div>
  );
};

export default CourseHighlights;
