/**
 * @file MbbsModeCard.tsx
 * @description MBBS mode card with year badge and subject selector
 */

import React from 'react';
import { MBBSSubject, getSubjectsForYear } from '../../data/mbbsSubjects';

interface MbbsModeCardProps {
  mbbsYear?: 1 | 2 | 3 | 4;
  selectedSubject: MBBSSubject | null;
  onSubjectChange: (subject: MBBSSubject | null) => void;
  onOpenSubjectModal: () => void;
}

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

export const MbbsModeCard: React.FC<MbbsModeCardProps> = ({
  mbbsYear,
  selectedSubject,
  onSubjectChange,
  onOpenSubjectModal,
}) => {
  const subjects = mbbsYear ? getSubjectsForYear(mbbsYear) : [];

  return (
    <div className="mode-mbbs w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
      {/* Icon with Year Badge */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
            <GraduationCapIcon className="w-6 h-6 text-amber-300" />
          </div>
          {mbbsYear && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
              {mbbsYear}
            </div>
          )}
        </div>
      </div>

      {/* Tagline */}
      <p className="text-center text-white/70 text-sm mb-6">
        Your curriculum. Your preparation.
      </p>

      {/* Year Display */}
      {mbbsYear && (
        <div className="mb-4 text-center">
          <p className="text-white/60 text-xs mb-1">Currently in</p>
          <p className="text-white text-lg font-semibold">
            Year {mbbsYear}
            {mbbsYear === 1 && 'st'}
            {mbbsYear === 2 && 'nd'}
            {mbbsYear === 3 && 'rd'}
            {mbbsYear === 4 && 'th'}
          </p>
        </div>
      )}

      {/* Subject Selector */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Select Subject
        </label>
        <button
          onClick={onOpenSubjectModal}
          disabled={!mbbsYear || subjects.length === 0}
          className={`w-full flex justify-between items-center text-left p-3 bg-white/20 border border-white/30 rounded-lg transition-all text-white ${
            mbbsYear && subjects.length > 0
              ? 'hover:bg-white/30 focus:ring-4 focus:ring-amber-400/50 cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <span className="text-sm">
            {selectedSubject
              ? `${selectedSubject.fullName} (${selectedSubject.name})`
              : mbbsYear
              ? 'Choose a subject'
              : 'Set your year first'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Available Subjects Count */}
      {mbbsYear && subjects.length > 0 && (
        <p className="text-white/50 text-xs text-center mt-2">
          {subjects.length} subject{subjects.length !== 1 ? 's' : ''} available
        </p>
      )}
    </div>
  );
};

