
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

  -- Obat (JSONB array: [{nama, aturan_pakai}])
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
-- MASTER DATA TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS master_diagnosa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS master_tindakan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS master_obat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE master_diagnosa ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_tindakan ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_obat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_master_diagnosa" ON master_diagnosa
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_all_master_tindakan" ON master_tindakan
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_all_master_obat" ON master_obat
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- SEED: Master Diagnosa (155 Diagnosa)
-- ============================================
INSERT INTO master_diagnosa (nama) VALUES
  ('Abortus spontan komplit'),
  ('Abortus insipiens/mengancam'),
  ('Abortus spontan inkomplit'),
  ('Alergi makanan'),
  ('Anemia defisiensi besi'),
  ('Anemia defisiensi besi pada kehamilan'),
  ('Angina pectoris'),
  ('Apendisitis akut'),
  ('Artritis osteoarthritis'),
  ('Artritis rheumatoid'),
  ('Askariasis'),
  ('Asma bronkial'),
  ('Astigmatisma ringan'),
  ('Bells palsy'),
  ('Benda asing di hidung'),
  ('Benda asing di konjungtiva'),
  ('Blefaritis'),
  ('Bronchitis akut'),
  ('Buta senja / rabun senja'),
  ('Cardiorespiratory arrest'),
  ('Cutaneous larva migran'),
  ('Delirium (dengan/tnp intox.alkohol/drug)'),
  ('Demam dengue, DHF'),
  ('Demam tifoid'),
  ('Dementia'),
  ('Dermatitis atopic (kecuali recalcitrant)'),
  ('Dermatitis kontak alergika'),
  ('Dermatitis kontak iritan'),
  ('Dermatitis numularis'),
  ('Dermatitis seboroik'),
  ('Tinea kapitis'),
  ('Tinea barbae'),
  ('Tinea fasialis'),
  ('Tinea korporis'),
  ('Tinea manus'),
  ('Tinea unguium'),
  ('Tinea kruris'),
  ('Tinea pedis'),
  ('Diabetes mellitus tipe 1'),
  ('Diabetes mellitus tipe 2'),
  ('Disentri basiler dan amuba'),
  ('Dyslipidemia'),
  ('Eklampsia'),
  ('Epilepsy'),
  ('Epistaksis'),
  ('Exanthematous drug eruption'),
  ('Fixed drug eruption'),
  ('Faringitis'),
  ('Filariasis'),
  ('Flour albus/ vaginal discharge non-GO'),
  ('Fraktur terbuka, tertutup'),
  ('Furunkel di hidung'),
  ('Gagal jantung akut'),
  ('Gagal jantung kronik'),
  ('Gangguan campuran anxietas dan depresi'),
  ('Gangguan psikotik'),
  ('Gastritis'),
  ('Gastroenteritis (kolera, giardiasis)'),
  ('Glaucoma akut'),
  ('Gonore'),
  ('Hemoroid grade 1,2'),
  ('Hepatitis A'),
  ('Hepatitis B'),
  ('Herpes simpleks tanpa komplikasi'),
  ('Herpes zoster tanpa komplikasi'),
  ('Hyperemesis gravidarum'),
  ('Hiperglikemia hyperosmolar non ketotik'),
  ('Hipermetropia ringan'),
  ('Hipertensi esensial'),
  ('Hiperurisemia (gout)'),
  ('Hipoglikemia ringan'),
  ('HIV AIDS tanpa komplikasi'),
  ('Hordeolum'),
  ('Infark miokard'),
  ('Infark serebral / stroke'),
  ('Infeksi pada umbilikal'),
  ('Infeksi saluran kemih'),
  ('Influenza'),
  ('Insomnia'),
  ('Intoleransi makanan'),
  ('Kandidiasis mulut'),
  ('Katarak'),
  ('Kehamilan normal'),
  ('Kejang demam'),
  ('Keracunan makanan'),
  ('Ketuban pecah dini (KPD)'),
  ('Kolesistitis'),
  ('Konjungtivitis'),
  ('Laryngitis'),
  ('Lepra'),
  ('Leptospirosis (tanpa komplikasi)'),
  ('Liken simplek kronis/neurodermatitis'),
  ('Limfadenitis'),
  ('Lipoma'),
  ('Lka bakar derajat 1,2'),
  ('Malabsorbsi makanan'),
  ('Malaria'),
  ('Malnutrisi energy-protein'),
  ('Mastitis'),
  ('Mata kering'),
  ('Migraine'),
  ('Miliaria'),
  ('Myopia ringan'),
  ('Moluskum kontangiosum'),
  ('Morbili tanpa komplikasi'),
  ('Napkin eczema (diaper rash)'),
  ('Obesitas'),
  ('Otitis eksterna'),
  ('Otitis media akut'),
  ('Parotitis'),
  ('Pedikulosis kapitis'),
  ('Penyakit cacing tambang'),
  ('Perdarahan saluran cerna bagian atas'),
  ('Perdarahan saluran cerna bagian bawah'),
  ('Perdarahan post partum'),
  ('Perdarahan subkonjungtiva'),
  ('Peritonitis'),
  ('Pertussis'),
  ('Persalinan lama'),
  ('Pitiriasis rosea'),
  ('Pioderma'),
  ('Pitiriasis versikolor'),
  ('Pneumonia aspirasi'),
  ('Pneumonia, bronkopneumonia'),
  ('Polimialgia reumatik'),
  ('Pre-eklampsia'),
  ('Presbiopia'),
  ('Rabies'),
  ('Reaksi anafilaktik'),
  ('Reaksi gigitan serangga (insect bite)'),
  ('Refluks gastroesofageal (GERD)'),
  ('Rhinitis akut'),
  ('Rhinitis alergika'),
  ('Rhinitis vasomotor'),
  ('Rupture perineum grade 1,2'),
  ('Serumen prop'),
  ('Sifilis'),
  ('Scabies'),
  ('Skistosomiasis'),
  ('Status epileptikus'),
  ('Strongiloidiasis'),
  ('Syok (septik, hipovolemik, kardiogenik, neurogenic)'),
  ('Taeniasis'),
  ('Takikardia'),
  ('Tension headache'),
  ('Tetanus'),
  ('Tiroktosikosis'),
  ('Tonsillitis'),
  ('Tuberculosis paru tanpa komplikasi'),
  ('Urtikaria (akut dan kronis)'),
  ('Vaginitis'),
  ('Varisela tanpa komplikasi'),
  ('Vertigo (BPPV)'),
  ('Veruka vulgaris'),
  ('Vulvitis')
ON CONFLICT (nama) DO NOTHING;

-- ============================================
-- SEED: Master Tindakan Medis
-- ============================================
INSERT INTO master_tindakan (nama) VALUES
  ('Pemeriksaan fisik'),
  ('Pemeriksaan darah lengkap'),
  ('Pemeriksaan urine'),
  ('Perawatan luka'),
  ('Rawat jalan'),
  ('Suntik'),
  ('Infus RL'),
  ('Infus NaCl'),
  ('Nebulizer'),
  ('EKG'),
  ('Rontgen'),
  ('USG'),
  ('Hecting / Jahit luka'),
  ('Insisi abses'),
  ('Pemasangan kateter'),
  ('Pemasangan NGT'),
  ('Ganti verband'),
  ('Observasi'),
  ('Konsultasi spesialis')
ON CONFLICT (nama) DO NOTHING;

-- ============================================
-- SEED: Master Obat (flat list, tanpa kategori)
-- ============================================
INSERT INTO master_obat (nama) VALUES
  ('Omeprazol'),
  ('Lansoprazol'),
  ('Cimetidine'),
  ('Ranitidine'),
  ('Sucralfate'),
  ('Antasida'),
  ('Amoxicillin'),
  ('Cefadroxil'),
  ('Erythromycin'),
  ('Ciprofloxacin'),
  ('Metronidazole'),
  ('Cotrimoxazole'),
  ('Cefixime'),
  ('Doxycycline'),
  ('Cetirizine'),
  ('Loratadine'),
  ('CTM'),
  ('Dexamethasone'),
  ('Methylprednisolone'),
  ('Ondansetron'),
  ('Domperidone'),
  ('Metoclopramide'),
  ('Paracetamol'),
  ('Ibuprofen'),
  ('Asam Mefenamat'),
  ('Ketorolac'),
  ('Tramadol'),
  ('Loperamide'),
  ('Attapulgite'),
  ('Zinc'),
  ('Piroxicam'),
  ('Meloxicam'),
  ('Diclofenac'),
  ('Salbutamol'),
  ('Aminophylline'),
  ('Bromhexine'),
  ('Ambroxol'),
  ('N-Acetylcysteine'),
  ('Pseudoephedrine'),
  ('Codein'),
  ('Dextromethorphan'),
  ('OBH'),
  ('Guaifenesin'),
  ('Vitamin B Complex'),
  ('Vitamin B1'),
  ('Vitamin B6'),
  ('Vitamin B12'),
  ('Vitamin C'),
  ('Vitamin D'),
  ('Cendo Xitrol'),
  ('Insto'),
  ('Cendo Lyteers'),
  ('Bioplacenton'),
  ('Hidrocortisone'),
  ('Gentamicin cream'),
  ('Ketoconazole cream'),
  ('Miconazole'),
  ('Otopain'),
  ('Tarivid Otic'),
  ('Amlodipine'),
  ('Captopril'),
  ('Bisoprolol'),
  ('Furosemide'),
  ('Spironolactone'),
  ('Candesartan'),
  ('Gabapentin'),
  ('Carbamazepine'),
  ('Amitriptyline'),
  ('Alprazolam'),
  ('Diazepam'),
  ('Metformin'),
  ('Glimepiride'),
  ('Glibenclamide'),
  ('Acarbose'),
  ('Flavoxate'),
  ('NaCl 0.9%'),
  ('Ringer Laktat'),
  ('Dextrose 5%'),
  ('KaEN 3B')
ON CONFLICT (nama) DO NOTHING;

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
