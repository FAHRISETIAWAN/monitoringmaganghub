import { Icon } from "@iconify/react";
import { formatTanggalID } from "@/lib/date";
import type { Peserta } from "@/lib/types";

export function PesertaCard({ peserta }: { peserta: Peserta }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-semibold text-ink">
          {peserta.nama
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{peserta.nama}</p>
          <p className="text-xs text-muted-foreground">{peserta.jenjang}</p>
        </div>
        <span
          className={
            peserta.status === "aktif"
              ? "ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-up/10 px-3 py-1 text-xs font-semibold text-up"
              : "ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold text-body"
          }
        >
          <Icon
            icon={peserta.status === "aktif" ? "lucide:circle-dot" : "lucide:circle-check"}
            className="size-3.5"
          />
          {peserta.status === "aktif" ? "Aktif" : "Selesai"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-hairline pt-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Asal Instansi</p>
          <p className="text-body">{peserta.asalInstansi}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Jurusan</p>
          <p className="text-body">{peserta.jurusan}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Divisi</p>
          <p className="text-body">{peserta.divisi}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Mentor</p>
          <p className="text-body">{peserta.mentorNama}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground">Periode</p>
          <p className="text-body">
            {formatTanggalID(peserta.periodeMulai)} – {formatTanggalID(peserta.periodeSelesai)}
          </p>
        </div>
      </div>
    </div>
  );
}
