"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "gooey-toast";
import { useAuth } from "@/context/auth-context";
import { useLogbook } from "@/context/logbook-context";
import { formatTanggalID } from "@/lib/date";
import { isHtmlEmpty } from "@/lib/html";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { EmojiRating } from "@/components/ui/emoji-rating";
import { StatusBadge } from "@/components/logbook/status-badge";
import type { LogbookEntry } from "@/lib/types";

function InfoBlock({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: string;
  iconClassName: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-soft p-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconClassName
        )}
      >
        <Icon icon={icon} className="size-4.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

export function VerifyLogbookDialog({ entry }: { entry: LogbookEntry }) {
  const { user } = useAuth();
  const { setStatus } = useLogbook();

  const [open, setOpen] = useState(false);
  const [catatan, setCatatan] = useState(entry.catatanMentor ?? "");
  const [catatanOpen, setCatatanOpen] = useState(false);
  const [rating, setRating] = useState(entry.ratingPeserta ?? 0);

  if (!user) return null;

  const initials = entry.pesertaNama
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setCatatan(entry.catatanMentor ?? "");
      setCatatanOpen(false);
      setRating(entry.ratingPeserta ?? 0);
    }
  }

  function handleDecision(decision: "verified" | "revisi") {
    if (decision === "revisi" && isHtmlEmpty(catatan)) {
      setCatatanOpen(true);
      toast.error({
        title: "Catatan wajib diisi",
        description: "Jelaskan apa yang perlu diperbaiki peserta.",
      });
      return;
    }

    setStatus(entry.id, decision, {
      catatanMentor: isHtmlEmpty(catatan) ? undefined : catatan,
      ratingPeserta: rating > 0 ? rating : undefined,
      diverifikasiOleh: user!.name,
    });

    toast[decision === "verified" ? "success" : "warning"]({
      title:
        decision === "verified"
          ? "Logbook terverifikasi"
          : "Logbook dikembalikan untuk revisi",
      description: `Logbook ${entry.pesertaNama} tanggal ${formatTanggalID(entry.tanggal)} telah diperbarui.`,
    });
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm" variant="secondary">
          <Icon icon="lucide:eye" className="size-3.5" />
          Review
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden data-[side=right]:w-full data-[side=right]:max-w-full data-[side=right]:sm:inset-y-4 data-[side=right]:sm:right-4 data-[side=right]:sm:h-[calc(100%-2rem)] data-[side=right]:sm:max-w-2xl data-[side=right]:sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <div>
            <p className="text-base font-semibold text-ink">Detail Logbook</p>
            <p className="text-xs text-muted-foreground">
              ID {entry.id} · {formatTanggalID(entry.tanggal)}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
          <div className="flex items-center justify-between rounded-2xl bg-surface-soft p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{entry.pesertaNama}</p>
                <p className="truncate text-xs text-muted-foreground">{entry.divisi}</p>
              </div>
            </div>
            <StatusBadge status={entry.status} />
          </div>

          {entry.status === "pending" && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
              <Icon icon="lucide:info" className="size-4 shrink-0" />
              Logbook ini menunggu keputusan Anda.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <InfoBlock
              icon="lucide:calendar"
              iconClassName="bg-primary/10 text-primary"
              label="Tanggal"
              value={formatTanggalID(entry.tanggal)}
            />
            <InfoBlock
              icon="lucide:clock"
              iconClassName="bg-accent-yellow/15 text-accent-yellow"
              label="Jam"
              value={`${entry.jamMulai}–${entry.jamSelesai}`}
            />
          </div>

          {entry.lampiranUrl && (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-soft p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-up/10 text-up">
                  <Icon icon="lucide:paperclip" className="size-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Lampiran</p>
                  <p className="truncate text-sm font-semibold text-ink">
                    {entry.lampiranUrl}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <a href={entry.lampiranUrl} target="_blank" rel="noopener noreferrer">
                  Buka
                </a>
              </Button>
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon icon="lucide:list-checks" className="size-4" />
                </span>
                <span className="mt-1 w-px flex-1 bg-hairline" />
              </div>
              <div className="min-w-0 flex-1 pb-5">
                <p className="pt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Aktivitas
                </p>
                <div
                  className="mt-1 text-sm text-body [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: entry.aktivitas }}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-up/10 text-up">
                  <Icon icon="lucide:target" className="size-4" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="pt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Output
                </p>
                <div
                  className="mt-1 text-sm text-body [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: entry.output }}
                />
              </div>
            </div>
          </div>

          <Collapsible open={catatanOpen} onOpenChange={setCatatanOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl bg-surface-soft px-4 py-3 text-left transition-colors hover:bg-surface-strong">
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <Icon icon="lucide:message-square-text" className="size-4 text-muted-foreground" />
                Catatan mentor
                <span className="text-xs font-normal text-muted-foreground">
                  (opsional untuk verifikasi)
                </span>
                {!isHtmlEmpty(catatan) && (
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                )}
              </span>
              <Icon
                icon="lucide:chevron-down"
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  catatanOpen && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-0">
              <div className="pt-2">
                <Label htmlFor="catatan" className="sr-only">
                  Catatan mentor
                </Label>
                <RichTextEditor
                  id="catatan"
                  value={catatan}
                  onChange={setCatatan}
                  placeholder="Tulis catatan atau umpan balik untuk peserta"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-soft px-4 py-5">
            <span className="text-sm font-medium text-ink">Rating peserta</span>
            <EmojiRating value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-hairline px-5 py-4">
          <div className="flex gap-3">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleDecision("revisi")}
            >
              <Icon icon="lucide:rotate-ccw" className="size-4" />
              Minta Revisi
            </Button>
            <Button className="flex-1" onClick={() => handleDecision("verified")}>
              <Icon icon="lucide:check" className="size-4" />
              Verifikasi
            </Button>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon="lucide:info" className="size-3.5 shrink-0" />
            Catatan wajib diisi jika logbook dikembalikan untuk revisi.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
