import { useState, useEffect } from 'react'

function CaseScreen({ patientCase, repNumber, onComplete }) {
  const [timer, setTimer] = useState(0)
  const [chatHistory, setChatHistory] = useState([])
  const [microFeedbacks, setMicroFeedbacks] = useState([])
  const [usedActions, setUsedActions] = useState(new Set())
  const [phase, setPhase] = useState('history')
  const [userDiagnosis, setUserDiagnosis] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const actions = {
    history: [
      { key: 'onset', label: 'Ask about onset', field: 'onset', feedback: 'Rep counted: History taking' },
      { key: 'character', label: 'Assess character', field: 'character', feedback: 'Good form: Pain assessment' },
      { key: 'radiation', label: 'Check radiation', field: 'radiation', feedback: 'Rep counted: Systematic approach' },
      { key: 'associated', label: 'Associated symptoms', field: 'associated', feedback: 'Good form: Complete history' },
    ],
    examination: [
      { key: 'vitals', label: 'Check vitals', field: 'vitals', feedback: 'Rep counted: Vital signs' },
      { key: 'general', label: 'General exam', field: 'general', feedback: 'Good form: Observation skills' },
      { key: 'cardiovascular', label: 'CVS exam', field: 'cardiovascular', feedback: 'Rep counted: System exam' },
    ],
    investigations: [
      { key: 'ecg', label: 'Order ECG', field: 'ecg', feedback: 'Smart move: First-line test' },
      { key: 'cbc', label: 'Order CBC', field: 'cbc', feedback: 'Good form: Lab work' },
      { key: 'troponin', label: 'Check Troponin', field: 'troponin', feedback: 'Rep counted: Cardiac markers' },
    ]
  }

  const handleActionClick = (action) => {
    if (usedActions.has(action.key)) return

    setUsedActions(prev => new Set([...prev, action.key]))
    
    const response = patientCase.history?.[action.field] || 
                    patientCase.examination?.[action.field] || 
                    patientCase.investigations?.[action.field] ||
                    "No specific information available."
    
    setChatHistory(prev => [...prev, {
      type: 'user',
      text: action.label
    }, {
      type: 'response',
      text: response
    }])

    setMicroFeedbacks(prev => [...prev, action.feedback])
    
    setTimeout(() => {
      setMicroFeedbacks(prev => prev.slice(1))
    }, 3000)
  }

  const handleSubmit = () => {
    if (!userDiagnosis.trim()) return
    onComplete()
  }

  return (
    <div className="training-case-container">
      <div className="training-header">
        <div className="case-number">Case #{repNumber}</div>
        <div className="timer">{formatTime(timer)}</div>
        <div className="reps-counter">
          Reps today: 2 | This week: 8
        </div>
      </div>

      <div className="training-patient-card">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {patientCase.patientName}
          </div>
          <div style={{ opacity: 0.7, marginBottom: '1rem' }}>
            {patientCase.age} years | {patientCase.gender}
          </div>
          <div style={{ fontSize: '1.25rem', color: '#ff6b35' }}>
            CC: {patientCase.chiefComplaint}
          </div>
        </div>

        {/* Micro Feedbacks */}
        {microFeedbacks.map((feedback, idx) => (
          <div key={idx} className="micro-feedback">
            <span>✓</span>
            <span>{feedback}</span>
          </div>
        ))}

        {/* Phase Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>
          <button
            className={`training-action-button ${phase === 'history' ? 'used' : ''}`}
            onClick={() => setPhase('history')}
            style={{ flex: 1 }}
          >
            History
          </button>
          <button
            className={`training-action-button ${phase === 'examination' ? 'used' : ''}`}
            onClick={() => setPhase('examination')}
            style={{ flex: 1 }}
          >
            Examination
          </button>
          <button
            className={`training-action-button ${phase === 'investigations' ? 'used' : ''}`}
            onClick={() => setPhase('investigations')}
            style={{ flex: 1 }}
          >
            Investigations
          </button>
          <button
            className={`training-action-button ${phase === 'diagnosis' ? 'used' : ''}`}
            onClick={() => setPhase('diagnosis')}
            style={{ flex: 1 }}
          >
            Diagnose
          </button>
        </div>

        {/* Actions Grid */}
        {phase !== 'diagnosis' && (
          <div className="action-grid">
            {actions[phase]?.map(action => (
              <button
                key={action.key}
                className={`training-action-button ${usedActions.has(action.key) ? 'used' : ''}`}
                onClick={() => handleActionClick(action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="chat-container">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`training-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
        )}

        {/* Diagnosis Phase */}
        {phase === 'diagnosis' && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#ffd23f' }}>
              Take your best shot. You're training, not being tested.
            </h3>
            <textarea
              value={userDiagnosis}
              onChange={(e) => setUserDiagnosis(e.target.value)}
              placeholder="Your diagnosis and reasoning..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                background: 'rgba(0, 0, 0, 0.3)',
                color: 'white'
              }}
            />
            <button
              className="submit-rep-button"
              onClick={handleSubmit}
              disabled={!userDiagnosis.trim()}
            >
              Submit Rep
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CaseScreen
