'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePatients } from '@/hooks/usePatients';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Patient } from '@/types/medical-record';

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getPatientById } = usePatients();
  const { records, fetchRecords } = useMedicalRecords();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const p = await getPatientById(id);
      setPatient(p);
      await fetchRecords({ patientId: id });
      setLoading(false);
    };
    load();
  }, [id, getPatientById, fetchRecords]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-40 w-full rounded-xl" />
        <div className="skeleton h-60 w-full rounded-xl" />
      </div>
    );
  }

  if (!patient) {
    return <div className="text-center py-20 text-gray-400">Pasien tidak ditemukan</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/dashboard/pasien" className="hover:text-blue-600 transition-colors">Pasien</Link>
        <span>/</span>
        <span className="text-gray-700 truncate">{patient.nama}</span>
      </div>

      {/* Patient Info */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">{patient.nama}</h1>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{patient.no_reg}</span>
            </p>
          </div>
          <Link href={`/dashboard/rekam-medis/baru?patient=${patient.id}`}>
            <Button size="sm" icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }>Buat RM</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Tanggal Lahir', value: new Date(patient.tanggal_lahir).toLocaleDateString('id-ID') },
            { label: 'Jenis Kelamin', value: patient.jenis_kelamin },
            { label: 'Alamat', value: patient.alamat },
            { label: 'No. Telepon', value: patient.no_telepon || '-' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-sm text-gray-700">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Medical Records */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Riwayat Rekam Medis</h2>
        {records.length > 0 ? (
          <div className="space-y-3">
            {records.map((record) => (
              <Link key={record.id} href={`/dashboard/rekam-medis/${record.id}`}>
                <Card hover className="p-4 mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{record.diagnosa || 'Tanpa diagnosa'}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {record.keluhan_utama} • {new Date(record.tanggal_kunjungan).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {record.icd_10 && (
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{record.icd_10}</span>
                      )}
                      <Badge variant={record.status === 'selesai' ? 'success' : 'warning'}>
                        {record.status === 'selesai' ? 'Selesai' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-400">Belum ada rekam medis</p>
          </Card>
        )}
      </div>
    </div>
  );
}
