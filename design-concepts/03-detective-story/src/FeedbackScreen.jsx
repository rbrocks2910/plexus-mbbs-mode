import { useState } from 'react'

function FeedbackScreen({ patientCase, onCloseCase }) {
  const [showAnswers, setShowAnswers] = useState({})

  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="detective-feedback-container">
      <div className="case-solved-header">
        <div className="case-solved-title">
          Case Solved
        </div>
        <p style={{ fontSize: '1.125rem', color: '#a39f9a', fontStyle: 'italic' }}>
          "Elementary, my dear Watson"
        </p>

        <div className="solution-box">
          <div style={{ fontSize: '0.875rem', color: '#a39f9a', marginBottom: '0.5rem' }}>
            THE SOLUTION
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#d4af37' }}>
            {patientCase.diagnosis}
          </div>
        </div>
      </div>

      {/* Your Deductions */}
      <div className="deductions-section">
        <h3 className="section-header">Your Deductions</h3>
        {patientCase.learningPoints.strengths.map((point, idx) => (
          <div key={idx} className="deduction-correct">
            ✓ {point}
          </div>
        ))}
      </div>

      {/* What the Master Detective Saw */}
      <div className="deductions-section">
        <h3 className="section-header">What the Master Detective Would've Seen</h3>
        {patientCase.learningPoints.improvements.map((point, idx) => (
          <div key={idx} className="deduction-missed">
            🔍 {point}
          </div>
        ))}
      </div>

      {/* The Full Picture */}
      <div className="deductions-section">
        <h3 className="section-header">The Full Picture</h3>
        <div style={{
          padding: '1.5rem',
          background: 'rgba(201, 169, 98, 0.1)',
          borderRadius: '0.5rem',
          borderLeft: '3px solid #c9a962',
          lineHeight: '1.8'
        }}>
          {patientCase.learningPoints.keyTakeaway}
        </div>
      </div>

      {/* Scotland Yard Test */}
      {patientCase.examQuestions && patientCase.examQuestions.length > 0 && (
        <div className="scotland-yard-section">
          <h3 className="section-header">Scotland Yard Wants to Test You</h3>
          <p style={{ marginBottom: '1.5rem', color: '#a39f9a', fontStyle: 'italic' }}>
            Questions on this case type
          </p>
          
          {patientCase.examQuestions.map((q, idx) => (
            <div key={idx} className="exam-question-box">
              <div style={{ fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                Q{idx + 1}. {q.question}
              </div>
              
              <button
                className="reveal-answer-button"
                onClick={() => toggleAnswer(idx)}
              >
                {showAnswers[idx] ? 'Hide Answer' : 'Reveal Answer'}
              </button>
              
              {showAnswers[idx] && (
                <div className="answer-reveal">
                  <strong>Answer:</strong> {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Close Case Button */}
      <button className="close-case-button" onClick={onCloseCase}>
        Close Case File
      </button>

      <div style={{
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.95rem',
        color: '#a39f9a',
        fontStyle: 'italic'
      }}>
        <p>The game is afoot! On to the next mystery.</p>
      </div>
    </div>
  )
}

export default FeedbackScreen
