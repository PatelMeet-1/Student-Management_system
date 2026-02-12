import React from "react";
import MarksManager from "./MarksManager";

export default function UniversityMarks() {
  return (
    <div className="py-4">
      <MarksManager 
        type="university"
        title="🎓 University Marks Manager"
        apiBase="http://localhost:3000/api/results"
        usersApi="http://localhost:3000/api/users"
        coursesApi="http://localhost:3000/api/courses"
      />
    </div>
  );
}
