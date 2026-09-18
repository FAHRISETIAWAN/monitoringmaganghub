"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "gooey-toast";
import { useAuth } from "@/context/auth-context";
import { useLogbook } from "@/context/logbook-context";
import { usePeserta } from "@/context/peserta-context";
import { formatTanggalID, hariFromISODate, todayISODate } from "@/lib/date";
import { isHtmlEmpty } from "@/lib/html";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeInput } from "@/components/ui/time-input";
import { StatusBadge } from "@/components/logbook/status-badge";
import { cn } from "@/lib/utils";
import type { LogbookEntry } from "@/lib/types";

const TIME_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

function ReceiptRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

export function AddLogbookDialog() {
  const { user } = useAuth();
  const { addEntry } = useLogbook();
  const { peserta: pesertaList } = usePeserta();
  const peserta = pesertaList.find((p) => p.id === user?.pesertaId);

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState<LogbookEntry | null>(null);
  const [tanggal, setTanggal] = useState(todayISODate());
  const [jamMulai, setJamMulai] = useState("08:00");
  const [jamSelesai, setJamSelesai] = useState("16:00");
  const [aktivitas, setAktivitas] = useState("");
  const [output, setOutput] = useState("");
  const [lampiranUrl, setLampiranUrl] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user || !peserta) return null;

  const trimmedLampiranUrl = lampiranUrl.trim();
  const isFormComplete =
    TIME_FORMAT.test(jamMulai) &&
    TIME_FORMAT.test(jamSelesai) &&
    jamSelesai > jamMulai &&
    !isHtmlEmpty(aktivitas) &&
    !isHtmlEmpty(output) &&
    (!trimmedLampiranUrl || /^https?:\/\//i.test(trimmedLampiranUrl));

  function resetForm() {
    setTanggal(todayISODate());
    setJamMulai("08:00");
    setJamSelesai("16:00");
    setAktivitas("");
    setOutput("");
    setLampiranUrl("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSubmitted(null);
      resetForm();
    }
  }

  function handleSave(status: "draft" | "pending") {
    if (!peserta) return;

    if (!TIME_FORMAT.test(jamMulai) || !TIME_FORMAT.test(jamSelesai)) {
      toast.error({
        title: "Format jam tidak valid",
        description: "Gunakan format 24 jam, contoh 08:00.",
      });
      return;
    }
    if (jamSelesai <= jamMulai) {
      toast.error({
        title: "Jam tidak valid",
        description: "Jam selesai harus setelah jam mulai.",
      });
      return;
    }
    if (status === "pending" && (isHtmlEmpty(aktivitas) || isHtmlEmpty(output))) {
      toast.error({
        title: "Lengkapi data logbook",
        description: "Aktivitas dan output wajib diisi sebelum dipublikasikan.",
      });
      return;
    }
    const trimmedLampiran = lampiranUrl.trim();
    if (trimmedLampiran && !/^https?:\/\//i.test(trimmedLampiran)) {
      toast.error({
        title: "URL lampiran tidak valid",
        description: "Gunakan tautan yang diawali http:// atau https://",
      });
      return;
    }

    setSaving(true);
    const entry = addEntry({
      pesertaId: peserta.id,
      pesertaNama: peserta.nama,
      divisi: peserta.divisi,
      tanggal,
      jamMulai,
      jamSelesai,
      aktivitas,
      output,
      lampiranUrl: trimmedLampiran || undefined,
      status,
    });

    toast.success({
      title:
        status === "draft"
          ? "Logbook disimpan sebagai draft"
          : "Logbook berhasil dipublikasikan",
      description:
        status === "draft"
          ? "Anda dapat melanjutkan dan mempublikasikannya nanti."
          : "Menunggu verifikasi dari mentor Anda.",
    });
    setSubmitted(entry);
    setSaving(false);
  }

  const isDraftResult = submitted?.status === "draft";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="shrink-0">
          <Icon icon="lucide:plus" className="size-4" />
          <span className="hidden sm:inline">Tambah Logbook</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col data-[side=right]:w-full data-[side=right]:max-w-full data-[side=right]:sm:max-w-full">
        {submitted ? (
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center overflow-y-auto px-6 py-10 text-center">
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-full",
                isDraftResult ? "bg-surface-strong text-muted-foreground" : "bg-up/15 text-up"
              )}
            >
              <Icon icon={isDraftResult ? "lucide:file-edit" : "lucide:check"} className="size-8" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-ink">
              {isDraftResult
                ? "Logbook disimpan sebagai draft"
                : "Logbook berhasil dipublikasikan"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isDraftResult
                ? "Anda dapat melanjutkan dan mempublikasikannya nanti."
                : "Menunggu verifikasi dari mentor Anda."}
            </p>

            <div className="mt-6 flex w-full flex-col gap-4 rounded-2xl bg-surface-soft p-5 text-left">
              <ReceiptRow label="Tanggal" value={formatTanggalID(submitted.tanggal)} />
              <ReceiptRow
                label="Jam"
                value={`${submitted.jamMulai}–${submitted.jamSelesai}`}
              />
              <ReceiptRow label="Divisi" value={submitted.divisi} />
              {submitted.lampiranUrl && (
                <ReceiptRow
                  label="Lampiran"
                  value={
                    <a
                      href={submitted.lampiranUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Lihat tautan
                      <Icon icon="lucide:external-link" className="size-3.5" />
                    </a>
                  }
                />
              )}
              <ReceiptRow label="Status" value={<StatusBadge status={submitted.status} />} />
            </div>

            <Button
              className="mt-8 w-full"
              size="lg"
              onClick={() => handleOpenChange(false)}
            >
              Tutup
            </Button>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Tambah Logbook Harian</SheetTitle>
              <SheetDescription>
                Catat aktivitas magang hari ini untuk direview oleh mentor.
              </SheetDescription>
            </SheetHeader>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tanggal">Tanggal</Label>
                    <DatePicker
                      id="tanggal"
                      value={tanggal}
                      max={todayISODate()}
                      onChange={setTanggal}
                    />
                    <p className="text-xs text-muted-foreground">
                      Hari: {hariFromISODate(tanggal)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="jamMulai">Jam mulai</Label>
                    <TimeInput id="jamMulai" value={jamMulai} onChange={setJamMulai} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="jamSelesai">Jam selesai</Label>
                    <TimeInput
                      id="jamSelesai"
                      value={jamSelesai}
                      onChange={setJamSelesai}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="aktivitas">Aktivitas</Label>
                  <RichTextEditor
                    id="aktivitas"
                    value={aktivitas}
                    onChange={setAktivitas}
                    placeholder="Jelaskan kegiatan yang dilakukan hari ini"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="output">Output</Label>
                  <RichTextEditor
                    id="output"
                    value={output}
                    onChange={setOutput}
                    placeholder="Hasil atau capaian dari aktivitas tersebut"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="lampiranUrl">Lampiran (URL)</Label>
                  <div className="relative">
                    <Icon
                      icon="lucide:link"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="lampiranUrl"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={lampiranUrl}
                      onChange={(e) => setLampiranUrl(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Opsional. Tautan dokumen, foto, atau bukti pendukung lainnya.
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-3 p-4 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  disabled={saving || !isFormComplete}
                  onClick={() => handleSave("draft")}
                >
                  <Icon icon="lucide:file-edit" className="size-4" />
                  Draft
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={saving || !isFormComplete}
                  onClick={() => handleSave("pending")}
                >
                  <Icon icon="lucide:send" className="size-4" />
                  Publish
                </Button>
              </div>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
