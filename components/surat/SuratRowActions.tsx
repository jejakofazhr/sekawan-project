'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { parseSuratKeterangan } from '@/lib/surat-helpers';
import type { Surat } from '@/types/medical-record';

interface Props {
  surat: Surat;
  onDelete: () => void;
}

export default function SuratRowActions({ surat, onDelete }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!surat.patient) return;
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
            pdfData={{
              ...commonPdfData,
              diagnosa_text: extra.diagnosa_text,
              lama_istirahat: extra.lama_istirahat,
              tanggal_mulai: surat.tanggal_mulai || '',
              tanggal_selesai: surat.tanggal_selesai || '',
            }}
          />
        );
      } else {
        const SuratDokterPDF = dokterMod.default;
        doc = (
          <SuratDokterPDF
            patient={surat.patient}
            pdfData={{
              ...commonPdfData,
              kondisi: extra.kondisi,
              keperluan: extra.keperluan,
              tinggi: extra.tinggi,
              berat: extra.berat,
              mata: extra.mata,
              gol_darah: extra.gol_darah,
              buta_warna: extra.buta_warna,
              tekanan_darah: extra.tekanan_darah,
            }}
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
      console.error('PDF generation failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Preview */}
      <Link href={`/dashboard/surat/${surat.id}`}>
        <Button variant="ghost" size="sm" title="Preview">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Button>
      </Link>

      {/* Edit */}
      <Link href={`/dashboard/surat/${surat.id}/edit`}>
        <Button variant="ghost" size="sm" title="Edit">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Button>
      </Link>

      {/* Download PDF */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        title="Download PDF"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {downloading ? (
          <svg className="w-4 h-4 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        title="Hapus"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors"
      >
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
