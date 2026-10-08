import { useState } from 'react'
import WatsonSidebar from './components/WatsonSidebar'

function CaseScreen({ patientCase, caseNumber, onSolve }) {
  const [evidenceLog, setEvidenceLog] = useState([])
  const [cluesGathered, setCluesGathered] = useState([])
  const [watsonComments, setWatsonComments] = useState([
    { text: "A new mystery, Holmes! Let's examine the facts carefully." }
  ])
  const [usedTools, setUsedTools] = useState(new Set())
  const [phase, setPhase] = useState('interview') // 'interview', 'examine', 'forensics', 'deduction'
  const [deduction, setDeduction] = useState('')

  const investigationTools = {
    interview: [
      { key: 'onset', label: 'Interview: Timeline', field: 'onset' },
      { key: 'character', label: 'Interview: Symptoms', field: 'character' },
      { key: 'radiation', label: 'Interview: Progression', field: 'radiation' },
      { key: 'associated', label: 'Interview: Related Facts', field: 'associated' },
    ],
    examine: [
      { key: 'vitals', label: 'Examine: Vital Signs', field: 'vitals' },
      { key: 'general', label: 'Examine: General State', field: 'general' },
      { key: 'cardiovascular', label: 'Examine: Cardiovascular', field: 'cardiovascular' },
    ],
    forensics: [
      { key: 'ecg', label: 'Request: ECG', field: 'ecg' },
      { key: 'cbc', label: 'Request: Blood Work', field: 'cbc' },
      { key: 'troponin', label: 'Request: Cardiac Markers', field: 'troponin' },
    ]
  }

  const handleToolUse = (tool) => {
    if (usedTools.has(tool.key)) return

    setUsedTools(prev => new Set([...prev, tool.key]))

    const evidence = patientCase.history?.[tool.field] || 
                    patientCase.examination?.[tool.field] || 
                    patientCase.investigations?.[tool.field] ||
                    "No specific evidence found."

    setEvidenceLog(prev => [...prev, {
      type: tool.label,
      content: evidence
    }])

    // Add clue
    const clueText = `${tool.label}: Key finding noted`
    setCluesGathered(prev => [...prev, clueText])

    // Watson comment
    const watsonKey = `asking${tool.field.charAt(0).toUpperCase() + tool.field.slice(1)}`
    const watsonComment = patientCase.mentorComments?.[watsonKey] || 
                         patientCase.mentorComments?.[`ordering${tool.field.charAt(0).toUpperCase() + tool.field.slice(1)}`] ||
                         "Interesting finding, Holmes. This adds to the puzzle."
    
    setTimeout(() => {
      setWatsonComments(prev => [...prev, {
        text: watsonComment
      }])
    }, 500)
  }

  const handleSubmitDeduction = () => {
    if (!deduction.trim()) return
    onSolve()
  }

  return (
    <div className="detective-case-container">
      {/* Case File Section */}
      <div className="case-file-section">
        <div className="case-file-header">
          <div className="case-number-badge">
            CASE FILE #{String(caseNumber).padStart(3, '0')}
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#c9a962', marginBottom: '0.5rem' }}>
            Subject: {patientCase.patientName}
          </h2>
          <div style={{ color: '#a39f9a', fontStyle: 'italic' }}>
            {patientCase.chiefComplaint}
          </div>
          
          <div className="subject-details">
            <div className="detail-item">
              <div className="detail-label">Age</div>
              <div className="detail-value">{patientCase.age} years</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Gender</div>
              <div className="detail-value">{patientCase.gender}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Status</div>
              <div className="detail-value">Under Investigation</div>
            </div>
          </div>
        </div>

        {/* Investigation Phase Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`tool-button ${phase === 'interview' ? 'used' : ''}`}
            onClick={() => setPhase('interview')}
            style={{ flex: 1 }}
          >
            Interview Patient
          </button>
          <button
            className={`tool-button ${phase === 'examine' ? 'used' : ''}`}
            onClick={() => setPhase('examine')}
            style={{ flex: 1 }}
          >
            Examine Evidence
          </button>
          <button
            className={`tool-button ${phase === 'forensics' ? 'used' : ''}`}
            onClick={() => setPhase('forensics')}
            style={{ flex: 1 }}
          >
            Request Forensics
          </button>
          <button
            className={`tool-button ${phase === 'deduction' ? 'used' : ''}`}
            onClick={() => setPhase('deduction')}
            style={{ flex: 1 }}
          >
            Present Deduction
          </button>
        </div>

        {/* Investigation Tools */}
        {phase !== 'deduction' && (
          <div className="investigation-tools">
            <div className="tool-label">Investigation Methods</div>
            <div className="tool-buttons">
              {investigationTools[phase]?.map(tool => (
                <button
                  key={tool.key}
                  className={`tool-button ${usedTools.has(tool.key) ? 'used' : ''}`}
                  onClick={() => handleToolUse(tool)}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Log */}
        {evidenceLog.length > 0 && (
          <div className="evidence-log">
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: 700, 
              marginBottom: '1rem',
              color: '#c9a962',
              fontFamily: 'Georgia, serif'
            }}>
              Evidence Log
            </div>
            {evidenceLog.map((entry, idx) => (
              <div key={idx} className="evidence-entry">
                <div className="entry-type">[{entry.type}]</div>
                <div className="entry-content">{entry.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Deduction Phase */}
        {phase === 'deduction' && (
          <div className="deduction-area">
            <h3 className="deduction-title">
              Present Your Theory, Holmes
            </h3>
            <p style={{ marginBottom: '1rem', color: '#a39f9a', fontStyle: 'italic' }}>
              Based on the evidence gathered, what is your deduction?
            </p>
            <textarea
              value={deduction}
              onChange={(e) => setDeduction(e.target.value)}
              className="deduction-input"
              placeholder="State your diagnosis and the chain of reasoning that led you to this conclusion..."
            />
            <button
              className="present-deduction-button"
              onClick={handleSubmitDeduction}
              disabled={!deduction.trim()}
            >
              Present Deduction
            </button>
          </div>
        )}

        {/* Clues Sidebar (on left screen) */}
        {cluesGathered.length > 0 && (
          <div className="clues-sidebar">
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              color: '#c9a962',
              fontFamily: 'Georgia, serif'
            }}>
              Clues Gathered
            </div>
            {cluesGathered.map((clue, idx) => (
              <div key={idx} className="clue-item">
                {clue}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Watson Sidebar */}
      <WatsonSidebar comments={watsonComments} />
    </div>
  )
}

export default CaseScreen
