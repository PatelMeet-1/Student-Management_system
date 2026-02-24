import React from 'react'
import MarksManager from '../UnivercityResult/MarksManager'  // ✅ CORRECT PATH!

export default function Practical() {
  return (
    <div className="py-4">  {/* 🔥 padding add */}
      <MarksManager 
        type="practical"
        title="🧪 Practical Marks Manager"
        apiBase={`${process.env.REACT_APP_API_URL}/results`}
        usersApi={`${process.env.REACT_APP_API_URL}/users`}
        coursesApi={`${process.env.REACT_APP_API_URL}/courses`}
      />
    </div>
  )
}
