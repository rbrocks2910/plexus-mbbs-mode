import React, { useState } from 'react';
import { Card } from './Card';

interface TimeSkipControlProps {
  onSkip: (value: number, unit: 'minutes' | 'hours' | 'days') => void;
  isLoading: boolean;
}

export const TimeSkipControl: React.FC<TimeSkipControlProps> = ({ onSkip, isLoading }) => {
  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [isOpen, setIsOpen] = useState(false);

  const handleSkip = () => {
    onSkip(value, unit);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:scale-105 transition-all transform disabled:from-gray-400 disabled:to-gray-500 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {isLoading ? 'Simulating...' : 'Skip Time'}
      </button>

      {isOpen && !isLoading && (
        <div className="absolute bottom-full mb-4 left-0 w-64 z-50 animate-fade-in">
          <Card className="bg-white shadow-2xl border-2 border-orange-100 p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              Skip Duration
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="1" 
                  value={value} 
                  onChange={(e) => setValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <select 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
              <div className="flex justify-between gap-2 pt-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-grow py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSkip}
                  className="flex-grow py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
