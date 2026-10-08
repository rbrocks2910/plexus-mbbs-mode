import { useState } from 'react'
import Homescreen from './Homescreen'
import CaseScreen from './CaseScreen'
import FeedbackScreen from './FeedbackScreen'
import { getRandomCase } from '../../shared/dummyPatientData'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'case', 'feedback'
  const [currentCase, setCurrentCase] = useState(null)
  const [userActions, setUserActions] = useState([])
  const [casesCompleted, setCasesCompleted] = useState(5) // Dummy progress

  const startCase = () => {
    const newCase = getRandomCase()
    setCurrentCase(newCase)
    setUserActions([])
    setScreen('case')
  }

  const completeCase = (actions) => {
    setUserActions(actions)
    setScreen('feedback')
  }

  const goHome = () => {
    setCasesCompleted(prev => prev + 1)
    setScreen('home')
    setCurrentCase(null)
    setUserActions([])
  }

  return (
    <>
      {screen === 'home' && (
        <Homescreen 
          casesCompleted={casesCompleted}
          onStartCase={startCase}
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
          userActions={userActions}
          onGoHome={goHome}
        />
      )}
    </>
  )
}

export default App
