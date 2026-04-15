'use client';

import React from 'react';
import type { MedicalRecordFormData } from '@/types/medical-record';
import { TINDAKAN_LIST } from '@/lib/data/obat-list';

interface TindakanStepProps {
  formData: MedicalRecordFormData;
  onToggleTindakan: (tindakan: string) => void;
}

export default function TindakanStep({ formData, onToggleTindakan }: TindakanStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Tindakan Medis</h3>
        <p className="text-sm text-gray-500">Pilih tindakan yang dilakukan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TINDAKAN_LIST.map((tindakan) => {
          const isSelected = formData.tindakan.includes(tindakan);
          return (
            <button
              key={tindakan}
              type="button"
              onClick={() => onToggleTindakan(tindakan)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left
                transition-all duration-200
                ${isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div
                className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
                  transition-all duration-200
                  ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                `}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {tindakan}
            </button>
          );
        })}
      </div>

      {formData.tindakan.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-600 mb-2">
            Tindakan dipilih ({formData.tindakan.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {formData.tindakan.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-xs font-medium text-blue-700 border border-blue-200"
              >
                {t}
                <button
                  type="button"
                  onClick={() => onToggleTindakan(t)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
