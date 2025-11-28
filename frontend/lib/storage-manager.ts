/**
 * StorageManager - LocalStorage Persistence Module
 * Handles saving, loading, and clearing quiz state from browser localStorage
 *
 * This module implements the persistence layer for SAP Obake quiz application,
 * ensuring quiz progress is saved and can be restored across browser sessions.
 */

import type { QuizSession, StoredQuizState } from "./types";
import { isStoredQuizState } from "./types";

/**
 * LocalStorage key for storing quiz state
 */
const STORAGE_KEY = "sap-obake-quiz-state";

/**
 * Current schema version for stored data
 * Increment this when making breaking changes to the storage schema
 */
const SCHEMA_VERSION = "1.0.0";

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save quiz session state to localStorage
 *
 * This function saves the current quiz session to browser localStorage,
 * allowing users to resume their quiz if they close the browser.
 *
 * @param session - The quiz session to save
 * @throws Error if localStorage quota is exceeded
 *
 * Validates: Requirements 8.1
 */
export function saveQuizState(session: QuizSession): void {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available. Quiz state will not be persisted.");
    return;
  }

  try {
    const storedState: StoredQuizState = {
      version: SCHEMA_VERSION,
      currentSession: session,
      completedSessions: [],
      lastUpdated: Date.now(),
    };

    const serializedState = JSON.stringify(storedState);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      // Try to clear old completed sessions and retry
      try {
        const existingState = loadQuizState();
        if (existingState) {
          const clearedState: StoredQuizState = {
            version: SCHEMA_VERSION,
            currentSession: session,
            completedSessions: [], // Clear old sessions
            lastUpdated: Date.now(),
          };
          const serializedState = JSON.stringify(clearedState);
          localStorage.setItem(STORAGE_KEY, serializedState);
          console.warn("LocalStorage quota exceeded. Cleared old completed sessions.");
          return;
        }
      } catch (retryError) {
        console.error("Failed to save quiz state after clearing old data:", retryError);
        throw new Error("LocalStorage quota exceeded and unable to clear space");
      }
    }
    console.error("Failed to save quiz state:", error);
    throw error;
  }
}

/**
 * Load quiz session state from localStorage
 *
 * This function retrieves the saved quiz session from browser localStorage.
 * If no saved state exists or the data is corrupted, it returns null.
 *
 * @returns The stored quiz state, or null if no valid state exists
 *
 * Validates: Requirements 8.2
 */
export function loadQuizState(): StoredQuizState | null {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);

    // No saved state exists
    if (serializedState === null) {
      return null;
    }

    // Empty string or whitespace-only - clear it
    if (serializedState.trim() === "") {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Parse the stored data
    const parsedState = JSON.parse(serializedState);

    // Validate the data structure using type guard
    if (!isStoredQuizState(parsedState)) {
      console.warn("Invalid stored quiz state structure. Clearing corrupted data.");
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Check schema version compatibility
    if (parsedState.version !== SCHEMA_VERSION) {
      console.warn(
        `Schema version mismatch. Expected ${SCHEMA_VERSION}, got ${parsedState.version}. Clearing old data.`
      );
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsedState;
  } catch (error) {
    // Handle JSON parse errors or other corruption
    console.error("Failed to load quiz state. Data may be corrupted:", error);
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  }
}

/**
 * Clear quiz session state from localStorage
 *
 * This function removes the saved quiz session from browser localStorage.
 * It should be called when a quiz is completed or when starting a fresh session.
 *
 * Validates: Requirements 8.5
 */
export function clearQuizState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear quiz state:", error);
    // Don't throw - clearing is a best-effort operation
  }
}

/**
 * Check if a saved quiz state exists in localStorage
 *
 * This is a convenience function to quickly check if there's a saved session
 * without loading and parsing the entire state.
 *
 * @returns true if a saved state exists, false otherwise
 *
 * Validates: Requirements 8.2
 */
export function hasSavedQuizState(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    return serializedState !== null;
  } catch (error) {
    console.error("Failed to check for saved quiz state:", error);
    return false;
  }
}

/**
 * Get the size of the stored quiz state in bytes
 *
 * This is a utility function for debugging and monitoring localStorage usage.
 *
 * @returns The size of the stored state in bytes, or 0 if no state exists
 */
export function getStoredStateSize(): number {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return 0;
    }
    // Calculate size in bytes (UTF-16 encoding)
    return new Blob([serializedState]).size;
  } catch (error) {
    console.error("Failed to get stored state size:", error);
    return 0;
  }
}
