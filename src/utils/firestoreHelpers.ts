/**
 * Helper functions for handling Firestore data conversions
 */

import { User, UserUsageStats, Subscription } from '../types';

export type AnyTimestamp = { toDate: () => Date } | { seconds: number; nanoseconds: number } | Date | string;

/**
 * Convert Firestore timestamp to Date object, or return the value if it's already a Date or string
 */
export const convertTimestampToDate = (value: AnyTimestamp | undefined | null): Date | string | undefined | null => {
  if (!value) return value;
  if (typeof (value as any).toDate === 'function') {
    return (value as any).toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'object' && 'seconds' in value) {
    return new Date((value as any).seconds * 1000);
  }
  return value;
};

/**
 * Convert a Firestore user document to our User type
 */
export const convertFirestoreUser = (firestoreUserData: any, firebaseUser: any): User => {
  const now = new Date();

  // Convert subscription if it exists, otherwise create a default free subscription
  let subscription: Subscription;
  if (firestoreUserData.subscription) {
    subscription = {
      tier: firestoreUserData.subscription.tier || 'free',
      startDate: convertTimestampToDate(firestoreUserData.subscription.startDate) || now,
      endDate: convertTimestampToDate(firestoreUserData.subscription.endDate) || null,
      isActive: firestoreUserData.subscription.isActive ?? true,
      totalCasesUsed: firestoreUserData.subscription.totalCasesUsed || 0,
      maxTotalCases: firestoreUserData.subscription.maxTotalCases || (firestoreUserData.subscription.tier === 'premium' ? 30 : 2),
    };
  } else {
    // Default subscription for users who don't have subscription data in Firestore
    subscription = {
      tier: 'free',
      startDate: now,
      endDate: null,
      isActive: true,
      totalCasesUsed: 0,
      maxTotalCases: 2,
    };
  }

  // Convert usage stats
  const usageStats: UserUsageStats = {
    casesGeneratedToday: firestoreUserData.usageStats?.casesGeneratedToday || 0,
    casesGeneratedThisWeek: firestoreUserData.usageStats?.casesGeneratedThisWeek || 0,
    lastCaseGeneratedAt: convertTimestampToDate(firestoreUserData.usageStats?.lastCaseGeneratedAt) || new Date(0),
    totalCasesGenerated: firestoreUserData.usageStats?.totalCasesGenerated || 0,
    apiRequestsToday: firestoreUserData.usageStats?.apiRequestsToday || 0,
    apiRequestsThisHour: firestoreUserData.usageStats?.apiRequestsThisHour || 0,
    subscription: subscription,
  };

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || firestoreUserData.email || null,
    displayName: firebaseUser.displayName || firestoreUserData.displayName || null,
    photoURL: firebaseUser.photoURL || firestoreUserData.photoURL || null,
    emailVerified: firebaseUser.emailVerified || false,
    createdAt: firestoreUserData.createdAt ? convertTimestampToDate(firestoreUserData.createdAt) as Date :
               firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : now,
    lastLoginAt: firebaseUser.metadata.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime) : now,
    usageStats: usageStats,
    mbbsYear: firestoreUserData.mbbsYear as (1 | 2 | 3 | 4) | undefined,
  };
};