import Image from "next/image";
import { cn } from "@/lib/utils";

function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.45) 1.5px, transparent 1.5px)",
        backgroundSize: "14px 14px",
      }}
    />
  );
}

export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col overflow-hidden bg-primary px-12 pt-10 text-on-dark lg:flex">
        <DotGrid className="absolute top-8 right-10 h-24 w-32" />

        <div className="relative z-10 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-primary">
            M
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Monitoring Magang Hub <span className="text-white/70">ATR/BPN</span>
          </span>
        </div>

        <div className="relative z-10 mt-14  pr-6">
          <h1 className="font-display text-[20px] leading-[1.15] font-semibold tracking-tight text-white">
            Membangun pengalaman, mengembangkan kompetensi, dan berkontribusi bersama
          </h1>
          {/* <p className="mt-3 text-base text-white">
            Kelola logbook dan verifikasi kegiatan magang di lingkungan ATR/BPN
            dalam satu platform yang sederhana untuk peserta dan mentor.
          </p> */}
          <div className="mt-6 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-6 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="relative mx-auto aspect-3/2 w-full min-w-3xl max-5xl: overflow-hidden">
            <Image
              src="/login3.png"
              alt="Ilustrasi peserta magang berkolaborasi"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </div>
  );
}
