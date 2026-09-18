"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "gooey-toast";
import { useAuth } from "@/context/auth-context";
import { usePeserta } from "@/context/peserta-context";
import { useMentor } from "@/context/mentor-context";
import { DEMO_GOOGLE_EMAIL } from "@/lib/mock-data";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { PasswordInput } from "@/components/auth/password-input";
import {
  AuthDivider,
  GoogleContinueButton,
} from "@/components/auth/google-continue-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/lib/types";

export default function RegisterPage() {
  const { user, login } = useAuth();
  const { findByEmail, registerPeserta } = usePeserta();
  const { findByEmail: findMentorByEmail, registerMentor } = useMentor();
  const router = useRouter();

  const [role, setRole] = useState<Role>("peserta");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universitas, setUniversitas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [nip, setNip] = useState("");
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
      title: "Daftar dengan Google",
      description: "Contoh integrasi Google Sign-In (demo, belum terhubung ke backend).",
    });
    router.replace("/dashboard");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error({
        title: "Email tidak valid",
        description: "Masukkan alamat email yang benar.",
      });
      return;
    }
    if (password.length < 6) {
      toast.error({
        title: "Password terlalu pendek",
        description: "Gunakan minimal 6 karakter.",
      });
      return;
    }
    if (findByEmail(email.trim()) || findMentorByEmail(email.trim())) {
      toast.error({
        title: "Email sudah terdaftar",
        description: "Silakan masuk menggunakan akun yang sudah ada.",
      });
      return;
    }

    if (role === "peserta") {
      if (!universitas.trim() || !jurusan.trim()) {
        toast.error({
          title: "Lengkapi data Anda",
          description: "Universitas dan jurusan wajib diisi.",
        });
        return;
      }

      setSubmitting(true);
      const peserta = registerPeserta({
        email: email.trim(),
        password,
        universitas: universitas.trim(),
        jurusan: jurusan.trim(),
      });

      toast.success({
        title: `Pendaftaran berhasil, ${peserta.nama.split(" ")[0]}`,
        description: "Akun Anda menunggu verifikasi admin sebelum dapat digunakan.",
      });
    } else {
      if (!nip.trim()) {
        toast.error({
          title: "Lengkapi data Anda",
          description: "NIP wajib diisi.",
        });
        return;
      }

      setSubmitting(true);
      const mentor = registerMentor({
        email: email.trim(),
        password,
        nip: nip.trim(),
      });

      toast.success({
        title: `Pendaftaran berhasil, ${mentor.nama.split(" ")[0]}`,
        description: "Akun Anda menunggu verifikasi admin sebelum dapat digunakan.",
      });
    }

    router.replace("/login");
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
        Buat akun baru
      </h2>
      <p className="mt-1 text-sm text-body">
        Satu akun untuk mengelola kegiatan magang di lingkungan ATR/BPN.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Daftar sebagai</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger id="role" className="h-12 w-full rounded-md">
              <SelectValue placeholder="Pilih peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="peserta">Peserta Magang</SelectItem>
              <SelectItem value="mentor">Mentor</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
          />
        </div>

        {role === "peserta" ? (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="universitas">Universitas</Label>
              <Input
                id="universitas"
                placeholder="Nama universitas/institusi"
                value={universitas}
                onChange={(e) => setUniversitas(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="jurusan">Jurusan</Label>
              <Input
                id="jurusan"
                placeholder="Program studi/jurusan"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="nip">NIP</Label>
            <Input
              id="nip"
              inputMode="numeric"
              placeholder="Nomor Induk Pegawai"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Dengan mendaftar, Anda menyetujui pengelolaan data untuk keperluan
          monitoring magang di lingkungan ATR/BPN.
        </p>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
          Daftar
          <Icon icon="lucide:arrow-right" className="size-4" />
        </Button>
      </form>

      {role === "peserta" && (
        <div className="mt-4 flex flex-col gap-4">
          <AuthDivider label="atau" />
          <GoogleContinueButton
            label="Daftar dengan Google"
            onClick={handleGoogleContinue}
          />
        </div>
      )}

      <p className="mt-6 text-center text-sm text-body">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
