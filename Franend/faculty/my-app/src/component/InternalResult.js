import React from 'react'
import MarksManager from './marks'  // ✅ Correct path
export default function Internal() {
  return (
    <div className="py-4">
      <MarksManager
        type="internal"
        title="📝 Internal Marks Manager"
        apiBase="http://localhost:3000/api/results"
        usersApi="http://localhost:3000/api/users"
        coursesApi="http://localhost:3000/api/courses"
      />
    </div>
  )
}
