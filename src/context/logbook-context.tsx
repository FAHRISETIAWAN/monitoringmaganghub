"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorageState } from "@/lib/use-local-storage";
import { MOCK_LOGBOOK } from "@/lib/mock-data";
import type { LogbookEntry, LogbookStatus } from "@/lib/types";

const STORAGE_KEY = "magang-hub-logbook-entries";

type NewLogbookInput = {
  pesertaId: string;
  pesertaNama: string;
  divisi: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  aktivitas: string;
  output: string;
  lampiranUrl?: string;
  status?: Extract<LogbookStatus, "draft" | "pending">;
};

type LogbookContextValue = {
  entries: LogbookEntry[];
  addEntry: (input: NewLogbookInput) => LogbookEntry;
  setStatus: (
    id: string,
    status: LogbookStatus,
    payload: { catatanMentor?: string; ratingPeserta?: number; diverifikasiOleh: string }
  ) => void;
  rateMentor: (id: string, rating: number) => void;
};

const LogbookContext = createContext<LogbookContextValue | null>(null);

export function LogbookProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useLocalStorageState<LogbookEntry[]>(
    STORAGE_KEY,
    MOCK_LOGBOOK
  );

  const addEntry = useCallback(
    (input: NewLogbookInput) => {
      const entry: LogbookEntry = {
        id: `lb-${Date.now()}`,
        diperbaruiPada: new Date().toISOString(),
        ...input,
        status: input.status ?? "pending",
      };
      setEntries([entry, ...entries]);
      return entry;
    },
    [entries, setEntries]
  );

  const setStatus = useCallback<LogbookContextValue["setStatus"]>(
    (id, status, payload) => {
      setEntries(
        entries.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                status,
                catatanMentor: payload.catatanMentor,
                ratingPeserta: payload.ratingPeserta,
                diverifikasiOleh: payload.diverifikasiOleh,
                diperbaruiPada: new Date().toISOString(),
              }
            : entry
        )
      );
    },
    [entries, setEntries]
  );

  const rateMentor = useCallback(
    (id: string, rating: number) => {
      setEntries(
        entries.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                ratingMentor: rating,
                diperbaruiPada: new Date().toISOString(),
              }
            : entry
        )
      );
    },
    [entries, setEntries]
  );

  const value = useMemo(
    () => ({ entries, addEntry, setStatus, rateMentor }),
    [entries, addEntry, setStatus, rateMentor]
  );

  return (
    <LogbookContext.Provider value={value}>{children}</LogbookContext.Provider>
  );
}

export function useLogbook() {
  const ctx = useContext(LogbookContext);
  if (!ctx) throw new Error("useLogbook must be used within LogbookProvider");
  return ctx;
}
