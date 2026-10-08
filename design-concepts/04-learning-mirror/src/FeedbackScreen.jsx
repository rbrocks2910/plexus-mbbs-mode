import { useState } from 'react'

function FeedbackScreen({ patientCase, onContinue }) {
  const [showAnswers, setShowAnswers] = useState({})

  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="mirror-feedback-container">
      <div className="feedback-hero">
        <h1 className="feedback-title">Your Learning Summary</h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b' }}>
          Here's what your brain just accomplished
        </p>
      </div>

      {/* Diagnosis */}
      <div className="diagnosis-card">
        <h3 style={{ fontSize: '1.5rem', color: '#2563eb', marginBottom: '0.5rem' }}>
          The Diagnosis
        </h3>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
          {patientCase.diagnosis}
        </div>
      </div>

      {/* Learning Summary Grid */}
      <div className="learning-summary-grid">
        <div className="summary-card">
          <div className="summary-title">
            <span>✅</span>
            <span>Skills You Used</span>
          </div>
          {patientCase.learningPoints.strengths.map((point, idx) => (
            <div key={idx} className="summary-item">
              {point}
            </div>
          ))}
        </div>

        <div className="summary-card">
          <div className="summary-title">
            <span>📈</span>
            <span>Skills You'll Gain Next</span>
          </div>
          {patientCase.learningPoints.improvements.map((point, idx) => (
            <div key={idx} className="summary-item">
              {point}
            </div>
          ))}
        </div>
      </div>

      {/* Brain Map */}
      <div className="brain-map">
        <div className="brain-map-title">
          Your Clinical Reasoning Network
        </div>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Today you strengthened these nodes:
        </p>
        <div className="skill-nodes">
          <div className="skill-node">History taking</div>
          <div className="skill-node">Physical examination</div>
          <div className="skill-node">Investigation ordering</div>
          <div className="skill-node">Pattern recognition</div>
          <div className="skill-node">Differential diagnosis</div>
          <div className="skill-node">Clinical synthesis</div>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          After 1000 cases, this network will be dense and interconnected.<br/>
          You're building diagnostic mastery, one case at a time.
        </p>
      </div>

      {/* Key Takeaway */}
      <div className="diagnosis-card">
        <h3 style={{ fontSize: '1.5rem', color: '#2563eb', marginBottom: '1rem' }}>
          💡 Pattern to Remember
        </h3>
        <div style={{ lineHeight: '1.8', color: '#1e293b' }}>
          {patientCase.learningPoints.keyTakeaway}
        </div>
      </div>

      {/* Exam Practice */}
      {patientCase.examQuestions && patientCase.examQuestions.length > 0 && (
        <div className="exam-section">
          <h3 style={{ fontSize: '1.5rem', color: '#2563eb', marginBottom: '1rem' }}>
            📝 Lock in This Learning with Exam Practice
          </h3>
          
          {patientCase.examQuestions.map((q, idx) => (
            <div key={idx} className="exam-question-card">
              <div className="question-prompt">
                Q{idx + 1}. {q.question}
              </div>
              
              <button
                className="show-answer-button"
                onClick={() => toggleAnswer(idx)}
              >
                {showAnswers[idx] ? 'Hide Answer' : 'Show Answer'}
              </button>
              
              {showAnswers[idx] && (
                <div className="answer-box">
                  <strong>Answer:</strong> {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <button className="continue-learning-button" onClick={onContinue}>
        Continue Learning
      </button>

      <div style={{
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.95rem',
        color: '#64748b'
      }}>
        <p>Your neural pathways are growing stronger with every case.</p>
      </div>
    </div>
  )
}

export default FeedbackScreen
