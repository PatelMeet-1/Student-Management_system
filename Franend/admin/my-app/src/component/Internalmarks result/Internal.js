import React from 'react'
import MarksManager from '../UnivercityResult/MarksManager'  // ✅ Correct path

export default function Internal() {
  return (
    <div className="w-100 py-4">
      <MarksManager 
        type="internal"
        title="📝 Internal Marks Manager"
        apiBase={`${process.env.REACT_APP_API_URL}/results`}
        usersApi={`${process.env.REACT_APP_API_URL}/users`}
        coursesApi={`${process.env.REACT_APP_API_URL}/courses`}
      />
    </div>
  )
}
