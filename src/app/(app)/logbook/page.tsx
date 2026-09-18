"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/auth-context";
import { useLogbook } from "@/context/logbook-context";
import { usePeserta } from "@/context/peserta-context";
import { BULAN_ID, formatTanggalID } from "@/lib/date";
import { stripHtml } from "@/lib/html";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/logbook/status-badge";
import { AddLogbookDialog } from "@/components/logbook/add-logbook-dialog";
import { VerifyLogbookDialog } from "@/components/logbook/verify-logbook-dialog";
import { RateMentorDialog } from "@/components/logbook/rate-mentor-dialog";
import { CatatanMentorDialog } from "@/components/logbook/catatan-mentor-dialog";
import { LogbookCard } from "@/components/logbook/logbook-card";
import {
  LogbookFilterDialog,
  type FilterValue,
} from "@/components/logbook/logbook-filter-dialog";

const PAGE_SIZE = 20;

export default function LogbookPage() {
  const { user } = useAuth();
  const { entries } = useLogbook();
  const { peserta: pesertaList } = usePeserta();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>("semua");
  const [monthFilter, setMonthFilter] = useState("semua");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user && user.role === "admin") {
      router.replace("/verifikasi-akun");
    }
  }, [user, router]);

  const isMentor = user?.role === "mentor";
  const mentorNama = pesertaList.find((p) => p.id === user?.pesertaId)?.mentorNama;

  const roleScoped = useMemo(
    () =>
      isMentor
        ? entries.filter((e) => e.status !== "draft")
        : entries.filter((e) => e.pesertaId === user?.pesertaId),
    [entries, isMentor, user?.pesertaId]
  );

  const months = useMemo(() => {
    const unique = new Set(roleScoped.map((e) => e.tanggal.slice(0, 7)));
    return [...unique].sort((a, b) => (a < b ? 1 : -1));
  }, [roleScoped]);

  const scoped = useMemo(() => {
    const sorted = [...roleScoped].sort((a, b) =>
      a.diperbaruiPada < b.diperbaruiPada ? 1 : -1
    );
    const byMonth =
      monthFilter === "semua"
        ? sorted
        : sorted.filter((e) => e.tanggal.startsWith(monthFilter));
    const byStatus =
      filter === "semua" ? byMonth : byMonth.filter((e) => e.status === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter(
      (e) =>
        e.pesertaNama.toLowerCase().includes(q) ||
        stripHtml(e.aktivitas).toLowerCase().includes(q) ||
        stripHtml(e.output).toLowerCase().includes(q) ||
        e.divisi.toLowerCase().includes(q)
    );
  }, [roleScoped, filter, monthFilter, query]);

  const totalPages = Math.max(1, Math.ceil(scoped.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = scoped.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterChange(next: FilterValue) {
    setFilter(next);
    setPage(1);
  }

  function handleMonthChange(next: string) {
    setMonthFilter(next);
    setPage(1);
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    setPage(1);
  }

  if (!user || user.role === "admin") return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[32px] leading-tight font-semibold tracking-tight text-ink">
            Logbook Kegiatan
          </h1>
          <p className="mt-1 text-sm text-body">
            {isMentor
              ? "Tinjau dan verifikasi logbook seluruh peserta magang."
              : "Catat aktivitas harian Anda selama magang."}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto">
            <Icon
              icon="lucide:search"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Cari logbook..."
              className="h-11 w-full rounded-full border border-input bg-transparent py-2 pr-4 pl-10 text-sm text-ink outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:border-2 sm:w-56"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={monthFilter} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-11! min-w-0 flex-1 gap-2 rounded-full border-input px-4 sm:w-auto sm:flex-none">
                <Icon icon="lucide:calendar" className="size-4 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Semua Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Bulan</SelectItem>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {BULAN_ID[Number(m.slice(5, 7)) - 1]} {m.slice(0, 4)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isMentor && <AddLogbookDialog />}
            <LogbookFilterDialog value={filter} onApply={handleFilterChange} />
          </div>
        </div>
      </div>

      {scoped.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-16 text-center">
          <Icon icon="lucide:notebook-pen" className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {query.trim()
              ? "Tidak ada logbook yang cocok dengan pencarian."
              : "Belum ada logbook pada kategori ini."}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl bg-card lg:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isMentor && <TableHead>Peserta</TableHead>}
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jam</TableHead>
                    <TableHead>Aktivitas</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Status</TableHead>
                    {!isMentor && <TableHead>Catatan</TableHead>}
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((entry) => (
                    <TableRow key={entry.id}>
                      {isMentor && (
                        <TableCell className="font-medium text-ink">
                          <p>{entry.pesertaNama}</p>
                          <p className="text-xs text-muted-foreground">{entry.divisi}</p>
                        </TableCell>
                      )}
                      <TableCell className="whitespace-nowrap">
                        {formatTanggalID(entry.tanggal)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-numeric text-sm">
                        {entry.jamMulai}–{entry.jamSelesai}
                      </TableCell>
                      <TableCell className="max-w-64">
                        <p className="line-clamp-2 text-sm text-body">
                          {stripHtml(entry.aktivitas)}
                        </p>
                        {entry.lampiranUrl && (
                          <a
                            href={entry.lampiranUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            <Icon icon="lucide:paperclip" className="size-3" />
                            Lampiran
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="max-w-56">
                        <p className="line-clamp-2 text-sm text-body">
                          {stripHtml(entry.output)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={entry.status} />
                      </TableCell>
                      {!isMentor && (
                        <TableCell>
                          <CatatanMentorDialog entry={entry} />
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        {isMentor ? (
                          <VerifyLogbookDialog entry={entry} />
                        ) : (
                          entry.status === "verified" &&
                          mentorNama && (
                            <RateMentorDialog entry={entry} mentorNama={mentorNama} />
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:hidden">
            {paged.map((entry) => (
              <LogbookCard
                key={entry.id}
                entry={entry}
                isMentor={isMentor}
                mentorNama={mentorNama}
              />
            ))}
          </div>

          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
