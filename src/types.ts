/**
 * @file types.ts
 * @description This file serves as the single source of truth for all data structures and type definitions used across the Plexus application.
 * By centralizing types, we ensure data consistency, improve code readability, and leverage TypeScript's static analysis to catch errors during development.
 * This is fundamental to building a robust and maintainable application.
 */

// Represents the clinical rarity of a case. This is used for weighted case selection and for informing the user on the feedback screen.
export type CaseRarity = 'Very Common' | 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';

// Represents the user's rarity selection preference, including the option for any rarity.
export type RaritySelection = CaseRarity | 'Any';

// Defines the available medical specialties. This enum populates the specialty selection dropdown on the HomeScreen.
// 'General Medicine' is a special case that triggers a random specialty selection in the case generation logic.
export enum Specialty {
  'General Medicine' = 'General Medicine', // This will function as the "Random" or "Any" category
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

// Defines the structure for the AI-generated patient's demographic and background information.
// This data is used to populate the patient info card on the CaseScreen and is passed to the Gemini API
// to maintain context during the chat simulation. `initialEmotionalState` sets the tone for the first interaction.
export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  occupation: string;
  background: string; // Contains crucial, subtle clinical clues for the user to uncover.
  initialEmotionalState: string;
  personalityTrait?: string; // Optional legacy field
  healthLiteracy?: number; // Optional legacy field
  unconscious?: boolean; // Whether patient is unconscious / comatose
  cannotSpeak?: boolean; // Whether patient is unable to speak (aphasic, infant, intubated, severe distress)
  attendant?: {
    name: string;
    relationship: string; // e.g. "Mother", "Father", "Spouse", "Bystander", "Son", "Attendant"
  };
}

// Defines the structure for the patient's initial complaint.
// This is the first piece of clinical information the user receives and is displayed on the CaseScreen.
export interface PresentingComplaint {
  chiefComplaint: string;
  historyOfPresentingIllness: string;
}

// Represents an item in a medical prescription.
export interface PrescriptionItem {
  drugId: string;
  drugName: string;
  dosageForm: string;
  quantity: string;
  durationDays: number;
}

// Represents the outcome of a medicine simulation step.
export interface SimulationOutcome {
  timestamp: string;
  timeElapsed: string; // e.g., "2 days"
  outcomes: string[];
  isCured: boolean;
  storyUpdate?: string;
  newEmotionalState: string;
}

// Tracks the state of the medicine simulation for a case.
export interface MedicineState {
  prescriptions: PrescriptionItem[];
  simulationHistory: SimulationOutcome[];
  isCured: boolean;
}

// The core data structure for a single medical simulation case.
// It aggregates all case-related information, including the "secret" `underlyingDiagnosis` which is used by the AI
// to generate consistent responses and for final feedback evaluation.
export interface MedicalCase {
  id: string; // Unique identifier for the case session.
  rarity: CaseRarity;
  specialty: Specialty;
  patient: PatientProfile;
  presentingComplaint: PresentingComplaint;
  underlyingDiagnosis: string; // This is secret, used for AI consistency and feedback generation.
  causativeAgent?: string; // Optional: pathogen for infectious diseases.
  status: 'active' | 'completed'; // Tracks the case's lifecycle.
  mbbsMode?: {
    enabled: boolean;
    subjectId: string; // e.g., 'anatomy', 'physiology', 'biochemistry'
    subjectName: string; // e.g., 'Anatomy'
    topicId?: string;
    topicName?: string;
    universityQuestion?: string;
    modelAnswer?: string;
  };
  fmtMode?: {
    enabled: boolean;
    zone: 1 | 2 | 3; // 1: Alive/Conscious, 2: Alive/Unconscious, 3: Dead
    topicId: string;
    topicName: string;
  };
  medicineMode?: MedicineState;
}

// Represents a single message in the patient consultation chat on the CaseScreen.
// `sender` determines the message's alignment and styling.
// `emotionalState` is a key feature, provided by the AI to help the user practice empathy and read patient cues.
export interface ChatMessage {
  sender: 'user' | 'patient' | 'system';
  text: string;
  timestamp: string;
  emotionalState?: string;
  physicalReaction?: string;
  observations?: string;
}

// Defines the structure for the results of a requested clinical investigation (lab, imaging, or exam).
// This is used to populate the 'Reports' tab on the CaseScreen.
// `imageUrl` is optional and used specifically for imaging results generated by the `imagen` model.
export interface InvestigationResult {
  testName: string;
  result: string; // A one-line summary. 'Processing...' is used as a placeholder during generation.
  imageUrl?: string; // Base64 data URL for generated images.
  interpretation?: string; // The full, detailed report text.
}

// Defines the comprehensive, structured feedback object generated by the AI on the FeedbackScreen.
// Each field corresponds to a specific section of the feedback UI, providing a detailed performance review.
export interface CaseFeedback {
  correctness: 'Correct' | 'Partially Correct' | 'Incorrect';
  reasoningAnalysis: string;
  whatWentWell: string[];
  areasForImprovement: string[];
  keyMissedClues: string[]; // Specific, actionable clues the user may have overlooked in the chat.
  finalDiagnosisExplanation: string;
  differentialDiagnosisAnalysis: string[];
  universityExamQuestions?: {
    question: string;
    context: string;    // Disease/topic name for answer generation
    subject: string;    // 'psm' or 'fmt' for subject-specific context
    answer?: string;    // Optional - filled on demand when user clicks "Get Answer"
  }[]; // MBBS mode: AI-generated university exam questions (PSM & FMT)
}

// A placeholder structure for tracking overall user statistics. Currently used to track completed cases.
// This could be expanded in the future to include more detailed analytics.
export interface UserProgress {
  completedCases: number;
  averageConfidence: number;
  correctDiagnosisRate: number;
}

// Subscription tier types
export type SubscriptionTier = 'free' | 'premium';

// Subscription information
export interface Subscription {
  tier: SubscriptionTier;
  startDate: Date | string; // Firestore timestamps can be converted to Date
  endDate: Date | string | null; // null for free tier
  isActive: boolean;
  totalCasesUsed: number;
  maxTotalCases: number;
}

// User usage statistics for rate limiting and analytics
export interface UserUsageStats {
  casesGeneratedToday: number;
  casesGeneratedThisWeek: number;
  lastCaseGeneratedAt: Date | string;
  totalCasesGenerated: number;
  apiRequestsToday: number;
  apiRequestsThisHour: number;
  subscription?: Subscription; // Optional subscription info
}

// User profile information
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  mbbsYear?: 1 | 2 | 3 | 4; // MBBS professional year (1-4)
  createdAt: Date;
  lastLoginAt: Date;
  usageStats: UserUsageStats;
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserStats: (stats: Partial<UserUsageStats>) => Promise<void>;
  checkRateLimit: (action: 'case_generation' | 'api_request') => Promise<{ allowed: boolean; remaining: number; resetTime: Date }>;
  subscribeToPremium: () => Promise<void>;
  updateSubscription: (subscription: Partial<Subscription>) => Promise<void>;
  canGenerateCase: () => Promise<{ allowed: boolean; remaining: number; resetTime: Date }>;
  checkAndUpdateSubscription: () => Promise<void>;
}