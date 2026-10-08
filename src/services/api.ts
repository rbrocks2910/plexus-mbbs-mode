/**
 * @file api.ts
 * @description Central service layer for simulation, fully functional in standalone offline mode.
 */

import {
  MedicalCase,
  Specialty,
  RaritySelection,
  ChatMessage,
  PatientProfile,
  InvestigationResult,
  CaseFeedback,
  PrescriptionItem,
  SimulationOutcome,
} from '../types';
import { getDummyCase, getMbbsCase } from './dummyData';
import { findFirstYearTopic } from '../data/firstYearExamBank';

export const generatePatientCase = async (
  specialty: Specialty,
  rarity: RaritySelection,
  recentDiagnoses: string[] = [],
  mbbsMode?: { enabled: boolean; subjectId: string; subjectName: string }
): Promise<MedicalCase> => {
  // Try remote backend if available, otherwise return MBBS clinical case
  try {
    const response = await fetch('/api/generateCase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialty, rarity, recentDiagnoses, mbbsMode }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Fall through to local simulation
  }

  if (mbbsMode && mbbsMode.enabled) {
    return getMbbsCase(mbbsMode.subjectId, mbbsMode.subjectName);
  }
  return getDummyCase(specialty, rarity);
};

export const getChatResponse = async (
  chatHistory: ChatMessage[],
  patient: PatientProfile,
  diagnosis: string,
  fmtMode?: { enabled: boolean; zone: 1 | 2 | 3; topicId: string; topicName: string },
  prescriptions?: PrescriptionItem[],
  causativeAgent?: string
): Promise<{ text: string; emotionalState: string; physicalReaction?: string; observations?: string }> => {
  try {
    const response = await fetch('/api/getChatResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatHistory, patient, diagnosis, fmtMode, prescriptions, causativeAgent }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Fall through to local simulation
  }

  // Check if patient cannot speak or is unconscious
  const isAttendant = patient.unconscious || patient.cannotSpeak || !!patient.attendant || (patient.age && patient.age <= 10) ||
    diagnosis.toLowerCase().includes('shock') || diagnosis.toLowerCase().includes('coma') || diagnosis.toLowerCase().includes('unconscious') || diagnosis.toLowerCase().includes('aphasia') || diagnosis.toLowerCase().includes('altered sensorium');

  const attendantRole = patient.attendant?.relationship || (patient.age <= 10 ? 'Parent' : 'Attendant');

  // Realistic patient or attendant simulation response generator
  const latestMessage = chatHistory[chatHistory.length - 1]?.text.toLowerCase() || '';
  let reply = isAttendant
    ? `Doctor, I am the patient's ${attendantRole}. The patient cannot speak directly right now, but I have been with them and can answer your questions.`
    : `Doctor, I've been feeling quite unwell with this. Could you please help me understand what might be causing it?`;
  let emotionalState = isAttendant ? 'Anxious Attendant' : (patient.initialEmotionalState || 'Concerned');

  if (latestMessage.includes('pain') || latestMessage.includes('hurt')) {
    reply = isAttendant
      ? `Doctor, they were clutching this area in severe agony before losing responsiveness / becoming this weak. It seemed excruciating.`
      : `Yes doctor, there is discomfort. It bothers me a lot, especially when I exert myself or try to rest.`;
    emotionalState = isAttendant ? 'Worried' : 'Uncomfortable';
  } else if (latestMessage.includes('fever') || latestMessage.includes('temperature') || latestMessage.includes('chill')) {
    reply = isAttendant
      ? `Yes doctor, their forehead has been burning hot with severe shivering. The body temperature spiked repeatedly over the last few days.`
      : `Yes, my body temperature keeps spiking. I get severe chills and body ache, and then I sweat profusely.`;
    emotionalState = isAttendant ? 'Distressed' : 'Exhausted';
  } else if (latestMessage.includes('how long') || latestMessage.includes('when did') || latestMessage.includes('start') || latestMessage.includes('duration')) {
    reply = isAttendant
      ? `This started about a few days ago, doctor. But it became critically worse today, which is why we rushed them to the hospital.`
      : `It started around a few weeks ago and has been progressively worsening over the past few days.`;
    emotionalState = 'Anxious';
  } else if (latestMessage.includes('medicine') || latestMessage.includes('drug') || latestMessage.includes('treatment') || latestMessage.includes('take')) {
    reply = isAttendant
      ? `We gave some over-the-counter medicine at home when symptoms began, but it did not help at all.`
      : `I took some paracetamol and over-the-counter tablets from the local chemist, but they only gave temporary relief.`;
  } else if (latestMessage.includes('family') || latestMessage.includes('history') || latestMessage.includes('smoke') || latestMessage.includes('alcohol')) {
    reply = isAttendant
      ? `In the family, there is a history of hypertension and diabetes. No major known drug allergies that we are aware of.`
      : `In my family, my father had high blood pressure. Regarding habits, I try to lead a regular life, but work stress is quite high.`;
  } else if (latestMessage.includes('appetite') || latestMessage.includes('weight') || latestMessage.includes('eat')) {
    reply = isAttendant
      ? `They have barely been able to eat or drink anything recently due to the severe illness.`
      : `My appetite has dropped significantly lately, doctor. I have also noticed my clothes fitting looser.`;
  } else if (latestMessage.includes('breath') || latestMessage.includes('cough') || latestMessage.includes('chest')) {
    reply = isAttendant
      ? `Their breathing has been very rapid and shallow, doctor. We noticed severe chest retractions.`
      : `I find it harder to catch my breath, and this persistent irritation in my chest won't go away.`;
    emotionalState = 'Distressed';
  }

  return {
    text: reply,
    emotionalState,
    physicalReaction: isAttendant
      ? `${attendantRole} leans forward attentively and gestures towards the patient.`
      : 'Patient nods thoughtfully and maintains eye contact.',
    observations: isAttendant
      ? 'Patient is currently unresponsive or unable to phonate clearly. Vitals: Pulse 94/min, BP 118/76 mmHg, SpO2 96% on room air.'
      : 'Vitals: Pulse 88/min, BP 124/82 mmHg, SpO2 98% on room air.'
  };
};

export const getInvestigationResult = async (
  testName: string,
  medicalCase: MedicalCase
): Promise<InvestigationResult> => {
  try {
    const response = await fetch('/api/getInvestigationResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testName, medicalCase }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Fall through to local simulation
  }

  const nameLower = testName.toLowerCase();
  const diagLower = (medicalCase.underlyingDiagnosis || '').toLowerCase();

  let result = 'Within normal physiological limits.';
  let interpretation = 'No acute gross pathology detected.';

  if (nameLower.includes('cbc') || nameLower.includes('complete blood') || nameLower.includes('hemogram')) {
    if (diagLower.includes('dengue')) {
      result = 'Hb: 14.8 g/dL, Total WBC: 2,800/mcL (Leukopenia), Platelets: 42,000/mcL (Severe Thrombocytopenia), Hematocrit: 48% (Hemoconcentration).';
      interpretation = 'Severe thrombocytopenia and hemoconcentration suggestive of acute dengue with plasma leakage.';
    } else if (diagLower.includes('tuberculosis')) {
      result = 'Hb: 10.2 g/dL (Mild normocytic normochromic anemia), Total WBC: 9,200/mcL, Lymphocytes: 48%, ESR: 78 mm/hr (Markedly elevated).';
      interpretation = 'Elevated ESR and relative lymphocytosis consistent with chronic granulomatous infection.';
    } else if (diagLower.includes('malaria')) {
      result = 'Hb: 9.8 g/dL, Total WBC: 4,500/mcL, Platelets: 85,000/mcL, ESR: 35 mm/hr.';
      interpretation = 'Anemia and mild thrombocytopenia commonly observed in acute malaria.';
    } else {
      result = 'Hb: 13.5 g/dL, Total WBC: 11,800/mcL (Mild leukocytosis, 76% neutrophils), Platelets: 240,000/mcL.';
      interpretation = 'Mild neutrophilic leukocytosis suggestive of acute inflammatory or infective process.';
    }
  } else if (nameLower.includes('x-ray') || nameLower.includes('chest') || nameLower.includes('cxr')) {
    if (diagLower.includes('tuberculosis')) {
      result = 'Cavitary consolidation with fibro-nodular opacities in the right upper lobe. Blunting of the right costophrenic angle.';
      interpretation = 'Classic post-primary pulmonary tuberculosis presentation with apical cavitation.';
    } else {
      result = 'Normal cardiac silhouette and bronchovascular markings. Both lung fields clear. Costophrenic angles sharp.';
      interpretation = 'No focal consolidation, effusion, or pneumothorax.';
    }
  } else if (nameLower.includes('sputum') || nameLower.includes('afb') || nameLower.includes('smear') || nameLower.includes('cbnaat')) {
    if (diagLower.includes('tuberculosis')) {
      result = 'Ziehl-Neelsen Stain: 2+ Acid Fast Bacilli seen. GeneXpert (CBNAAT): Mycobacterium tuberculosis DETECTED, Rifampicin resistance NOT detected.';
      interpretation = 'Microbiologically confirmed pulmonary tuberculosis sensitive to first-line rifampicin.';
    } else {
      result = 'Gram stain: Mixed oral flora. Acid-fast bacilli not seen (negative).';
      interpretation = 'Negative for mycobacterial infection.';
    }
  } else if (nameLower.includes('malaria') || nameLower.includes('smear') || nameLower.includes('peripheral')) {
    if (diagLower.includes('malaria')) {
      result = 'Thick and Thin Leishman Stains: Schüffner dots and amoeboid trophozoites of Plasmodium vivax identified in enlarged red blood cells.';
      interpretation = 'Confirmed Plasmodium vivax malaria infection.';
    } else {
      result = 'Peripheral blood smear: Normocytic normochromic RBCs. No malarial parasites or hemoparasites seen.';
      interpretation = 'Negative for intra-erythrocytic parasites.';
    }
  } else if (nameLower.includes('ct') || nameLower.includes('head') || nameLower.includes('brain')) {
    if (diagLower.includes('subdural') || diagLower.includes('hematoma')) {
      result = 'NCCT Brain: Crescentic hyperdense collection along the right fronto-parietal convexity with 5mm midline shift.';
      interpretation = 'Acute subdural hematoma with mass effect requiring urgent neurosurgical evaluation.';
    } else {
      result = 'NCCT Brain: Ventricles, cisterns, and sulci are normal in size and appearance. No intracranial hemorrhage or acute infarct.';
      interpretation = 'Normal non-contrast head CT.';
    }
  } else if (nameLower.includes('atropine') || nameLower.includes('cholinesterase') || nameLower.includes('toxicology')) {
    if (diagLower.includes('organophosphorus')) {
      result = 'Serum Pseudocholinesterase: 1,200 U/L (Markedly reduced, normal: 5,400 - 13,200 U/L).';
      interpretation = 'Severe depression of cholinesterase activity pathognomonic for organophosphate toxicity.';
    } else {
      result = 'Toxicology screen: Negative for common pesticides, opioids, and benzodiazepines.';
      interpretation = 'Unremarkable toxicology profile.';
    }
  }

  return {
    testName,
    result,
    interpretation,
  };
};

export const getCaseFeedback = async (
  medicalCase: MedicalCase,
  userDiagnosis: string,
  userConfidence: number,
  chatHistory: ChatMessage[],
  differentialDiagnoses: string[],
  prescriptions?: PrescriptionItem[],
  simulationHistory?: SimulationOutcome[]
): Promise<CaseFeedback> => {
  try {
    const response = await fetch('/api/getCaseFeedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicalCase, userDiagnosis, userConfidence, chatHistory, differentialDiagnoses, prescriptions, simulationHistory }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Fall through to local simulation
  }

  const actualDiag = (medicalCase.underlyingDiagnosis || '').toLowerCase();
  const submittedDiag = (userDiagnosis || '').toLowerCase();

  const isExact = actualDiag.includes(submittedDiag) || submittedDiag.includes(actualDiag);
  const isClose = differentialDiagnoses.some(d => d.toLowerCase().includes(actualDiag) || actualDiag.includes(d.toLowerCase()));

  const correctness: CaseFeedback['correctness'] = isExact ? 'Correct' : isClose ? 'Partially Correct' : 'Incorrect';

  return {
    correctness,
    reasoningAnalysis: `You diagnosed the patient with "${userDiagnosis}". The underlying clinical diagnosis is ${medicalCase.underlyingDiagnosis}. Your clinical history-taking explored ${chatHistory.length} exchanges and differential consideration covered ${differentialDiagnoses.length} candidates.`,
    whatWentWell: [
      'Identified the chief presenting symptoms promptly.',
      'Constructed a logical differential diagnosis list.',
      'Interacted professionally and with empathy toward the patient.'
    ],
    areasForImprovement: [
      'Correlate risk factors and environmental exposures earlier in the clinical workup.',
      'Order high-yield confirmatory investigations before committing to definitive therapy.',
      'Always probe travel, occupational, and vaccination histories in fever cases.'
    ],
    keyMissedClues: [
      'The chronological timeline of presenting complaints.',
      'Exposure history mentioned in the patient background.'
    ],
    differentialDiagnosisAnalysis: differentialDiagnoses.map(ddx => `${ddx}: Valid differential consideration given the acute clinical presentation.`),
    finalDiagnosisExplanation: `The verified final diagnosis is ${medicalCase.underlyingDiagnosis}. This diagnosis is supported by the characteristic symptom constellation and hallmark clinical features.`,
    universityExamQuestions: medicalCase.mbbsMode?.universityQuestion ? [
      {
        question: medicalCase.mbbsMode.universityQuestion,
        context: medicalCase.mbbsMode.topicName || medicalCase.underlyingDiagnosis,
        subject: medicalCase.mbbsMode.subjectId || '1st-year',
        answer: medicalCase.mbbsMode.modelAnswer
      }
    ] : [
      {
        question: `Discuss the clinical features, diagnostic workup, and national management guidelines for ${medicalCase.underlyingDiagnosis}.`,
        context: medicalCase.underlyingDiagnosis,
        subject: medicalCase.mbbsMode?.subjectId || 'psm',
        answer: `Comprehensive MBBS notes for ${medicalCase.underlyingDiagnosis}: Understand the etiopathogenesis, classical clinical triad, definitive laboratory confirmation, and standard first-line management protocol.`
      }
    ]
  };
};

export const getGuiderAdvice = async (
  medicalCase: MedicalCase,
  chatHistory: ChatMessage[],
  investigations: InvestigationResult[],
  differentialDiagnoses: string[]
): Promise<{ critique: string[]; suggestion: string; rationale: string }> => {
  try {
    const response = await fetch('/api/getGuiderAdvice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicalCase, chatHistory, investigations, differentialDiagnoses }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Fall through to local simulation
  }

  return {
    critique: [
      "Good focus on the chief complaint.",
      investigations.length === 0 ? "Consider ordering standard baseline investigations (CBC, chest imaging, etc.)." : "Appropriate initial diagnostic workup in progress."
    ],
    suggestion: "Focus on differentiating infectious from non-infectious etiologies.",
    rationale: "Gathering specific epidemiological and occupational exposures helps narrow down the differential quickly."
  };
};

export const getExamAnswer = async (
  question: string,
  context: string,
  subject: string
): Promise<string> => {
  const match = findFirstYearTopic(context) || findFirstYearTopic(question);
  if (match && match.modelAnswer) {
    return match.modelAnswer;
  }

  try {
    const response = await fetch('/api/getExamAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context, subject }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.answer) {
        return data.answer;
      }
    }
  } catch (e) {
    // Fall through to fallback template
  }

  return `### MBBS University Examination Key Notes: ${context}
1. **Definition & Etiology:** Detailed overview of etiopathogenesis and causative factors.
2. **Clinical Features:** Cardinal signs and symptoms seen in typical university exam cases.
3. **Investigations:** Gold standard tests and confirmatory diagnostic algorithms.
4. **Management:** Stepwise therapeutic approach, monitoring parameters, and preventive strategies.`;
};

export const simulateMedicineEffect = async (
  medicalCase: MedicalCase,
  prescriptions: PrescriptionItem[],
  timeSkipValue: number,
  timeSkipUnit: 'minutes' | 'hours' | 'days'
): Promise<SimulationOutcome> => {
  try {
    const response = await fetch('/api/simulateMedicineEffect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicalCase, prescriptions, timeSkipValue, timeSkipUnit }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Fall through to local simulation
  }

  return {
    timestamp: new Date().toISOString(),
    timeElapsed: `${timeSkipValue} ${timeSkipUnit}`,
    outcomes: [
      `Patient monitored over ${timeSkipValue} ${timeSkipUnit}.`,
      `Medication administered: ${prescriptions.map(p => p.drugName).join(', ')}.`,
      `Vitals stabilized. Symptoms showing gradual improvement.`
    ],
    isCured: true,
    newEmotionalState: 'Relieved'
  };
};