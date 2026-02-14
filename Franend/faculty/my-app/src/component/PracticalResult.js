import React from 'react'
import MarksManager from './marks'  // ✅ CORRECT PATH!
export default function Practical() {
  return (
    <div className="py-4">
      <MarksManager
        type="practical"
        title="🧪 Practical Marks Manager"
        apiBase="http://localhost:3000/api/results"
        usersApi="http://localhost:3000/api/users"
        coursesApi="http://localhost:3000/api/courses"
      />
    </div>
  )
}
