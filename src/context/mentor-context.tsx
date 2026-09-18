"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorageState } from "@/lib/use-local-storage";
import { MOCK_MENTORS } from "@/lib/mock-data";
import type { AkunStatus, Mentor } from "@/lib/types";

const STORAGE_KEY = "magang-hub-mentors";

type RegisterMentorInput = {
  email: string;
  password: string;
  nip: string;
};

type MentorContextValue = {
  mentors: Mentor[];
  findByEmail: (email: string) => Mentor | undefined;
  registerMentor: (input: RegisterMentorInput) => Mentor;
  setAkunStatus: (id: string, status: AkunStatus, catatanAdmin?: string) => void;
};

const MentorContext = createContext<MentorContextValue | null>(null);

export function MentorProvider({ children }: { children: React.ReactNode }) {
  const [mentors, setMentors] = useLocalStorageState<Mentor[]>(
    STORAGE_KEY,
    MOCK_MENTORS
  );

  const findByEmail = useCallback(
    (email: string) =>
      mentors.find((m) => m.email.toLowerCase() === email.toLowerCase()),
    [mentors]
  );

  const registerMentor = useCallback(
    (input: RegisterMentorInput) => {
      const nama = input.email
        .split("@")[0]
        .replace(/[._]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const newMentor: Mentor = {
        id: `m-${Date.now()}`,
        nama,
        email: input.email.trim().toLowerCase(),
        password: input.password,
        nip: input.nip.trim(),
        akunStatus: "pending",
      };

      setMentors([newMentor, ...mentors]);
      return newMentor;
    },
    [mentors, setMentors]
  );

  const setAkunStatus = useCallback(
    (id: string, status: AkunStatus, catatanAdmin?: string) => {
      setMentors(
        mentors.map((m) =>
          m.id === id ? { ...m, akunStatus: status, catatanAdmin } : m
        )
      );
    },
    [mentors, setMentors]
  );

  const value = useMemo(
    () => ({ mentors, findByEmail, registerMentor, setAkunStatus }),
    [mentors, findByEmail, registerMentor, setAkunStatus]
  );

  return (
    <MentorContext.Provider value={value}>{children}</MentorContext.Provider>
  );
}

export function useMentor() {
  const ctx = useContext(MentorContext);
  if (!ctx) throw new Error("useMentor must be used within MentorProvider");
  return ctx;
}
