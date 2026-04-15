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
  bold: { fontFamily: 'Helvetica-Bold' },
  nbSection: { marginTop: 16 },
  nbRow: { flexDirection: 'row', marginBottom: 3 },
  nbPrefix: { width: 30, color: '#000' },
  nbLabel: { width: 100, color: '#000' },
  nbSeparator: { width: 15, color: '#000' },
  nbValue: { flex: 1, color: '#000' },
  footer: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
  signBlock: { width: 200, textAlign: 'center' },
  signDate: { marginBottom: 60, fontSize: 10, textAlign: 'left' },
  signName: { fontSize: 11 },
});

interface SuratDokterPDFProps {
  patient: Patient;
  pdfData: {
    nama_dokter: string;
    pekerjaan: string;
    kondisi: 'SEHAT' | 'TIDAK SEHAT';
    keperluan: string;
    tinggi: string;
    berat: string;
    mata: string;
    gol_darah: string;
    buta_warna: string;
    tekanan_darah: string;
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

export default function SuratDokterPDF({ patient, pdfData }: SuratDokterPDFProps) {
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
        <Text style={styles.suratTitle}>SURAT KETERANGAN DOKTER</Text>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.paragraph}>
            Yang bertanda tangan dibawah ini telah memeriksa :
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

          {/* Kondisi */}
          <View style={{ marginTop: 12, marginBottom: 4 }}>
            <Text>
              Pada pemeriksaan kami dapatkan kondisi berbadan{' '}
              <Text style={styles.bold}>
                {pdfData.kondisi === 'SEHAT' ? 'SEHAT' : 'TIDAK SEHAT'}
              </Text>
            </Text>
          </View>

          {/* Keperluan */}
          <View style={{ marginBottom: 10 }}>
            <Text>Surat ini dipergunakan untuk keperluan :</Text>
            <Text style={{ marginTop: 4 }}>
              {pdfData.keperluan || '.................................................................'}
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Supaya dapat dipergunakan sebagaimana mestinya.
          </Text>

          {/* NB Section and Signature side by side */}
          <View style={styles.footer}>
            {/* NB */}
            <View style={{ flex: 1 }}>
              <View style={styles.nbRow}>
                <Text style={styles.nbPrefix}>NB :</Text>
                <Text style={styles.nbLabel}>Tinggi</Text>
                <Text style={styles.nbSeparator}>:</Text>
                <Text style={styles.nbValue}>{pdfData.tinggi || '..........'}</Text>
              </View>
              <View style={styles.nbRow}>
                <Text style={styles.nbPrefix}></Text>
                <Text style={styles.nbLabel}>Berat</Text>
                <Text style={styles.nbSeparator}>:</Text>
                <Text style={styles.nbValue}>{pdfData.berat || '..........'}</Text>
              </View>
              <View style={styles.nbRow}>
                <Text style={styles.nbPrefix}></Text>
                <Text style={styles.nbLabel}>Mata</Text>
                <Text style={styles.nbSeparator}>:</Text>
                <Text style={styles.nbValue}>{pdfData.mata || '..........'}</Text>
              </View>
              <View style={styles.nbRow}>
                <Text style={styles.nbPrefix}></Text>
                <Text style={styles.nbLabel}>Gol. Darah</Text>
                <Text style={styles.nbSeparator}>:</Text>
                <Text style={styles.nbValue}>{pdfData.gol_darah || '..........'}</Text>
              </View>
              <View style={styles.nbRow}>
                <Text style={styles.nbPrefix}></Text>
                <Text style={styles.nbLabel}>Buta warna</Text>
                <Text style={styles.nbSeparator}>:</Text>
                <Text style={styles.nbValue}>{pdfData.buta_warna || '..........'}</Text>
              </View>
              <View style={styles.nbRow}>
                <Text style={styles.nbPrefix}></Text>
                <Text style={styles.nbLabel}>Tekanan darah</Text>
                <Text style={styles.nbSeparator}>:</Text>
                <Text style={styles.nbValue}>{pdfData.tekanan_darah || '..........'}</Text>
              </View>
            </View>

            {/* Signature */}
            <View style={styles.signBlock}>
              <Text style={styles.signDate}>
                Banyumas, {formatDate(pdfData.created_at || new Date().toISOString())}
              </Text>
              <Text style={styles.signName}>
                {pdfData.nama_dokter ? `dr. ${pdfData.nama_dokter}` : 'dr. ..................'}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
