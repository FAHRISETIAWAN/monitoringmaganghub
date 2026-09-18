import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type ChipTone = "primary" | "up" | "accent" | "down";

const CHIP_STYLES: Record<ChipTone, string> = {
  primary: "bg-primary",
  up: "bg-up",
  accent: "bg-accent-yellow",
  down: "bg-down",
};

export function StatCard({
  label,
  value,
  icon,
  chip = "primary",
}: {
  label: string;
  value: string;
  icon: string;
  chip?: ChipTone;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-7">
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl text-white",
          CHIP_STYLES[chip]
        )}
      >
        <Icon icon={icon} className="size-6" />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1.5 font-numeric text-2xl leading-none font-semibold text-ink">
          {value}
        </p>
      </div>
    </div>
  );
}
