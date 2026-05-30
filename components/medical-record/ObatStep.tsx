'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Button from '@/components/ui/Button';
import type { MedicalRecordFormData, ObatItem } from '@/types/medical-record';
import { ALL_OBAT_NAMES } from '@/lib/data/obat-list';
import { createClient } from '@/lib/supabase/client';

interface ObatStepProps {
  formData: MedicalRecordFormData;
  onAddObat: (obat: ObatItem) => void;
  onRemoveObat: (index: number) => void;
}

export default function ObatStep({ formData, onAddObat, onRemoveObat }: ObatStepProps) {
  const supabase = createClient();
  const [obatNames, setObatNames] = useState<string[]>(ALL_OBAT_NAMES);
  const [newObat, setNewObat] = useState<ObatItem>({
    nama: '',
    aturan_pakai: '',
  });

  // Load obat names from Supabase (flat list, no kategori)
  useEffect(() => {
    const loadObat = async () => {
      try {
        const { data } = await supabase
          .from('master_obat')
          .select('nama')
          .order('nama');
        if (data && data.length > 0) {
          setObatNames(data.map((d: { nama: string }) => d.nama));
        }
      } catch {
        // Use static fallback
      }
    };
    loadObat();
  }, [supabase]);

  const obatOptions = useMemo(() =>
    obatNames.map((nama) => ({
      value: nama,
      label: nama,
    })),
    [obatNames]
  );

  const handleAdd = () => {
    if (newObat.nama && newObat.aturan_pakai) {
      onAddObat(newObat);
      setNewObat({ nama: '', aturan_pakai: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Resep Obat</h3>
        <p className="text-sm text-gray-500">Tambahkan obat yang diresepkan</p>
      </div>

      {/* Add medicine form */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
        <p className="text-sm font-medium text-gray-700">Tambah Obat</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SearchableSelect
            label="Nama Obat"
            options={obatOptions}
            placeholder="Cari nama obat..."
            value={newObat.nama}
            onChange={(val) => setNewObat((prev) => ({ ...prev, nama: val }))}
          />
          <Input
            label="Aturan Pakai"
            placeholder="Contoh: 3x1 sesudah makan..."
            value={newObat.aturan_pakai}
            onChange={(e) => setNewObat((prev) => ({ ...prev, aturan_pakai: e.target.value }))}
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleAdd}
          disabled={!newObat.nama || !newObat.aturan_pakai}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Tambah Obat
        </Button>
      </div>

      {/* Medicine list */}
      {formData.obat.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Daftar Obat ({formData.obat.length})
          </p>
          {formData.obat.map((obat, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{obat.nama}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {obat.aturan_pakai}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveObat(index)}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {formData.obat.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <p className="text-sm">Belum ada obat ditambahkan</p>
        </div>
      )}
    </div>
  );
}
