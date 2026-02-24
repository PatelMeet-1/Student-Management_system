import React from 'react'
import MarksManager from './marks'

export default function Internal() {

  // ✅ YAHI LINE ADD KARO
  const API_URL = process.env.REACT_APP_API_URL

  return (
    <div className="py-4">
      <MarksManager
        type="internal"
        title="📝 Internal Marks Manager"
        apiBase={`${API_URL}/results`}
        usersApi={`${API_URL}/users`}
        coursesApi={`${API_URL}/courses`}
      />
    </div>
  )
}