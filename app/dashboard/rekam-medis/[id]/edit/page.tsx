'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMedicalRecordForm, FORM_STEPS } from '@/hooks/useMedicalRecordForm';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import StepIndicator from '@/components/ui/StepIndicator';
import Button from '@/components/ui/Button';
import PatientIdentityStep from '@/components/medical-record/PatientIdentityStep';
import AnamnesaStep from '@/components/medical-record/AnamnesaStep';
import DiagnosaStep from '@/components/medical-record/DiagnosaStep';
import TindakanStep from '@/components/medical-record/TindakanStep';
import EdukasiStep from '@/components/medical-record/EdukasiStep';
import ObatStep from '@/components/medical-record/ObatStep';
import { useToast } from '@/components/ui/Toast';

export default function EditRekamMedisPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getRecordById, updateRecord, loading: saving } = useMedicalRecords();
  const { showToast, ToastContainer } = useToast();
  const [pageLoading, setPageLoading] = useState(true);

  const {
    currentStep, formData, errors, updateFormData,
    addObat, removeObat, toggleTindakan,
    nextStep, prevStep, goToStep, getSubmitData,
  } = useMedicalRecordForm(undefined, 2);

  useEffect(() => {
    const load = async () => {
      const record = await getRecordById(id);
      if (record) {
        updateFormData({
          patient_id: record.patient_id,
          keluhan_utama: record.keluhan_utama ?? '',
          riwayat_penyakit_sekarang: record.riwayat_penyakit_sekarang ?? '',
          riwayat_penyakit_terdahulu: record.riwayat_penyakit_terdahulu ?? '',
          riwayat_penyakit_keluarga: record.riwayat_penyakit_keluarga ?? '',
          tekanan_darah: record.tekanan_darah ?? '',
          nadi: record.nadi ?? '',
          suhu: record.suhu ?? '',
          respirasi: record.respirasi ?? '',
          saturasi: record.saturasi ?? '',
          diagnosa: record.diagnosa ?? '',
          icd_10: record.icd_10 ?? '',
          keterangan_diagnosa: record.keterangan_diagnosa ?? '',
          tindakan: record.tindakan ?? [],
          edukasi: record.edukasi ?? '',
          obat: record.obat ?? [],
        });
      }
      setPageLoading(false);
    };
    load();

  }, [id]);

  const handleSubmit = async () => {
    const data = getSubmitData();
    const result = await updateRecord(id, data);
    if (result) {
      showToast('Rekam medis berhasil diperbarui!', 'success');
      setTimeout(() => router.push(`/dashboard/rekam-medis/${id}`), 1000);
    } else {
      showToast('Gagal mengupdate rekam medis', 'error');
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-16 w-full rounded-xl" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PatientIdentityStep formData={formData} onUpdate={updateFormData} errors={errors} />;
      case 2: return <AnamnesaStep formData={formData} onUpdate={updateFormData} errors={errors} />;
      case 3: return <DiagnosaStep formData={formData} onUpdate={updateFormData} errors={errors} />;
      case 4: return <TindakanStep formData={formData} onToggleTindakan={toggleTindakan} />;
      case 5: return <EdukasiStep formData={formData} onUpdate={updateFormData} />;
      case 6: return <ObatStep formData={formData} onAddObat={addObat} onRemoveObat={removeObat} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ToastContainer />

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/dashboard/rekam-medis" className="hover:text-blue-600 transition-colors">Rekam Medis</Link>
        <span>/</span>
        <Link href={`/dashboard/rekam-medis/${id}`} className="hover:text-blue-600 transition-colors">Detail</Link>
        <span>/</span>
        <span className="text-gray-700">Edit</span>
      </div>

      <StepIndicator steps={FORM_STEPS} currentStep={currentStep} onStepClick={goToStep} />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {renderStep()}
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Button variant="secondary" onClick={prevStep} disabled={currentStep === 1}>
          ← Sebelumnya
        </Button>
        <span className="text-sm text-gray-400">Langkah {currentStep} dari {FORM_STEPS.length}</span>
        {currentStep < FORM_STEPS.length ? (
          <Button onClick={() => nextStep()}>Selanjutnya →</Button>
        ) : (
          <Button onClick={handleSubmit} loading={saving}>💾 Simpan Perubahan</Button>
        )}
      </div>
    </div>
  );
}
