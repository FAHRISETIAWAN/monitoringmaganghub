"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { formatTanggalID } from "@/lib/date";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { LogbookEntry } from "@/lib/types";

export function CatatanMentorDialog({ entry }: { entry: LogbookEntry }) {
  const [open, setOpen] = useState(false);

  if (!entry.catatanMentor) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Lihat catatan mentor"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-soft hover:text-primary"
        >
          <Icon icon="lucide:message-square-text" className="size-4.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-0 gap-5 sm:max-w-lg">
        <DialogHeader className="min-w-0 items-center gap-3 text-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon icon="lucide:message-square-text" className="size-5.5" />
          </span>
          <div className="w-full min-w-0">
            <DialogTitle>Catatan Mentor</DialogTitle>
            <DialogDescription className="mt-1">
              {entry.diverifikasiOleh ?? "Mentor"} · {formatTanggalID(entry.tanggal)}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div
          className="min-w-0 rounded-2xl bg-surface-soft p-5 text-sm text-body [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: entry.catatanMentor }}
        />

        <DialogFooter>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
