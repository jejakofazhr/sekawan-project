'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSurat } from '@/hooks/useSurat';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import SuratRowActions from '@/components/surat/SuratRowActions';

export default function SuratPage() {
  const { suratList, loading, fetchSuratList, deleteSurat } = useSurat();
  const { showToast, ToastContainer } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchSuratList(); }, [fetchSuratList]);

  // Show success toast after redirect from create page
  useEffect(() => {
    const created = sessionStorage.getItem('suratCreated');
    if (created) {
      sessionStorage.removeItem('suratCreated');
      showToast('Surat berhasil dibuat!', 'success');
    }
    const updated = sessionStorage.getItem('suratUpdated');
    if (updated) {
      sessionStorage.removeItem('suratUpdated');
      showToast('Surat berhasil diperbarui!', 'success');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      const ok = await deleteSurat(deleteId);
      if (ok) { showToast('Surat berhasil dihapus', 'success'); setDeleteId(null); }
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surat</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola surat keterangan sakit dan surat dokter</p>
        </div>
        <Link href="/dashboard/surat/baru">
          <Button icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Buat Surat
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Pasien</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Jenis Surat</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tanggal</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Dokter</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-full rounded" /></td>
                  ))}</tr>
                ))
              ) : suratList.length > 0 ? (
                suratList.map((surat) => (
                  <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{surat.patient?.nama || '-'}</p>
                      <p className="text-xs text-gray-400">{surat.patient?.no_reg}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={surat.jenis === 'surat_sakit' ? 'warning' : 'info'}>
                        {surat.jenis === 'surat_sakit' ? 'Surat Sakit' : 'Surat Dokter'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(surat.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{surat.nama_dokter || '-'}</td>
                    <td className="px-6 py-4">
                      <SuratRowActions
                        surat={surat}
                        onDelete={() => setDeleteId(surat.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    Belum ada surat dibuat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Hapus Surat" message="Apakah Anda yakin ingin menghapus surat ini?" loading={loading}
      />
    </div>
  );
}
