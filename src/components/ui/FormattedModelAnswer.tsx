import React from 'react';

interface FormattedModelAnswerProps {
  content: string;
  variant?: 'light' | 'dark';
}

/**
 * Sanitizes MBBS text to eliminate any quote-escaping artifacts.
 */
export function sanitizeMbbsText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/'/g, '')
    .replace(/\\n/g, '\n')
    .trim();
}

/**
 * Parses markdown-formatted MBBS model answer text into structured UI blocks.
 */
export const FormattedModelAnswer: React.FC<FormattedModelAnswerProps> = ({
  content,
  variant = 'light'
}) => {
  const cleanText = sanitizeMbbsText(content);

  if (!cleanText) {
    return <p className={variant === 'dark' ? 'text-white/60 italic' : 'text-slate-500 italic'}>No model answer available.</p>;
  }

  // Split lines
  const lines = cleanText.split('\n');
  const blocks: React.ReactNode[] = [];

  let currentSectionTitle = '';
  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      blocks.push(
        <div key={`list-${blocks.length}`} className="my-3 space-y-2">
          {currentListItems}
        </div>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    // 1. Header (### Title)
    if (trimmed.startsWith('###')) {
      flushList();
      const title = trimmed.replace(/^###\s*/, '').replace(/\*\*/g, '');
      blocks.push(
        <div
          key={`header-${index}`}
          className={`p-4 rounded-xl mb-4 font-bold tracking-wide flex items-center gap-3 shadow-sm ${
            variant === 'dark'
              ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-emerald-200'
              : 'bg-gradient-to-r from-plexus-blue/10 via-sky-50 to-indigo-50 border border-plexus-blue/20 text-plexus-blue'
          }`}
        >
          <span className="text-xl">📋</span>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-extrabold opacity-75">
              University Examination Model Answer
            </div>
            <div className="text-base sm:text-lg font-bold">{title}</div>
          </div>
        </div>
      );
      return;
    }

    // 2. Section Heading (e.g., **1. Core Concept & Definition:**)
    const sectionMatch = trimmed.match(/^\*\*(\d+\..*?)\*\*:?$/) || trimmed.match(/^(\d+\..*?:?)$/);
    if (sectionMatch) {
      flushList();
      const heading = sectionMatch[1].replace(/\*\*/g, '');
      currentSectionTitle = heading;
      blocks.push(
        <div
          key={`sec-${index}`}
          className={`mt-5 mb-3 pb-2 border-b font-bold text-sm sm:text-base flex items-center gap-2 ${
            variant === 'dark'
              ? 'text-teal-300 border-white/15'
              : 'text-plexus-blue border-slate-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${variant === 'dark' ? 'bg-teal-400' : 'bg-plexus-blue'}`}></span>
          <span>{heading}</span>
        </div>
      );
      return;
    }

    // 3. Special Callouts:
    // Diagram pearl
    if (trimmed.toLowerCase().includes('must-draw diagram') || trimmed.toLowerCase().includes('diagram:')) {
      flushList();
      const diagramText = trimmed.replace(/^[\*\-]\s*/, '').replace(/\*\*Must-Draw Diagram:\*\*/i, '').replace(/Must-Draw Diagram:/i, '').trim();
      blocks.push(
        <div
          key={`diag-${index}`}
          className={`p-3.5 my-3 rounded-xl border flex items-start gap-3 text-sm ${
            variant === 'dark'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <span className="text-xl flex-shrink-0">✏️</span>
          <div>
            <span className="font-bold block uppercase text-xs tracking-wider mb-0.5">
              Must-Draw Exam Diagram (Full Marks):
            </span>
            <span className="leading-relaxed">{diagramText || trimmed}</span>
          </div>
        </div>
      );
      return;
    }

    // Examiner Keywords pearl
    if (trimmed.toLowerCase().includes('examiner key') || trimmed.toLowerCase().includes('examiner keywords')) {
      flushList();
      const examText = trimmed.replace(/^[\*\-]\s*/, '').replace(/\*\*Examiner Key.*?:\*\*/i, '').trim();
      blocks.push(
        <div
          key={`exam-${index}`}
          className={`p-3.5 my-3 rounded-xl border flex items-start gap-3 text-sm ${
            variant === 'dark'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          <span className="text-xl flex-shrink-0">⭐</span>
          <div>
            <span className="font-bold block uppercase text-xs tracking-wider mb-0.5">
              High-Marks Examiner Keywords:
            </span>
            <span className="leading-relaxed">{examText || trimmed}</span>
          </div>
        </div>
      );
      return;
    }

    // Clinical Pearls / Applied Anatomy
    if (trimmed.toLowerCase().includes('applied anatomy') || trimmed.toLowerCase().includes('clinical correlation') || trimmed.toLowerCase().includes('clinical pearls')) {
      flushList();
      const pearlText = trimmed.replace(/^[\*\-]\s*/, '').replace(/\*\*.*?\*\*:?/, '').trim();
      blocks.push(
        <div
          key={`pearl-${index}`}
          className={`p-3.5 my-3 rounded-xl border flex items-start gap-3 text-sm ${
            variant === 'dark'
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
              : 'bg-sky-50 border-sky-300 text-sky-900'
          }`}
        >
          <span className="text-xl flex-shrink-0">🩺</span>
          <div>
            <span className="font-bold block uppercase text-xs tracking-wider mb-0.5">
              Applied Clinical Correlation:
            </span>
            <span className="leading-relaxed">{pearlText || trimmed}</span>
          </div>
        </div>
      );
      return;
    }

    // 4. Bullet points (* or -)
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      const cleanLine = trimmed.replace(/^[\*\-]\s*/, '');
      
      // Check for bold prefix like **Definition:**
      const boldPrefixMatch = cleanLine.match(/^\*\*(.*?)\*\*:?\s*(.*)$/);
      if (boldPrefixMatch) {
        const prefix = boldPrefixMatch[1].replace(/:$/, '');
        const rest = boldPrefixMatch[2];
        currentListItems.push(
          <div key={`li-${index}`} className="flex items-start gap-2.5 text-sm leading-relaxed">
            <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
              variant === 'dark' ? 'bg-emerald-400' : 'bg-plexus-accent'
            }`}></span>
            <div>
              <span className={`font-bold mr-1.5 ${
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {prefix}:
              </span>
              <span className={variant === 'dark' ? 'text-white/85' : 'text-slate-700'}>
                {rest}
              </span>
            </div>
          </div>
        );
      } else {
        currentListItems.push(
          <div key={`li-${index}`} className="flex items-start gap-2.5 text-sm leading-relaxed">
            <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
              variant === 'dark' ? 'bg-emerald-400' : 'bg-plexus-accent'
            }`}></span>
            <span className={variant === 'dark' ? 'text-white/85' : 'text-slate-700'}>
              {cleanLine.replace(/\*\*/g, '')}
            </span>
          </div>
        );
      }
      return;
    }

    // 5. Regular text paragraph
    flushList();
    blocks.push(
      <p
        key={`p-${index}`}
        className={`my-2 text-sm leading-relaxed ${
          variant === 'dark' ? 'text-white/85' : 'text-slate-700'
        }`}
      >
        {trimmed.replace(/\*\*/g, '')}
      </p>
    );
  });

  flushList();

  return (
    <div className="space-y-1">
      {blocks}
    </div>
  );
};
