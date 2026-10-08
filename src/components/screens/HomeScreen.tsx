/**
 * @file HomeScreen.tsx
 * @description Clean, standalone MBBS clinical simulator landing page.
 * Allows direct selection of MBBS Year, Subject, and immediate simulation launch.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Specialty } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { CASE_GENERATION_TIPS } from '../../constants/loadingMessages';
import { getSubjectsForYear, MBBSSubject } from '../../data/mbbsSubjects';
import { motion } from 'framer-motion';
import { useSRSStore } from '../../store/srsStore';

const HeartbeatWave: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0,10 H10 L13,6 L16,14 L19,4 L22,12 L25,10 H35 L38,6 L41,14 L44,4 L47,12 L50,10 H60 L63,6 L66,14 L69,4 L72,12 L75,10 H85 L88,6 L91,14 L94,4 L97,12 L100,10" />
  </svg>
);

const GraduationCapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10l-10-5-10 5 10 5 10-5z" />
    <path d="M6 12v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5" />
  </svg>
);

const YEAR_DETAILS = [
  { year: 1 as const, title: '1st Year', subtitle: 'Pre-clinical (Anatomy, Physio, Biochem)' },
  { year: 2 as const, title: '2nd Year', subtitle: 'Para-clinical (Path, Pharma, Micro)' },
  { year: 3 as const, title: '3rd Year', subtitle: 'Pre-final (PSM, FMT, Eye, ENT)' },
  { year: 4 as const, title: '4th Year', subtitle: 'Final Clinical (Med, Surg, OBG, Peds, Ortho)' },
];

export const HomeScreen: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | 4>(3);
  const [selectedSubject, setSelectedSubject] = useState<MBBSSubject | null>(() => {
    const year3Subjects = getSubjectsForYear(3);
    return year3Subjects[0] || null;
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const { startNewCase, state } = useAppContext();
  const navigate = useNavigate();
  const getDueCards = useSRSStore(state => state.getDueCards);
  const dueCards = getDueCards();

  // Update selected subject when year changes
  const handleYearChange = (year: 1 | 2 | 3 | 4) => {
    setSelectedYear(year);
    setValidationError(null);
    const subjects = getSubjectsForYear(year);
    if (subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    } else {
      setSelectedSubject(null);
    }
  };

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * CASE_GENERATION_TIPS.length));
    const quoteInterval = setInterval(() => {
      setQuoteIndex(prevIndex => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * CASE_GENERATION_TIPS.length);
        } while (newIndex === prevIndex && CASE_GENERATION_TIPS.length > 1);
        return newIndex;
      });
    }, 8000);
    return () => clearInterval(quoteInterval);
  }, []);

  const handleStartCase = async () => {
    if (!selectedSubject) {
      setValidationError('Please select a subject to begin.');
      return;
    }

    setValidationError(null);

    const newCase = await startNewCase(
      Specialty['General Medicine'],
      'Any',
      {
        enabled: true,
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name
      }
    );

    if (newCase) {
      navigate(`/case/${newCase.id}`);
    }
  };

  const availableSubjects = getSubjectsForYear(selectedYear);

  return (
    <>
      {state.isLoading && (
        <LoadingOverlay title="Preparing Clinical Simulation" messages={CASE_GENERATION_TIPS} />
      )}

      <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-br from-plexus-blue via-[#173859] to-plexus-accent relative overflow-x-hidden">
        {/* Background Decorative ECG Layer - Fixed & Isolated to eliminate any layout jitter */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
          <div className="w-[140%] max-w-none opacity-20 animate-pulse-heart">
            <HeartbeatWave className="w-full text-white" />
          </div>
        </div>

        {/* TOP HEADER */}
        <header className="relative z-10 w-full max-w-4xl p-2 flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-sm font-bold shadow-sm">
              P
            </div>
            <div>
              <span className="font-bold tracking-wider text-base sm:text-lg block leading-none">PLEXUS</span>
              <span className="text-[10px] text-white/60 tracking-widest uppercase">MBBS Simulator</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/review')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-105 cursor-pointer backdrop-blur-sm border border-emerald-400/40"
            >
              <span>⚡ SRS Revision</span>
              {dueCards.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-emerald-800 text-[10px] font-bold">
                  {dueCards.length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium">
              <GraduationCapIcon className="w-4 h-4 text-amber-300" />
              <span>Curriculum Mode</span>
            </div>
          </div>
        </header>

        {/* HERO TITLE */}
        <div className="relative z-10 text-center text-white mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            MBBS Clinical Case
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2 max-w-md mx-auto">
            Select your year and subject to begin an interactive bedside consultation.
          </p>
        </div>

        {/* PERMANENT SPACED REPETITION (SRS) CARD */}
        <div 
          onClick={() => navigate('/review')}
          className="relative z-10 w-full max-w-2xl mb-6 p-4 sm:p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center justify-between cursor-pointer transform hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Spaced Repetition System (SRS)</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {dueCards.length > 0 ? `${dueCards.length} Due Today` : 'Active'}
                </span>
              </div>
              <p className="text-white/75 text-xs sm:text-sm mt-0.5">
                {dueCards.length > 0
                  ? `You have ${dueCards.length} high-yield university exam questions due for daily revision today.`
                  : `Automated spaced review for questions from your completed cases. Click to revise or practice anytime.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-3">
            <span className="hidden sm:inline-block text-xs font-semibold text-white/90 bg-white/20 px-3 py-1.5 rounded-xl">
              Open SRS →
            </span>
            <div className="sm:hidden w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">
              →
            </div>
          </div>
        </div>

        {/* MAIN CONFIGURATION CONTAINER */}
        <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-7 shadow-2xl">
          {/* STEP 1: YEAR SELECTOR */}
          <div className="mb-6">
            <label className="block text-white/90 text-sm font-semibold tracking-wide uppercase mb-3">
              1. Choose MBBS Year
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {YEAR_DETAILS.map((item) => {
                const isSelected = selectedYear === item.year;
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => handleYearChange(item.year)}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-white text-plexus-blue font-bold shadow-lg border-white scale-[1.02]'
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                    }`}
                  >
                    <div className="text-lg font-bold">{item.title}</div>
                    <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-plexus-blue/70' : 'text-white/60'}`}>
                      {item.year === 1 && 'Pre-clinical'}
                      {item.year === 2 && 'Para-clinical'}
                      {item.year === 3 && 'Pre-final'}
                      {item.year === 4 && 'Final Clinical'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SUBJECT SELECTOR */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-white/90 text-sm font-semibold tracking-wide uppercase">
                2. Choose Subject
              </label>
              <span className="text-xs text-white/60">
                {availableSubjects.length} subjects in Year {selectedYear}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {availableSubjects.map((subject) => {
                const isSelected = selectedSubject?.id === subject.id;
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(subject);
                      setValidationError(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white text-plexus-blue border-white shadow-md scale-[1.01]'
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm sm:text-base flex items-center justify-between">
                        <span>{subject.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-plexus-blue"></span>
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 ${isSelected ? 'text-gray-600' : 'text-white/70'}`}>
                        {subject.fullName}
                      </div>
                    </div>
                    <div className={`text-[11px] mt-2 font-medium ${isSelected ? 'text-plexus-accent font-semibold' : 'text-white/50'}`}>
                      High-Yield Clinical Cases
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ERROR DISPLAY */}
          {validationError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400 text-red-100 rounded-lg text-sm text-center">
              {validationError}
            </div>
          )}

          {state.error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400 text-red-100 rounded-lg text-sm text-center">
              {state.error}
            </div>
          )}

          {/* STEP 3: BEGIN SIMULATION */}
          <button
            type="button"
            onClick={handleStartCase}
            disabled={state.isLoading || !selectedSubject}
            className="w-full font-bold py-3.5 px-6 rounded-xl text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 ease-plexus-ease flex items-center justify-center gap-2 transform hover:scale-[1.02] bg-white text-plexus-blue hover:bg-gray-100 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            <span>Begin Simulation</span>
            {selectedSubject && (
              <span className="text-sm font-normal text-plexus-blue/70">
                — {selectedSubject.name}
              </span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* CLINICAL TIP FOOTER */}
        <footer className="relative z-10 mt-6 text-center text-white/60 text-xs sm:text-sm max-w-md px-4">
          <p key={quoteIndex} className="italic animate-fade-in">
            "{CASE_GENERATION_TIPS[quoteIndex]}"
          </p>
        </footer>
      </div>
    </>
  );
};
