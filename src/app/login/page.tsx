"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "gooey-toast";
import { useAuth } from "@/context/auth-context";
import { usePeserta } from "@/context/peserta-context";
import { useMentor } from "@/context/mentor-context";
import { DEMO_GOOGLE_EMAIL, MOCK_ADMINS } from "@/lib/mock-data";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { PasswordInput } from "@/components/auth/password-input";
import {
  AuthDivider,
  GoogleContinueButton,
} from "@/components/auth/google-continue-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { user, login } = useAuth();
  const { findByEmail } = usePeserta();
  const { findByEmail: findMentorByEmail } = useMentor();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  function handleGoogleContinue() {
    const peserta = findByEmail(DEMO_GOOGLE_EMAIL);
    if (!peserta) return;

    login({
      email: peserta.email,
      name: peserta.nama,
      role: "peserta",
      pesertaId: peserta.id,
    });
    toast.success({
      title: "Masuk dengan Google",
      description: "Contoh integrasi Google Sign-In (demo, belum terhubung ke backend).",
    });
    router.replace("/dashboard");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error({
        title: "Email tidak valid",
        description: "Masukkan alamat email yang benar untuk masuk.",
      });
      return;
    }
    if (!password) {
      toast.error({
        title: "Password belum diisi",
        description: "Masukkan password akun Anda.",
      });
      return;
    }

    setSubmitting(true);

    const admin = MOCK_ADMINS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (admin) {
      if (admin.password !== password) {
        setSubmitting(false);
        toast.error({
          title: "Password salah",
          description: "Periksa kembali password Anda.",
        });
        return;
      }

      login({ email: admin.email, name: admin.nama, role: "admin" });
      toast.success({
        title: `Selamat datang, ${admin.nama.split(" ")[0]}`,
        description: "Anda masuk sebagai admin.",
      });
      router.replace("/verifikasi-akun");
      return;
    }

    const peserta = findByEmail(email.trim());
    if (peserta) {
      if (peserta.password && peserta.password !== password) {
        setSubmitting(false);
        toast.error({
          title: "Password salah",
          description: "Periksa kembali password Anda.",
        });
        return;
      }
      if (peserta.akunStatus !== "disetujui") {
        setSubmitting(false);
        toast.error({
          title:
            peserta.akunStatus === "pending"
              ? "Akun menunggu verifikasi"
              : "Akun ditolak",
          description:
            peserta.akunStatus === "pending"
              ? "Akun Anda sedang menunggu verifikasi admin."
              : peserta.catatanAdmin ||
                "Pendaftaran Anda ditolak admin. Hubungi mentor/admin untuk info lebih lanjut.",
        });
        return;
      }

      login({
        email: peserta.email,
        name: peserta.nama,
        role: "peserta",
        pesertaId: peserta.id,
      });
      toast.success({
        title: `Selamat datang, ${peserta.nama.split(" ")[0]}`,
        description: "Anda masuk sebagai peserta magang.",
      });
      router.replace("/dashboard");
      return;
    }

    const mentor = findMentorByEmail(email.trim());
    if (mentor && mentor.password === password) {
      if (mentor.akunStatus !== "disetujui") {
        setSubmitting(false);
        toast.error({
          title:
            mentor.akunStatus === "pending"
              ? "Akun menunggu verifikasi"
              : "Akun ditolak",
          description:
            mentor.akunStatus === "pending"
              ? "Akun Anda sedang menunggu verifikasi admin."
              : mentor.catatanAdmin ||
                "Pendaftaran Anda ditolak admin. Hubungi admin untuk info lebih lanjut.",
        });
        return;
      }

      login({
        email: mentor.email,
        name: mentor.nama,
        role: "mentor",
      });
      toast.success({
        title: `Selamat datang, ${mentor.nama.split(" ")[0]}`,
        description: "Anda masuk sebagai mentor.",
      });
      router.replace("/dashboard");
      return;
    }

    setSubmitting(false);
    toast.error({
      title: "Akun tidak ditemukan",
      description: "Periksa email/password, atau daftar terlebih dahulu.",
    });
  }

  return (
    <AuthSplitLayout>
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          M
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-ink">
          Monitoring Magang Hub <span className="text-primary">ATR/BPN</span>
        </span>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        Masuk ke akun Anda
      </h2>
      <p className="mt-1 text-sm text-body">
        Pantau dan kelola kegiatan magang dengan lebih cerdas.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Masukkan password"
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={submitting}>
          Masuk
          <Icon icon="lucide:arrow-right" className="size-4" />
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-4">
        <AuthDivider label="atau" />
        <GoogleContinueButton onClick={handleGoogleContinue} />
      </div>

      <p className="mt-6 text-center text-sm text-body">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
