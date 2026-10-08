import React from 'react'

function Homescreen({ casesCompleted, onStartLearning }) {
  return (
    <div className="mirror-hero">
      <h1 className="mirror-hero-title">
        Watch Yourself Learn.<br/>In Real-Time.
      </h1>
      <p className="mirror-subtitle">
        Every action shows what you're learning. Make your growth visible.
      </p>

      <div className="dual-pane-preview">
        <div className="preview-pane">
          <div className="pane-label">Your Actions</div>
          <div className="pane-content">
            You'll interact with patients, ask questions, order tests, and diagnose.
          </div>
        </div>
        <div className="preview-pane">
          <div className="pane-label">What You're Learning</div>
          <div className="pane-content">
            Real-time annotations show exactly what clinical reasoning skills you're building.
          </div>
        </div>
      </div>

      <div className="neural-progress">
        <div className="progress-label">
          Neural pathways strengthened:
        </div>
        <div className="progress-value">
          {casesCompleted} case patterns
        </div>
      </div>

      <button className="start-learning-button" onClick={onStartLearning}>
        Start Learning
      </button>

      <div style={{
        marginTop: '3rem',
        fontSize: '1rem',
        color: '#64748b',
        lineHeight: '1.8'
      }}>
        <p>
          Learning isn't hidden until feedback—it's celebrated as it happens.<br/>
          After 1000 cases, you'll have a complete clinical reasoning network.
        </p>
      </div>
    </div>
  )
}

export default Homescreen
