import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSRSStore, SRSCard } from '../../store/srsStore';

const MOTIVATIONS = [
  "You're crushing it! 🔥",
  "Great momentum! 🚀",
  "Exam ready! 📚",
  "Keep it up! 💪",
  "Unstoppable! ⭐",
  "Brilliant retention! 🧠"
];

export const ReviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const getDueCards = useSRSStore((state) => state.getDueCards);
  const getAllCards = useSRSStore((state) => state.getAllCards);
  const gradeCard = useSRSStore((state) => state.gradeCard);
  const seedSampleDeck = useSRSStore((state) => state.seedSampleDeck);

  const [activeDeck, setActiveDeck] = useState<SRSCard[]>(() => {
    const due = getDueCards();
    return due.length > 0 ? due : getAllCards();
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalSavedCards = getAllCards();
  const dueCount = getDueCards().length;
  const currentCard = activeDeck[currentIndex];

  useEffect(() => {
    // Show random motivational toast periodically
    if (currentIndex > 0 && currentIndex % 3 === 0) {
      setToastMessage(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleGrade = (grade: 'NEED_PRACTICE' | 'GOT_IT') => {
    if (!currentCard) return;

    gradeCard(currentCard.id, grade);
    setIsAnswerRevealed(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleStartPracticeAll = () => {
    const all = getAllCards();
    if (all.length > 0) {
      setActiveDeck(all);
      setCurrentIndex(0);
      setIsAnswerRevealed(false);
    }
  };

  const handleLoadSampleCards = () => {
    seedSampleDeck();
    const updated = useSRSStore.getState().getAllCards();
    setActiveDeck(updated);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
  };

  const isComplete = currentIndex >= activeDeck.length;

  // Empty state or Completed State
  if (activeDeck.length === 0 || isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-plexus-blue to-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <span className="text-4xl">{totalSavedCards.length === 0 ? '🧠' : '🎉'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {totalSavedCards.length === 0
              ? "Your SRS Deck is Empty"
              : isComplete
              ? "Revision Complete!"
              : "All Due Cards Reviewed!"}
          </h2>

          <p className="text-white/80 text-sm leading-relaxed mb-6">
            {totalSavedCards.length === 0
              ? "Every time you complete an MBBS clinical case, its university theory question is automatically stored here for spaced repetition."
              : "Great job! Consistent daily retrieval dramatically strengthens your recall for university professional examinations."}
          </p>

          <div className="space-y-3">
            {totalSavedCards.length === 0 ? (
              <button
                onClick={handleLoadSampleCards}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Load High-Yield Practice Questions
              </button>
            ) : (
              <button
                onClick={handleStartPracticeAll}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Practice All Saved Cards ({totalSavedCards.length})
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
            >
              Return to Cases
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const progressPercentage = ((currentIndex) / activeDeck.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#102b44] to-slate-950 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-between text-white relative overflow-hidden">

      {/* Top Header & Progress */}
      <div className="w-full max-w-3xl flex items-center justify-between gap-4 mb-4 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold border border-white/15 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Home
        </button>

        <div className="flex-grow max-w-md mx-2">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="text-xs font-bold text-white/90 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
          {currentIndex + 1} <span className="text-white/50">/ {activeDeck.length}</span>
        </div>
      </div>

      {/* Motivational Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-16 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full font-bold shadow-2xl text-xs sm:text-sm border border-white/30 tracking-wide"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flashcard Area */}
      <div className="w-full max-w-3xl flex-grow flex flex-col justify-center my-2 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + (isAnswerRevealed ? '-ans' : '-q')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl flex flex-col max-h-[68vh] overflow-y-auto"
          >
            {/* Topic pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30">
                {currentCard.topic}
              </span>
              <span className="text-[11px] text-white/60 font-mono">
                Interval: {currentCard.interval}d
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-6 text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {currentCard.question}
              </h3>
            </div>

            {/* Answer Box (revealed) */}
            {isAnswerRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-left bg-black/30 border border-white/15 p-5 rounded-2xl text-white/90 text-sm leading-relaxed whitespace-pre-wrap mt-2 overflow-y-auto"
              >
                <div className="text-xs font-bold uppercase text-emerald-300 mb-2 tracking-wider">
                  Model High-Marks University Answer:
                </div>
                {currentCard.answer}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls: Reveal or Grade */}
      <div className="w-full max-w-3xl mb-4 relative z-10">
        {!isAnswerRevealed ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsAnswerRevealed(true)}
            className="w-full py-4 bg-white text-plexus-blue font-bold rounded-2xl text-base sm:text-lg shadow-xl hover:bg-gray-100 transition-all cursor-pointer"
          >
            Reveal Model Answer
          </motion.button>
        ) : (
          <div className="w-full flex gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleGrade('NEED_PRACTICE')}
              className="flex-1 py-3.5 sm:py-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 rounded-2xl font-bold text-sm sm:text-base transition-all cursor-pointer"
            >
              Need Practice
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleGrade('GOT_IT')}
              className="flex-1 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer"
            >
              Got It!
            </motion.button>
          </div>
        )}
      </div>

    </div>
  );
};
