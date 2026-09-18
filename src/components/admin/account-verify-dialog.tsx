"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "gooey-toast";
import { usePeserta } from "@/context/peserta-context";
import { useMentor } from "@/context/mentor-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Mentor, Peserta } from "@/lib/types";

export type PendingAccount =
  | { kind: "peserta"; data: Peserta }
  | { kind: "mentor"; data: Mentor };

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

export function AccountVerifyDialog({ account }: { account: PendingAccount }) {
  const { setAkunStatus: setPesertaStatus } = usePeserta();
  const { setAkunStatus: setMentorStatus } = useMentor();

  const [open, setOpen] = useState(false);

  const { kind, data } = account;
  const id = kind === "peserta" ? data.id : data.id;
  const roleLabel = kind === "peserta" ? "Peserta Magang" : "Mentor";
  const initials = data.nama
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleDecision(decision: "disetujui" | "ditolak") {
    if (kind === "peserta") {
      setPesertaStatus(id, decision);
    } else {
      setMentorStatus(id, decision);
    }

    toast[decision === "disetujui" ? "success" : "warning"]({
      title: decision === "disetujui" ? "Akun disetujui" : "Akun ditolak",
      description: `Pendaftaran ${data.nama} sebagai ${roleLabel.toLowerCase()} telah diperbarui.`,
    });
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="secondary">
          <Icon icon="lucide:eye" className="size-3.5" />
          Review
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden data-[side=right]:w-full data-[side=right]:max-w-full data-[side=right]:sm:inset-y-4 data-[side=right]:sm:right-4 data-[side=right]:sm:h-[calc(100%-2rem)] data-[side=right]:sm:max-w-lg data-[side=right]:sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <div>
            <p className="text-base font-semibold text-ink">Verifikasi Akun</p>
            <p className="text-xs text-muted-foreground">Menunggu keputusan admin</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
          <div className="flex items-center justify-between rounded-2xl bg-surface-soft p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{data.nama}</p>
                <p className="truncate text-xs text-muted-foreground">{data.email}</p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-yellow/15 px-3 py-1 text-xs font-semibold whitespace-nowrap text-accent-yellow">
              <Icon icon="lucide:user-round" className="size-3.5" />
              {roleLabel}
            </span>
          </div>

          <div className="rounded-2xl bg-surface-soft p-4">
            {kind === "peserta" ? (
              <>
                <InfoRow label="Asal Instansi" value={data.asalInstansi} />
                <InfoRow label="Jurusan" value={data.jurusan} />
                <InfoRow label="Jenjang" value={data.jenjang} />
              </>
            ) : (
              <InfoRow label="NIP" value={data.nip} />
            )}
          </div>
        </div>

        <div className="flex gap-3 border-t border-hairline px-5 py-4">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => handleDecision("ditolak")}
          >
            <Icon icon="lucide:x" className="size-4" />
            Tolak
          </Button>
          <Button className="flex-1" onClick={() => handleDecision("disetujui")}>
            <Icon icon="lucide:check" className="size-4" />
            Setujui
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
