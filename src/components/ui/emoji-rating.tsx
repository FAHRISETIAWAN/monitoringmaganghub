"use client";

import { cn } from "@/lib/utils";

const RATING_OPTIONS = [
  { value: 1, emoji: "😞", label: "Sangat kurang" },
  { value: 2, emoji: "😕", label: "Kurang" },
  { value: 3, emoji: "😐", label: "Cukup" },
  { value: 4, emoji: "🙂", label: "Baik" },
  { value: 5, emoji: "🤩", label: "Sangat baik" },
] as const;

export function EmojiRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5">
      {RATING_OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <div key={option.value} className="flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={() => onChange(active ? 0 : option.value)}
              aria-label={option.label}
              aria-pressed={active}
              title={option.label}
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                active
                  ? "size-14 bg-accent-yellow/15 text-3xl ring-4 ring-accent-yellow/25"
                  : "size-11 text-xl opacity-40 grayscale hover:opacity-80 hover:grayscale-0"
              )}
            >
              {option.emoji}
            </button>
            <span
              className={cn(
                "rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-card transition-opacity duration-200",
                active ? "opacity-100" : "opacity-0"
              )}
            >
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
