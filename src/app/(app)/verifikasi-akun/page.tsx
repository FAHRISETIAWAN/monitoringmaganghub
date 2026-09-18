"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/auth-context";
import { usePeserta } from "@/context/peserta-context";
import { useMentor } from "@/context/mentor-context";
import {
  AccountVerifyDialog,
  type PendingAccount,
} from "@/components/admin/account-verify-dialog";

export default function VerifikasiAkunPage() {
  const { user } = useAuth();
  const { peserta } = usePeserta();
  const { mentors } = useMentor();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/login");
    }
  }, [user, router]);

  const pending: PendingAccount[] = useMemo(() => {
    const pesertaPending: PendingAccount[] = peserta
      .filter((p) => p.akunStatus === "pending")
      .map((data) => ({ kind: "peserta", data }));
    const mentorPending: PendingAccount[] = mentors
      .filter((m) => m.akunStatus === "pending")
      .map((data) => ({ kind: "mentor", data }));
    return [...pesertaPending, ...mentorPending];
  }, [peserta, mentors]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px] leading-tight font-semibold tracking-tight text-ink">
          Verifikasi Akun
        </h1>
        <p className="mt-1 text-sm text-body">
          Tinjau pendaftaran peserta magang dan mentor yang menunggu persetujuan.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl bg-card">
        {pending.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Icon icon="lucide:user-check" className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Tidak ada pendaftaran yang menunggu verifikasi.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {pending.map((account) => {
              const key = `${account.kind}-${account.data.id}`;
              const roleLabel = account.kind === "peserta" ? "Peserta Magang" : "Mentor";
              const initials = account.data.nama
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <li key={key} className="flex items-center gap-4 px-6 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-semibold text-ink">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink">{account.data.nama}</p>
                      <span className="shrink-0 rounded-full bg-accent-yellow/15 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-accent-yellow">
                        {roleLabel}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {account.data.email}
                    </p>
                  </div>
                  <AccountVerifyDialog account={account} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
