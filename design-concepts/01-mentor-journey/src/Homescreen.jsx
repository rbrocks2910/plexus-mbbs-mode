import React from 'react'

function Homescreen({ casesCompleted, onStartCase }) {
  const totalCases = 1000
  const remainingCases = totalCases - casesCompleted

  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="hero-title">
          Walk Hospital Rounds with an AI Mentor
        </h1>
        <p className="hero-subtitle">
          You're not diagnosing alone. You're learning to see what experts see.
        </p>
        
        <div className="progress-indicator">
          <p className="progress-text">
            {casesCompleted} patients walked. {remainingCases} rounds to go.
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e0e0e0',
            borderRadius: '4px',
            marginTop: '1rem',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(casesCompleted / totalCases) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4a7c9e, #6ba3c9)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <button className="cta-button" onClick={onStartCase}>
            Start Your First Round
          </button>
        </div>

        <div style={{
          marginTop: '3rem',
          fontSize: '0.95rem',
          color: '#666',
          lineHeight: '1.8'
        }}>
          <p>
            No pressure. No judgment. Just you, a patient, and a mentor who guides you through every step.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Homescreen
