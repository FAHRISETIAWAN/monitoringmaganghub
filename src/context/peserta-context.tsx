"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorageState } from "@/lib/use-local-storage";
import { MOCK_PESERTA } from "@/lib/mock-data";
import { todayISODate } from "@/lib/date";
import type { AkunStatus, Peserta } from "@/lib/types";

const STORAGE_KEY = "magang-hub-peserta";

type RegisterInput = {
  email: string;
  password: string;
  universitas: string;
  jurusan: string;
};

type PesertaContextValue = {
  peserta: Peserta[];
  findByEmail: (email: string) => Peserta | undefined;
  registerPeserta: (input: RegisterInput) => Peserta;
  setAkunStatus: (id: string, status: AkunStatus, catatanAdmin?: string) => void;
};

const PesertaContext = createContext<PesertaContextValue | null>(null);

export function PesertaProvider({ children }: { children: React.ReactNode }) {
  const [peserta, setPeserta] = useLocalStorageState<Peserta[]>(
    STORAGE_KEY,
    MOCK_PESERTA
  );

  const findByEmail = useCallback(
    (email: string) =>
      peserta.find((p) => p.email.toLowerCase() === email.toLowerCase()),
    [peserta]
  );

  const registerPeserta = useCallback(
    (input: RegisterInput) => {
      const nama = input.email
        .split("@")[0]
        .replace(/[._]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const newPeserta: Peserta = {
        id: `p-${Date.now()}`,
        nama,
        email: input.email.trim().toLowerCase(),
        password: input.password,
        asalInstansi: input.universitas.trim(),
        jurusan: input.jurusan.trim(),
        jenjang: "Mahasiswa",
        divisi: "Menunggu Penempatan",
        mentorNama: "Belum ditentukan",
        periodeMulai: todayISODate(),
        periodeSelesai: todayISODate(),
        status: "aktif",
        akunStatus: "pending",
      };

      setPeserta([newPeserta, ...peserta]);
      return newPeserta;
    },
    [peserta, setPeserta]
  );

  const setAkunStatus = useCallback(
    (id: string, status: AkunStatus, catatanAdmin?: string) => {
      setPeserta(
        peserta.map((p) =>
          p.id === id ? { ...p, akunStatus: status, catatanAdmin } : p
        )
      );
    },
    [peserta, setPeserta]
  );

  const value = useMemo(
    () => ({ peserta, findByEmail, registerPeserta, setAkunStatus }),
    [peserta, findByEmail, registerPeserta, setAkunStatus]
  );

  return (
    <PesertaContext.Provider value={value}>{children}</PesertaContext.Provider>
  );
}

export function usePeserta() {
  const ctx = useContext(PesertaContext);
  if (!ctx) throw new Error("usePeserta must be used within PesertaProvider");
  return ctx;
}
