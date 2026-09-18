import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { LogbookStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  LogbookStatus,
  { label: string; icon: string; className: string }
> = {
  draft: {
    label: "Draft",
    icon: "lucide:file-edit",
    className: "bg-surface-strong text-muted-foreground",
  },
  pending: {
    label: "Menunggu",
    icon: "lucide:clock",
    className: "bg-accent-yellow/15 text-accent-yellow",
  },
  verified: {
    label: "Terverifikasi",
    icon: "lucide:check-circle-2",
    className: "bg-up/15 text-up",
  },
  revisi: {
    label: "Perlu Revisi",
    icon: "lucide:alert-circle",
    className: "bg-down/15 text-down",
  },
};

export function StatusBadge({ status }: { status: LogbookStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        config.className
      )}
    >
      <Icon icon={config.icon} className="size-3.5" />
      {config.label}
    </span>
  );
}
