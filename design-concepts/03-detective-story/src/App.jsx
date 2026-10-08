import { useState } from 'react'
import Homescreen from './Homescreen'
import CaseScreen from './CaseScreen'
import FeedbackScreen from './FeedbackScreen'
import { getRandomCase } from '../../shared/dummyPatientData'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'case', 'feedback'
  const [currentCase, setCurrentCase] = useState(null)
  const [casesSolved, setCasesSolved] = useState(4)

  const openCase = () => {
    const newCase = getRandomCase()
    setCurrentCase(newCase)
    setScreen('case')
  }

  const solveCase = () => {
    setScreen('feedback')
  }

  const closeCase = () => {
    setCasesSolved(prev => prev + 1)
    setScreen('home')
    setCurrentCase(null)
  }

  return (
    <>
      {screen === 'home' && (
        <Homescreen 
          casesSolved={casesSolved}
          onOpenCase={openCase}
        />
      )}
      {screen === 'case' && currentCase && (
        <CaseScreen 
          patientCase={currentCase}
          caseNumber={casesSolved + 1}
          onSolve={solveCase}
        />
      )}
      {screen === 'feedback' && currentCase && (
        <FeedbackScreen 
          patientCase={currentCase}
          onCloseCase={closeCase}
        />
      )}
    </>
  )
}

export default App
