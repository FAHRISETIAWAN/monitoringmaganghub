export type Role = "peserta" | "mentor" | "admin";

export type AuthUser = {
  email: string;
  name: string;
  role: Role;
  pesertaId?: string;
};

export type PesertaStatus = "aktif" | "selesai";

export type AkunStatus = "pending" | "disetujui" | "ditolak";

export type Peserta = {
  id: string;
  nama: string;
  email: string;
  password?: string;
  asalInstansi: string;
  jurusan: string;
  jenjang: "Mahasiswa" | "SMK/SMA";
  divisi: string;
  mentorNama: string;
  periodeMulai: string;
  periodeSelesai: string;
  status: PesertaStatus;
  akunStatus: AkunStatus;
  catatanAdmin?: string;
};

export type Mentor = {
  id: string;
  nama: string;
  email: string;
  password: string;
  nip: string;
  akunStatus: AkunStatus;
  catatanAdmin?: string;
};

export type Admin = {
  nama: string;
  email: string;
  password: string;
};

export type LogbookStatus = "draft" | "pending" | "verified" | "revisi";

export type LogbookEntry = {
  id: string;
  pesertaId: string;
  pesertaNama: string;
  divisi: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  aktivitas: string;
  output: string;
  lampiranUrl?: string;
  status: LogbookStatus;
  catatanMentor?: string;
  ratingPeserta?: number;
  ratingMentor?: number;
  diverifikasiOleh?: string;
  diperbaruiPada: string;
};
