import React, { useEffect, useRef } from 'react'

function MentorSidebar({ comments }) {
  const commentsEndRef = useRef(null)

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  return (
    <div className="mentor-section">
      <div className="mentor-avatar">
        👨‍⚕️
      </div>
      <h2 className="mentor-title">Your Mentor</h2>
      
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.7, textAlign: 'center' }}>
        I'll guide you through every step. No pressure, just learning.
      </div>

      <div>
        {comments.map((comment, idx) => (
          <div key={idx} className="mentor-comment">
            <span className="comment-icon">{comment.icon}</span>
            <span>{comment.text}</span>
          </div>
        ))}
        <div ref={commentsEndRef} />
      </div>
    </div>
  )
}

export default MentorSidebar
