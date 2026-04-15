// ============================================
// DIAGNOSA KEPERAWATAN - DATA
// ============================================

export interface DiagnosaItem {
  kode: string;
  nama: string;
}

export interface DiagnosaKategori {
  label: string;
  value: string;
  items: DiagnosaItem[];
}

export const DIAGNOSA_KEPERAWATAN: DiagnosaKategori[] = [
  {
    label: 'Respirasi',
    value: 'respirasi',
    items: [
      { kode: 'D.0001', nama: 'Bersihan Jalan Napas Tidak Efektif' },
      { kode: 'D.0002', nama: 'Gangguan Penyapihan Ventilator' },
      { kode: 'D.0003', nama: 'Gangguan Pertukaran Gas' },
      { kode: 'D.0004', nama: 'Gangguan Ventilasi Spontan' },
      { kode: 'D.0005', nama: 'Pola Napas Tidak Efektif' },
      { kode: 'D.0006', nama: 'Risiko Aspirasi' },
    ],
  },
  {
    label: 'Sirkulasi',
    value: 'sirkulasi',
    items: [
      { kode: 'D.0007', nama: 'Gangguan Sirkulasi Spontan' },
      { kode: 'D.0008', nama: 'Penurunan Curah Jantung' },
      { kode: 'D.0009', nama: 'Perfusi Perifer Tidak Efektif' },
      { kode: 'D.0010', nama: 'Risiko Gangguan Sirkulasi Spontan' },
      { kode: 'D.0011', nama: 'Risiko Penurunan Curah Jantung' },
      { kode: 'D.0012', nama: 'Risiko Perfusi Gastrointestinal Tidak Efektif' },
      { kode: 'D.0013', nama: 'Risiko Perfusi Miokard Tidak Efektif' },
      { kode: 'D.0014', nama: 'Risiko Perfusi Perifer Tidak Efektif' },
      { kode: 'D.0015', nama: 'Risiko Perfusi Renal Tidak Efektif' },
      { kode: 'D.0016', nama: 'Risiko Perfusi Serebral Tidak Efektif' },
    ],
  },
  {
    label: 'Nutrisi dan Cairan',
    value: 'nutrisi_dan_cairan',
    items: [
      { kode: 'D.0017', nama: 'Berat Badan Lebih' },
      { kode: 'D.0018', nama: 'Defisit Nutrisi' },
      { kode: 'D.0019', nama: 'Diare' },
      { kode: 'D.0020', nama: 'Disfungsi Motilitas Gastrointestinal' },
      { kode: 'D.0022', nama: 'Hipervolemia' },
      { kode: 'D.0023', nama: 'Hipovolemia' },
      { kode: 'D.0024', nama: 'Ikterik Neonatus' },
      { kode: 'D.0025', nama: 'Kesiapan Peningkatan Keseimbangan Cairan' },
      { kode: 'D.0026', nama: 'Kesiapan Peningkatan Nutrisi' },
      { kode: 'D.0027', nama: 'Ketidakstabilan Kadar Glukosa Darah' },
      { kode: 'D.0028', nama: 'Menyusui Tidak Efektif' },
      { kode: 'D.0029', nama: 'Obesitas' },
      { kode: 'D.0030', nama: 'Risiko Berat Badan Lebih' },
      { kode: 'D.0031', nama: 'Risiko Defisit Nutrisi' },
      { kode: 'D.0032', nama: 'Risiko Disfungsi Motilitas Gastrointestinal' },
      { kode: 'D.0033', nama: 'Risiko Hipovolemia' },
      { kode: 'D.0034', nama: 'Risiko Ikterik Neonatus' },
      { kode: 'D.0035', nama: 'Risiko Ketidakseimbangan Cairan' },
      { kode: 'D.0036', nama: 'Risiko Ketidakseimbangan Elektrolit' },
      { kode: 'D.0037', nama: 'Risiko Ketidakstabilan Kadar Glukosa Darah' },
      { kode: 'D.0038', nama: 'Risiko Syok' },
    ],
  },
  {
    label: 'Eliminasi',
    value: 'eliminasi',
    items: [
      { kode: 'D.0040', nama: 'Gangguan Eliminasi Urin' },
      { kode: 'D.0041', nama: 'Inkontinensia Fekal' },
      { kode: 'D.0042', nama: 'Inkontinensia Urin Berlanjut' },
      { kode: 'D.0043', nama: 'Inkontinensia Urin Berlebih' },
      { kode: 'D.0044', nama: 'Inkontinensia Urin Fungsional' },
      { kode: 'D.0045', nama: 'Inkontinensia Urin Refleks' },
      { kode: 'D.0046', nama: 'Inkontinensia Urin Stres' },
      { kode: 'D.0047', nama: 'Inkontinensia Urin Urgensi' },
      { kode: 'D.0048', nama: 'Kesiapan Peningkatan Eliminasi Urin' },
      { kode: 'D.0049', nama: 'Konstipasi' },
      { kode: 'D.0050', nama: 'Retensi Urin' },
      { kode: 'D.0051', nama: 'Risiko Inkontinensia Urin Urgensi' },
      { kode: 'D.0052', nama: 'Risiko Konstipasi' },
    ],
  },
  {
    label: 'Aktivitas dan Istirahat',
    value: 'aktivitas_dan_istirahat',
    items: [
      { kode: 'D.0053', nama: 'Disorganisasi Perilaku Bayi' },
      { kode: 'D.0054', nama: 'Gangguan Mobilitas Fisik' },
      { kode: 'D.0055', nama: 'Gangguan Pola Tidur' },
      { kode: 'D.0056', nama: 'Intoleransi Aktivitas' },
      { kode: 'D.0057', nama: 'Keletihan' },
      { kode: 'D.0058', nama: 'Kesiapan Peningkatan Tidur' },
      { kode: 'D.0059', nama: 'Risiko Disorganisasi Perilaku Bayi' },
      { kode: 'D.0060', nama: 'Risiko Intoleransi Aktivitas' },
    ],
  },
  {
    label: 'Neurosensori',
    value: 'neurosensori',
    items: [
      { kode: 'D.0061', nama: 'Disrefleksia Otonom' },
      { kode: 'D.0062', nama: 'Gangguan Memori' },
      { kode: 'D.0063', nama: 'Gangguan Menelan' },
      { kode: 'D.0064', nama: 'Konfusi Akut' },
      { kode: 'D.0065', nama: 'Konfusi Kronis' },
      { kode: 'D.0066', nama: 'Penurunan Kapasitas Adaptif Intrakranial' },
      { kode: 'D.0067', nama: 'Risiko Disfungsi Neurovaskuler Perifer' },
      { kode: 'D.0068', nama: 'Risiko Konfusi Akut' },
    ],
  },
  {
    label: 'Reproduksi dan Seksualitas',
    value: 'reproduksi_dan_seksualitas',
    items: [
      { kode: 'D.0069', nama: 'Disfungsi Seksual' },
      { kode: 'D.0070', nama: 'Kesiapan Persalinan' },
      { kode: 'D.0071', nama: 'Pola Seksual Tidak Efektif' },
      { kode: 'D.0072', nama: 'Risiko Disfungsi Seksual' },
      { kode: 'D.0073', nama: 'Risiko Kehamilan Tidak Dikehendaki' },
    ],
  },
  {
    label: 'Nyeri dan Kenyamanan',
    value: 'nyeri_dan_kenyamanan',
    items: [
      { kode: 'D.0074', nama: 'Gangguan Rasa Nyaman' },
      { kode: 'D.0075', nama: 'Nyeri Akut' },
      { kode: 'D.0076', nama: 'Nyeri Kronis' },
      { kode: 'D.0077', nama: 'Nyeri Melahirkan' },
    ],
  },
  {
    label: 'Integritas Ego',
    value: 'integritas_ego',
    items: [
      { kode: 'D.0080', nama: 'Ansietas' },
      { kode: 'D.0081', nama: 'Berduka' },
      { kode: 'D.0082', nama: 'Distres Spiritual' },
      { kode: 'D.0083', nama: 'Gangguan Citra Tubuh' },
      { kode: 'D.0084', nama: 'Gangguan Identitas Diri' },
      { kode: 'D.0085', nama: 'Gangguan Persepsi Sensori' },
      { kode: 'D.0086', nama: 'Harga Diri Rendah Situasional' },
      { kode: 'D.0087', nama: 'Harga Diri Rendah Situasional' },
      { kode: 'D.0088', nama: 'Keputusasaan' },
      { kode: 'D.0089', nama: 'Kesiapan Peningkatan Konsep Diri' },
      { kode: 'D.0090', nama: 'Kesiapan Peningkatan Koping Keluarga' },
      { kode: 'D.0091', nama: 'Kesiapan Peningkatan Koping Komunitas' },
      { kode: 'D.0092', nama: 'Ketidakberdayaan' },
      { kode: 'D.0093', nama: 'Ketidakmampuan Koping Keluarga' },
      { kode: 'D.0094', nama: 'Koping Defensif' },
      { kode: 'D.0095', nama: 'Koping Komunitas Tidak Efektif' },
      { kode: 'D.0096', nama: 'Koping Tidak Efektif' },
      { kode: 'D.0097', nama: 'Penurunan Koping Keluarga' },
      { kode: 'D.0098', nama: 'Penampilan Peran Tidak Efektif' },
      { kode: 'D.0099', nama: 'Perilaku Kesehatan Cenderung Berisiko' },
      { kode: 'D.0100', nama: 'Risiko Distres Spiritual' },
      { kode: 'D.0101', nama: 'Risiko Harga Diri Rendah Kronis' },
      { kode: 'D.0102', nama: 'Risiko Harga Diri Rendah Situasional' },
      { kode: 'D.0103', nama: 'Risiko Ketidakberdayaan' },
      { kode: 'D.0104', nama: 'Sindrom Pasca Trauma' },
    ],
  },
];
