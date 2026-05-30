'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';

// Static fallback data
import { DIAGNOSA_MEDIS } from '@/data/diagnosa-medis';
import { ALL_OBAT_NAMES } from '@/lib/data/obat-list';
import { TINDAKAN_LIST } from '@/lib/data/obat-list';

type ActiveTab = 'diagnosa' | 'tindakan' | 'obat';

interface MasterItem {
  id: string;
  nama: string;
  created_at?: string;
}

export default function PengaturanPage() {
  const supabase = createClient();
  const { showToast, ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('diagnosa');
  const [items, setItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MasterItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formNama, setFormNama] = useState('');
  const [useSupabase, setUseSupabase] = useState(true);

  const tableName = activeTab === 'diagnosa' ? 'master_diagnosa' : activeTab === 'tindakan' ? 'master_tindakan' : 'master_obat';

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('nama');

      if (error) throw error;

      if (data && data.length > 0) {
        setItems(data);
        setUseSupabase(true);
      } else {
        // Load from static data
        loadStaticData();
      }
    } catch {
      // Tables might not exist yet, load static data
      loadStaticData();
    } finally {
      setLoading(false);
    }
  }, [supabase, tableName]);

  const loadStaticData = () => {
    setUseSupabase(false);
    if (activeTab === 'diagnosa') {
      setItems(DIAGNOSA_MEDIS.map((nama, i) => ({ id: `static-${i}`, nama })));
    } else if (activeTab === 'tindakan') {
      setItems(TINDAKAN_LIST.map((nama, i) => ({ id: `static-${i}`, nama })));
    } else {
      setItems(ALL_OBAT_NAMES.map((nama, i) => ({ id: `static-${i}`, nama })));
    }
  };

  useEffect(() => {
    setSearch('');
    loadItems();
  }, [activeTab, loadItems]);

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase();
    return item.nama.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditItem(null);
    setFormNama('');
    setModalOpen(true);
  };

  const openEdit = (item: MasterItem) => {
    setEditItem(item);
    setFormNama(item.nama);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formNama.trim()) {
      showToast('Nama wajib diisi', 'error');
      return;
    }

    if (!useSupabase) {
      showToast('Data master belum tersedia di database. Silakan buat tabel terlebih dahulu di Supabase.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = { nama: formNama.trim() };

      if (editItem && !editItem.id.startsWith('static-')) {
        const { error } = await supabase
          .from(tableName)
          .update(payload)
          .eq('id', editItem.id);
        if (error) throw error;
        showToast('Data berhasil diperbarui', 'success');
      } else {
        const { error } = await supabase
          .from(tableName)
          .insert([payload]);
        if (error) throw error;
        showToast('Data berhasil ditambahkan', 'success');
      }

      setModalOpen(false);
      loadItems();
    } catch (err) {
      showToast(`Gagal menyimpan: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    if (!useSupabase || deleteId.startsWith('static-')) {
      showToast('Data statis tidak bisa dihapus. Buat tabel master di Supabase terlebih dahulu.', 'error');
      setDeleteId(null);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', deleteId);
      if (error) throw error;
      showToast('Data berhasil dihapus', 'success');
      setDeleteId(null);
      loadItems();
    } catch (err) {
      showToast(`Gagal menghapus: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabConfig = [
    { key: 'diagnosa' as ActiveTab, label: 'Diagnosa Medis', icon: '🔬', count: items.length },
    { key: 'tindakan' as ActiveTab, label: 'Tindakan Medis', icon: '💉', count: items.length },
    { key: 'obat' as ActiveTab, label: 'Obat', icon: '💊', count: items.length },
  ];

  const handleSeedData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'diagnosa') {
        const payload = DIAGNOSA_MEDIS.map((nama) => ({ nama }));
        const { error } = await supabase.from(tableName).insert(payload);
        if (error) throw error;
      } else if (activeTab === 'tindakan') {
        const payload = TINDAKAN_LIST.map((nama) => ({ nama }));
        const { error } = await supabase.from(tableName).insert(payload);
        if (error) throw error;
      } else {
        const payload = ALL_OBAT_NAMES.map((nama) => ({ nama }));
        const { error } = await supabase.from(tableName).insert(payload);
        if (error) throw error;
      }

      showToast('Data berhasil diimport dari data awal!', 'success');
      loadItems();
    } catch (err) {
      showToast(`Gagal import: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola data master untuk diagnosa, tindakan, dan obat</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap
              transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {activeTab === tab.key && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {filteredItems.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Info banner — only shown when static data fallback is active */}
      {!useSupabase && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">📋 Data Statis</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Saat ini menggunakan data dari file lokal. Untuk bisa menambah/edit/hapus data, 
              buat tabel <code className="bg-amber-100 px-1 rounded">{tableName}</code> di Supabase kemudian import data awal.
            </p>
          </div>
          <Button size="sm" onClick={handleSeedData} loading={loading}>
            Import Data Awal
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Cari berdasarkan nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={openCreate} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Tambah
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 w-12">#</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Nama</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3"><div className="skeleton h-4 w-6 rounded" /></td>
                    <td className="px-6 py-3"><div className="skeleton h-4 w-full rounded" /></td>
                    <td className="px-6 py-3"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 text-xs text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{item.nama}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
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
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-400">
                    {search ? 'Tidak ditemukan' : 'Belum ada data'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Data' : 'Tambah Data Baru'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} loading={loading}>
              {editItem ? 'Simpan' : 'Tambah'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama *"
            placeholder={`Masukkan nama ${activeTab}...`}
            value={formNama}
            onChange={(e) => setFormNama(e.target.value)}
          />
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Data"
        message="Apakah Anda yakin ingin menghapus data ini?"
        loading={loading}
      />
    </div>
  );
}
