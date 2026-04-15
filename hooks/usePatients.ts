'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Patient, PatientFormData } from '@/types/medical-record';

export function usePatients() {
  const supabase = createClient();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(
          `nama.ilike.%${search}%,no_reg.ilike.%${search}%,alamat.ilike.%${search}%`
        );
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setPatients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data pasien');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const getPatientById = useCallback(async (id: string): Promise<Patient | null> => {
    const { data, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      setError(fetchError.message);
      return null;
    }
    return data;
  }, [supabase]);

  const createPatient = useCallback(async (patientData: PatientFormData): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('patients')
        .insert([{
          no_reg: patientData.no_reg,
          nama: patientData.nama,
          tanggal_lahir: patientData.tanggal_lahir,
          jenis_kelamin: patientData.jenis_kelamin,
          alamat: patientData.alamat,
          no_telepon: patientData.no_telepon || null,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      setPatients((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambahkan pasien');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updatePatient = useCallback(async (id: string, patientData: Partial<PatientFormData>): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('patients')
        .update({ ...patientData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setPatients((prev) => prev.map((p) => (p.id === id ? data : p)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupdate pasien');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const deletePatient = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setPatients((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus pasien');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const generateRegNumber = useCallback(async (): Promise<string> => {
    const { count } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    const nextNum = (count || 0) + 1;
    return `REG-${String(nextNum).padStart(3, '0')}`;
  }, [supabase]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    generateRegNumber,
    setError,
  };
}
