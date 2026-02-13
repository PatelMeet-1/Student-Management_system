import React from 'react'
import MarksManager from './marks'  // ✅ Correct path
import Sidebar from "./sidebar"
export default function Internal() {
  return (
    <div className="d-flex">  {/* 🔥 Flex container for sidebar and content */}
    <Sidebar />
    <div className="w-100 py-4 content-shift">  {/* 🔥 Full width and padding */}
      <MarksManager 
        type="internal"
        title="📝 Internal Marks Manager"           // ✅ Title fixed
        apiBase="http://localhost:3000/api/results"
        usersApi="http://localhost:3000/api/users"
        coursesApi="http://localhost:3000/api/courses"
      />
    </div>
    </div>
  )
}
