/**
 * @file App.tsx
 * @description Root component of the Plexus MBBS clinical application.
 * Uses code-splitting with React.lazy for ultra-fast initial screen loading.
 */

import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import { HomeScreen } from './src/components/screens/HomeScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

// Code-split heavy clinical screens so the initial home screen renders instantly
const CaseScreen = lazy(() => import('./src/components/screens/CaseScreen').then(m => ({ default: m.CaseScreen })));
const FeedbackScreen = lazy(() => import('./src/components/screens/FeedbackScreen').then(m => ({ default: m.FeedbackScreen })));
const ReviewScreen = lazy(() => import('./src/components/screens/ReviewScreen').then(m => ({ default: m.ReviewScreen })));

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#1A3C5A] text-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-white/20 border-t-plexus-teal rounded-full animate-spin"></div>
      <p className="text-xs font-medium tracking-wide text-white/70">Loading clinical module...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <HashRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Direct landing on MBBS simulator home */}
              <Route path="/" element={<HomeScreen />} />

              {/* Daily Review Mode */}
              <Route path="/review" element={<ReviewScreen />} />

              {/* Interactive Bedside Case Simulation */}
              <Route path="/case/:caseId" element={<CaseScreen />} />

              {/* Comprehensive Case Feedback */}
              <Route path="/feedback/:caseId" element={<FeedbackScreen />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
