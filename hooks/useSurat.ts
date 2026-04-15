'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Surat, SuratFormData } from '@/types/medical-record';

export function useSurat() {
  const supabase = createClient();
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuratList = useCallback(async (filters?: {
    patientId?: string;
    jenis?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('surat')
        .select('*, patient:patients(*), medical_record:medical_records(*)')
        .order('created_at', { ascending: false });

      if (filters?.patientId) {
        query = query.eq('patient_id', filters.patientId);
      }
      if (filters?.jenis) {
        query = query.eq('jenis', filters.jenis);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setSuratList(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data surat');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createSurat = useCallback(async (suratData: SuratFormData): Promise<Surat | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('surat')
        .insert([{
          patient_id: suratData.patient_id,
          medical_record_id: suratData.medical_record_id || null,
          jenis: suratData.jenis,
          tanggal_mulai: suratData.tanggal_mulai || null,
          tanggal_selesai: suratData.tanggal_selesai || null,
          keterangan: suratData.keterangan || null,
          nama_dokter: suratData.nama_dokter || null,
        }])
        .select('*, patient:patients(*), medical_record:medical_records(*)')
        .single();

      if (insertError) throw insertError;
      setSuratList((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat surat');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const deleteSurat = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('surat')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSuratList((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus surat');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const getSuratById = useCallback(async (id: string): Promise<Surat | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('surat')
        .select('*, patient:patients(*), medical_record:medical_records(*)')
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;
      return data;
    } catch {
      return null;
    }
  }, [supabase]);

  const updateSurat = useCallback(async (id: string, suratData: SuratFormData): Promise<Surat | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('surat')
        .update({
          tanggal_mulai: suratData.tanggal_mulai || null,
          tanggal_selesai: suratData.tanggal_selesai || null,
          keterangan: suratData.keterangan || null,
          nama_dokter: suratData.nama_dokter || null,
        })
        .eq('id', id)
        .select('*, patient:patients(*), medical_record:medical_records(*)')
        .single();
      if (updateError) throw updateError;
      setSuratList((prev) => prev.map((s) => (s.id === id ? data : s)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupdate surat');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    suratList,
    loading,
    error,
    fetchSuratList,
    createSurat,
    updateSurat,
    deleteSurat,
    getSuratById,
    setError,
  };
}
