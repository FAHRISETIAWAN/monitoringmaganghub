"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BULAN_ID, formatTanggalSingkatID, todayISODate } from "@/lib/date";

const HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export function DatePicker({
  id,
  value,
  onChange,
  max,
  min,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  max?: string;
  min?: string;
}) {
  const initial = value ? new Date(`${value}T00:00:00`) : new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      const base = value ? new Date(`${value}T00:00:00`) : new Date();
      setViewYear(base.getFullYear());
      setViewMonth(base.getMonth());
    }
  }

  function goMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function isDisabled(iso: string) {
    if (max && iso > max) return true;
    if (min && iso < min) return true;
    return false;
  }

  const grid = buildMonthGrid(viewYear, viewMonth);
  const todayIso = todayISODate();
  const todayDisabled = isDisabled(todayIso);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          className="flex h-12 w-full items-center gap-2.5 rounded-md border border-input bg-transparent px-3.5 text-left text-sm text-ink transition-colors outline-none focus-visible:border-2 focus-visible:border-primary"
        >
          <Icon icon="lucide:calendar" className="size-4 shrink-0 text-muted-foreground" />
          <span>{value ? formatTanggalSingkatID(value) : "Pilih tanggal"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3">
        <div className="flex items-center justify-between px-0.5">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-strong hover:text-ink"
          >
            <Icon icon="lucide:chevron-left" className="size-4" />
          </button>
          <span className="text-sm font-semibold text-ink">
            {BULAN_ID[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={() => goMonth(1)}
            aria-label="Bulan berikutnya"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-strong hover:text-ink"
          >
            <Icon icon="lucide:chevron-right" className="size-4" />
          </button>
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
          {HARI_PENDEK.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {grid.map((d) => {
            const iso = toISODate(d);
            const inMonth = d.getMonth() === viewMonth;
            const disabled = isDisabled(iso);
            const isSelected = iso === value;
            const isToday = iso === todayIso;
            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onChange(iso);
                  setOpen(false);
                }}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm transition-colors",
                  !inMonth && "text-muted-foreground/40",
                  inMonth && !isSelected && "text-ink hover:bg-surface-strong",
                  isSelected && "bg-primary font-semibold text-white",
                  !isSelected && isToday && "font-semibold text-primary",
                  disabled && "pointer-events-none opacity-30"
                )}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-end border-t border-transparent pt-1">
          <button
            type="button"
            disabled={todayDisabled}
            onClick={() => {
              onChange(todayIso);
              setOpen(false);
            }}
            className="text-sm font-semibold text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
          >
            Hari ini
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
