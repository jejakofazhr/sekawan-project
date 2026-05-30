// ============================================
// REKAM MEDIS - TYPE DEFINITIONS
// ============================================

export interface Patient {
  id: string;
  no_reg: string;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  no_telepon?: string;
  created_at: string;
  updated_at: string;
}

export interface ObatItem {
  nama: string;
  dosis: string;
  aturan_pakai: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  tanggal_kunjungan: string;

  // Anamnesa
  keluhan_utama?: string;
  riwayat_penyakit_sekarang?: string;
  riwayat_penyakit_terdahulu?: string;
  riwayat_penyakit_keluarga?: string;

  // Vital Signs
  tekanan_darah?: string;
  nadi?: string;
  suhu?: string;
  respirasi?: string;
  saturasi?: string;

  // Diagnosa
  diagnosa?: string;
  icd_10?: string;
  keterangan_diagnosa?: string;

  // Tindakan
  tindakan: string[];

  // Edukasi
  edukasi?: string;

  // Obat
  obat: ObatItem[];

  // Status
  status: 'draft' | 'selesai';

  created_at: string;
  updated_at: string;

  // Joined
  patient?: Patient;
}

export interface Surat {
  id: string;
  medical_record_id?: string;
  patient_id: string;
  jenis: 'surat_sakit' | 'surat_dokter';
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  keterangan?: string;
  nama_dokter?: string;
  created_at: string;

  // Joined
  patient?: Patient;
  medical_record?: MedicalRecord;
}

export interface AllowedEmail {
  id: string;
  email: string;
  created_at: string;
}

// Form types for multi-step form
export interface PatientFormData {
  no_reg: string;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan' | '';
  alamat: string;
  no_telepon: string;
}

export interface MedicalRecordFormData {
  patient_id: string;
  // Anamnesa
  keluhan_utama: string;
  riwayat_penyakit_sekarang: string;
  riwayat_penyakit_terdahulu: string;
  riwayat_penyakit_keluarga: string;
  // Vital Signs
  tekanan_darah: string;
  nadi: string;
  suhu: string;
  respirasi: string;
  saturasi: string;
  // Diagnosa
  diagnosa: string;
  icd_10: string;
  keterangan_diagnosa: string;
  // Tindakan
  tindakan: string[];
  // Edukasi
  edukasi: string;
  // Obat
  obat: ObatItem[];
}

export interface SuratFormData {
  patient_id: string;
  medical_record_id: string;
  jenis: 'surat_sakit' | 'surat_dokter';
  tanggal_mulai: string;
  tanggal_selesai: string;
  keterangan: string;
  nama_dokter: string;
}

// Dashboard stats
export interface DashboardStats {
  totalPatients: number;
  totalRecords: number;
  todayVisits: number;
  totalSurat: number;
}
