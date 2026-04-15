// ============================================
// DAFTAR OBAT - Static Drug List
// ============================================

export interface ObatCategory {
  kategori: string;
  items: string[];
}

export const OBAT_LIST: ObatCategory[] = [
  {
    kategori: 'Anti Asam',
    items: ['Omeprazol', 'Lansoprazol', 'Cimetidine', 'Ranitidine', 'Sucralfate', 'Antasida'],
  },
  {
    kategori: 'Antibiotik',
    items: ['Amoxicillin', 'Cefadroxil', 'Erythromycin', 'Ciprofloxacin', 'Metronidazole', 'Cotrimoxazole', 'Cefixime', 'Doxycycline'],
  },
  {
    kategori: 'Anti Alergi',
    items: ['Cetirizine', 'Loratadine', 'CTM', 'Dexamethasone', 'Methylprednisolone'],
  },
  {
    kategori: 'Anti Mual/Nyeri',
    items: ['Ondansetron', 'Domperidone', 'Metoclopramide', 'Paracetamol', 'Ibuprofen', 'Asam Mefenamat', 'Ketorolac', 'Tramadol'],
  },
  {
    kategori: 'Anti Diare',
    items: ['Loperamide', 'Attapulgite', 'Zinc'],
  },
  {
    kategori: 'Anti Inflamasi',
    items: ['Dexamethasone', 'Methylprednisolone', 'Piroxicam', 'Meloxicam', 'Diclofenac'],
  },
  {
    kategori: 'Obat Saluran Napas',
    items: ['Salbutamol', 'Aminophylline', 'Bromhexine', 'Ambroxol', 'N-Acetylcysteine', 'Pseudoephedrine'],
  },
  {
    kategori: 'Obat Batuk',
    items: ['Codein', 'Dextromethorphan', 'OBH', 'Guaifenesin'],
  },
  {
    kategori: 'Vitamin',
    items: ['Vitamin B Complex', 'Vitamin B1', 'Vitamin B6', 'Vitamin B12', 'Vitamin C', 'Zinc', 'Vitamin D'],
  },
  {
    kategori: 'Obat Mata',
    items: ['Cendo Xitrol', 'Insto', 'Cendo Lyteers'],
  },
  {
    kategori: 'Obat Kulit',
    items: ['Bioplacenton', 'Hidrocortisone', 'Gentamicin cream', 'Ketoconazole cream', 'Miconazole'],
  },
  {
    kategori: 'Obat Telinga',
    items: ['Otopain', 'Tarivid Otic'],
  },
  {
    kategori: 'Obat Jantung',
    items: ['Amlodipine', 'Captopril', 'Bisoprolol', 'Furosemide', 'Spironolactone', 'Candesartan'],
  },
  {
    kategori: 'Obat Saraf',
    items: ['Gabapentin', 'Carbamazepine', 'Amitriptyline', 'Alprazolam', 'Diazepam'],
  },
  {
    kategori: 'Obat DM',
    items: ['Metformin', 'Glimepiride', 'Glibenclamide', 'Acarbose'],
  },
  {
    kategori: 'Obat Saluran Kemih',
    items: ['Flavoxate'],
  },
  {
    kategori: 'Cairan Infus',
    items: ['NaCl 0.9%', 'Ringer Laktat', 'Dextrose 5%', 'KaEN 3B'],
  },
];

// Flat list of all drug names
export const ALL_OBAT_NAMES: string[] = OBAT_LIST.flatMap((cat) => cat.items);

// Daftar tindakan medis
export const TINDAKAN_LIST: string[] = [
  'Pemeriksaan fisik',
  'Pemeriksaan darah lengkap',
  'Pemeriksaan urine',
  'Perawatan luka',
  'Rawat jalan',
  'Suntik',
  'Infus RL',
  'Infus NaCl',
  'Nebulizer',
  'EKG',
  'Rontgen',
  'USG',
  'Hecting / Jahit luka',
  'Insisi abses',
  'Pemasangan kateter',
  'Pemasangan NGT',
  'Ganti verband',
  'Observasi',
  'Konsultasi spesialis',
];
