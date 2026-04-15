'use client';

import React, { useEffect, useState } from 'react';
import { Input, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { Patient, MedicalRecordFormData } from '@/types/medical-record';
import { createClient } from '@/lib/supabase/client';

interface PatientIdentityStepProps {
  formData: MedicalRecordFormData;
  onUpdate: (data: Partial<MedicalRecordFormData>) => void;
  errors: Record<string, string>;
}

export default function PatientIdentityStep({
  formData,
  onUpdate,
  errors,
}: PatientIdentityStepProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchPatients = async () => {
      let query = supabase.from('patients').select('*').order('nama');
      if (search) {
        query = query.or(`nama.ilike.%${search}%,no_reg.ilike.%${search}%`);
      }
      const { data } = await query;
      setPatients(data || []);
    };
    fetchPatients();
  }, [search, supabase]);

  useEffect(() => {
    if (formData.patient_id && patients.length > 0) {
      const p = patients.find((p) => p.id === formData.patient_id);
      if (p) setSelectedPatient(p);
    }
  }, [formData.patient_id, patients]);

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    onUpdate({ patient_id: patient.id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Identitas Pasien</h3>
        <p className="text-sm text-gray-500">Pilih pasien untuk rekam medis ini</p>
      </div>

      {/* Search */}
      <Input
        placeholder="Cari pasien berdasarkan nama atau no. registrasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="py-3"
      />
      {errors.patient_id && (
        <p className="text-sm text-red-500 -mt-4">{errors.patient_id}</p>
      )}

      {/* Patient List */}
      <div className="grid gap-3 max-h-80 overflow-y-auto pr-1">
        {patients.map((patient) => (
          <Card
            key={patient.id}
            hover
            onClick={() => selectPatient(patient)}
            className={`p-4 cursor-pointer transition-all duration-200 ${selectedPatient?.id === patient.id
                ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50/50'
                : ''
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{patient.nama}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {patient.no_reg} • {patient.jenis_kelamin} •{' '}
                  {new Date(patient.tanggal_lahir).toLocaleDateString('id-ID')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{patient.alamat}</p>
              </div>
              {selectedPatient?.id === patient.id && (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink: 0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </Card>
        ))}
        {patients.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Tidak ada pasien ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
