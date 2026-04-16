'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

export default function RekamMedisPage() {
  const { records, loading, fetchRecords, deleteRecord } = useMedicalRecords();
  const { showToast, ToastContainer } = useToast();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchRecords({ search }); }, [search, fetchRecords]);

  const handleDelete = async () => {
    if (deleteId) {
      const ok = await deleteRecord(deleteId);
      if (ok) { showToast('Rekam medis berhasil dihapus', 'success'); setDeleteId(null); }
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Rekam Medis</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar semua rekam medis pasien</p>
        </div>
        <Link href="/dashboard/rekam-medis/baru">
          <Button icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Buat Rekam Medis
          </Button>
        </Link>
      </div>

      <Input placeholder="Cari berdasarkan diagnosa, keluhan, atau kode ICD-10..." value={search}
        onChange={(e) => setSearch(e.target.value)} />

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Pasien</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Keluhan</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Diagnosa</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">ICD-10</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tanggal</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-full rounded" /></td>
                  ))}</tr>
                ))
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.patient?.nama || '-'}</p>
                        <p className="text-xs text-gray-400">{record.patient?.no_reg}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[150px] truncate">{record.keluhan_utama || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.diagnosa || '-'}</td>
                    <td className="px-6 py-4">
                      {record.icd_10 ? (
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{record.icd_10}</span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(record.tanggal_kunjungan).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={record.status === 'selesai' ? 'success' : 'warning'}>
                        {record.status === 'selesai' ? 'Selesai' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/rekam-medis/${record.id}`}>
                          <Button variant="ghost" size="sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                        </Link>
                        <Link href={`/dashboard/rekam-medis/${record.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(record.id)}>
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                    {search ? 'Tidak ditemukan' : 'Belum ada data rekam medis'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          ))
        ) : records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{record.patient?.nama || '-'}</p>
                  <p className="text-xs text-gray-400">{record.patient?.no_reg}</p>
                </div>
                <Badge variant={record.status === 'selesai' ? 'success' : 'warning'}>
                  {record.status === 'selesai' ? 'Selesai' : 'Draft'}
                </Badge>
              </div>

              <div className="mt-3 space-y-2">
                {record.keluhan_utama && (
                  <div>
                    <span className="text-xs text-gray-400">Keluhan</span>
                    <p className="text-sm text-gray-700 line-clamp-2">{record.keluhan_utama}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Diagnosa</span>
                    <p className="text-gray-700 truncate">{record.diagnosa || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">ICD-10</span>
                    <p className="text-gray-700">
                      {record.icd_10 ? (
                        <span className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{record.icd_10}</span>
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tanggal</span>
                    <p className="text-gray-700">{new Date(record.tanggal_kunjungan).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-end gap-1">
                <Link href={`/dashboard/rekam-medis/${record.id}`}>
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Button>
                </Link>
                <Link href={`/dashboard/rekam-medis/${record.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(record.id)}>
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
            {search ? 'Tidak ditemukan' : 'Belum ada data rekam medis'}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Hapus Rekam Medis" message="Apakah Anda yakin ingin menghapus rekam medis ini?" loading={loading}
      />
    </div>
  );
}
