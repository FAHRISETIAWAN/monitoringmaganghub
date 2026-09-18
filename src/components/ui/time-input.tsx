"use client";

import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";

function normalizeTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function TimeInput({
  id,
  value,
  onChange,
  placeholder = "08:00",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Icon
        icon="lucide:clock"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(normalizeTimeInput(e.target.value))}
        maxLength={5}
        className="pl-10"
      />
    </div>
  );
}
