/**
 * @file types.ts
 * @description This file serves as the single source of truth for all data structures and type definitions used across the server-side functions.
 */

export type CaseRarity = 'Very Common' | 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
export type RaritySelection = CaseRarity | 'Any';

export enum Specialty {
  'General Medicine' = 'General Medicine',
  Cardiology = 'Cardiology',
  Pulmonology = 'Pulmonology',
  Gastroenterology = 'Gastroenterology',
  Neurology = 'Neurology',
  Dermatology = 'Dermatology',
  Endocrinology = 'Endocrinology',
  Nephrology = 'Nephrology',
  Oncology = 'Oncology',
  Rheumatology = 'Rheumatology',
  Psychiatry = 'Psychiatry',
  'Infectious Disease' = 'Infectious Disease',
  Hematology = 'Hematology',
  Orthopedics = 'Orthopedics',
}

export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  occupation: string;
  background: string;
  initialEmotionalState: string;
  personalityTrait: string; // Patient's communication personality archetype
  healthLiteracy: number; // Health literacy level 1-9
}

export interface PresentingComplaint {
  chiefComplaint: string;
  historyOfPresentingIllness: string;
}

export interface PrescriptionItem {
  drugId: string;
  drugName: string;
  dosageForm: string;
  quantity: string;
  durationDays: number;
}

export interface SimulationOutcome {
  timestamp: string;
  timeElapsed: string;
  outcomes: string[];
  isCured: boolean;
  storyUpdate?: string;
  newEmotionalState: string;
}

export interface MedicineState {
  prescriptions: PrescriptionItem[];
  simulationHistory: SimulationOutcome[];
  isCured: boolean;
}

export interface MedicalCase {
  id: string;
  rarity: CaseRarity;
  specialty: Specialty;
  patient: PatientProfile;
  presentingComplaint: PresentingComplaint;
  underlyingDiagnosis: string;
  causativeAgent?: string;
  status: 'active' | 'completed';
  mbbsMode?: {
    enabled: boolean;
    subjectId: string;
    subjectName: string;
  };
  fmtMode?: {
    enabled: boolean;
    zone: 1 | 2 | 3;
    topicId: string;
    topicName: string;
  };
  medicineMode?: MedicineState;
}

export interface ChatMessage {
  sender: 'user' | 'patient' | 'system';
  text: string;
  timestamp: string;
  emotionalState?: string;
  physicalReaction?: string;
  observations?: string;
}

export interface InvestigationResult {
  testName: string;
  result: string;
  imageUrl?: string;
  interpretation?: string;
}

export interface CaseFeedback {
  correctness: 'Correct' | 'Partially Correct' | 'Incorrect';
  reasoningAnalysis: string;
  whatWentWell: string[];
  areasForImprovement: string[];
  keyMissedClues: string[];
  finalDiagnosisExplanation: string;
  differentialDiagnosisAnalysis: string[];
  universityExamQuestions?: {
    question: string;
    context: string;
    subject: string;
    answer?: string;
  }[];
}