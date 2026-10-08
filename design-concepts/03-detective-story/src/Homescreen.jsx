import React from 'react'

function Homescreen({ casesSolved, onOpenCase }) {
  const totalMysteries = 1000
  const unsolvedMysteries = totalMysteries - casesSolved

  return (
    <div className="detective-hero">
      <h1 className="detective-title">
        Every Patient is a Mystery
      </h1>
      <p className="detective-subtitle">
        You're the detective. Work with your AI partner to crack the case.
      </p>

      <div className="case-file-counter">
        <div className="solved-unsolved">
          <div className="solved-box">
            <div className="counter-label">Cases Solved</div>
            <div className="counter-value">{casesSolved}</div>
          </div>
          <div className="unsolved-box">
            <div className="counter-label">Unsolved Mysteries</div>
            <div className="counter-value">{unsolvedMysteries}</div>
          </div>
        </div>
      </div>

      <button className="open-case-button" onClick={onOpenCase}>
        Open Next Case File
      </button>

      <div style={{
        marginTop: '3rem',
        fontSize: '1rem',
        color: '#a39f9a',
        lineHeight: '1.8',
        fontStyle: 'italic'
      }}>
        <p>
          "When you have eliminated the impossible, whatever remains,<br/>
          however improbable, must be the truth."
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          — Sherlock Holmes
        </p>
      </div>
    </div>
  )
}

export default Homescreen
