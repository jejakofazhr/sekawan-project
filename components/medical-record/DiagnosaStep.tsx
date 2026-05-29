'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { createClient } from '@/lib/supabase/client';
import type { MedicalRecordFormData } from '@/types/medical-record';

// Fallback static data (used when DB tables don't exist yet)
import { DIAGNOSA_MEDIS as STATIC_DIAGNOSA_MEDIS } from '@/data/diagnosa-medis';
import { DIAGNOSA_KEPERAWATAN as STATIC_DIAGNOSA_KEPERAWATAN } from '@/data/diagnosa-keperawatan';

interface DiagnosaStepProps {
  formData: MedicalRecordFormData;
  onUpdate: (data: Partial<MedicalRecordFormData>) => void;
  errors: Record<string, string>;
}

export default function DiagnosaStep({ formData, onUpdate, errors }: DiagnosaStepProps) {
  const supabase = createClient();
  const [diagnosaList, setDiagnosaList] = useState<string[]>(STATIC_DIAGNOSA_MEDIS);
  const [keperawatanList, setKeperawatanList] = useState(STATIC_DIAGNOSA_KEPERAWATAN);

  // Try to load from Supabase
  useEffect(() => {
    const loadDiagnosa = async () => {
      try {
        const { data } = await supabase
          .from('master_diagnosa')
          .select('nama')
          .order('nama');
        if (data && data.length > 0) {
          setDiagnosaList(data.map((d: { nama: string }) => d.nama));
        }
      } catch {
        // Use static fallback
      }
    };
    loadDiagnosa();
  }, [supabase]);

  // Determine the initial kategori from saved keterangan_diagnosa
  const getInitialKategori = () => {
    if (!formData.keterangan_diagnosa) return '';
    for (const kat of keperawatanList) {
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
      diagnosaList.map((nama) => ({
        value: nama,
        label: nama,
      })),
    [diagnosaList]
  );

  // Build options for the Diagnosa Keperawatan category dropdown
  const kategoriOptions = useMemo(
    () =>
      keperawatanList.map((kat) => ({
        value: kat.value,
        label: kat.label,
      })),
    [keperawatanList]
  );

  // Build options for the jenis dropdown based on the selected category
  const jenisOptions = useMemo(() => {
    const selected = keperawatanList.find((kat) => kat.value === kategori);
    if (!selected) return [];
    return selected.items.map((item) => ({
      value: `${item.kode}: ${item.nama}`,
      label: `${item.kode}: ${item.nama}`,
    }));
  }, [kategori, keperawatanList]);

  // When kategori changes, reset the jenis (keterangan_diagnosa) if it doesn't belong to the new category
  useEffect(() => {
    if (kategori) {
      const selected = keperawatanList.find((kat) => kat.value === kategori);
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

      {/* Diagnosa Medis - Searchable Dropdown */}
      <SearchableSelect
        label="Diagnosa Medis *"
        placeholder="Cari diagnosa medis..."
        options={diagnosaMedisOptions}
        value={formData.diagnosa}
        onChange={(val) => onUpdate({ diagnosa: val })}
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

        <SearchableSelect
          label="Diagnosa *"
          placeholder="Cari kategori diagnosa..."
          options={kategoriOptions}
          value={kategori}
          onChange={(val) => setKategori(val)}
          error={errors.kategori_diagnosa}
        />

        {/* Jenis Dropdown - only shown when a category is selected */}
        {kategori && (
          <SearchableSelect
            label="Jenis *"
            placeholder="Cari jenis diagnosa..."
            options={jenisOptions}
            value={formData.keterangan_diagnosa}
            onChange={(val) => onUpdate({ keterangan_diagnosa: val })}
            error={errors.keterangan_diagnosa}
          />
        )}
      </div>
    </div>
  );
}
