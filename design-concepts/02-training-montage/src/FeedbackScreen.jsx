import { useState } from 'react'

function FeedbackScreen({ patientCase, repNumber, onRest, onGoAgain }) {
  const [showAnswers, setShowAnswers] = useState({})

  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="training-feedback-container">
      <div className="rep-complete-header">
        <div className="rep-number">
          Rep #{repNumber} Complete
        </div>
        <p style={{ fontSize: '1.25rem', opacity: 0.7 }}>
          Here's your form check
        </p>
      </div>

      {/* Diagnosis */}
      <div className="form-check-section">
        <div className="form-check-title">
          <span>🎯</span>
          <span>The Diagnosis</span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff6b35' }}>
          {patientCase.diagnosis}
        </div>
      </div>

      {/* Strengths */}
      <div className="form-check-section">
        <div className="form-check-title">
          <span>✅</span>
          <span>Strengths You Showed</span>
        </div>
        {patientCase.learningPoints.strengths.map((point, idx) => (
          <div key={idx} className="strength-item">
            {point}
          </div>
        ))}
      </div>

      {/* Skills to Drill */}
      <div className="form-check-section">
        <div className="form-check-title">
          <span>🎯</span>
          <span>Skills to Drill Next</span>
        </div>
        {patientCase.learningPoints.improvements.map((point, idx) => (
          <div key={idx} className="drill-item">
            {point}
          </div>
        ))}
      </div>

      {/* Progress Metric */}
      <div className="form-check-section">
        <div className="form-check-title">
          <span>📈</span>
          <span>Progress</span>
        </div>
        <div className="progress-metric">
          Your pattern recognition is 23% sharper than last week.<br/>
          You're building momentum. Keep going.
        </div>
      </div>

      {/* Exam Questions */}
      {patientCase.examQuestions && patientCase.examQuestions.length > 0 && (
        <div className="form-check-section">
          <div className="form-check-title">
            <span>💪</span>
            <span>Want to Drill Exam Questions?</span>
          </div>
          
          {patientCase.examQuestions.map((q, idx) => (
            <div key={idx} style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '1rem' }}>
                Q{idx + 1}. {q.question}
              </div>
              
              <button
                onClick={() => toggleAnswer(idx)}
                style={{
                  background: 'rgba(255, 107, 53, 0.3)',
                  color: '#ffd23f',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 107, 53, 0.5)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {showAnswers[idx] ? 'Hide Answer' : 'Show Answer'}
              </button>
              
              {showAnswers[idx] && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 210, 63, 0.1)',
                  borderRadius: '0.5rem',
                  borderLeft: '3px solid #ffd23f',
                  lineHeight: '1.8'
                }}>
                  <strong>Answer:</strong> {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rep Counter */}
      <div className="rep-counter-big">
        {repNumber} of 1000 complete.
      </div>
      <div style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.8 }}>
        Keep going.
      </div>

      {/* Continue Buttons */}
      <div className="continue-buttons">
        <button className="rest-button" onClick={onRest}>
          Rest
        </button>
        <button className="go-again-button" onClick={onGoAgain}>
          Go Again →
        </button>
      </div>

      <div style={{
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.95rem',
        opacity: 0.6
      }}>
        <p>Recovery is part of training. Come back stronger tomorrow.</p>
      </div>
    </div>
  )
}

export default FeedbackScreen
