'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSurat } from '@/hooks/useSurat';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { parseSuratKeterangan, INITIAL_PDF_EXTRA, type PdfExtraData } from '@/lib/surat-helpers';
import type { Surat, SuratFormData } from '@/types/medical-record';

export default function EditSuratPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getSuratById, updateSurat, loading: saving } = useSurat();
  const { showToast, ToastContainer } = useToast();

  const [surat, setSurat] = useState<Surat | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<SuratFormData, 'patient_id' | 'medical_record_id' | 'jenis'>>({
    tanggal_mulai: '',
    tanggal_selesai: '',
    keterangan: '',
    nama_dokter: '',
  });
  const [pdfExtra, setPdfExtra] = useState<PdfExtraData>(INITIAL_PDF_EXTRA);

  // Auto-calculate lama_istirahat
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

  useEffect(() => {
    const load = async () => {
      const data = await getSuratById(id);
      if (data) {
        setSurat(data);
        const extra = parseSuratKeterangan(data.keterangan);
        setFormData({
          tanggal_mulai: data.tanggal_mulai || '',
          tanggal_selesai: data.tanggal_selesai || '',
          keterangan: '',
          nama_dokter: data.nama_dokter || '',
        });
        setPdfExtra(extra);
      }
      setPageLoading(false);
    };
    load();
  }, [id, getSuratById]);

  const handleSubmit = async () => {
    if (!formData.nama_dokter) { showToast('Nama dokter wajib diisi', 'error'); return; }

    const result = await updateSurat(id, {
      patient_id: surat?.patient_id || '',
      medical_record_id: surat?.medical_record_id || '',
      jenis: surat?.jenis || 'surat_sakit',
      ...formData,
      keterangan: JSON.stringify(pdfExtra),
    });

    if (result) {
      sessionStorage.setItem('suratUpdated', '1');
      router.push('/dashboard/surat');
    } else {
      showToast('Gagal mengupdate surat', 'error');
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!surat) return <div className="text-center py-20 text-gray-400">Surat tidak ditemukan</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <ToastContainer />

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/dashboard/surat" className="hover:text-blue-600 transition-colors">Surat</Link>
        <span>/</span>
        <Link href={`/dashboard/surat/${id}`} className="hover:text-blue-600 transition-colors">Detail</Link>
        <span>/</span>
        <span className="text-gray-700">Edit</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Surat</h1>
        <p className="text-sm text-gray-500 mt-1">
          {surat.jenis === 'surat_sakit' ? '🤒 Surat Sakit' : '👨‍⚕️ Surat Dokter'} — {surat.patient?.nama}
        </p>
      </div>

      <Card className="p-4 sm:p-6 space-y-5">
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

        {/* ===== SURAT SAKIT ===== */}
        {surat.jenis === 'surat_sakit' && (
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
                  pdfExtra.lama_istirahat ? 'bg-blue-50 border-blue-200 text-blue-800 font-semibold' : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}>
                  {pdfExtra.lama_istirahat ? `${pdfExtra.lama_istirahat} hari` : 'Otomatis terisi dari tanggal mulai & selesai'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== SURAT DOKTER ===== */}
        {surat.jenis === 'surat_dokter' && (
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">📋 Detail Surat Dokter</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Kondisi Kesehatan *</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['SEHAT', 'TIDAK SEHAT'] as const).map((opt) => (
                    <button key={opt} type="button"
                      onClick={() => setPdfExtra({ ...pdfExtra, kondisi: opt })}
                      className={`p-3 rounded-lg border text-xs sm:text-sm font-semibold text-center transition-all ${
                        pdfExtra.kondisi === opt
                          ? opt === 'SEHAT' ? 'bg-green-50 border-green-300 text-green-700 ring-2 ring-green-500/20' : 'bg-red-50 border-red-300 text-red-700 ring-2 ring-red-500/20'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >{opt}</button>
                  ))}
                </div>
              </div>
              <Input label="Keperluan" placeholder="Keperluan surat..." value={pdfExtra.keperluan}
                onChange={(e) => setPdfExtra({ ...pdfExtra, keperluan: e.target.value })} />
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 sm:p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">NB - Pemeriksaan Fisik</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Tinggi (cm)" type="number" min={0} placeholder="Contoh: 170" value={pdfExtra.tinggi}
                    onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setPdfExtra({ ...pdfExtra, tinggi: v }); }} />
                  <Input label="Berat (kg)" type="number" min={0} placeholder="Contoh: 65" value={pdfExtra.berat}
                    onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setPdfExtra({ ...pdfExtra, berat: v }); }} />
                  <Select label="Mata" placeholder="-- Pilih --" value={pdfExtra.mata}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, mata: e.target.value })}
                    options={[{ value: 'Normal', label: 'Normal' }, { value: 'Minus (Miopia)', label: 'Minus (Miopia)' }, { value: 'Plus (Hipermetropia)', label: 'Plus (Hipermetropia)' }, { value: 'Silinder (Astigmatisma)', label: 'Silinder (Astigmatisma)' }, { value: 'Minus + Silinder', label: 'Minus + Silinder' }, { value: 'Plus + Silinder', label: 'Plus + Silinder' }]}
                  />
                  <Select label="Gol. Darah" placeholder="-- Pilih --" value={pdfExtra.gol_darah}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, gol_darah: e.target.value })}
                    options={[{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'AB', label: 'AB' }, { value: 'O', label: 'O' }, { value: 'Tidak Diketahui', label: 'Tidak Diketahui' }]}
                  />
                  <Select label="Buta Warna" placeholder="-- Pilih --" value={pdfExtra.buta_warna}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, buta_warna: e.target.value })}
                    options={[{ value: 'Normal', label: 'Normal' }, { value: 'Buta Warna Parsial', label: 'Buta Warna Parsial' }, { value: 'Buta Warna Total', label: 'Buta Warna Total' }]}
                  />
                  <Input label="Tekanan Darah" placeholder="Contoh: 120/80" value={pdfExtra.tekanan_darah}
                    onChange={(e) => setPdfExtra({ ...pdfExtra, tekanan_darah: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Link href={`/dashboard/surat/${id}`}>
          <Button variant="secondary" className="w-full sm:w-auto">← Kembali</Button>
        </Link>
        <Button onClick={handleSubmit} loading={saving} className="w-full sm:w-auto">💾 Simpan Perubahan</Button>
      </div>
    </div>
  );
}
