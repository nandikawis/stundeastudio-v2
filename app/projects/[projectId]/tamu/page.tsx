"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { api } from "../../../lib/api";
import { useRequireAuth } from "../../../lib/useRequireAuth";
import type { ProjectData } from "../../../lib/mockData";
import type { Entitlements, ProfileWithPlan } from "../../../lib/plans";
import { formatLimit } from "../../../lib/plans";

type Guest = {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  rsvp_status: "pending" | "attending" | "not_attending" | "maybe";
  number_of_guests: number;
  note?: string | null;
};

function statusLabel(status: Guest["rsvp_status"]) {
  switch (status) {
    case "attending":
      return "Hadir";
    case "not_attending":
      return "Tidak hadir";
    case "maybe":
      return "Mungkin";
    default:
      return "Belum RSVP";
  }
}

export default function ProjectGuestsPage() {
  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : "";
  const { ready: authReady } = useRequireAuth();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);

  useEffect(() => {
    if (!authReady || !projectId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const [projRes, guestRes, profileRes] = await Promise.all([
        api.get<ProjectData>(`/api/projects/${projectId}`),
        api.get<Guest[]>(`/api/projects/${projectId}/guests`),
        api.get<ProfileWithPlan>("/api/auth/profile"),
      ]);
      if (cancelled) return;
      if (profileRes.success && profileRes.data?.entitlements) {
        setEntitlements(profileRes.data.entitlements);
      }
      if (!projRes.success || !projRes.data) {
        setError(projRes.success === false ? projRes.error : "Proyek tidak ditemukan");
        setLoading(false);
        return;
      }
      setProject(projRes.data);
      if (guestRes.success && Array.isArray(guestRes.data)) {
        setGuests(guestRes.data);
      } else {
        setGuests([]);
        if (guestRes.success === false) {
          setError(guestRes.error);
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, projectId]);

  const stats = useMemo(() => {
    const attending = guests.filter((g) => g.rsvp_status === "attending");
    const notAttending = guests.filter((g) => g.rsvp_status === "not_attending");
    const pending = guests.filter((g) => g.rsvp_status === "pending" || g.rsvp_status === "maybe");
    const headcount = attending.reduce((sum, g) => sum + (g.number_of_guests || 1), 0);
    return {
      total: guests.length,
      attending: attending.length,
      notAttending: notAttending.length,
      pending: pending.length,
      headcount,
    };
  }, [guests]);

  const guestLink = (guest: Guest) => {
    if (!project) return "";
    const slug = encodeURIComponent(project.slug || project.name || project.id);
    const path = `/wedding-invitation/${project.id}/${slug}/${guest.slug}`;
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectId) return;
    setAdding(true);
    setError(null);
    const res = await api.post<Guest>(`/api/projects/${projectId}/guests`, {
      name: name.trim(),
    });
    setAdding(false);
    if (!res.success || !res.data) {
      setError(res.success === false ? res.error : "Gagal menambah tamu");
      return;
    }
    setGuests((prev) => [...prev, res.data as Guest]);
    setName("");
  };

  const handleDelete = async (guest: Guest) => {
    if (!window.confirm(`Hapus tamu "${guest.name}"?`)) return;
    const res = await api.delete(`/api/projects/${projectId}/guests/${guest.id}`);
    if (!res.success) {
      setError(res.success === false ? res.error : "Gagal menghapus");
      return;
    }
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));
  };

  const handleCopy = async (guest: Guest) => {
    const url = guestLink(guest);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setError("Tidak bisa menyalin link");
    }
  };

  const handleShareRsvp = async () => {
    if (!projectId) return;
    setSharing(true);
    setError(null);
    const res = await api.post<{ token: string; path: string }>(
      `/api/projects/${projectId}/rsvp-share`
    );
    setSharing(false);
    if (!res.success || !res.data?.path) {
      setError(
        res.success === false ? res.error : "Gagal membuat link bagikan"
      );
      return;
    }
    const url = `${window.location.origin}${res.data.path}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setError("Link dibuat, tapi tidak bisa disalin. " + url);
    }
  };

  const maxGuests = entitlements?.limits.maxGuests ?? null;
  const canShareRsvp =
    entitlements?.limits.canShareRsvpManage === true &&
    entitlements?.status !== "expired";
  const guestsAtLimit =
    maxGuests != null && guests.length >= maxGuests;

  return (
    <main className="landing-root flex min-h-screen flex-col bg-[#f7f6f3] text-primary">
      <Navbar />
      <div className="relative z-0 mx-auto w-full max-w-[1200px] flex-1 px-5 pb-20 pt-36 sm:px-8 lg:px-14 lg:pt-40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/projects"
              className="landing-btn landing-btn-ghost relative z-10 !px-3 !py-2 text-sm"
            >
              ← Proyek
            </Link>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
              Tamu & RSVP
            </p>
            <h1
              className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {project?.name || "Daftar tamu"}
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-primary/50">
              Tambah tamu, salin link personal, atau bagikan ke klien agar mereka
              kelola RSVP tanpa login.
              {maxGuests != null && (
                <>
                  {" "}
                  Batas paket: {guests.length}/{formatLimit(maxGuests)} tamu.
                </>
              )}
            </p>
          </div>
          {project && (
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleShareRsvp()}
                disabled={sharing || !canShareRsvp}
                title={
                  canShareRsvp
                    ? undefined
                    : "Tidak tersedia di paket Free Trial — upgrade untuk bagikan"
                }
                className="landing-btn landing-btn-primary disabled:opacity-50"
              >
                {sharing
                  ? "Menyiapkan…"
                  : shareCopied
                    ? "Link tersalin"
                    : canShareRsvp
                      ? "Bagikan RSVP"
                      : "Bagikan (Pro+)"}
              </button>
              <Link
                href={`/editor/${project.id}`}
                className="landing-btn landing-btn-ghost"
              >
                Buka editor
              </Link>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-600/90">{error}</p>
        )}

        {loading ? (
          <p className="mt-12 text-sm text-primary/45">Memuat…</p>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Total tamu", value: stats.total },
                { label: "Hadir", value: stats.attending },
                { label: "Jumlah orang", value: stats.headcount },
                { label: "Belum RSVP", value: stats.pending },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-primary/8 bg-white/70 px-4 py-4"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                    {s.label}
                  </p>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.02em]">{s.value}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAdd}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama tamu"
                disabled={guestsAtLimit}
                className="min-w-0 flex-1 rounded-full border border-primary/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary/35 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={adding || !name.trim() || guestsAtLimit}
                className="landing-btn landing-btn-primary disabled:opacity-50"
              >
                {guestsAtLimit
                  ? "Batas tamu tercapai"
                  : adding
                    ? "Menambah…"
                    : "Tambah tamu"}
              </button>
            </form>
            {guestsAtLimit && (
              <p className="mt-3 text-sm text-primary/50">
                Batas tamu paket tercapai.{" "}
                <Link href="/pricing" className="underline underline-offset-2">
                  Lihat harga
                </Link>{" "}
                untuk upgrade.
              </p>
            )}

            <ul className="mt-8 space-y-3">
              {guests.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-primary/15 px-5 py-10 text-center text-sm text-primary/45">
                  Belum ada tamu. Tambahkan nama untuk membuat link personal.
                </li>
              ) : (
                guests.map((guest) => (
                  <li
                    key={guest.id}
                    className="flex flex-col gap-3 rounded-2xl border border-primary/8 bg-white/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-primary">{guest.name}</p>
                      <p className="mt-1 text-xs text-primary/45">
                        {statusLabel(guest.rsvp_status)}
                        {guest.rsvp_status === "attending"
                          ? ` · ${guest.number_of_guests} orang`
                          : ""}
                        {guest.note ? ` · ${guest.note}` : ""}
                      </p>
                      <p className="mt-2 break-all text-[11px] text-primary/35">
                        {guestLink(guest)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void handleCopy(guest)}
                        className="rounded-full border border-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-[#f7f6f3]"
                      >
                        {copiedId === guest.id ? "Tersalin" : "Salin link"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(guest)}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
