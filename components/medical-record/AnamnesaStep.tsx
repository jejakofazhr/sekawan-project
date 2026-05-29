'use client';

import React from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import type { MedicalRecordFormData } from '@/types/medical-record';

interface AnamnesaStepProps {
  formData: MedicalRecordFormData;
  onUpdate: (data: Partial<MedicalRecordFormData>) => void;
  errors: Record<string, string>;
}

export default function AnamnesaStep({ formData, onUpdate, errors }: AnamnesaStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Anamnesa / Keluhan Fisik</h3>
        <p className="text-sm text-gray-500">Catat keluhan dan riwayat penyakit pasien</p>
      </div>

      <Textarea
        label="Keluhan Utama *"
        placeholder="Tuliskan keluhan utama pasien..."
        value={formData.keluhan_utama}
        onChange={(e) => onUpdate({ keluhan_utama: e.target.value })}
        error={errors.keluhan_utama}
        rows={3}
      />

      {/* Vital Signs */}
      <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Tanda Vital (Vital Signs)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input
            label="TD (Tekanan Darah)"
            placeholder="Contoh: 120/80 mmHg"
            value={formData.tekanan_darah}
            onChange={(e) => onUpdate({ tekanan_darah: e.target.value })}
          />
          <Input
            label="Nadi"
            placeholder="Contoh: 80 x/menit"
            value={formData.nadi}
            onChange={(e) => onUpdate({ nadi: e.target.value })}
          />
          <Input
            label="Suhu"
            placeholder="Contoh: 36.5 °C"
            value={formData.suhu}
            onChange={(e) => onUpdate({ suhu: e.target.value })}
          />
          <Input
            label="Respirasi"
            placeholder="Contoh: 20 x/menit"
            value={formData.respirasi}
            onChange={(e) => onUpdate({ respirasi: e.target.value })}
          />
          <Input
            label="Saturasi (SpO2)"
            placeholder="Contoh: 98%"
            value={formData.saturasi}
            onChange={(e) => onUpdate({ saturasi: e.target.value })}
          />
        </div>
      </div>

      <Textarea
        label="Riwayat Penyakit Sekarang"
        placeholder="Ceritakan perjalanan penyakit saat ini..."
        value={formData.riwayat_penyakit_sekarang}
        onChange={(e) => onUpdate({ riwayat_penyakit_sekarang: e.target.value })}
        rows={3}
      />

      <Textarea
        label="Riwayat Penyakit Terdahulu"
        placeholder="Riwayat penyakit yang pernah dialami..."
        value={formData.riwayat_penyakit_terdahulu}
        onChange={(e) => onUpdate({ riwayat_penyakit_terdahulu: e.target.value })}
        rows={3}
      />

      <Textarea
        label="Riwayat Penyakit Keluarga"
        placeholder="Riwayat penyakit dalam keluarga..."
        value={formData.riwayat_penyakit_keluarga}
        onChange={(e) => onUpdate({ riwayat_penyakit_keluarga: e.target.value })}
        rows={3}
      />
    </div>
  );
}
