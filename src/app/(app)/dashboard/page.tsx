"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/auth-context";
import { useLogbook } from "@/context/logbook-context";
import {
  formatTanggalID,
  hariSingkatFromISODate,
  lastNDaysISODate,
  todayISODate,
} from "@/lib/date";
import { stripHtml } from "@/lib/html";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityBarChart } from "@/components/dashboard/activity-bar-chart";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { StatusBadge } from "@/components/logbook/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
  const { user } = useAuth();
  const { entries } = useLogbook();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === "admin") {
      router.replace("/verifikasi-akun");
    }
  }, [user, router]);

  if (!user || user.role === "admin") return null;

  const isMentor = user.role === "mentor";
  const scopedEntries = (
    isMentor ? entries : entries.filter((e) => e.pesertaId === user.pesertaId)
  ).filter((e) => e.status !== "draft");

  const today = todayISODate();

  const totalLogbook = scopedEntries.length;
  const menungguVerifikasi = scopedEntries.filter((e) => e.status === "pending").length;
  const terverifikasiCount = scopedEntries.filter((e) => e.status === "verified").length;
  const revisiCount = scopedEntries.filter((e) => e.status === "revisi").length;

  const weeklyData = lastNDaysISODate(7).map((iso) => ({
    label: hariSingkatFromISODate(iso),
    value: scopedEntries.filter((e) => e.tanggal === iso).length,
    isToday: iso === today,
  }));

  const recent = [...scopedEntries]
    .sort((a, b) => (a.diperbaruiPada < b.diperbaruiPada ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <div>
        {/* <span className="inline-flex items-center rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold tracking-wide text-body uppercase">
          {isMentor ? "Dasbor Mentor" : "Dasbor Peserta Magang"}
        </span> */}
        <h1 className="mt-3 text-[28px] leading-tight font-semibold tracking-tight text-ink">
          Selamat datang, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-body">{formatTanggalID(today)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Logbook"
          value={String(totalLogbook)}
          icon="lucide:notebook-pen"
          chip="accent"
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={String(menungguVerifikasi)}
          icon="lucide:clock"
          chip="down"
        />
        <StatCard
          label="Terverifikasi"
          value={String(terverifikasiCount)}
          icon="lucide:check-circle-2"
          chip="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-7 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-ink">
                Aktivitas 7 Hari Terakhir
              </h2>
              <p className="text-sm text-muted-foreground">Jumlah logbook per hari</p>
            </div>
            <span className="font-numeric text-2xl font-semibold text-ink">
              {weeklyData.reduce((sum, d) => sum + d.value, 0)}
            </span>
          </div>
          <div className="mt-6">
            <ActivityBarChart data={weeklyData} />
          </div>
        </div>

        <div className="rounded-2xl bg-card p-7">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            Ringkasan Status
          </h2>
          <p className="text-sm text-muted-foreground">Seluruh logbook tercatat</p>
          <div className="mt-6">
            <StatusDonut
              centerLabel="Logbook"
              segments={[
                { label: "Terverifikasi", value: terverifikasiCount, color: "var(--up)" },
                { label: "Menunggu", value: menungguVerifikasi, color: "var(--accent-yellow)" },
                { label: "Revisi", value: revisiCount, color: "var(--down)" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            Aktivitas terbaru
          </h2>
          <Link
            href="/logbook"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <Icon icon="lucide:notebook-pen" className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Belum ada logbook yang tercatat.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isMentor && <TableHead>Peserta</TableHead>}
                  <TableHead>Aktivitas</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((entry) => (
                  <TableRow key={entry.id}>
                    {isMentor && (
                      <TableCell className="font-medium text-ink">
                        {entry.pesertaNama}
                      </TableCell>
                    )}
                    <TableCell className="max-w-72">
                      <p className="line-clamp-1 text-sm text-body">
                        {stripHtml(entry.aktivitas)}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatTanggalID(entry.tanggal)}
                    </TableCell>
                    <TableCell className="font-numeric text-sm whitespace-nowrap">
                      {entry.jamMulai}–{entry.jamSelesai}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={entry.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
