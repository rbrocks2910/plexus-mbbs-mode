import { useState } from 'react'

function FeedbackScreen({ patientCase, userActions, onGoHome }) {
  const [showAnswers, setShowAnswers] = useState({})

  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1 className="feedback-title">What You Just Learned</h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>
          Let's reflect on this case together
        </p>
      </div>

      {/* Diagnosis Result */}
      <div className="diagnosis-result">
        <h3 className="section-title">
          <span>🎯</span> The Diagnosis
        </h3>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#4a7c9e' }}>
          {patientCase.diagnosis}
        </p>
      </div>

      {/* Strengths */}
      <div className="feedback-section">
        <h3 className="section-title">
          <span>✅</span> What You Saw
        </h3>
        <ul className="learning-list">
          {patientCase.learningPoints.strengths.map((point, idx) => (
            <li key={idx} className="learning-item">
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="feedback-section">
        <h3 className="section-title">
          <span>📈</span> What You'll See After 100 More Rounds
        </h3>
        <ul className="learning-list">
          {patientCase.learningPoints.improvements.map((point, idx) => (
            <li key={idx} className="improvement-item">
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Key Takeaway */}
      <div className="feedback-section">
        <h3 className="section-title">
          <span>💡</span> The Pattern to Remember
        </h3>
        <div className="key-takeaway">
          {patientCase.learningPoints.keyTakeaway}
        </div>
      </div>

      {/* MBBS Exam Questions */}
      {patientCase.examQuestions && patientCase.examQuestions.length > 0 && (
        <div className="feedback-section">
          <h3 className="section-title">
            <span>📝</span> Here's What Your Professor Might Ask
          </h3>
          <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            Practice questions based on this patient
          </p>
          
          {patientCase.examQuestions.map((q, idx) => (
            <div key={idx} className="exam-question">
              <div className="question-text">
                Q{idx + 1}. {q.question}
              </div>
              
              <button
                className="reveal-button"
                onClick={() => toggleAnswer(idx)}
              >
                {showAnswers[idx] ? 'Hide Answer' : 'Show Answer'}
              </button>
              
              {showAnswers[idx] && (
                <div className="answer-text">
                  <strong>Answer:</strong> {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
        <button
          className="action-button"
          onClick={onGoHome}
        >
          Continue Your Journey
        </button>
      </div>

      <div style={{
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.95rem',
        opacity: 0.7
      }}>
        <p>Every case makes you sharper. Keep walking rounds with your mentor.</p>
      </div>
    </div>
  )
}

export default FeedbackScreen
