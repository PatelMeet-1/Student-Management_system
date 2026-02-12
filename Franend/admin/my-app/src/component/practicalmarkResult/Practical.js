import React from 'react'
import MarksManager from '../UnivercityResult/MarksManager'  // ✅ CORRECT PATH!

export default function Practical() {
  return (
    <div className="py-4">  {/* 🔥 padding add */}
      <MarksManager 
        type="practical"
        title="🧪 Practical Marks Manager"        // 🔥 TITLE ADD!
        apiBase="http://localhost:3000/api/results"
        usersApi="http://localhost:3000/api/users"     // 🔥 Optional
        coursesApi="http://localhost:3000/api/courses" // 🔥 Optional
      />
    </div>
  )
}
