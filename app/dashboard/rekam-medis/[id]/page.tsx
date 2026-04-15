'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import RecordDetail from '@/components/medical-record/RecordDetail';
import Button from '@/components/ui/Button';
import type { MedicalRecord } from '@/types/medical-record';

export default function RekamMedisDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getRecordById } = useMedicalRecords();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getRecordById(id);
      setRecord(data);
      setLoading(false);
    };
    load();
  }, [id, getRecordById]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="skeleton h-8 w-48 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!record) {
    return <div className="text-center py-20 text-gray-400">Rekam medis tidak ditemukan</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/dashboard/rekam-medis" className="hover:text-blue-600 transition-colors">Rekam Medis</Link>
          <span>/</span>
          <span className="text-gray-700">Detail</span>
        </div>
        <Link href={`/dashboard/rekam-medis/${id}/edit`}>
          <Button variant="secondary" size="sm" icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }>
            Edit
          </Button>
        </Link>
      </div>

      <RecordDetail record={record} />
    </div>
  );
}
