/**
 * @file storage.ts
 * @description Utility functions for persisting application state to localStorage
 * and IndexedDB for offline support.
 */

import { AppState } from '../context/AppContext';
import { MedicalCase } from '../types';

const STORAGE_KEYS = {
  APP_STATE: 'plexus_mbbs_app_state_v2',
  CASE_STATE_PREFIX: 'plexus_mbbs_case_state_',
  OFFLINE_QUEUE: 'plexus_mbbs_offline_queue',
} as const;

/**
 * Save AppContext state to localStorage
 */
export const saveAppState = (state: AppState): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEYS.APP_STATE, serialized);
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
};

/**
 * Load AppContext state from localStorage
 */
export const loadAppState = (): AppState | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    if (!serialized) return null;
    const state = JSON.parse(serialized) as AppState;
    if (state) {
      state.isLoading = false;
      state.error = null;
    }
    return state;
  } catch (error) {
    console.error('Failed to load app state:', error);
    return null;
  }
};

/**
 * Clear AppContext state from localStorage
 */
export const clearAppState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.APP_STATE);
  } catch (error) {
    console.error('Failed to clear app state:', error);
  }
};

/**
 * Case-specific state interface for CaseScreen
 */
export interface CaseState {
  caseId: string;
  chatHistory: any[];
  investigations: any[];
  differentialDiagnoses: string[];
  patientEmotionalState: string;
  medicineMode?: {
    prescriptions: any[];
    simulationHistory: any[];
    isCured: boolean;
  };
  lastUpdated: string;
}

/**
 * Save case-specific state to localStorage
 */
export const saveCaseState = (caseId: string, state: Omit<CaseState, 'caseId' | 'lastUpdated'>): void => {
  try {
    const caseState: CaseState = {
      ...state,
      caseId,
      lastUpdated: new Date().toISOString(),
    };
    const serialized = JSON.stringify(caseState);
    localStorage.setItem(`${STORAGE_KEYS.CASE_STATE_PREFIX}${caseId}`, serialized);
  } catch (error) {
    console.error(`Failed to save case state for ${caseId}:`, error);
  }
};

/**
 * Load case-specific state from localStorage
 */
export const loadCaseState = (caseId: string): CaseState | null => {
  try {
    const serialized = localStorage.getItem(`${STORAGE_KEYS.CASE_STATE_PREFIX}${caseId}`);
    if (!serialized) return null;
    return JSON.parse(serialized) as CaseState;
  } catch (error) {
    console.error(`Failed to load case state for ${caseId}:`, error);
    return null;
  }
};

/**
 * Clear case-specific state from localStorage
 */
export const clearCaseState = (caseId: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEYS.CASE_STATE_PREFIX}${caseId}`);
  } catch (error) {
    console.error(`Failed to clear case state for ${caseId}:`, error);
  }
};

/**
 * Clear all case states (useful for cleanup)
 */
export const clearAllCaseStates = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.CASE_STATE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all case states:', error);
  }
};

/**
 * Offline action queue item
 */
export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retries: number;
}

/**
 * Add action to offline queue
 */
export const addToOfflineQueue = (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>): void => {
  try {
    const queue = getOfflineQueue();
    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retries: 0,
    };
    queue.push(newAction);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to add to offline queue:', error);
  }
};

/**
 * Get offline queue
 */
export const getOfflineQueue = (): OfflineAction[] => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (!serialized) return [];
    return JSON.parse(serialized) as OfflineAction[];
  } catch (error) {
    console.error('Failed to get offline queue:', error);
    return [];
  }
};

/**
 * Remove action from offline queue
 */
export const removeFromOfflineQueue = (actionId: string): void => {
  try {
    const queue = getOfflineQueue();
    const filtered = queue.filter(action => action.id !== actionId);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from offline queue:', error);
  }
};

/**
 * Clear offline queue
 */
export const clearOfflineQueue = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
  }
};
