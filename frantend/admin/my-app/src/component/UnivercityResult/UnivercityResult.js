import React from "react";
import MarksManager from "./MarksManager";

export default function UniversityMarks() {
  return (
    <div className="py-4">
      <MarksManager 
        type="university"
        title="🎓 University Marks Manager"
        apiBase={`${process.env.REACT_APP_API_URL}/results`}
        usersApi={`${process.env.REACT_APP_API_URL}/users`}
        coursesApi={`${process.env.REACT_APP_API_URL}/courses`}
      />
    </div>
  );
}
