import { useState } from 'react'
import Homescreen from './Homescreen'
import CaseScreen from './CaseScreen'
import FeedbackScreen from './FeedbackScreen'
import { getRandomCase } from '../../shared/dummyPatientData'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'case', 'feedback'
  const [currentCase, setCurrentCase] = useState(null)
  const [repsCompleted, setRepsCompleted] = useState(6) // Dummy progress
  const [streak, setStreak] = useState(3)
  const [repsThisWeek, setRepsThisWeek] = useState(8)

  const startCase = () => {
    const newCase = getRandomCase()
    setCurrentCase(newCase)
    setScreen('case')
  }

  const completeCase = () => {
    setScreen('feedback')
  }

  const goHome = () => {
    setRepsCompleted(prev => prev + 1)
    setRepsThisWeek(prev => prev + 1)
    setScreen('home')
    setCurrentCase(null)
  }

  const goAgain = () => {
    const newCase = getRandomCase()
    setCurrentCase(newCase)
    setRepsCompleted(prev => prev + 1)
    setRepsThisWeek(prev => prev + 1)
    setScreen('case')
  }

  return (
    <>
      {screen === 'home' && (
        <Homescreen 
          repsCompleted={repsCompleted}
          streak={streak}
          repsThisWeek={repsThisWeek}
          onEnterArena={startCase}
        />
      )}
      {screen === 'case' && currentCase && (
        <CaseScreen 
          patientCase={currentCase}
          repNumber={repsCompleted + 1}
          onComplete={completeCase}
        />
      )}
      {screen === 'feedback' && currentCase && (
        <FeedbackScreen 
          patientCase={currentCase}
          repNumber={repsCompleted + 1}
          onRest={goHome}
          onGoAgain={goAgain}
        />
      )}
    </>
  )
}

export default App
