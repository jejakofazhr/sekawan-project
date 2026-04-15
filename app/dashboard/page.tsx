'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function DashboardPage() {
  const { stats, recentRecords, loading, fetchStats } = useDashboardStats();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang di Sekawan Project — Sistem Rekam Medis
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pasien"
          value={loading ? '—' : stats.totalPatients}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Rekam Medis"
          value={loading ? '—' : stats.totalRecords}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Kunjungan Hari Ini"
          value={loading ? '—' : stats.todayVisits}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Total Surat"
          value={loading ? '—' : stats.totalSurat}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
        />
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Rekam Medis Terbaru</h2>
          <Link
            href="/dashboard/rekam-medis"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Pasien</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Diagnosa</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">ICD-10</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tanggal</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-32 rounded" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-24 rounded" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-16 rounded" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-20 rounded" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-16 rounded" /></td>
                  </tr>
                ))
              ) : recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {record.patient?.nama || '-'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {record.patient?.no_reg || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.diagnosa || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {record.icd_10 || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(record.tanggal_kunjungan).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={record.status === 'selesai' ? 'success' : 'warning'}>
                        {record.status === 'selesai' ? 'Selesai' : 'Draft'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    Belum ada data rekam medis
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/pasien"
          className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Tambah Pasien</p>
              <p className="text-xs text-gray-400">Daftarkan pasien baru</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/rekam-medis/baru"
          className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-green-200 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Buat Rekam Medis</p>
              <p className="text-xs text-gray-400">Catat kunjungan baru</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/surat/baru"
          className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Buat Surat</p>
              <p className="text-xs text-gray-400">Surat sakit / dokter</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
