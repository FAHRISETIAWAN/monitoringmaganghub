"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "gooey-toast";
import { useLogbook } from "@/context/logbook-context";
import { formatTanggalID } from "@/lib/date";
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
import { EmojiRating } from "@/components/ui/emoji-rating";
import type { LogbookEntry } from "@/lib/types";

export function RateMentorDialog({
  entry,
  mentorNama,
}: {
  entry: LogbookEntry;
  mentorNama: string;
}) {
  const { rateMentor } = useLogbook();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(entry.ratingMentor ?? 0);

  const rated = !!entry.ratingMentor;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setRating(entry.ratingMentor ?? 0);
  }

  function handleSave() {
    if (rating === 0) {
      toast.error({
        title: "Pilih rating terlebih dahulu",
        description: "Beri penilaian sebelum mengirim.",
      });
      return;
    }

    rateMentor(entry.id, rating);
    toast.success({
      title: "Rating terkirim",
      description: `Terima kasih atas penilaian Anda untuk ${mentorNama}.`,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant={rated ? "secondary" : "default"}>
          <Icon icon={rated ? "lucide:star" : "lucide:smile-plus"} className="size-3.5" />
          {rated ? "Ubah Rating" : "Beri Rating"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-0 gap-5 sm:max-w-lg">
        <DialogHeader className="min-w-0 items-center gap-3 text-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-yellow/15 text-accent-yellow">
            <Icon icon="lucide:smile-plus" className="size-5.5" />
          </span>
          <div className="w-full min-w-0">
            <DialogTitle>Rating Mentor</DialogTitle>
            <DialogDescription className="mt-1">
              Bagaimana bimbingan {mentorNama} untuk logbook tanggal{" "}
              {formatTanggalID(entry.tanggal)}?
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-w-0 rounded-2xl bg-surface-soft px-4 py-7">
          <EmojiRating value={rating} onChange={setRating} />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleSave}>
            Kirim Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
