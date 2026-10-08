import React, { useEffect, useRef } from 'react'

function WatsonSidebar({ comments }) {
  const commentsEndRef = useRef(null)

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  return (
    <div className="watson-section">
      <div className="watson-avatar">
        🕵️
      </div>
      <h2 className="watson-title">Dr. Watson</h2>
      
      <div style={{ 
        marginBottom: '1.5rem', 
        fontSize: '0.875rem', 
        color: '#a39f9a', 
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        "Your loyal partner in investigation"
      </div>

      <div>
        {comments.map((comment, idx) => (
          <div key={idx} className="watson-comment">
            {comment.text}
          </div>
        ))}
        <div ref={commentsEndRef} />
      </div>
    </div>
  )
}

export default WatsonSidebar
