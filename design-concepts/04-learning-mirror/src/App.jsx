import { useState } from 'react'
import Homescreen from './Homescreen'
import CaseScreen from './CaseScreen'
import FeedbackScreen from './FeedbackScreen'
import { getRandomCase } from '../../shared/dummyPatientData'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'case', 'feedback'
  const [currentCase, setCurrentCase] = useState(null)
  const [casesCompleted, setCasesCompleted] = useState(4)

  const startLearning = () => {
    const newCase = getRandomCase()
    setCurrentCase(newCase)
    setScreen('case')
  }

  const completeCase = () => {
    setScreen('feedback')
  }

  const goHome = () => {
    setCasesCompleted(prev => prev + 1)
    setScreen('home')
    setCurrentCase(null)
  }

  return (
    <>
      {screen === 'home' && (
        <Homescreen 
          casesCompleted={casesCompleted}
          onStartLearning={startLearning}
        />
      )}
      {screen === 'case' && currentCase && (
        <CaseScreen 
          patientCase={currentCase}
          onComplete={completeCase}
        />
      )}
      {screen === 'feedback' && currentCase && (
        <FeedbackScreen 
          patientCase={currentCase}
          onContinue={goHome}
        />
      )}
    </>
  )
}

export default App
