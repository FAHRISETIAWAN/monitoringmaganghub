import { Icon } from "@iconify/react";
import { formatTanggalID } from "@/lib/date";
import { stripHtml } from "@/lib/html";
import { StatusBadge } from "@/components/logbook/status-badge";
import { VerifyLogbookDialog } from "@/components/logbook/verify-logbook-dialog";
import { RateMentorDialog } from "@/components/logbook/rate-mentor-dialog";
import { CatatanMentorDialog } from "@/components/logbook/catatan-mentor-dialog";
import type { LogbookEntry } from "@/lib/types";

export function LogbookCard({
  entry,
  isMentor,
  mentorNama,
}: {
  entry: LogbookEntry;
  isMentor: boolean;
  mentorNama?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {isMentor && (
            <>
              <p className="truncate font-medium text-ink">{entry.pesertaNama}</p>
              <p className="text-xs text-muted-foreground">{entry.divisi}</p>
            </>
          )}
          <p className="mt-0.5 text-sm text-body">
            {formatTanggalID(entry.tanggal)}
            <span className="font-numeric text-muted-foreground">
              {" "}
              · {entry.jamMulai}–{entry.jamSelesai}
            </span>
          </p>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      <div className="flex flex-col gap-2 border-t border-hairline pt-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Aktivitas
          </p>
          <p className="line-clamp-2 text-sm text-body">{stripHtml(entry.aktivitas)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Output
          </p>
          <p className="line-clamp-2 text-sm text-body">{stripHtml(entry.output)}</p>
        </div>
        {entry.lampiranUrl && (
          <a
            href={entry.lampiranUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Icon icon="lucide:paperclip" className="size-3" />
            Lampiran
          </a>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-hairline pt-3">
        {!isMentor && <CatatanMentorDialog entry={entry} />}
        <div className="ml-auto">
          {isMentor ? (
            <VerifyLogbookDialog entry={entry} />
          ) : (
            entry.status === "verified" &&
            mentorNama && <RateMentorDialog entry={entry} mentorNama={mentorNama} />
          )}
        </div>
      </div>
    </div>
  );
}
