'use client';

// Tambahkan import Suspense dari react
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

// 1. Pindahkan semua logika utama ke dalam komponen baru ini
function RekamMedisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient');

  const {
    currentStep, formData, errors, updateFormData,
    addObat, removeObat, toggleTindakan,
    nextStep, prevStep, goToStep, getSubmitData,
  } = useMedicalRecordForm(
    patientId ? { patient_id: patientId } : undefined,
    patientId ? 2 : 1,   // skip step 1 (Pilih Pasien) if patient already known
  );

  const { createRecord, loading } = useMedicalRecords();
  const { showToast, ToastContainer } = useToast();

  const handleSubmit = async () => {
    const data = getSubmitData();
    const result = await createRecord(data);
    if (result) {
      showToast('Rekam medis berhasil dibuat!', 'success');
      setTimeout(() => router.push(`/dashboard/rekam-medis/${result.id}`), 1000);
    } else {
      showToast('Gagal membuat rekam medis', 'error');
    }
  };

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
    <>
      <ToastContainer />

      {/* Step Indicator */}
      <StepIndicator steps={FORM_STEPS} currentStep={currentStep} onStepClick={goToStep} />

      {/* Form Content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Button variant="secondary" onClick={prevStep} disabled={currentStep === 1}>
          ← Sebelumnya
        </Button>

        <span className="text-sm text-gray-400">
          Langkah {currentStep} dari {FORM_STEPS.length}
        </span>

        {currentStep < FORM_STEPS.length ? (
          <Button onClick={() => nextStep()}>
            Selanjutnya →
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading}>
            💾 Simpan Rekam Medis
          </Button>
        )}
      </div>
    </>
  );
}

// 2. Ini adalah halaman utama yang di-export oleh Next.js
export default function BuatRekamMedisPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb ditaruh di luar karena tidak butuh useSearchParams */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/dashboard/rekam-medis" className="hover:text-blue-600 transition-colors">Rekam Medis</Link>
        <span>/</span>
        <span className="text-gray-700">Buat Baru</span>
      </div>

      {/* 3. Bungkus komponen form yang pakai useSearchParams dengan Suspense */}
      <Suspense fallback={
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
          Memuat formulir...
        </div>
      }>
        <RekamMedisForm />
      </Suspense>
    </div>
  );
}