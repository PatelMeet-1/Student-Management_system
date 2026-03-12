import React, { useState, useEffect } from "react";import AOS from "aos";
import "aos/dist/aos.css";
// import { useEffect } from "react";



const coursesData = [
  {
    id: 1,
    title: "BBA",
    description: "Bachelor of Business Administration",
    image: "https://img.freepik.com/free-vector/business-management-vector-illustration_53876-44131.jpg",
    departments: ["Finance", "Marketing", "Human Resource", "Operations", "International Business"]
  },
  {
    id: 2,
    title: "BCA",
    description: "Bachelor of Computer Applications",
    image: "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg",
    departments: ["Software Development", "Web Technology", "Database Management", "Networking", "Mobile App Development"]
  },
  {
    id: 3,
    title: "B.Tech",
    description: "Bachelor of Technology",
    image: "https://img.freepik.com/free-vector/engineering-concept-illustration_114360-1546.jpg",
    departments: ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"]
  },
  {
    id: 4,
    title: "B.Sc",
    description: "Bachelor of Science",
    image: "https://img.freepik.com/free-vector/science-concept-illustration_114360-2094.jpg",
    departments: ["Physics", "Chemistry", "Mathematics", "Biology", "Statistics"]
  },
  {
    id: 5,
    title: "B.Com",
    description: "Bachelor of Commerce",
    image: "https://img.freepik.com/free-vector/finance-concept-illustration_114360-2824.jpg",
    departments: ["Accounting", "Banking", "Taxation", "Auditing", "Economics"]
  },
  {
    id: 6,
    title: "BA",
    description: "Bachelor of Arts",
    image: "https://img.freepik.com/free-vector/education-concept-illustration_114360-473.jpg",
    departments: ["English", "History", "Economics", "Political Science", "Sociology"]
  },
  {
    id: 7,
    title: "MBA",
    description: "Master of Business Administration",
    image: "https://img.freepik.com/free-vector/business-management-vector-illustration_53876-44131.jpg",
    departments: ["Finance", "Marketing", "HR", "Operations", "Strategy"]
  },
  {
    id: 8,
    title: "MCA",
    description: "Master of Computer Applications",
    image: "https://img.freepik.com/free-vector/software-development-concept_114360-748.jpg",
    departments: ["Software Engineering", "Data Science", "Cyber Security", "Cloud Computing", "AI/ML"]
  },
  {
    id: 9,
    title: "M.Tech",
    description: "Master of Technology",
    image: "https://img.freepik.com/free-vector/engineering-concept-illustration_114360-1546.jpg",
    departments: ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"]
  },
  {
    id: 10,
    title: "M.Sc",
    description: "Master of Science",
    image: "https://img.freepik.com/free-vector/science-concept-illustration_114360-2094.jpg",
    departments: ["Physics", "Chemistry", "Mathematics", "Biotechnology", "Environmental Science"]
  },
  {
    id: 11,
    title: "M.Com",
    description: "Master of Commerce",
    image: "https://img.freepik.com/free-vector/finance-concept-illustration_114360-2824.jpg",
    departments: ["Advanced Accounting", "Banking", "Taxation", "Finance", "International Business"]
  },
  {
    id: 12,
    title: "MA",
    description: "Master of Arts",
    image: "https://img.freepik.com/free-vector/education-concept-illustration_114360-473.jpg",
    departments: ["English Literature", "History", "Economics", "Psychology", "Sociology"]
  }
];

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  departments: string[];
}

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div
        className="card h-100 border-0 shadow position-relative overflow-hidden"
        style={{ 
          backgroundColor: "#D1E8E2",
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
          height: "200px",
          overflow: "hidden",
          borderRadius: "15px 15px 0 0"
        }}>
          <img
            src={course.image}
            className="card-img-top w-100 h-100"
            alt={course.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)"
            }}
          />
        </div>

        <div className="card-body text-center p-4">
          <h5 className="fw-bold mb-2" style={{ color: "#19747E" }}>
            {course.title}
          </h5>
          <p className="mb-4" style={{ color: "#19747E", fontSize: "0.95rem" }}>
            {course.description}
          </p>
          <button
            className="btn w-100 fw-semibold"
            style={{ 
              backgroundColor: "#19747E",
              color: "white",
              borderRadius: "25px",
              border: "none",
              boxShadow: "0 5px 15px rgba(25,116,126,0.3)",
              transform: isHovered ? "scale(1.05)" : "scale(1)"
            }}
            onClick={() => onViewDetails(course)}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseModal: React.FC<{ 
  course: Course | null; 
  onClose: () => void;
}> = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1040,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          maxWidth: "500px",
          maxHeight: "80vh",
          width: "90%",
          zIndex: 1050,
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div className="p-4 border-bottom" style={{ backgroundColor: "#D1E8E2" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold mb-1" style={{ color: "#19747E" }}>
                {course.title}
              </h4>
              <p style={{ color: "#19747E", margin: 0, fontSize: "0.95rem" }}>
                {course.description}
              </p>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#19747E"
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Departments List */}
        <div className="p-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
          <h5 className="fw-bold mb-3" style={{ color: "#19747E" }}>
            Available Departments
          </h5>
          <div className="row g-2">
            {course.departments.map((dept, index) => (
              <div key={index} className="col-6">
                <div 
                  className="p-3 border rounded-2 text-center"
                  style={{ 
                    backgroundColor: "#F8F9FA",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: "1px solid #E9ECEF"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#D1E8E2";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F8F9FA";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <small className="fw-semibold" style={{ color: "#19747E" }}>
                    {dept}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Courses: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });

    AOS.refresh();
  }, []);

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  return (
    <>
      <section className="py-5" style={{ backgroundColor: "#E2E2E2", position: "relative" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: "#19747E" }}>
              Our Courses
            </h2>
            <p style={{ color: "#19747E", fontSize: "1.1rem" }}>
              Explore the academic programs available in our institution.
            </p>
          </div>

          <div className="row g-4" data-aos="zoom-in">
            {coursesData.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <CourseModal course={selectedCourse} onClose={closeModal} />
    </>
  );
};

export default Courses;
