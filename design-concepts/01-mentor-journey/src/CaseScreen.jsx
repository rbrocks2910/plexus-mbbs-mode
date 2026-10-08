import { useState } from 'react'
import MentorSidebar from './components/MentorSidebar'

function CaseScreen({ patientCase, onComplete }) {
  const [chatHistory, setChatHistory] = useState([])
  const [mentorComments, setMentorComments] = useState([
    { text: "Let's begin. Take a moment to look at the patient. What would you want to know first?", icon: "💭" }
  ])
  const [phase, setPhase] = useState('history') // 'history', 'examination', 'investigations', 'diagnosis'
  const [userDiagnosis, setUserDiagnosis] = useState('')
  const [actionsLog, setActionsLog] = useState([])

  const questionPrompts = {
    history: [
      { key: 'onset', label: 'When did symptoms start?', field: 'onset' },
      { key: 'character', label: 'What does it feel like?', field: 'character' },
      { key: 'radiation', label: 'Does it spread anywhere?', field: 'radiation' },
      { key: 'associated', label: 'Any other symptoms?', field: 'associated' },
      { key: 'pastHistory', label: 'Any past medical history?', field: 'pastHistory' },
    ],
    examination: [
      { key: 'vitals', label: 'Check vital signs', field: 'vitals' },
      { key: 'general', label: 'General examination', field: 'general' },
      { key: 'cardiovascular', label: 'Cardiovascular exam', field: 'cardiovascular' },
    ],
    investigations: [
      { key: 'ecg', label: 'Order ECG', field: 'ecg' },
      { key: 'cbc', label: 'Order CBC', field: 'cbc' },
      { key: 'troponin', label: 'Check Troponin', field: 'troponin' },
    ]
  }

  const handleQuestionClick = (prompt) => {
    const { label, field } = prompt
    
    // Add user question to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      text: label
    }])

    // Add patient response
    const response = patientCase.history?.[field] || 
                    patientCase.examination?.[field] || 
                    patientCase.investigations?.[field] ||
                    "No specific information available."
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'patient',
        text: response
      }])

      // Add mentor comment
      const mentorKey = `asking${field.charAt(0).toUpperCase() + field.slice(1)}`
      const mentorComment = patientCase.mentorComments?.[mentorKey] || 
                           patientCase.mentorComments?.[`ordering${field.charAt(0).toUpperCase() + field.slice(1)}`] ||
                           "Good thinking. Keep gathering information systematically."
      
      setMentorComments(prev => [...prev, {
        text: mentorComment,
        icon: "👨‍⚕️"
      }])

      // Log action
      setActionsLog(prev => [...prev, `Asked about ${field}`])
    }, 500)
  }

  const handlePhaseChange = (newPhase) => {
    setPhase(newPhase)
    setMentorComments(prev => [...prev, {
      text: `Good progression. Let's move to ${newPhase}. What would you like to check?`,
      icon: "✅"
    }])
  }

  const handleSubmitDiagnosis = () => {
    if (!userDiagnosis.trim()) return
    
    setActionsLog(prev => [...prev, `Proposed diagnosis: ${userDiagnosis}`])
    
    setTimeout(() => {
      onComplete(actionsLog)
    }, 500)
  }

  return (
    <div className="case-container">
      {/* Patient Section */}
      <div className="patient-section">
        <div className="patient-card">
          <div className="patient-info">
            <div className="info-item">
              <div className="info-label">Patient Name</div>
              <div className="info-value">{patientCase.patientName}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Age / Gender</div>
              <div className="info-value">{patientCase.age} years / {patientCase.gender}</div>
            </div>
          </div>

          <div className="chief-complaint">
            Chief Complaint: {patientCase.chiefComplaint}
          </div>

          {/* Phase Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              className={`prompt-button ${phase === 'history' ? 'active' : ''}`}
              onClick={() => handlePhaseChange('history')}
            >
              History
            </button>
            <button
              className={`prompt-button ${phase === 'examination' ? 'active' : ''}`}
              onClick={() => handlePhaseChange('examination')}
            >
              Examination
            </button>
            <button
              className={`prompt-button ${phase === 'investigations' ? 'active' : ''}`}
              onClick={() => handlePhaseChange('investigations')}
            >
              Investigations
            </button>
            <button
              className={`prompt-button ${phase === 'diagnosis' ? 'active' : ''}`}
              onClick={() => handlePhaseChange('diagnosis')}
            >
              Diagnosis
            </button>
          </div>

          {/* Interaction Area */}
          {phase !== 'diagnosis' && (
            <div className="interaction-area">
              <div className="question-prompts">
                {questionPrompts[phase]?.map(prompt => (
                  <button
                    key={prompt.key}
                    className="prompt-button"
                    onClick={() => handleQuestionClick(prompt)}
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="chat-history">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.type}`}>
                  <div className="message-label">
                    {msg.type === 'user' ? 'You' : 'Patient'}
                  </div>
                  <div className="message-text">{msg.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Diagnosis Input */}
          {phase === 'diagnosis' && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#4a7c9e' }}>
                Based on what you've seen, what patterns stand out to you?
              </h3>
              <textarea
                value={userDiagnosis}
                onChange={(e) => setUserDiagnosis(e.target.value)}
                placeholder="Share your thoughts on the diagnosis and key reasoning..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <button
                className="action-button"
                onClick={handleSubmitDiagnosis}
                disabled={!userDiagnosis.trim()}
              >
                Submit Your Reasoning
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Sidebar */}
      <MentorSidebar comments={mentorComments} />
    </div>
  )
}

export default CaseScreen
