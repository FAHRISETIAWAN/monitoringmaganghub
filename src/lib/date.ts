const HARI_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const HARI_ID_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function hariFromISODate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return HARI_ID[date.getDay()];
}

export function formatTanggalID(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return `${HARI_ID[date.getDay()]}, ${date.getDate()} ${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function todayISODate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function lastNDaysISODate(n: number): string[] {
  const today = todayISODate();
  const base = new Date(`${today}T00:00:00`);
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function hariSingkatFromISODate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return HARI_ID_SHORT[date.getDay()];
}

export function formatTanggalSingkatID(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return `${date.getDate()} ${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatJamAMPM(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${mStr} ${period}`;
}
