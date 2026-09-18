"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { LogbookStatus } from "@/lib/types";

export type FilterValue = "semua" | LogbookStatus;

const OPTIONS: {
  value: FilterValue;
  label: string;
  description: string;
  icon: string;
  chip: string;
}[] = [
  {
    value: "semua",
    label: "Semua",
    description: "Tampilkan seluruh logbook tanpa filter status.",
    icon: "lucide:list",
    chip: "bg-surface-strong text-body",
  },
  {
    value: "draft",
    label: "Draft",
    description: "Logbook yang belum dipublikasikan.",
    icon: "lucide:file-edit",
    chip: "bg-surface-strong text-muted-foreground",
  },
  {
    value: "pending",
    label: "Menunggu",
    description: "Logbook yang belum ditinjau mentor.",
    icon: "lucide:clock",
    chip: "bg-accent-yellow/15 text-accent-yellow",
  },
  {
    value: "verified",
    label: "Terverifikasi",
    description: "Logbook yang sudah disetujui mentor.",
    icon: "lucide:check-circle-2",
    chip: "bg-up/15 text-up",
  },
  {
    value: "revisi",
    label: "Revisi",
    description: "Logbook yang dikembalikan untuk diperbaiki.",
    icon: "lucide:alert-circle",
    chip: "bg-down/15 text-down",
  },
];

export function LogbookFilterDialog({
  value,
  onApply,
}: {
  value: FilterValue;
  onApply: (value: FilterValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const [staged, setStaged] = useState<FilterValue>(value);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setStaged(value);
  }

  function handleApply() {
    onApply(staged);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Filter status logbook" className="relative">
          <Icon icon="lucide:sliders-horizontal" className="size-4.5" />
          {value !== "semua" && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Filter Status</DialogTitle>
          <DialogDescription>
            Pilih status logbook yang ingin ditampilkan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[60vh] flex-col gap-2.5 overflow-y-auto">
          {OPTIONS.map((option) => {
            const active = staged === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStaged(option.value)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-hairline hover:border-muted-foreground/30"
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    option.chip
                  )}
                >
                  <Icon icon={option.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    {option.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    active ? "border-primary bg-primary" : "border-hairline"
                  )}
                >
                  {active && <Icon icon="lucide:check" className="size-3 text-white" />}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter className="mt-2 gap-2 sm:gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleApply}>
            Terapkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
