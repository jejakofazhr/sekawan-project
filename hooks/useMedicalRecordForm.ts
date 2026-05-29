'use client';

import { useState, useCallback } from 'react';
import type { MedicalRecordFormData, ObatItem } from '@/types/medical-record';

const INITIAL_FORM_DATA: MedicalRecordFormData = {
  patient_id: '',
  keluhan_utama: '',
  riwayat_penyakit_sekarang: '',
  riwayat_penyakit_terdahulu: '',
  riwayat_penyakit_keluarga: '',
  tekanan_darah: '',
  nadi: '',
  suhu: '',
  respirasi: '',
  saturasi: '',
  diagnosa: '',
  icd_10: '',
  keterangan_diagnosa: '',
  tindakan: [],
  edukasi: '',
  obat: [],
};

export const FORM_STEPS = [
  { id: 1, title: 'Identitas Pasien', description: 'Pilih pasien' },
  { id: 2, title: 'Anamnesa', description: 'Keluhan & riwayat penyakit' },
  { id: 3, title: 'Diagnosa', description: 'Diagnosis & kode ICD-10' },
  { id: 4, title: 'Tindakan', description: 'Tindakan medis' },
  { id: 5, title: 'Edukasi', description: 'Edukasi pasien' },
  { id: 6, title: 'Obat', description: 'Resep obat' },
];

export function useMedicalRecordForm(initialData?: Partial<MedicalRecordFormData>, initialStep: number = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = useCallback((updates: Partial<MedicalRecordFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach((key) => delete clearedErrors[key]);
    setErrors(clearedErrors);
  }, [errors]);

  const addObat = useCallback((obat: ObatItem) => {
    setFormData((prev) => ({
      ...prev,
      obat: [...prev.obat, obat],
    }));
  }, []);

  const removeObat = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      obat: prev.obat.filter((_, i) => i !== index),
    }));
  }, []);

  const toggleTindakan = useCallback((tindakan: string) => {
    setFormData((prev) => ({
      ...prev,
      tindakan: prev.tindakan.includes(tindakan)
        ? prev.tindakan.filter((t) => t !== tindakan)
        : [...prev.tindakan, tindakan],
    }));
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.patient_id) {
          newErrors.patient_id = 'Pilih pasien terlebih dahulu';
        }
        break;
      case 2:
        if (!formData.keluhan_utama.trim()) {
          newErrors.keluhan_utama = 'Keluhan utama wajib diisi';
        }
        break;
      case 3:
        if (!formData.diagnosa.trim()) {
          newErrors.diagnosa = 'Diagnosa wajib diisi';
        }
        break;
      // Steps 4, 5, 6 are optional
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
      return true;
    }
    return false;
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setErrors({});
  }, []);

  const getSubmitData = useCallback(() => {
    return {
      patient_id: formData.patient_id,
      keluhan_utama: formData.keluhan_utama || undefined,
      riwayat_penyakit_sekarang: formData.riwayat_penyakit_sekarang || undefined,
      riwayat_penyakit_terdahulu: formData.riwayat_penyakit_terdahulu || undefined,
      riwayat_penyakit_keluarga: formData.riwayat_penyakit_keluarga || undefined,
      tekanan_darah: formData.tekanan_darah || undefined,
      nadi: formData.nadi || undefined,
      suhu: formData.suhu || undefined,
      respirasi: formData.respirasi || undefined,
      saturasi: formData.saturasi || undefined,
      diagnosa: formData.diagnosa || undefined,
      icd_10: formData.icd_10 || undefined,
      keterangan_diagnosa: formData.keterangan_diagnosa || undefined,
      tindakan: formData.tindakan,
      edukasi: formData.edukasi || undefined,
      obat: formData.obat,
      status: 'selesai' as const,
    };
  }, [formData]);

  return {
    currentStep,
    formData,
    errors,
    updateFormData,
    addObat,
    removeObat,
    toggleTindakan,
    validateStep,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    getSubmitData,
  };
}
