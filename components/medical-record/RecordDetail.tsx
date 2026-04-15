'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { DIAGNOSA_KEPERAWATAN } from '@/data/diagnosa-keperawatan';
import type { MedicalRecord } from '@/types/medical-record';

function getKategoriKeperawatan(keterangan: string | undefined): string {
  if (!keterangan) return '-';
  for (const kat of DIAGNOSA_KEPERAWATAN) {
    const found = kat.items.find(
      (item) => `${item.kode}: ${item.nama}` === keterangan
    );
    if (found) return kat.label;
  }
  return '-';
}

interface RecordDetailProps {
  record: MedicalRecord;
}

export default function RecordDetail({ record }: RecordDetailProps) {
  const sections = [
    {
      title: 'Identitas Pasien',
      icon: '👤',
      items: record.patient
        ? [
            { label: 'No. Registrasi', value: record.patient.no_reg },
            { label: 'Nama', value: record.patient.nama },
            { label: 'Tanggal Lahir', value: new Date(record.patient.tanggal_lahir).toLocaleDateString('id-ID') },
            { label: 'Jenis Kelamin', value: record.patient.jenis_kelamin },
            { label: 'Alamat', value: record.patient.alamat },
            { label: 'No. Telepon', value: record.patient.no_telepon || '-' },
          ]
        : [],
    },
    {
      title: 'Anamnesa',
      icon: '📋',
      items: [
        { label: 'Keluhan Utama', value: record.keluhan_utama || '-' },
        { label: 'Riwayat Penyakit Sekarang', value: record.riwayat_penyakit_sekarang || '-' },
        { label: 'Riwayat Penyakit Terdahulu', value: record.riwayat_penyakit_terdahulu || '-' },
        { label: 'Riwayat Penyakit Keluarga', value: record.riwayat_penyakit_keluarga || '-' },
      ],
    },
    {
      title: 'Diagnosa',
      icon: '🔬',
      items: [
        { label: 'Diagnosa Medis', value: record.diagnosa || '-' },
        { label: 'Kode ICD-10', value: record.icd_10 || '-' },
        { label: 'Diagnosa Keperawatan', value: getKategoriKeperawatan(record.keterangan_diagnosa) },
        { label: 'Jenis', value: record.keterangan_diagnosa || '-' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(record.tanggal_kunjungan).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge variant={record.status === 'selesai' ? 'success' : 'warning'}>
          {record.status === 'selesai' ? 'Selesai' : 'Draft'}
        </Badge>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">
              {section.icon} {section.title}
            </h4>
          </div>
          <div className="px-5 py-3 divide-y divide-gray-50">
            {section.items.map((item) => (
              <div key={item.label} className="flex py-2.5">
                <span className="text-sm text-gray-500 w-48 shrink-0">{item.label}</span>
                <span className="text-sm text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tindakan */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700">💉 Tindakan</h4>
        </div>
        <div className="px-5 py-3">
          {record.tindakan && record.tindakan.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {record.tindakan.map((t) => (
                <Badge key={t} variant="info">{t}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Tidak ada tindakan</p>
          )}
        </div>
      </div>

      {/* Edukasi */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700">📖 Edukasi</h4>
        </div>
        <div className="px-5 py-3">
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {record.edukasi || 'Tidak ada edukasi'}
          </p>
        </div>
      </div>

      {/* Obat */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700">💊 Resep Obat</h4>
        </div>
        <div className="px-5 py-3">
          {record.obat && record.obat.length > 0 ? (
            <div className="space-y-3">
              {record.obat.map((obat, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{obat.nama}</p>
                    <p className="text-xs text-gray-500">
                      {obat.dosis} — {obat.aturan_pakai}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Tidak ada obat diresepkan</p>
          )}
        </div>
      </div>
    </div>
  );
}
