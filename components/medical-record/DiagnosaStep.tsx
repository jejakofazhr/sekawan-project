'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Input, Select } from '@/components/ui/Input';
import { DIAGNOSA_MEDIS } from '@/data/diagnosa-medis';
import { DIAGNOSA_KEPERAWATAN } from '@/data/diagnosa-keperawatan';
import type { MedicalRecordFormData } from '@/types/medical-record';

interface DiagnosaStepProps {
  formData: MedicalRecordFormData;
  onUpdate: (data: Partial<MedicalRecordFormData>) => void;
  errors: Record<string, string>;
}

export default function DiagnosaStep({ formData, onUpdate, errors }: DiagnosaStepProps) {
  // Determine the initial kategori from saved keterangan_diagnosa
  const getInitialKategori = () => {
    if (!formData.keterangan_diagnosa) return '';
    for (const kat of DIAGNOSA_KEPERAWATAN) {
      const found = kat.items.find(
        (item) => `${item.kode}: ${item.nama}` === formData.keterangan_diagnosa
      );
      if (found) return kat.value;
    }
    return '';
  };

  const [kategori, setKategori] = useState(getInitialKategori);

  // Build options for Diagnosa Medis dropdown
  const diagnosaMedisOptions = useMemo(
    () =>
      DIAGNOSA_MEDIS.map((nama) => ({
        value: nama,
        label: nama,
      })),
    []
  );

  // Build options for the Diagnosa Keperawatan category dropdown
  const kategoriOptions = useMemo(
    () =>
      DIAGNOSA_KEPERAWATAN.map((kat) => ({
        value: kat.value,
        label: kat.label,
      })),
    []
  );

  // Build options for the jenis dropdown based on the selected category
  const jenisOptions = useMemo(() => {
    const selected = DIAGNOSA_KEPERAWATAN.find((kat) => kat.value === kategori);
    if (!selected) return [];
    return selected.items.map((item) => ({
      value: `${item.kode}: ${item.nama}`,
      label: `${item.kode}: ${item.nama}`,
    }));
  }, [kategori]);

  // When kategori changes, reset the jenis (keterangan_diagnosa) if it doesn't belong to the new category
  useEffect(() => {
    if (kategori) {
      const selected = DIAGNOSA_KEPERAWATAN.find((kat) => kat.value === kategori);
      if (selected) {
        const currentValid = selected.items.some(
          (item) => `${item.kode}: ${item.nama}` === formData.keterangan_diagnosa
        );
        if (!currentValid) {
          onUpdate({ keterangan_diagnosa: '' });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategori]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Diagnosa</h3>
        <p className="text-sm text-gray-500">Tentukan diagnosis medis dan keperawatan</p>
      </div>

      {/* Diagnosa Medis - Dropdown */}
      <Select
        label="Diagnosa Medis *"
        placeholder="-- Pilih Diagnosa Medis --"
        options={diagnosaMedisOptions}
        value={formData.diagnosa}
        onChange={(e) => onUpdate({ diagnosa: e.target.value })}
        error={errors.diagnosa}
      />

      <Input
        label="Kode ICD-10"
        placeholder="Contoh: A90, J20.9, K29.7..."
        value={formData.icd_10}
        onChange={(e) => onUpdate({ icd_10: e.target.value })}
        helperText="International Classification of Diseases"
      />

      {/* Diagnosa Keperawatan - Category + Jenis Dropdowns */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800">Diagnosa Keperawatan</h4>

        <Select
          label="Diagnosa *"
          placeholder="-- Pilih Diagnosa --"
          options={kategoriOptions}
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          error={errors.kategori_diagnosa}
        />

        {/* Jenis Dropdown - only shown when a category is selected */}
        {kategori && (
          <Select
            label="Jenis *"
            placeholder="-- Pilih Jenis Diagnosa --"
            options={jenisOptions}
            value={formData.keterangan_diagnosa}
            onChange={(e) => onUpdate({ keterangan_diagnosa: e.target.value })}
            error={errors.keterangan_diagnosa}
          />
        )}
      </div>
    </div>
  );
}
