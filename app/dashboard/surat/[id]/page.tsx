'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSurat } from '@/hooks/useSurat';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { parseSuratKeterangan } from '@/lib/surat-helpers';
import type { Surat } from '@/types/medical-record';

export default function SuratDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getSuratById } = useSurat();
  const [surat, setSurat] = useState<Surat | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getSuratById(id);
      setSurat(data);
      setLoading(false);
    };
    load();
  }, [id, getSuratById]);

  const handleDownload = async () => {
    if (!surat?.patient) return;
    setDownloading(true);
    try {
      const extra = parseSuratKeterangan(surat.keterangan);
      const [{ pdf }, sakitMod, dokterMod] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/surat/SuratSakitPDF'),
        import('@/components/surat/SuratDokterPDF'),
      ]);

      const commonPdfData = {
        nama_dokter: surat.nama_dokter || '',
        pekerjaan: extra.pekerjaan,
        created_at: surat.created_at,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let doc: React.ReactElement<any>;
      if (surat.jenis === 'surat_sakit') {
        const SuratSakitPDF = sakitMod.default;
        doc = (
          <SuratSakitPDF
            patient={surat.patient}
            pdfData={{ ...commonPdfData, diagnosa_text: extra.diagnosa_text, lama_istirahat: extra.lama_istirahat, tanggal_mulai: surat.tanggal_mulai || '', tanggal_selesai: surat.tanggal_selesai || '' }}
          />
        );
      } else {
        const SuratDokterPDF = dokterMod.default;
        doc = (
          <SuratDokterPDF
            patient={surat.patient}
            pdfData={{ ...commonPdfData, kondisi: extra.kondisi, keperluan: extra.keperluan, tinggi: extra.tinggi, berat: extra.berat, mata: extra.mata, gol_darah: extra.gol_darah, buta_warna: extra.buta_warna, tekanan_darah: extra.tekanan_darah }}
          />
        );
      }

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${surat.jenis === 'surat_sakit' ? 'Surat_Keterangan_Sakit' : 'Surat_Keterangan_Dokter'}_${surat.patient.nama}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!surat) {
    return <div className="text-center py-20 text-gray-400">Surat tidak ditemukan</div>;
  }

  const extra = parseSuratKeterangan(surat.keterangan);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/dashboard/surat" className="hover:text-blue-600 transition-colors">Surat</Link>
          <span>/</span>
          <span className="text-gray-700">Detail</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/surat/${id}/edit`}>
            <Button variant="secondary" size="sm">✏️ Edit</Button>
          </Link>
          <Button onClick={handleDownload} loading={downloading} size="sm">
            📥 Download PDF
          </Button>
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Jenis Surat</p>
            <Badge variant={surat.jenis === 'surat_sakit' ? 'warning' : 'info'} >
              {surat.jenis === 'surat_sakit' ? '🤒 Surat Sakit' : '👨‍⚕️ Surat Dokter'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">{new Date(surat.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Patient info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t border-gray-100">
          {[
            { label: 'Pasien', value: surat.patient?.nama || '-' },
            { label: 'No. Registrasi', value: surat.patient?.no_reg || '-' },
            { label: 'Pekerjaan', value: extra.pekerjaan || '-' },
            { label: 'Dokter', value: surat.nama_dokter ? `dr. ${surat.nama_dokter}` : '-' },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-xs text-gray-400">{row.label}</p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Surat Sakit Details */}
      {surat.jenis === 'surat_sakit' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">📋 Detail Surat Sakit</h4>
          </div>
          <div className="px-4 sm:px-5 py-4 space-y-3">
            {[
              { label: 'Diagnosa / Keterangan', value: extra.diagnosa_text || '-' },
              { label: 'Lama Istirahat', value: extra.lama_istirahat ? `${extra.lama_istirahat} hari` : '-' },
              { label: 'Tanggal Mulai', value: surat.tanggal_mulai ? new Date(surat.tanggal_mulai).toLocaleDateString('id-ID') : '-' },
              { label: 'Tanggal Selesai', value: surat.tanggal_selesai ? new Date(surat.tanggal_selesai).toLocaleDateString('id-ID') : '-' },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row py-1.5 border-b border-gray-50 last:border-0 gap-0.5 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-400 sm:text-gray-500 sm:w-48 shrink-0">{row.label}</span>
                <span className="text-sm text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Surat Dokter Details */}
      {surat.jenis === 'surat_dokter' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">📋 Detail Surat Dokter</h4>
          </div>
          <div className="px-4 sm:px-5 py-4 space-y-1">
            {[
              { label: 'Kondisi', value: extra.kondisi || '-' },
              { label: 'Keperluan', value: extra.keperluan || '-' },
              { label: 'Tinggi', value: extra.tinggi ? `${extra.tinggi} cm` : '-' },
              { label: 'Berat', value: extra.berat ? `${extra.berat} kg` : '-' },
              { label: 'Mata', value: extra.mata || '-' },
              { label: 'Gol. Darah', value: extra.gol_darah || '-' },
              { label: 'Buta Warna', value: extra.buta_warna || '-' },
              { label: 'Tekanan Darah', value: extra.tekanan_darah || '-' },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row py-1.5 border-b border-gray-50 last:border-0 gap-0.5 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-400 sm:text-gray-500 sm:w-48 shrink-0">{row.label}</span>
                <span className="text-sm text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
