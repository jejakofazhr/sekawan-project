'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DashboardStats, MedicalRecord } from '@/types/medical-record';

export function useDashboardStats() {
  const supabase = createClient();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalRecords: 0,
    todayVisits: 0,
    totalSurat: 0,
  });
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // Get total patients
      const { count: patientCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Get total records
      const { count: recordCount } = await supabase
        .from('medical_records')
        .select('*', { count: 'exact', head: true });

      // Get today's visits
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('medical_records')
        .select('*', { count: 'exact', head: true })
        .gte('tanggal_kunjungan', today.toISOString());

      // Get total surat
      const { count: suratCount } = await supabase
        .from('surat')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalPatients: patientCount || 0,
        totalRecords: recordCount || 0,
        todayVisits: todayCount || 0,
        totalSurat: suratCount || 0,
      });

      // Get recent records
      const { data: recent } = await supabase
        .from('medical_records')
        .select('*, patient:patients(*)')
        .order('tanggal_kunjungan', { ascending: false })
        .limit(5);

      setRecentRecords(recent || []);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    stats,
    recentRecords,
    loading,
    fetchStats,
  };
}
