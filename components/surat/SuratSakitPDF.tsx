'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Patient } from '@/types/medical-record';

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11 },
  headerBox: {
    borderBottom: '2px solid #000',
    paddingBottom: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  headerKlinik: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  headerKlinikBlue: { color: '#0000CC' },
  headerKlinikRed: { color: '#CC0000', fontFamily: 'Helvetica-BoldOblique' },
  headerAlamat: { fontSize: 9, color: '#333', marginBottom: 1 },
  suratTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  body: { marginBottom: 10, lineHeight: 1.8 },
  paragraph: { marginBottom: 8, lineHeight: 1.6 },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 100, color: '#000' },
  separator: { width: 15, color: '#000' },
  value: { flex: 1, color: '#000' },
  valueDots: { flex: 1, color: '#666' },
  bold: { fontFamily: 'Helvetica-Bold' },
  footer: { marginTop: 30, flexDirection: 'row', justifyContent: 'flex-end' },
  signBlock: { width: 200, textAlign: 'center' },
  signDate: { marginBottom: 60, fontSize: 10, textAlign: 'left' },
  signName: { fontSize: 11 },
});

interface SuratSakitPDFProps {
  patient: Patient;
  pdfData: {
    nama_dokter: string;
    pekerjaan: string;
    diagnosa_text: string;
    lama_istirahat: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    created_at: string;
  };
}

function calculateAge(tanggalLahir: string): string {
  const birth = new Date(tanggalLahir);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age} tahun`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function SuratSakitPDF({ patient, pdfData }: SuratSakitPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.headerKlinik}>
            <Text style={styles.headerKlinikBlue}>KLINIK </Text>
            <Text style={styles.headerKlinikRed}>SEKAWAN SEJAHTERA</Text>
          </Text>
          <Text style={styles.headerAlamat}>Jalan Raya Banyumas-Banjarnegara Km7</Text>
          <Text style={styles.headerAlamat}>Somakaton Somagede Banyumas</Text>
        </View>

        {/* Title */}
        <Text style={styles.suratTitle}>SURAT KETERANGAN SAKIT</Text>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.paragraph}>
            Yang bertanda tangan dibawah ini menerangkan bahwa :
          </Text>

          {/* Patient Info */}
          <View style={styles.row}>
            <Text style={styles.label}>Nama</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{patient.nama}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Umur</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{calculateAge(patient.tanggal_lahir)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pekerjaan</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{pdfData.pekerjaan || '.................................'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{patient.alamat}</Text>
          </View>

          {/* Diagnosa */}
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <Text>{pdfData.diagnosa_text || '.................................'}</Text>
          </View>

          {/* Istirahat */}
          <Text style={styles.paragraph}>
            Perlu istirahat selama {pdfData.lama_istirahat || '......'} hari
          </Text>
          <Text style={styles.paragraph}>
            sejak tanggal {pdfData.tanggal_mulai ? formatDate(pdfData.tanggal_mulai) : '...............'} s.d. {pdfData.tanggal_selesai ? formatDate(pdfData.tanggal_selesai) : '...............'}
          </Text>

          {/* Closing */}
          <Text style={{ ...styles.paragraph, marginTop: 16 }}>
            Demikian surat kami buat dengan sesungguhnya
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.footer}>
          <View style={styles.signBlock}>
            <Text style={styles.signDate}>
              Banyumas, {formatDate(pdfData.created_at || new Date().toISOString())}
            </Text>
            <Text style={styles.signName}>
              {pdfData.nama_dokter ? `dr. ${pdfData.nama_dokter}` : 'dr. ..................'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
