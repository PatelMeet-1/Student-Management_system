import React from 'react'
import MarksManager from '../UnivercityResult/MarksManager'  // ✅ Correct path

export default function Internal() {
  return (
    <div className="w-100 py-4">
      <MarksManager 
        type="internal"
        title="📝 Internal Marks Manager"           // ✅ Title fixed
        apiBase="http://localhost:3000/api/results"
        usersApi="http://localhost:3000/api/users"
        coursesApi="http://localhost:3000/api/courses"
      />
    </div>
  )
}
