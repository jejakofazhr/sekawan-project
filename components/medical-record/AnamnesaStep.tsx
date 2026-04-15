'use client';

import React from 'react';
import { Textarea } from '@/components/ui/Input';
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
