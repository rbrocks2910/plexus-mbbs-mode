import React, { useState } from 'react';
import { PrescriptionItem } from '../../types';
import { Card } from '../ui/Card';
import { DRUG_OPTIONS, DOSAGE_FORMS } from '../../constants';

interface PrescriptionModalProps {
  currentPrescriptions: PrescriptionItem[];
  onAdd: (item: PrescriptionItem) => void;
  onRemove: (drugId: string) => void;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  currentPrescriptions,
  onAdd,
  onRemove,
  onClose,
}) => {
  const [selectedDrug, setSelectedDrug] = useState(DRUG_OPTIONS[0]);
  const [dosageForm, setDosageForm] = useState(DOSAGE_FORMS[0]);
  const [quantity, setQuantity] = useState('');
  const [duration, setDuration] = useState(1);

  const handleAdd = () => {
    if (!quantity.trim()) return;
    
    const newItem: PrescriptionItem = {
      drugId: `${selectedDrug}-${Date.now()}`,
      drugName: selectedDrug,
      dosageForm,
      quantity,
      durationDays: duration,
    };
    
    onAdd(newItem);
    setQuantity('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl bg-white/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-plexus-blue/10 to-transparent">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-plexus-blue">Prescription Manager</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-plexus-blue transition-colors text-2xl font-bold">&times;</button>
          </div>
          <p className="text-gray-600 mt-1">Manage medications for the patient.</p>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Add New Drug Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="bg-plexus-accent w-2 h-2 rounded-full"></span>
              Add New Medication
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Drug</label>
                <select 
                  value={selectedDrug} 
                  onChange={(e) => setSelectedDrug(e.target.value)}
                  className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plexus-accent focus:border-transparent outline-none transition-all"
                >
                  {DRUG_OPTIONS.map(drug => <option key={drug} value={drug}>{drug}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
                <select 
                  value={dosageForm} 
                  onChange={(e) => setDosageForm(e.target.value)}
                  className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plexus-accent focus:border-transparent outline-none transition-all"
                >
                  {DOSAGE_FORMS.map(form => <option key={form} value={form}>{form}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity/Dosage</label>
                <input 
                  type="text" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 500mg" 
                  className="w-full p-2.5 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plexus-accent focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days): {duration}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4" 
                />
              </div>
            </div>
            <button 
              onClick={handleAdd}
              disabled={!quantity.trim()}
              className="mt-6 w-full bg-plexus-blue text-white font-bold py-3 rounded-lg hover:bg-plexus-blue-dark disabled:bg-gray-400 transition-all shadow-md transform hover:scale-[1.02]"
            >
              Add to Prescription
            </button>
          </div>

          {/* Current Prescriptions List */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 px-1">Current Prescriptions</h3>
            {currentPrescriptions.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 italic">No medications prescribed yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentPrescriptions.map((item) => (
                  <div key={item.drugId} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-plexus-accent transition-colors group">
                    <div>
                      <h4 className="font-bold text-plexus-blue-dark">{item.drugName}</h4>
                      <p className="text-sm text-gray-600">
                        {item.dosageForm} • {item.quantity} • {item.durationDays} days
                      </p>
                    </div>
                    <button 
                      onClick={() => onRemove(item.drugId)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Remove"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
};
