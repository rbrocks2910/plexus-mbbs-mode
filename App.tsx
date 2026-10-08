/**
 * @file App.tsx
 * @description Standalone root component of the Plexus MBBS clinical application.
 * Defines routing and state management with zero external auth or database requirements.
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { CaseScreen } from './src/components/screens/CaseScreen';
import { FeedbackScreen } from './src/components/screens/FeedbackScreen';
import { ReviewScreen } from './src/components/screens/ReviewScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <HashRouter>
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
        </HashRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
