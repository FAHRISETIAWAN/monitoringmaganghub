"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "gooey-toast";
import { useAuth } from "@/context/auth-context";
import { usePeserta } from "@/context/peserta-context";
import { useMentor } from "@/context/mentor-context";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Role } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  roles: Role[];
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    roles: ["peserta", "mentor"],
  },
  {
    href: "/logbook",
    label: "Logbook",
    icon: "lucide:notebook-pen",
    roles: ["peserta", "mentor"],
  },
  {
    href: "/peserta",
    label: "Peserta Magang",
    icon: "lucide:users",
    roles: ["mentor"],
  },
  {
    href: "/verifikasi-akun",
    label: "Verifikasi Akun",
    icon: "lucide:user-check",
    roles: ["admin"],
  },
];

const ROLE_LABEL: Record<Role, string> = {
  peserta: "Peserta Magang",
  mentor: "Mentor",
  admin: "Admin",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { peserta } = usePeserta();
  const { mentors } = useMentor();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const homeHref = user.role === "admin" ? "/verifikasi-akun" : "/dashboard";
  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(user.role));
  const pendingAkunCount =
    peserta.filter((p) => p.akunStatus === "pending").length +
    mentors.filter((m) => m.akunStatus === "pending").length;
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    logout();
    toast.info({
      title: "Berhasil keluar",
      description: "Sampai jumpa lagi.",
    });
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-soft">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:h-20 lg:gap-8 lg:px-8">
        <Link href={homeHref} className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            M
          </span>
          <span className="hidden min-w-0 leading-tight sm:block">
            <span className="block truncate text-[13px] font-semibold tracking-tight text-ink">
              Monitoring Magang Hub
            </span>
            <span className="block text-xs text-muted-foreground">ATR/BPN</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {visibleNav.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-body hover:bg-surface-soft hover:text-ink"
                )}
              >
                <Icon icon={item.icon} className="size-4" />
                {item.label}
                {item.href === "/verifikasi-akun" && pendingAkunCount > 0 && (
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold",
                      active ? "bg-white text-primary" : "bg-down text-white"
                    )}
                  >
                    {pendingAkunCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 lg:gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Keluar"
            className="flex size-10 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-soft hover:text-ink"
          >
            <Icon icon="lucide:log-out" className="size-4.5" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-surface-strong text-xs font-semibold text-ink">
              {initials}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-medium text-ink">{user.name}</span>
              <span className="block text-xs text-muted-foreground">
                {ROLE_LABEL[user.role]}
              </span>
            </span>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex bg-card lg:hidden">
        {visibleNav.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span className="relative">
                <Icon icon={item.icon} className="size-5" />
                {item.href === "/verifikasi-akun" && pendingAkunCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex size-3.5 items-center justify-center rounded-full bg-down text-[9px] font-semibold text-white">
                    {pendingAkunCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="min-w-0 flex-1 px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
        {children}
      </main>
    </div>
  );
}
