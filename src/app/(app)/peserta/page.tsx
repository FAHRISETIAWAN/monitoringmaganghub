"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/auth-context";
import { usePeserta } from "@/context/peserta-context";
import { formatTanggalID } from "@/lib/date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { PesertaCard } from "@/components/peserta/peserta-card";

const PAGE_SIZE = 20;

export default function PesertaPage() {
  const { user } = useAuth();
  const { peserta } = usePeserta();
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user && user.role !== "mentor") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const totalPages = Math.max(1, Math.ceil(peserta.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(
    () => peserta.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [peserta, safePage]
  );

  if (!user || user.role !== "mentor") return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px] leading-tight font-semibold tracking-tight text-ink">
          Peserta Magang
        </h1>
        <p className="mt-1 text-sm text-body">
          Daftar peserta magang yang tercatat di lingkungan ATR/BPN.
        </p>
      </div>

      {peserta.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-16 text-center">
          <Icon icon="lucide:users" className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada peserta magang.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl bg-card lg:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Asal Instansi</TableHead>
                    <TableHead>Jurusan</TableHead>
                    <TableHead>Divisi</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-ink">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-semibold text-ink">
                            {p.nama
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div>
                            <p>{p.nama}</p>
                            <p className="text-xs text-muted-foreground">{p.jenjang}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-body">{p.asalInstansi}</TableCell>
                      <TableCell className="text-body">{p.jurusan}</TableCell>
                      <TableCell className="text-body">{p.divisi}</TableCell>
                      <TableCell className="text-body">{p.mentorNama}</TableCell>
                      <TableCell className="whitespace-nowrap text-body">
                        {formatTanggalID(p.periodeMulai)} –{" "}
                        {formatTanggalID(p.periodeSelesai)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            p.status === "aktif"
                              ? "inline-flex items-center gap-1.5 rounded-full bg-up/10 px-3 py-1 text-xs font-semibold text-up"
                              : "inline-flex items-center gap-1.5 rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold text-body"
                          }
                        >
                          <Icon
                            icon={
                              p.status === "aktif" ? "lucide:circle-dot" : "lucide:circle-check"
                            }
                            className="size-3.5"
                          />
                          {p.status === "aktif" ? "Aktif" : "Selesai"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:hidden">
            {paged.map((p) => (
              <PesertaCard key={p.id} peserta={p} />
            ))}
          </div>

          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
