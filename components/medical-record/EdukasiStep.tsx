'use client';

import React from 'react';
import { Textarea } from '@/components/ui/Input';
import type { MedicalRecordFormData } from '@/types/medical-record';

interface EdukasiStepProps {
  formData: MedicalRecordFormData;
  onUpdate: (data: Partial<MedicalRecordFormData>) => void;
}

export default function EdukasiStep({ formData, onUpdate }: EdukasiStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Edukasi Pasien</h3>
        <p className="text-sm text-gray-500">Berikan edukasi dan saran untuk pasien</p>
      </div>

      <Textarea
        label="Catatan Edukasi"
        placeholder="Tuliskan edukasi yang diberikan kepada pasien, misalnya: istirahat cukup, minum air putih banyak, hindari makanan pedas, kontrol 3 hari lagi..."
        value={formData.edukasi}
        onChange={(e) => onUpdate({ edukasi: e.target.value })}
        rows={6}
      />

      {/* Quick suggestions */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Saran cepat:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Istirahat cukup',
            'Minum air putih yang banyak',
            'Makan teratur',
            'Hindari makanan pedas',
            'Hindari asap rokok',
            'Kontrol ulang 3 hari',
            'Kontrol ulang 1 minggu',
            'Segera ke IGD jika keluhan memberat',
          ].map((saran) => (
            <button
              key={saran}
              type="button"
              onClick={() => {
                const current = formData.edukasi;
                const newText = current ? `${current}\n${saran}` : saran;
                onUpdate({ edukasi: newText });
              }}
              className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
            >
              + {saran}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
