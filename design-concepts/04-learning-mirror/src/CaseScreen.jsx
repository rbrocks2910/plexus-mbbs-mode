import { useState } from 'react'

function CaseScreen({ patientCase, onComplete }) {
  const [currentResponse, setCurrentResponse] = useState(null)
  const [learningAnnotations, setLearningAnnotations] = useState([
    {
      title: "Welcome to Learning Mode",
      text: "As you work through this case, watch the right side. You'll see exactly what skills you're building with each action.",
      skills: ["Meta-learning"]
    }
  ])
  const [usedActions, setUsedActions] = useState(new Set())
  const [phase, setPhase] = useState('history')
  const [userDiagnosis, setUserDiagnosis] = useState('')

  const actions = {
    history: [
      { key: 'onset', label: 'Ask about onset', field: 'onset', skill: 'History taking → Timing assessment' },
      { key: 'character', label: 'Assess character', field: 'character', skill: 'History taking → Symptom characterization' },
      { key: 'radiation', label: 'Check radiation', field: 'radiation', skill: 'History taking → Pain mapping' },
      { key: 'associated', label: 'Associated symptoms', field: 'associated', skill: 'History taking → Comprehensive assessment' },
    ],
    examination: [
      { key: 'vitals', label: 'Check vital signs', field: 'vitals', skill: 'Physical exam → Hemodynamic assessment' },
      { key: 'general', label: 'General examination', field: 'general', skill: 'Physical exam → Observation skills' },
      { key: 'cardiovascular', label: 'CVS examination', field: 'cardiovascular', skill: 'Physical exam → System-specific evaluation' },
    ],
    investigations: [
      { key: 'ecg', label: 'Order ECG', field: 'ecg', skill: 'Investigation → First-line diagnostic tools' },
      { key: 'cbc', label: 'Order CBC', field: 'cbc', skill: 'Investigation → Laboratory analysis' },
      { key: 'troponin', label: 'Check Troponin', field: 'troponin', skill: 'Investigation → Biomarker interpretation' },
    ]
  }

  const handleActionClick = (action) => {
    if (usedActions.has(action.key)) return

    setUsedActions(prev => new Set([...prev, action.key]))

    const response = patientCase.history?.[action.field] || 
                    patientCase.examination?.[action.field] || 
                    patientCase.investigations?.[action.field] ||
                    "No specific information available."

    setCurrentResponse({
      label: action.label,
      text: response
    })

    // Add learning annotation
    const mentorKey = `asking${action.field.charAt(0).toUpperCase() + action.field.slice(1)}`
    const learningText = patientCase.mentorComments?.[mentorKey] || 
                        patientCase.mentorComments?.[`ordering${action.field.charAt(0).toUpperCase() + action.field.slice(1)}`] ||
                        `You're systematically gathering information. This builds your diagnostic reasoning framework.`

    setTimeout(() => {
      setLearningAnnotations(prev => [...prev, {
        title: "Skill Building",
        text: learningText,
        skills: [action.skill]
      }])
    }, 300)
  }

  const handleSubmit = () => {
    if (!userDiagnosis.trim()) return

    setLearningAnnotations(prev => [...prev, {
      title: "Synthesis Complete",
      text: "You've integrated multiple data points to form a diagnosis. This is advanced clinical reasoning—you're building pattern recognition and differential diagnosis skills.",
      skills: ["Differential diagnosis", "Clinical synthesis", "Pattern recognition"]
    }])

    setTimeout(() => {
      onComplete()
    }, 1000)
  }

  return (
    <div className="mirror-case-container">
      {/* Patient Pane (Left) */}
      <div className="patient-pane">
        <div className="pane-header">
          <div className="pane-title">
            <span>👤</span>
            <span>Your Actions</span>
          </div>
        </div>

        <div className="mirror-patient-card">
          <div className="patient-header">
            <div>
              <div className="patient-name">{patientCase.patientName}</div>
              <div className="patient-meta">{patientCase.age} years | {patientCase.gender}</div>
            </div>
          </div>
          <div className="chief-complaint-text">
            CC: {patientCase.chiefComplaint}
          </div>
        </div>

        {/* Phase Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            className={`mirror-action-button ${phase === 'history' ? 'used' : ''}`}
            onClick={() => setPhase('history')}
            style={{ flex: 1 }}
          >
            History
          </button>
          <button
            className={`mirror-action-button ${phase === 'examination' ? 'used' : ''}`}
            onClick={() => setPhase('examination')}
            style={{ flex: 1 }}
          >
            Examination
          </button>
          <button
            className={`mirror-action-button ${phase === 'investigations' ? 'used' : ''}`}
            onClick={() => setPhase('investigations')}
            style={{ flex: 1 }}
          >
            Investigations
          </button>
          <button
            className={`mirror-action-button ${phase === 'diagnosis' ? 'used' : ''}`}
            onClick={() => setPhase('diagnosis')}
            style={{ flex: 1 }}
          >
            Diagnose
          </button>
        </div>

        {/* Action Buttons */}
        {phase !== 'diagnosis' && (
          <div className="action-group">
            <div className="action-group-title">Choose an action:</div>
            <div className="action-buttons">
              {actions[phase]?.map(action => (
                <button
                  key={action.key}
                  className={`mirror-action-button ${usedActions.has(action.key) ? 'used' : ''}`}
                  onClick={() => handleActionClick(action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Response */}
        {currentResponse && (
          <div className="response-box">
            <div className="response-label">{currentResponse.label}</div>
            <div className="response-text">{currentResponse.text}</div>
          </div>
        )}

        {/* Diagnosis Input */}
        {phase === 'diagnosis' && (
          <div className="diagnosis-section">
            <div className="diagnosis-title">
              What patterns do you see?
            </div>
            <textarea
              value={userDiagnosis}
              onChange={(e) => setUserDiagnosis(e.target.value)}
              className="diagnosis-input"
              placeholder="Your diagnosis and key reasoning..."
            />
            <button
              className="submit-diagnosis-button"
              onClick={handleSubmit}
              disabled={!userDiagnosis.trim()}
            >
              Submit Diagnosis
            </button>
          </div>
        )}
      </div>

      {/* Learning Pane (Right) */}
      <div className="learning-pane">
        <div className="pane-header">
          <div className="pane-title">
            <span>🧠</span>
            <span>What You're Learning</span>
          </div>
        </div>

        {learningAnnotations.map((annotation, idx) => (
          <div key={idx} className="mirror-annotation">
            <div className="annotation-icon">✓</div>
            <div className="annotation-title">{annotation.title}</div>
            <div className="annotation-text">{annotation.text}</div>
            <div style={{ marginTop: '0.75rem' }}>
              {annotation.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CaseScreen
