'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { MedicalRecord } from '@/types/medical-record';

export function useMedicalRecords() {
  const supabase = createClient();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (filters?: {
    search?: string;
    patientId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('medical_records')
        .select('*, patient:patients(*)')
        .order('tanggal_kunjungan', { ascending: false });

      if (filters?.patientId) {
        query = query.eq('patient_id', filters.patientId);
      }
      if (filters?.search) {
        query = query.or(
          `diagnosa.ilike.%${filters.search}%,keluhan_utama.ilike.%${filters.search}%,icd_10.ilike.%${filters.search}%`
        );
      }
      if (filters?.startDate) {
        query = query.gte('tanggal_kunjungan', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('tanggal_kunjungan', filters.endDate);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data rekam medis');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const getRecordById = useCallback(async (id: string): Promise<MedicalRecord | null> => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('medical_records')
        .select('*, patient:patients(*)')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createRecord = useCallback(async (recordData: Partial<MedicalRecord>): Promise<MedicalRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const { patient, ...dataToInsert } = recordData;
      void patient;
      const { data, error: insertError } = await supabase
        .from('medical_records')
        .insert([dataToInsert])
        .select('*, patient:patients(*)')
        .single();

      if (insertError) throw insertError;
      setRecords((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat rekam medis');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updateRecord = useCallback(async (id: string, recordData: Partial<MedicalRecord>): Promise<MedicalRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const { patient, ...dataToUpdate } = recordData;
      void patient;
      const { data, error: updateError } = await supabase
        .from('medical_records')
        .update({ ...dataToUpdate, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, patient:patients(*)')
        .single();

      if (updateError) throw updateError;
      setRecords((prev) => prev.map((r) => (r.id === id ? data : r)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupdate rekam medis');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setRecords((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus rekam medis');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    records,
    loading,
    error,
    fetchRecords,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
    setError,
  };
}
