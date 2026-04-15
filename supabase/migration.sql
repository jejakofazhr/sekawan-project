
CREATE TABLE IF NOT EXISTS allowed_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel pasien
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no_reg TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  alamat TEXT NOT NULL,
  no_telepon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel rekam medis (1 kunjungan = 1 record)
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  tanggal_kunjungan TIMESTAMPTZ DEFAULT now(),

  -- Anamnesa
  keluhan_utama TEXT,
  riwayat_penyakit_sekarang TEXT,
  riwayat_penyakit_terdahulu TEXT,
  riwayat_penyakit_keluarga TEXT,

  -- Diagnosa
  diagnosa TEXT,
  icd_10 TEXT,
  keterangan_diagnosa TEXT,

  -- Tindakan (array of strings)
  tindakan TEXT[] DEFAULT '{}',

  -- Edukasi
  edukasi TEXT,

  -- Obat (JSONB array: [{nama, dosis, aturan_pakai}])
  obat JSONB DEFAULT '[]',

  -- Status
  status TEXT DEFAULT 'selesai' CHECK (status IN ('draft', 'selesai')),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel surat
CREATE TABLE IF NOT EXISTS surat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medical_record_id UUID REFERENCES medical_records(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  jenis TEXT NOT NULL CHECK (jenis IN ('surat_sakit', 'surat_dokter')),
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  keterangan TEXT,
  nama_dokter TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_emails ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can do everything
CREATE POLICY "auth_all_patients" ON patients
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_all_medical_records" ON medical_records
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_all_surat" ON surat
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_read_allowed_emails" ON allowed_emails
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: 3 Dummy Patients
-- ============================================
INSERT INTO patients (no_reg, nama, tanggal_lahir, jenis_kelamin, alamat, no_telepon) VALUES
  ('REG-001', 'Ahmad Rizky Pratama', '1990-05-15', 'Laki-laki', 'Jl. Merdeka No. 45, Jakarta Selatan', '081234567890'),
  ('REG-002', 'Siti Nurhaliza', '1985-11-22', 'Perempuan', 'Jl. Sudirman No. 12, Bandung', '082345678901'),
  ('REG-003', 'Budi Santoso', '1978-03-08', 'Laki-laki', 'Jl. Gatot Subroto No. 88, Surabaya', '083456789012');

-- Seed: dummy medical records for each patient
INSERT INTO medical_records (patient_id, keluhan_utama, riwayat_penyakit_sekarang, riwayat_penyakit_terdahulu, diagnosa, icd_10, tindakan, edukasi, obat)
SELECT id,
  'Demam tinggi selama 3 hari',
  'Pasien datang dengan keluhan demam tinggi disertai sakit kepala dan nyeri otot',
  'Tidak ada riwayat penyakit sebelumnya',
  'Demam Dengue', 'A90',
  ARRAY['Pemeriksaan darah lengkap', 'Infus RL'],
  'Istirahat cukup, minum air putih minimal 2 liter per hari, segera ke IGD jika terjadi pendarahan',
  '[{"nama":"Paracetamol","dosis":"500mg","aturan_pakai":"3x1 sesudah makan"},{"nama":"Vitamin C","dosis":"500mg","aturan_pakai":"1x1 sesudah makan pagi"}]'::jsonb
FROM patients WHERE no_reg = 'REG-001';

INSERT INTO medical_records (patient_id, keluhan_utama, riwayat_penyakit_sekarang, riwayat_penyakit_terdahulu, diagnosa, icd_10, tindakan, edukasi, obat)
SELECT id,
  'Batuk berdahak selama 1 minggu',
  'Batuk disertai dahak berwarna kuning kehijauan, sesak napas ringan',
  'Riwayat asma pada masa kecil',
  'Bronkitis Akut', 'J20.9',
  ARRAY['Nebulizer', 'Pemeriksaan fisik'],
  'Hindari asap rokok dan polusi udara, istirahat cukup, minum air hangat',
  '[{"nama":"Ambroxol","dosis":"30mg","aturan_pakai":"3x1 sesudah makan"},{"nama":"Amoxicillin","dosis":"500mg","aturan_pakai":"3x1 sesudah makan"},{"nama":"Salbutamol","dosis":"2mg","aturan_pakai":"3x1 jika sesak"}]'::jsonb
FROM patients WHERE no_reg = 'REG-002';

INSERT INTO medical_records (patient_id, keluhan_utama, riwayat_penyakit_sekarang, riwayat_penyakit_terdahulu, diagnosa, icd_10, tindakan, edukasi, obat)
SELECT id,
  'Nyeri ulu hati',
  'Nyeri ulu hati sejak 2 hari lalu, memberat setelah makan pedas dan kopi',
  'Riwayat maag kronis',
  'Gastritis', 'K29.7',
  ARRAY['Pemeriksaan fisik'],
  'Makan teratur 3x sehari, hindari makanan pedas, asam, dan kafein, jangan telat makan',
  '[{"nama":"Omeprazol","dosis":"20mg","aturan_pakai":"1x1 sebelum makan pagi"},{"nama":"Sucralfate","dosis":"500mg","aturan_pakai":"3x1 sebelum makan"},{"nama":"Domperidone","dosis":"10mg","aturan_pakai":"3x1 sebelum makan"}]'::jsonb
FROM patients WHERE no_reg = 'REG-003';
