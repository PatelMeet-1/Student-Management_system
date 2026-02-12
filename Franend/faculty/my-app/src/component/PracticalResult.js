import React from 'react'
import MarksManager from './marks'  // ✅ CORRECT PATH!
import Sidebar from "./sidebar"
export default function Practical() {
  return (

    <div className='d-flex'>
      <Sidebar />
    <div className="w-100 py-4">  {/* 🔥 padding add */}
      <MarksManager 
        type="practical"
        title="🧪 Practical Marks Manager"        // 🔥 TITLE ADD!
        apiBase="http://localhost:3000/api/results"
        usersApi="http://localhost:3000/api/users"     // 🔥 Optional
        coursesApi="http://localhost:3000/api/courses" // 🔥 Optional
      />
    </div>
    </div>
  )
}
