"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={cn(
        "flex size-10 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-soft hover:text-ink",
        className
      )}
    >
      {mounted && (
        <Icon icon={isDark ? "lucide:sun" : "lucide:moon"} className="size-4.5" />
      )}
    </button>
  );
}
