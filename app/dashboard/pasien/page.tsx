'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePatients } from '@/hooks/usePatients';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import type { PatientFormData } from '@/types/medical-record';

const INITIAL_FORM: PatientFormData = {
  no_reg: '', nama: '', tanggal_lahir: '', jenis_kelamin: '', alamat: '', no_telepon: '',
};

export default function PasienPage() {
  const { patients, loading, error, fetchPatients, createPatient, updatePatient, deletePatient, generateRegNumber } = usePatients();
  const { showToast, ToastContainer } = useToast();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_FORM);

  useEffect(() => { fetchPatients(search); }, [search, fetchPatients]);

  const openCreate = async () => {
    const regNum = await generateRegNumber();
    setFormData({ ...INITIAL_FORM, no_reg: regNum });
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    const p = patients.find((p) => p.id === id);
    if (p) {
      setFormData({
        no_reg: p.no_reg, nama: p.nama, tanggal_lahir: p.tanggal_lahir,
        jenis_kelamin: p.jenis_kelamin, alamat: p.alamat, no_telepon: p.no_telepon || '',
      });
      setEditId(id);
      setModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.tanggal_lahir || !formData.jenis_kelamin || !formData.alamat) {
      showToast('Harap lengkapi semua field yang wajib', 'error');
      return;
    }
    if (editId) {
      const result = await updatePatient(editId, formData);
      if (result) { showToast('Pasien berhasil diperbarui', 'success'); setModalOpen(false); }
    } else {
      const result = await createPatient(formData as PatientFormData & { jenis_kelamin: 'Laki-laki' | 'Perempuan' });
      if (result) { showToast('Pasien berhasil ditambahkan', 'success'); setModalOpen(false); }
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      const ok = await deletePatient(deleteId);
      if (ok) { showToast('Pasien berhasil dihapus', 'success'); setDeleteId(null); }
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Data Pasien</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data pasien klinik</p>
        </div>
        <Button onClick={openCreate} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Tambah Pasien
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Cari pasien berdasarkan nama, no. registrasi, atau alamat..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">No. Reg</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Nama</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tgl Lahir</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Jenis Kelamin</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Alamat</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-full rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {patient.no_reg}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/pasien/${patient.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {patient.nama}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(patient.tanggal_lahir).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{patient.jenis_kelamin}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{patient.alamat}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(patient.id)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(patient.id)}>
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
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                    {search ? 'Tidak ada pasien ditemukan' : 'Belum ada data pasien'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          ))
        ) : patients.length > 0 ? (
          patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/dashboard/pasien/${patient.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {patient.nama}
                  </Link>
                  <div className="mt-1">
                    <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {patient.no_reg}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(patient.id)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(patient.id)}>
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Tgl Lahir</span>
                  <p className="text-gray-700">{new Date(patient.tanggal_lahir).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <span className="text-gray-400">Jenis Kelamin</span>
                  <p className="text-gray-700">{patient.jenis_kelamin}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Alamat</span>
                  <p className="text-gray-700 truncate">{patient.alamat}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
            {search ? 'Tidak ada pasien ditemukan' : 'Belum ada data pasien'}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Pasien' : 'Tambah Pasien Baru'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} loading={loading}>{editId ? 'Simpan' : 'Tambah'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="No. Registrasi" value={formData.no_reg} disabled />
          <Input label="Nama Lengkap *" placeholder="Masukkan nama lengkap pasien" value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Tanggal Lahir *" type="date" value={formData.tanggal_lahir}
              onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Jenis Kelamin *</label>
              <select className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                value={formData.jenis_kelamin}
                onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value as 'Laki-laki' | 'Perempuan' })}>
                <option value="">Pilih...</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>
          <Input label="Alamat *" placeholder="Masukkan alamat lengkap" value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
          <Input label="No. Telepon" placeholder="08xxxxxxxxxx" value={formData.no_telepon}
            onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })} />
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Pasien"
        message="Apakah Anda yakin ingin menghapus pasien ini? Semua data rekam medis terkait juga akan dihapus."
        loading={loading}
      />
    </div>
  );
}
