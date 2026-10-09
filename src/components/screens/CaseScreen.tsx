/**
 * @file CaseScreen.tsx
 * @description This is the core component of the Plexus application, where the user interacts with the medical simulation.
 * It is a complex, stateful component responsible for:
 * 1.  **Patient Consultation:** Managing the chat interface between the user and the AI patient.
 * 2.  **Clinical Investigations:** Allowing the user to order labs, imaging, and exams, and displaying the results.
 * 3.  **Differential Diagnosis:** Providing a tool for the user to list and manage their potential diagnoses.
 * 4.  **AI Guidance:** Offering contextual advice from an AI mentor based on the user's progress.
 * 5.  **Diagnosis Submission:** Handling the final diagnosis proposal and navigating to the feedback screen.
 * It fetches case data using the `caseId` from the URL and extensively uses local state (`useState`) to manage the dynamic UI.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { MedicalCase, ChatMessage, InvestigationResult, PrescriptionItem, SimulationOutcome } from '../../types';
import { getChatResponse, getInvestigationResult, getGuiderAdvice, simulateMedicineEffect } from '../../services/api';
// FIX: Corrected import path to point to the constants module directly.
import { INVESTIGATION_OPTIONS, FMT_PM_EXAMINATION_OPTIONS } from '../../constants';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { ReportViewer } from '../reports/ReportViewer';
import { LabIcon, ImagingIcon, ExamIcon } from '../icons/ReportIcons';
import { GuiderIcon } from '../icons/GuiderIcons';
import { saveCaseState, loadCaseState } from '../../utils/storage';
import { PrescriptionModal } from './PrescriptionModal';
import { TimeSkipControl } from '../ui/TimeSkipControl';

// Type alias for the active tab in the right-hand panel, improving readability.
type ActiveTab = 'reports' | 'order' | 'differential' | 'attending';

// A collection of simple SVG icon components used for UI clarity.
const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const PatientIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);
const HandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0V12m-3-1.5c.01-.13.01-.27.01-.4V6a1.5 1.5 0 113 0V12m0-1.5c.01-.13.01-.27.01-.4V6a1.5 1.5 0 113 0V12m0-1.5c.01-.13.01-.27.01-.4V6a1.5 1.5 0 113 0V12m0-1.5a1.5 1.5 0 013 0v1.5a7 7 0 01-14 0v-1.5a1.5 1.5 0 013 0v1.5z" /></svg>
);
const DocumentSearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21l6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM9 10h1m2 0h1" /></svg>
);

export const CaseScreen: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { getCaseById, completeCase } = useAppContext();
  
  // === LOCAL STATE MANAGEMENT ===
  const [medicalCase, setMedicalCase] = useState<MedicalCase | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationResult[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isPatientReplying, setIsPatientReplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientEmotionalState, setPatientEmotionalState] = useState('');
  
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [confidence, setConfidence] = useState(50);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('attending');
  const [selectedReport, setSelectedReport] = useState<InvestigationResult | null>(null);
  const [customTestName, setCustomTestName] = useState('');

  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<string[]>([]);
  const [ddxInput, setDdxInput] = useState('');

  const [attendingAdvice, setAttendingAdvice] = useState<{ critique: string[]; suggestion: string; rationale: string } | null>(null);
  const [isAttendingLoading, setIsAttendingLoading] = useState(false);

  // === MEDICINE MODE STATE ===
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationOutcomes, setSimulationOutcomes] = useState<SimulationOutcome[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [isCured, setIsCured] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Helper to check if patient cannot give history themselves (unconscious, shock, coma, infant, trauma, aphasic)
  const isAttendantCase = (): boolean => {
    if (!medicalCase) return false;
    if (medicalCase.patient.unconscious || medicalCase.patient.cannotSpeak || !!medicalCase.patient.attendant) return true;
    if (medicalCase.fmtMode?.enabled && medicalCase.fmtMode.zone !== 1) return true;
    if (medicalCase.patient.age <= 10) return true;

    const diag = (medicalCase.underlyingDiagnosis || '').toLowerCase();
    const complaint = (medicalCase.presentingComplaint?.chiefComplaint || '').toLowerCase();
    const history = (medicalCase.presentingComplaint?.historyOfPresentingIllness || '').toLowerCase();

    return (
      diag.includes('shock') ||
      diag.includes('coma') ||
      diag.includes('unconscious') ||
      diag.includes('aphasia') ||
      diag.includes('altered sensorium') ||
      diag.includes('intoxication') ||
      diag.includes('encephalopathy') ||
      diag.includes('poisoning') ||
      diag.includes('seizure') ||
      diag.includes('strangulation') ||
      diag.includes('drowning') ||
      diag.includes('trauma') ||
      complaint.includes('unconscious') ||
      complaint.includes('inability to speak') ||
      complaint.includes('loss of consciousness') ||
      complaint.includes('brought by') ||
      complaint.includes('collapsed') ||
      history.includes('unresponsive') ||
      history.includes('brought by family')
    );
  };

  // Helper function to get role label of the person speaking in the consultation
  const getInterlocutorRole = (): string => {
    if (!medicalCase) return 'Patient';
    if (medicalCase.patient.attendant?.relationship) {
      return medicalCase.patient.attendant.relationship;
    }
    if (medicalCase.fmtMode?.enabled) {
      const zone = medicalCase.fmtMode.zone;
      if (zone === 2) return 'Attendant';
      if (zone === 3) return 'Informant';
    }
    if (isAttendantCase()) {
      if (medicalCase.patient.age <= 12) {
        return 'Parent / Attendant';
      }
      return 'Attendant / Relative';
    }
    return 'Patient';
  };

  // Helper function to get state label
  const getStateLabel = (): string => {
    if (isAttendantCase()) return 'Patient Status';
    return 'Patient State';
  };

  // Effect to fetch the case data when the component mounts or caseId changes.
  useEffect(() => {
    if (caseId) {
      const foundCase = getCaseById(caseId);
      if (foundCase) {
        setMedicalCase(foundCase);
        
        // Load persisted case state from localStorage
        const persistedState = loadCaseState(caseId);
        if (persistedState) {
          setChatHistory(persistedState.chatHistory || []);
          setInvestigations(persistedState.investigations || []);
          setDifferentialDiagnoses(persistedState.differentialDiagnoses || []);
          if (persistedState.patientEmotionalState) {
            setPatientEmotionalState(persistedState.patientEmotionalState);
          }
          if (persistedState.medicineMode) {
            setPrescriptions(persistedState.medicineMode.prescriptions || []);
            setSimulationOutcomes(persistedState.medicineMode.simulationHistory || []);
            setIsCured(persistedState.medicineMode.isCured || false);
          }
        }
      } else {
        // If the case ID is invalid or not found (e.g., page refresh), redirect to the home screen.
        navigate('/');
      }
    }
  }, [caseId, getCaseById, navigate]);

  // Effect to initialize the chat history once the medical case data has been loaded.
  // This runs only when `medicalCase` is first set, preventing re-initialization on subsequent re-renders.
  useEffect(() => {
    if (medicalCase && chatHistory.length === 0) {
      // Defensive check: Ensure presentingComplaint and chiefComplaint exist
      const chiefComplaint = medicalCase.presentingComplaint?.chiefComplaint;
      const patientGreeting = chiefComplaint 
        ? `Hello Doctor, thank you for seeing me. I'm here about my ${chiefComplaint.toLowerCase()}.`
        : `Hello Doctor, thank you for seeing me. I'm not feeling well.`;
      
      setPatientEmotionalState(medicalCase.patient.initialEmotionalState);
      const initialChat: ChatMessage[] = [{
          sender: 'patient',
          text: patientGreeting,
          timestamp: new Date().toISOString(),
          emotionalState: medicalCase.patient.initialEmotionalState
      }];
      setChatHistory(initialChat);
      
      // Save initial state
      if (caseId) {
        saveCaseState(caseId, {
          chatHistory: initialChat,
          investigations: [],
          differentialDiagnoses: [],
          patientEmotionalState: medicalCase.patient.initialEmotionalState,
        });
      }
    }
  }, [medicalCase, chatHistory.length, caseId]);

  // Effect to scroll the chat view automatically when new messages are added, but only if user is near the bottom
  useEffect(() => {
    const chatContainer = chatEndRef.current?.parentElement;
    if (chatContainer) {
      // Only scroll to bottom if user is already near the bottom (within 100px)
      const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
      if (isNearBottom) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Fallback for when parent element isn't available
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // === FEATURE: PATIENT CONSULTATION (CHAT) ===
  const handleSendMessage = async () => {
    if (!userInput.trim() || !medicalCase || !caseId) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput, timestamp: new Date().toISOString() };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setUserInput('');
    setIsPatientReplying(true);

    // Save state before API call
    saveCaseState(caseId, {
      chatHistory: newHistory,
      investigations,
      differentialDiagnoses,
      patientEmotionalState,
    });

    try {
      const response = await getChatResponse(
        newHistory, 
        medicalCase.patient, 
        medicalCase.underlyingDiagnosis, 
        medicalCase.fmtMode,
        prescriptions,
        medicalCase.causativeAgent
      );
      
      const patientMessage: ChatMessage = {
        sender: 'patient',
        text: response.text,
        timestamp: new Date().toISOString(),
        emotionalState: response.emotionalState,
        physicalReaction: response.physicalReaction,
        observations: response.observations,
      };

      const updatedHistory = [...newHistory, patientMessage];
      setPatientEmotionalState(response.emotionalState);
      setChatHistory(updatedHistory);
      
      // Save updated state
      saveCaseState(caseId, {
        chatHistory: updatedHistory,
        investigations,
        differentialDiagnoses,
        patientEmotionalState: response.emotionalState,
      });
    } catch (error) {
      console.error('Failed to get chat response:', error);
      // Keep user message even if API fails
    } finally {
      setIsPatientReplying(false);
    }
  };
  
  // === FEATURE: ORDERING INVESTIGATIONS ===
  const handleRequestInvestigation = async (testName: string) => {
    if (!medicalCase || !testName.trim() || !caseId || investigations.some(inv => inv.testName.toLowerCase() === testName.toLowerCase())) return;
    
    setActiveTab('reports');
    const newInvestigations = [...investigations, { testName, result: 'Processing...' }];
    setInvestigations(newInvestigations);
    
    // Save state before API call
    saveCaseState(caseId, {
      chatHistory,
      investigations: newInvestigations,
      differentialDiagnoses,
      patientEmotionalState,
    });

    try {
      const result = await getInvestigationResult(testName, medicalCase);
      const updatedInvestigations = newInvestigations.map(inv => inv.testName === testName ? result : inv);
      setInvestigations(updatedInvestigations);
      
      // Save updated state
      saveCaseState(caseId, {
        chatHistory,
        investigations: updatedInvestigations,
        differentialDiagnoses,
        patientEmotionalState,
      });
    } catch (error) {
      console.error('Failed to get investigation result:', error);
      // Remove processing state on error
      setInvestigations(prev => prev.filter(inv => inv.testName !== testName || inv.result !== 'Processing...'));
    }
  };

  const handleRequestCustomTest = () => {
      handleRequestInvestigation(customTestName);
      setCustomTestName('');
  }

  // === FEATURE: DIFFERENTIAL DIAGNOSIS MANAGEMENT ===
  const handleAddDdx = () => {
    if (ddxInput.trim() && !differentialDiagnoses.map(d => d.toLowerCase()).includes(ddxInput.trim().toLowerCase()) && caseId) {
        const updatedDdx = [...differentialDiagnoses, ddxInput.trim()];
        setDifferentialDiagnoses(updatedDdx);
        setDdxInput('');
        
        // Save state
        saveCaseState(caseId, {
          chatHistory,
          investigations,
          differentialDiagnoses: updatedDdx,
          patientEmotionalState,
        });
    }
  };

  const handleRemoveDdx = (diagnosisToRemove: string) => {
      if (!caseId) return;
      const updatedDdx = differentialDiagnoses.filter(d => d !== diagnosisToRemove);
      setDifferentialDiagnoses(updatedDdx);
      
      // Save state
      saveCaseState(caseId, {
        chatHistory,
        investigations,
        differentialDiagnoses: updatedDdx,
        patientEmotionalState,
      });
  };

  // === FEATURE: ATTENDING RESIDENT ===
  const handleAskAttending = async () => {
    if (!medicalCase) return;
    setIsAttendingLoading(true);
    setAttendingAdvice(null);
    try {
        const advice = await getGuiderAdvice(medicalCase, chatHistory, investigations, differentialDiagnoses);
        setAttendingAdvice(advice);
    } catch (error) {
        console.error("Failed to get attending advice:", error);
        const rationaleMessage = error instanceof Error ? error.message : "Please try again in a moment.";
        setAttendingAdvice({
            critique: ["An error occurred while fetching guidance."],
            suggestion: "Error fetching guidance.",
            rationale: `Could not connect to the attending. ${rationaleMessage}`
        });
    } finally {
        setIsAttendingLoading(false);
    }
  };

  // === FEATURE: MEDICINE MODE HANDLERS ===
  const handleAddPrescription = (item: PrescriptionItem) => {
    if (!caseId) return;
    const updated = [...prescriptions, item];
    setPrescriptions(updated);
    
    saveCaseState(caseId, {
      chatHistory,
      investigations,
      differentialDiagnoses,
      patientEmotionalState,
      medicineMode: { prescriptions: updated, simulationHistory: simulationOutcomes, isCured }
    });
  };

  const handleRemovePrescription = (drugId: string) => {
    if (!caseId) return;
    const updated = prescriptions.filter(p => p.drugId !== drugId);
    setPrescriptions(updated);
    
    saveCaseState(caseId, {
      chatHistory,
      investigations,
      differentialDiagnoses,
      patientEmotionalState,
      medicineMode: { prescriptions: updated, simulationHistory: simulationOutcomes, isCured }
    });
  };

  const handleSkipTime = async (value: number, unit: 'minutes' | 'hours' | 'days') => {
    if (!medicalCase || !caseId || isCured) return;

    setIsSimulating(true);
    try {
      const outcome = await simulateMedicineEffect(medicalCase, prescriptions, value, unit);
      
      const updatedHistory = [...simulationOutcomes, outcome];
      setSimulationOutcomes(updatedHistory);
      setIsCured(outcome.isCured);
      setPatientEmotionalState(outcome.newEmotionalState);

      // Add messages to the chat about the time skip
      const systemSkipMsg: ChatMessage = {
        sender: 'system',
        text: `--- ${value} ${unit} have passed ---`,
        timestamp: new Date().toISOString()
      };

      const outcomeList = outcome.outcomes.map(o => `• ${o}`).join('\n');
      const patientResponse = `${outcome.storyUpdate}\n\n${outcomeList}`;

      const patientMsg: ChatMessage = {
        sender: 'patient',
        text: patientResponse,
        timestamp: new Date().toISOString(),
        emotionalState: outcome.newEmotionalState
      };

      const updatedChat = [...chatHistory, systemSkipMsg, patientMsg];
      setChatHistory(updatedChat);

      saveCaseState(caseId, {
        chatHistory: updatedChat,
        investigations,
        differentialDiagnoses,
        patientEmotionalState: outcome.newEmotionalState,
        medicineMode: { 
          prescriptions, 
          simulationHistory: updatedHistory, 
          isCured: outcome.isCured 
        }
      });

      // If cured, show a success message
      if (outcome.isCured) {
        setIsCured(true);
      }
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsSimulating(false);
    }
  };
  
  // === FEATURE: PROPOSE FINAL DIAGNOSIS ===
  const handleSubmitDiagnosis = () => {
    if (!finalDiagnosis.trim() || !caseId) return;
    setIsSubmitting(true);
    completeCase(caseId);
    navigate(`/feedback/${caseId}`, {
      state: {
        userDiagnosis: finalDiagnosis,
        confidence,
        chatHistory,
        differentialDiagnoses,
        investigations,
        prescriptions,
        simulationHistory: simulationOutcomes
      }
    });
  };

  if (!medicalCase) {
    return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;
  }
  
  const TabButton: React.FC<{tabName: ActiveTab, currentTab: ActiveTab, children: React.ReactNode, icon: React.ReactNode}> = ({tabName, currentTab, children, icon}) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-300 ease-plexus-ease border-b-2 rounded-t-lg
            ${currentTab === tabName 
                ? 'text-plexus-blue border-plexus-accent'
                : 'text-gray-500 border-transparent hover:bg-plexus-accent/10 hover:text-plexus-blue'
            }
        `}
    >
        {icon}
        {children}
    </button>
  );
  
  const InvestigationCategory: React.FC<{title: string, tests: string[], icon: React.ReactNode}> = ({title, tests, icon}) => (
     <div className="mb-4">
        <h3 className="font-semibold text-gray-600 text-sm my-2 px-2 flex items-center gap-2">{icon} {title}</h3>
        <div className="space-y-1">
            {tests.map(test => (
                <button 
                    key={test} 
                    onClick={() => handleRequestInvestigation(test)} 
                    className="w-full text-left p-2 rounded-md hover:bg-plexus-accent/10 text-sm text-gray-700 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors duration-200"
                    disabled={investigations.some(i => i.testName.toLowerCase() === test.toLowerCase())}
                >
                    {test}
                </button>
            ))}
        </div>
     </div>
  )

  return (
    <div className="min-h-screen bg-plexus-bg-secondary p-4 lg:p-6 pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-screen-2xl mx-auto">
        
        {/* === Left Column: Patient Info and Chat Interface === */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Card displaying patient demographics and chief complaint. */}
          <Card>
            <div className="flex justify-between items-start">
              {/* Patient Name and Details */}
              <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                      <PatientIcon className="h-10 w-10" />
                  </div>
                  <div>
                      <h1 className="text-3xl font-bold text-plexus-blue">{medicalCase.patient.name}</h1>
                      <p className="text-gray-600 text-md">
                        {medicalCase.patient.age} yrs, {medicalCase.patient.gender} • {medicalCase.mbbsMode?.subjectName || 'MBBS Case'}
                      </p>
                      {isAttendantCase() && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>History given by: {getInterlocutorRole()} (Patient cannot give history)</span>
                        </div>
                      )}
                  </div>
              </div>
              {/* Current emotional state or status. */}
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-semibold text-plexus-accent">{getStateLabel()}</p>
                <p className="text-gray-700">{patientEmotionalState}</p>
              </div>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700">Chief Complaint</h3>
                <p className="text-gray-600">{medicalCase.presentingComplaint?.chiefComplaint || 'Not specified'}</p>
            </div>
          </Card>

          {/* Card containing the main chat interface. */}
          <Card className="flex flex-col h-[50vh] sm:h-[60vh] md:h-[65vh]">
            <h2 className="text-xl font-semibold mb-4 text-plexus-blue flex items-center justify-between flex-wrap gap-2">
              <span>
                Consultation {isAttendantCase() && (
                  <span className="text-xs sm:text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full ml-2">
                    Speaking with: {getInterlocutorRole()}
                  </span>
                )}
              </span>
            </h2>
            {/* Chat history display area. `overflow-y-auto` makes it scrollable. */}
            <div className="flex-grow overflow-y-auto pr-4 space-y-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className="animate-fade-in-up">
                  {msg.sender === 'system' ? (
                    <div className="flex justify-center my-6 px-4 w-full">
                      <div className="flex items-center gap-4 w-full max-w-lg">
                        <div className="h-px bg-gray-200 flex-grow" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-white px-3 italic whitespace-nowrap">
                          {msg.text}
                        </span>
                        <div className="h-px bg-gray-200 flex-grow" />
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'patient' && (
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0" title={getInterlocutorRole()}>
                          <PatientIcon className="h-5 w-5"/>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-md">
                        <div className={`p-3.5 rounded-2xl shadow-sm whitespace-pre-wrap ${
                          msg.sender === 'user' 
                            ? 'bg-plexus-blue text-white rounded-br-none' 
                            : 'bg-ivory text-gray-800 rounded-bl-none border border-gray-100'
                        }`}>
                          {msg.sender === 'patient' && isAttendantCase() && (
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                              {getInterlocutorRole()}:
                            </span>
                          )}
                          {msg.physicalReaction && (
                            <div className="text-[10px] font-black text-rose-500 uppercase mb-1.5 tracking-widest animate-pulse flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              {msg.physicalReaction}
                            </div>
                          )}
                          <p className={`text-sm leading-relaxed ${msg.text.startsWith('/act ') ? 'italic font-medium text-plexus-blue-dark' : ''}`}>
                            {msg.text.startsWith('/act ') ? msg.text.replace('/act ', 'Action: ') : msg.text}
                          </p>
                          <div className={`text-[9px] mt-1.5 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        
                        {msg.observations && (
                          <div className="mt-1 flex justify-start animate-fade-in">
                            <div className="bg-blue-50/70 border border-blue-200/50 rounded-xl p-3 flex items-start gap-3 shadow-sm backdrop-blur-sm">
                              <div className="bg-blue-500/10 p-1.5 rounded-lg">
                                <DocumentSearchIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-[9px] font-black text-blue-600/80 uppercase block mb-0.5 tracking-tighter">Clinical Observation</span>
                                <p className="text-[11px] text-blue-900 leading-normal font-medium">{msg.observations}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* The "patient is typing" indicator, shown conditionally. */}
              {isPatientReplying && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0" title={getInterlocutorRole()}>
                    <PatientIcon className="h-5 w-5"/>
                  </div>
                  <div className="bg-ivory text-gray-800 p-3 rounded-xl rounded-bl-none shadow-sm">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {/* An invisible element at the end of the chat, used as a target for auto-scrolling. */}
              <div ref={chatEndRef} />
            </div>
            {/* Chat input area at the bottom of the card. */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setUserInput(prev => prev.startsWith('/act ') ? prev : '/act ' + prev)}
                  disabled={isPatientReplying}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                    userInput.startsWith('/act ') 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <HandIcon className="h-3 w-3" />
                  Perform Physical Action
                </button>
                {userInput.startsWith('/act ') && (
                  <span className="text-[10px] text-blue-600 font-bold animate-pulse">ACTION MODE ACTIVE</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                  placeholder={userInput.startsWith('/act ') ? "Describe your physical action (e.g. Palpate the abdomen)..." : `Ask the ${getInterlocutorRole().toLowerCase()} a question...`}
                  className={`flex-grow p-3 bg-white text-gray-900 placeholder:text-gray-400 border rounded-lg focus:ring-2 transition-all ${
                    userInput.startsWith('/act ') 
                    ? 'border-blue-500 ring-blue-200 bg-blue-50/30' 
                    : 'border-gray-300 focus:ring-plexus-accent focus:border-plexus-accent'
                  }`}
                  disabled={isPatientReplying}
                />
                <button onClick={handleSendMessage} disabled={isPatientReplying || !userInput.trim()} className="bg-plexus-blue text-white font-bold py-3 px-5 rounded-lg hover:bg-plexus-blue-dark disabled:bg-gray-400 transition-all duration-300 ease-plexus-ease transform hover:scale-105">Send</button>
              </div>
            </div>
          </Card>
        </div>

        {/* === Right Column: Tabbed Interface for Investigations, DDx, and Resident === */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-full max-h-[calc(65vh+160px)]">
            {/* Tab navigation bar */}
            <div className="flex border-b border-gray-200 -mx-6 px-2">
                <TabButton tabName="attending" currentTab={activeTab} icon={<GuiderIcon className="h-5 w-5"/>}>Resident</TabButton>
                <TabButton tabName="differential" currentTab={activeTab} icon={<ClipboardListIcon className="h-5 w-5"/>}>Differential</TabButton>
                <TabButton tabName="order" currentTab={activeTab} icon={<PlusCircleIcon className="h-5 w-5"/>}>
                  {medicalCase?.fmtMode?.enabled && medicalCase.fmtMode.zone === 3 ? 'PM Exam' : 'Order'}
                </TabButton>
                <TabButton tabName="reports" currentTab={activeTab} icon={<DocumentIcon className="h-5 w-5"/>}>
                  {medicalCase?.fmtMode?.enabled && medicalCase.fmtMode.zone === 3 ? 'Autopsy' : 'Reports'}
                </TabButton>
                {/* Medicine Mode Tab */}
                <button
                    onClick={() => setActiveTab('medicine' as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-300 ease-plexus-ease border-b-2 rounded-t-lg
                        ${activeTab === ('medicine' as any)
                            ? 'text-plexus-blue border-plexus-accent'
                            : 'text-gray-500 border-transparent hover:bg-plexus-accent/10 hover:text-plexus-blue'
                        }
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Medicine
                </button>
            </div>
            {/* Container for the content of the currently active tab. */}
            <div className="mt-4 flex-grow flex flex-col overflow-y-auto pr-2">
                
                {/* Medicine Mode Tab Content */}
                {activeTab === ('medicine' as any) && (
                  <div className="animate-fade-in space-y-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center bg-plexus-blue/5 p-4 rounded-xl border border-plexus-blue/10">
                        <div>
                          <h3 className="font-bold text-plexus-blue">Prescription Mode</h3>
                          <p className="text-xs text-gray-500">{prescriptions.length} drugs active</p>
                        </div>
                        <button 
                          onClick={() => setShowPrescriptionModal(true)}
                          className="bg-plexus-blue text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-plexus-blue-dark transition-all"
                        >
                          Prescribe
                        </button>
                      </div>

                      <div className="flex justify-between items-center bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <div>
                          <h3 className="font-bold text-amber-800">Time Simulation</h3>
                          <p className="text-xs text-amber-600">Advance case timeline</p>
                        </div>
                        <TimeSkipControl onSkip={handleSkipTime} isLoading={isSimulating} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <DocumentIcon className="h-4 w-4" />
                        Treatment Progress
                      </h3>
                      {simulationOutcomes.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-200 rounded-xl">
                          No simulation history yet. Prescribe medication and skip time to see results.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {simulationOutcomes.map((outcome, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                  T + {outcome.timeElapsed}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(outcome.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {outcome.outcomes.map((text, i) => (
                                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    {text}
                                  </li>
                                ))}
                              </ul>
                              {outcome.isCured && (
                                <div className="mt-3 p-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Patient Cured
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Resident Tab Content */}
                {activeTab === 'attending' && (
                  <div className="animate-fade-in flex flex-col h-full">
                    {/* Elegant info banner - appears when no advice yet */}
                    {!attendingAdvice && !isAttendingLoading && (
                      <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-plexus-accent rounded-r-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <GuiderIcon className="h-6 w-6 text-plexus-accent flex-shrink-0 mt-0.5"/>
                          <div className="flex-grow">
                            <h3 className="font-semibold text-gray-800 mb-2">Your Resident</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Sees all your work, reassures the right steps and gently critiques the wrong ones. 
                              Gives clear direction on what to do next—with rationale. 
                              <span className="font-semibold text-plexus-blue"> Don't hesitate to use repeatedly</span>—it builds 
                              reasoning muscle and helps point out key missed flaws.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                      {isAttendingLoading ? (
                         <div className="flex flex-col items-center text-gray-500 pt-10"><Spinner size="md" className="border-plexus-accent/50" /><p className="mt-3 text-sm italic">Resident is reviewing your progress...</p></div>
                      ) : attendingAdvice ? (
                        <div className="space-y-6">
                           <h3 className="font-semibold text-plexus-accent text-md">Suggestion</h3>
                           <p className="mt-1 p-3 bg-plexus-accent/10 text-plexus-blue-dark rounded-lg font-medium">{attendingAdvice.suggestion}</p>
                           <h3 className="font-semibold text-gray-700 text-md">Rationale</h3>
                           <p className="mt-1 text-gray-600">{attendingAdvice.rationale}</p>
                           {attendingAdvice.critique.length > 0 && (
                            <>
                                <h3 className="font-semibold text-gray-700 text-md">Observation</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2 pl-2">
                                    {attendingAdvice.critique.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </>
                           )}
                        </div>
                      ) : (
                         <div className="text-center text-gray-500 pt-10">
                           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-plexus-accent/10 to-plexus-blue/10 rounded-full mb-3">
                             <GuiderIcon className="h-8 w-8 text-plexus-accent"/>
                           </div>
                           <h3 className="text-xl font-bold text-gray-800 mb-2">Ask the Resident</h3>
                           <p className="text-sm text-gray-600 max-w-xs mx-auto">Ready to guide your clinical reasoning at any point in your workup</p>
                         </div>
                      )}
                    </div>
                    <div className="pt-4 mt-auto border-t border-gray-200">
                      <button onClick={handleAskAttending} disabled={isAttendingLoading} className="w-full bg-plexus-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-plexus-accent/90 disabled:bg-gray-400 disabled:cursor-wait transition-all duration-300 ease-plexus-ease flex items-center justify-center gap-2">
                        <GuiderIcon className="h-5 w-5"/>
                        {isAttendingLoading ? 'Reviewing...' : (attendingAdvice ? 'Ask Again' : 'Consult Resident')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Differential Tab Content */}
                {activeTab === 'differential' && (
                  <div className="animate-fade-in flex flex-col h-full">
                    <div className="flex-grow overflow-y-auto pr-2">
                        {differentialDiagnoses.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Your differential diagnosis list is empty.</p>
                        ) : (
                            <ul className="space-y-2">
                                {differentialDiagnoses.map((d, i) => (
                                    <li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                        <span className="text-gray-800">{d}</span>
                                        <button onClick={() => handleRemoveDdx(d)} className="text-red-500 hover:text-red-700 p-1 rounded-full">&times;</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                     <div className="pt-4 mt-auto border-t border-gray-200 flex gap-2">
                        <input type="text" value={ddxInput} onChange={e => setDdxInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddDdx()} placeholder="Add to list..." className="flex-grow p-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-1 focus:ring-plexus-accent"/>
                        <button onClick={handleAddDdx} className="bg-plexus-blue text-white font-semibold px-4 py-2 rounded-md hover:bg-plexus-blue-dark">Add</button>
                    </div>
                  </div>
                )}

                {/* Order Tab Content */}
                {activeTab === 'order' && (
                    <div className="animate-fade-in">
                        {/* Conditional rendering: PM examination for Zone 3, normal investigations otherwise */}
                        {medicalCase.fmtMode?.enabled && medicalCase.fmtMode.zone === 3 ? (
                          <>
                            {/* FMT Zone 3: Post-mortem examination options */}
                            <InvestigationCategory title="External Examination" tests={FMT_PM_EXAMINATION_OPTIONS['External Examination']} icon={<ExamIcon className="h-4 w-4 text-red-500"/>} />
                            <InvestigationCategory title="Internal Examination" tests={FMT_PM_EXAMINATION_OPTIONS['Internal Examination']} icon={<ExamIcon className="h-4 w-4 text-orange-500"/>} />
                            <InvestigationCategory title="Toxicology & Analysis" tests={FMT_PM_EXAMINATION_OPTIONS['Toxicology & Analysis']} icon={<LabIcon className="h-4 w-4 text-purple-500"/>} />
                          </>
                        ) : (
                          <>
                            {/* Normal investigation options */}
                        <InvestigationCategory title="Common Labs" tests={INVESTIGATION_OPTIONS.labs} icon={<LabIcon className="h-4 w-4 text-blue-500"/>} />
                        <InvestigationCategory title="Common Imaging" tests={INVESTIGATION_OPTIONS.imaging} icon={<ImagingIcon className="h-4 w-4 text-purple-500"/>} />
                        <InvestigationCategory title="Physical Exams" tests={INVESTIGATION_OPTIONS.exams} icon={<ExamIcon className="h-4 w-4 text-green-500"/>} />
                          </>
                        )}
                        {/* Input for requesting a custom test not in the predefined lists. */}
                        <div className="pt-4 mt-2 border-t border-gray-200">
                             <h3 className="font-semibold text-gray-600 text-sm mb-2 px-2">Order Custom Test</h3>
                             <div className="flex gap-2">
                                <input type="text" value={customTestName} onChange={e => setCustomTestName(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleRequestCustomTest()} placeholder="e.g., 'Serum Ferritin'" className="flex-grow p-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-1 focus:ring-plexus-accent"/>
                                <button onClick={handleRequestCustomTest} className="bg-plexus-blue text-white font-semibold px-4 py-2 rounded-md hover:bg-plexus-blue-dark">Order</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Reports Tab Content */}
                {activeTab === 'reports' && (
                    <div className="space-y-2 animate-fade-in">
                        {investigations.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No investigations ordered yet.</p>}
                        {/* Map over the investigations array to display each one. */}
                        {investigations.map((inv, i) => (
                            <button key={i} onClick={() => inv.result !== 'Processing...' && setSelectedReport(inv)} className="w-full text-left p-3 rounded-lg hover:bg-plexus-accent/10 disabled:bg-transparent disabled:cursor-default transition-colors">
                                <p className="font-medium text-gray-800">{inv.testName}</p>
                                {inv.result === 'Processing...' ? (
                                    // Show a spinner while the result is being generated.
                                    <div className="flex items-center pl-2 mt-1"><Spinner size="sm" className="mr-2 border-plexus-accent/50" /><p className="text-gray-500 italic">{inv.result}</p></div>
                                ) : (
                                    // Show the summary result once available.
                                    <p className="text-gray-600 text-sm pl-2 mt-1 truncate">{inv.result}</p>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
          </Card>
        </div>
      </div>

      {/* Fixed footer bar for the final diagnosis button. It remains visible at the bottom of the screen. */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 z-20">
          <div className="max-w-screen-2xl mx-auto flex justify-end">
              <button onClick={() => setShowDiagnosisModal(true)} className="bg-plexus-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-plexus-blue-dark transition-all ease-plexus-ease transform hover:scale-105 shadow-plexus-lg">Propose Final Diagnosis</button>
          </div>
      </div>
      
      {/* Final Diagnosis Modal, shown conditionally. */}
      {showDiagnosisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <Card className="w-full max-w-lg bg-white/90 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-plexus-blue mb-4">Final Diagnosis</h2>
                <p className="text-gray-600 mb-6">Enter your final diagnosis and confidence level.</p>
                {/* Text input for the diagnosis. */}
                <input type="text" value={finalDiagnosis} onChange={e => setFinalDiagnosis(e.target.value)} placeholder="Enter final diagnosis..." className="w-full p-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plexus-accent mb-4"/>
                {/* Slider for confidence level. */}
                <label className="block text-gray-700 font-medium mb-2">Confidence: {confidence}%</label>
                <input type="range" min="0" max="100" step="5" value={confidence} onChange={e => setConfidence(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                {/* Action buttons for the modal. */}
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={() => setShowDiagnosisModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmitDiagnosis} disabled={!finalDiagnosis.trim() || isSubmitting} className="px-6 py-2 bg-plexus-blue text-white font-bold rounded-lg hover:bg-plexus-blue-dark disabled:bg-gray-400 flex items-center">
                        {isSubmitting ? <Spinner size="sm" /> : 'Submit'}
                    </button>
                </div>
            </Card>
        </div>
      )}

      {/* Report Viewer Modal, shown when a completed report is clicked. */}
      {selectedReport && medicalCase && (
         <ReportViewer
            report={selectedReport}
            patient={medicalCase.patient}
            onClose={() => setSelectedReport(null)}
          />
      )}

      {/* Success Modal */}
      {isCured && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <Card className="w-full max-w-md bg-white text-center p-8 border-t-8 border-green-500 shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Patient Cured!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your treatment plan was successful. {medicalCase.patient.name} has recovered.
              It's time to conclude this clinical session and review your performance.
            </p>
            <button 
              onClick={() => setShowDiagnosisModal(true)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Conclude Case & View Feedback
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Card>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <PrescriptionModal 
          currentPrescriptions={prescriptions}
          onAdd={handleAddPrescription}
          onRemove={handleRemovePrescription}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}
    </div>
  );
};