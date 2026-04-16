'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSurat } from '@/hooks/useSurat';
import { usePatients } from '@/hooks/usePatients';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { INITIAL_PDF_EXTRA, type PdfExtraData } from '@/lib/surat-helpers';
import type { SuratFormData } from '@/types/medical-record';

const INITIAL_FORM: SuratFormData = {
  patient_id: '',
  medical_record_id: '',
  jenis: 'surat_sakit',
  tanggal_mulai: '',
  tanggal_selesai: '',
  keterangan: '',
  nama_dokter: '',
};

export default function BuatSuratPage() {
  const router = useRouter();
  const { createSurat, loading: saving } = useSurat();
  const { patients, fetchPatients } = usePatients();
  const { showToast, ToastContainer } = useToast();

  const [formData, setFormData] = useState<SuratFormData>(INITIAL_FORM);
  const [pdfExtra, setPdfExtra] = useState<PdfExtraData>(INITIAL_PDF_EXTRA);

  // Auto-calculate lama_istirahat from date range
  useEffect(() => {
    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      const start = new Date(formData.tanggal_mulai);
      const end = new Date(formData.tanggal_selesai);
      const diff = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      setPdfExtra((prev) => ({ ...prev, lama_istirahat: String(diff) }));
    } else {
      setPdfExtra((prev) => ({ ...prev, lama_istirahat: '' }));
    }
  }, [formData.tanggal_mulai, formData.tanggal_selesai]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const handleSubmit = async () => {
    if (!formData.patient_id) { showToast('Pilih pasien terlebih dahulu', 'error'); return; }
    if (!formData.nama_dokter) { showToast('Nama dokter wajib diisi', 'error'); return; }

    // Serialize pdfExtra into keterangan field for storage
    const dataToSave: SuratFormData = {
      ...formData,
      keterangan: JSON.stringify(pdfExtra),
    };

    const result = await createSurat(dataToSave);
    if (result) {
      sessionStorage.setItem('suratCreated', '1');
      router.push('/dashboard/surat');
    } else {
      showToast('Gagal membuat surat', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <ToastContainer />

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/dashboard/surat" className="hover:text-blue-600 transition-colors">Surat</Link>
        <span>/</span>
        <span className="text-gray-700">Buat Surat</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Buat Surat Baru</h1>
        <p className="text-sm text-gray-500 mt-1">Buat surat keterangan sakit atau surat dokter</p>
      </div>

      <Card className="p-4 sm:p-6 space-y-5">
        {/* Jenis Surat */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'surat_sakit' as const, label: 'Surat Sakit', icon: '🤒' },
            { value: 'surat_dokter' as const, label: 'Surat Dokter', icon: '👨‍⚕️' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData({ ...formData, jenis: opt.value })}
              className={`p-3 sm:p-4 rounded-xl border text-left transition-all ${
                formData.jenis === opt.value
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-xl sm:text-2xl">{opt.icon}</span>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 sm:mt-2">{opt.label}</p>
            </button>
          ))}
        </div>

        {/* Patient Select */}
        <Select
          label="Pasien *"
          placeholder="Pilih pasien..."
          options={patients.map((p) => ({ value: p.id, label: `${p.nama} (${p.no_reg})` }))}
          value={formData.patient_id}
          onChange={(e) => setFormData({ ...formData, patient_id: e.target.value, medical_record_id: '' })}
        />

        {/* Common fields */}
        <Input
          label="Pekerjaan"
          placeholder="Pekerjaan pasien..."
          value={pdfExtra.pekerjaan}
          onChange={(e) => setPdfExtra({ ...pdfExtra, pekerjaan: e.target.value })}
        />

        <Input
          label="Nama Dokter *"
          placeholder="Nama dokter (tanpa gelar dr.)"
          value={formData.nama_dokter}
          onChange={(e) => setFormData({ ...formData, nama_dokter: e.target.value })}
          helperText="Gelar 'dr.' akan otomatis ditambahkan pada surat"
        />

        {/* ===== SURAT SAKIT FIELDS ===== */}
        {formData.jenis === 'surat_sakit' && (
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">📋 Detail Surat Sakit</h3>
            <div className="space-y-4">
              <Textarea
                label="Diagnosa / Keterangan"
                placeholder="Diagnosa atau keterangan penyakit..."
                value={pdfExtra.diagnosa_text}
                onChange={(e) => setPdfExtra({ ...pdfExtra, diagnosa_text: e.target.value })}
                rows={2}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Tanggal Mulai" type="date" value={formData.tanggal_mulai}
                  onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })} />
                <Input label="Tanggal Selesai" type="date" value={formData.tanggal_selesai}
                  onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Lama Istirahat (hari)</label>
                <div className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${
                  pdfExtra.lama_istirahat
                    ? 'bg-blue-50 border-blue-200 text-blue-800 font-semibold'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}>
                  {pdfExtra.lama_istirahat ? `${pdfExtra.lama_istirahat} hari` : 'Otomatis terisi dari tanggal mulai & selesai'}
                </div>
                <p className="text-xs text-gray-400">Dihitung otomatis dari tanggal mulai hingga selesai</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== SURAT DOKTER FIELDS ===== */}
        {formData.jenis === 'surat_dokter' && (
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">📋 Detail Surat Dokter</h3>
            <div className="space-y-4">
              {/* Kondisi */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Kondisi Kesehatan *</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['SEHAT', 'TIDAK SEHAT'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPdfExtra({ ...pdfExtra, kondisi: opt })}
                      className={`p-3 rounded-lg border text-xs sm:text-sm font-semibold text-center transition-all ${
                        pdfExtra.kondisi === opt
                          ? opt === 'SEHAT'
                            ? 'bg-green-50 border-green-300 text-green-700 ring-2 ring-green-500/20'
                            : 'bg-red-50 border-red-300 text-red-700 ring-2 ring-red-500/20'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Keperluan"
                placeholder="Keperluan surat (contoh: melamar pekerjaan)..."
                value={pdfExtra.keperluan}
                onChange={(e) => setPdfExtra({ ...pdfExtra, keperluan: e.target.value })}
              />

              {/* NB Fields */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 sm:p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">NB - Pemeriksaan Fisik</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Tinggi (cm)"
                    placeholder="Contoh: 170"
                    type="number"
                    min={0}
                    value={pdfExtra.tinggi}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || Number(val) >= 0) setPdfExtra({ ...pdfExtra, tinggi: val });
                    }}
                  />
                  <Input
                    label="Berat (kg)"
                    placeholder="Contoh: 65"
                    type="number"
                    min={0}
                    value={pdfExtra.berat}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || Number(val) >= 0) setPdfExtra({ ...pdfExtra, berat: val });
                    }}
                  />
                  <Select
                    label="Mata"
                    placeholder="-- Pilih --"
                    options={[
                      { value: 'Normal', label: 'Normal' },
                      { value: 'Minus (Miopia)', label: 'Minus (Miopia)' },
                      { value: 'Plus (Hipermetropia)', label: 'Plus (Hipermetropia)' },
                      { value: 'Silinder (Astigmatisma)', label: 'Silinder (Astigmatisma)' },
                      { value: 'Minus + Silinder', label: 'Minus + Silinder' },
                      { value: 'Plus + Silinder', label: 'Plus + Silinder' },
                    ]}
                    value={pdfExtra.mata}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, mata: e.target.value })}
                  />
                  <Select
                    label="Gol. Darah"
                    placeholder="-- Pilih --"
                    options={[
                      { value: 'A', label: 'A' },
                      { value: 'B', label: 'B' },
                      { value: 'AB', label: 'AB' },
                      { value: 'O', label: 'O' },
                      { value: 'Tidak Diketahui', label: 'Tidak Diketahui' },
                    ]}
                    value={pdfExtra.gol_darah}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, gol_darah: e.target.value })}
                  />
                  <Select
                    label="Buta Warna"
                    placeholder="-- Pilih --"
                    options={[
                      { value: 'Normal', label: 'Normal' },
                      { value: 'Buta Warna Parsial', label: 'Buta Warna Parsial' },
                      { value: 'Buta Warna Total', label: 'Buta Warna Total' },
                    ]}
                    value={pdfExtra.buta_warna}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, buta_warna: e.target.value })}
                  />
                  <Input label="Tekanan Darah" placeholder="Contoh: 120/80" value={pdfExtra.tekanan_darah}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, tekanan_darah: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Link href="/dashboard/surat">
          <Button variant="secondary" className="w-full sm:w-auto">← Kembali</Button>
        </Link>
        <Button onClick={handleSubmit} loading={saving} className="w-full sm:w-auto">
          💾 Simpan Surat
        </Button>
      </div>
    </div>
  );
}
