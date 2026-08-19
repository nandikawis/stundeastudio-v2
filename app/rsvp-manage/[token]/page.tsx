"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../lib/api";

type Guest = {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  rsvp_status: "pending" | "attending" | "not_attending" | "maybe";
  number_of_guests: number;
  note?: string | null;
};

type ProjectInfo = {
  id: string;
  name: string;
  slug: string;
  status?: string;
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

export default function PublicRsvpManagePage() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";

  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const res = await api.get<{ project: ProjectInfo; guests: Guest[] }>(
      `/api/rsvp-manage/${token}`
    );
    if (!res.success || !res.data) {
      setError(res.success === false ? res.error : "Link tidak valid");
      setProject(null);
      setGuests([]);
      setLoading(false);
      return;
    }
    setProject(res.data.project);
    setGuests(Array.isArray(res.data.guests) ? res.data.guests : []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const stats = useMemo(() => {
    const attending = guests.filter((g) => g.rsvp_status === "attending");
    const pending = guests.filter(
      (g) => g.rsvp_status === "pending" || g.rsvp_status === "maybe"
    );
    const headcount = attending.reduce(
      (sum, g) => sum + (g.number_of_guests || 1),
      0
    );
    return {
      total: guests.length,
      attending: attending.length,
      headcount,
      pending: pending.length,
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
    if (!name.trim() || !token) return;
    setAdding(true);
    setError(null);
    const res = await api.post<Guest>(`/api/rsvp-manage/${token}/guests`, {
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
    const res = await api.delete(
      `/api/rsvp-manage/${token}/guests/${guest.id}`
    );
    if (!res.success) {
      setError(res.success === false ? res.error : "Gagal menghapus");
      return;
    }
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));
  };

  const handleCopy = async (guest: Guest) => {
    try {
      await navigator.clipboard.writeText(guestLink(guest));
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setError("Tidak bisa menyalin link");
    }
  };

  return (
    <main className="landing-root min-h-screen bg-[#f7f6f3] text-primary">
      <div className="mx-auto w-full max-w-[900px] px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
          Kelola tamu
        </p>
        <h1
          className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {project?.name || (loading ? "Memuat…" : "RSVP")}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-primary/50">
          Tambah tamu dan salin link undangan personal. Tidak perlu login.
        </p>

        {error && (
          <p className="mt-6 text-sm text-red-600/90">{error}</p>
        )}

        {loading ? (
          <p className="mt-12 text-sm text-primary/45">Memuat…</p>
        ) : !project ? (
          <p className="mt-12 text-sm text-primary/50">
            Link tidak valid atau sudah tidak aktif.
          </p>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                  <p className="mt-2 text-2xl font-medium tracking-[-0.02em]">
                    {s.value}
                  </p>
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
                className="min-w-0 flex-1 rounded-full border border-primary/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary/35"
              />
              <button
                type="submit"
                disabled={adding || !name.trim()}
                className="landing-btn landing-btn-primary disabled:opacity-50"
              >
                {adding ? "Menambah…" : "Tambah tamu"}
              </button>
            </form>

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
    </main>
  );
}
