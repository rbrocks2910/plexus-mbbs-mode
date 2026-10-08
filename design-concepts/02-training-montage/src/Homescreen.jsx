import React from 'react'

function Homescreen({ repsCompleted, streak, repsThisWeek, onEnterArena }) {
  const totalReps = 1000
  const progressPercent = (repsCompleted / totalReps) * 100
  
  const getLevel = (reps) => {
    if (reps < 50) return 'Beginner'
    if (reps < 200) return 'Intermediate'
    if (reps < 500) return 'Advanced'
    return 'Expert'
  }

  const level = getLevel(repsCompleted)

  return (
    <div className="training-hero">
      <h1 className="training-hero-title">
        1000 Cases.<br/>One Instinct.
      </h1>
      <p className="training-subtitle">
        Your clinical reasoning is a muscle. Train it.
      </p>

      <div className="progress-bar-container">
        <div className="level-indicator">
          <div className="level-badge">{level}</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {repsCompleted} / {totalReps} Reps
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="streak-indicator">
        <span style={{ fontSize: '1.5rem' }}>🔥</span>
        <span>{streak}-day streak</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{repsCompleted}</div>
          <div className="stat-label">Total Reps</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{repsThisWeek}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <button className="enter-arena-button" onClick={onEnterArena}>
        Enter the Arena
      </button>

      <div style={{
        marginTop: '3rem',
        fontSize: '1rem',
        color: '#b0b0b0',
        lineHeight: '1.8'
      }}>
        <p>
          Every case is a rep. Every rep builds your diagnostic muscle.<br/>
          Top performers do 15 reps per week. You're building momentum.
        </p>
      </div>
    </div>
  )
}

export default Homescreen
