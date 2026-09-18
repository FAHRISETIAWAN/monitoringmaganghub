"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export function GoogleContinueButton({
  label = "Lanjutkan dengan Google",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full gap-2.5 border-hairline bg-white text-ink hover:bg-surface-strong"
      onClick={onClick}
    >
      <Icon icon="flat-color-icons:google" className="size-5" />
      {label}
    </Button>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-hairline" />
      <span className="text-xs whitespace-nowrap text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}
