// ============================================
// SURAT PDF HELPERS - Shared types & utilities
// ============================================

export interface PdfExtraData {
  pekerjaan: string;
  // Surat Sakit
  diagnosa_text: string;
  lama_istirahat: string;
  // Surat Dokter
  kondisi: 'SEHAT' | 'TIDAK SEHAT';
  keperluan: string;
  tinggi: string;
  berat: string;
  mata: string;
  gol_darah: string;
  buta_warna: string;
  tekanan_darah: string;
}

export const INITIAL_PDF_EXTRA: PdfExtraData = {
  pekerjaan: '',
  diagnosa_text: '',
  lama_istirahat: '',
  kondisi: 'SEHAT',
  keperluan: '',
  tinggi: '',
  berat: '',
  mata: '',
  gol_darah: '',
  buta_warna: '',
  tekanan_darah: '',
};

/** Parse the keterangan JSON field from the DB back into PdfExtraData */
export function parseSuratKeterangan(keterangan?: string | null): PdfExtraData {
  if (!keterangan) return { ...INITIAL_PDF_EXTRA };
  try {
    const parsed = JSON.parse(keterangan);
    return { ...INITIAL_PDF_EXTRA, ...parsed };
  } catch {
    return { ...INITIAL_PDF_EXTRA };
  }
}
