"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProjectData } from "../lib/mockData";
import { api, setAccessToken } from "../lib/api";
import { useRequireAuth } from "../lib/useRequireAuth";
import { clearCachedAuth } from "../lib/auth";
import {
  formatLimit,
  type Entitlements,
  type ProfileWithPlan,
} from "../lib/plans";

function statusLabel(status: string | undefined) {
  if (status === "published") return "Published";
  if (status === "archived") return "Archived";
  return "Draft";
}

export default function ProjectsPage() {
  const { ready: authReady } = useRequireAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [publishTarget, setPublishTarget] = useState<ProjectData | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<ProjectData | null>(null);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [reactivateId, setReactivateId] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;
    setLoading(true);
    (async () => {
      const [res, profileRes] = await Promise.all([
        api.get<ProjectData[]>("/api/projects"),
        api.get<ProfileWithPlan>("/api/auth/profile"),
      ]);
      if (cancelled) return;
      if (profileRes.success && profileRes.data?.entitlements) {
        setEntitlements(profileRes.data.entitlements);
      }
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        if (
          res.success === false &&
          res.error?.toLowerCase().includes("auth")
        ) {
          clearCachedAuth();
          setAccessToken(null);
        }
        setProjects([]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady]);

  const publishedCount = useMemo(
    () => projects.filter((p) => p.status === "published").length,
    [projects]
  );
  const maxPublished = entitlements?.limits.maxPublished ?? null;
  const slotLabel =
    maxPublished == null
      ? `${publishedCount} undangan aktif`
      : `${publishedCount}/${formatLimit(maxPublished)} undangan aktif`;
  const slotsFull =
    maxPublished != null &&
    publishedCount >= maxPublished &&
    entitlements?.status !== "expired";
  const planExpired = entitlements?.status === "expired";

  const DeleteModal = () => {
    if (!deleteTarget) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/40 px-5">
        <div className="w-full max-w-sm rounded-2xl border border-primary/10 bg-white px-6 py-7 shadow-[0_24px_64px_rgba(45,45,45,0.12)]">
          <h3
            className="text-xl font-medium tracking-[-0.02em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Hapus proyek?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-primary/55">
            Proyek{" "}
            <span className="font-medium text-primary">
              &quot;{deleteTarget.name || "Tanpa Nama"}&quot;
            </span>{" "}
            akan dihapus permanen. Tidak bisa dibatalkan.
          </p>

          {deleteError && (
            <p className="mt-3 text-sm text-red-600/90">{deleteError}</p>
          )}

          <div className="mt-8 flex justify-end gap-2">
            <button
              type="button"
              className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm"
              disabled={deleteLoading}
              onClick={() => {
                setDeleteTarget(null);
                setDeleteError(null);
              }}
            >
              Batal
            </button>
            <button
              type="button"
              className="landing-btn !bg-red-700 !px-4 !py-2 text-sm text-white hover:!bg-red-800 disabled:opacity-60"
              disabled={deleteLoading}
              onClick={async () => {
                if (!deleteTarget) return;
                setDeleteLoading(true);
                setDeleteError(null);
                setDeletingId(deleteTarget.id);

                const res = await api.delete<{ id: string }>(
                  `/api/projects/${deleteTarget.id}`
                );

                if (res.success) {
                  setProjects((prev) =>
                    prev.filter((p) => p.id !== deleteTarget.id)
                  );
                  setDeleteTarget(null);
                } else {
                  setDeleteError(
                    res.error || "Gagal menghapus proyek. Coba lagi."
                  );
                }

                setDeletingId(null);
                setDeleteLoading(false);
              }}
            >
              {deleteLoading ? "Menghapus…" : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PublishModal = () => {
    if (!publishTarget) return null;

    const isAlreadyPublished = publishTarget.status === "published";
    const projectName = publishTarget.name || publishTarget.id;
    const encodedName = encodeURIComponent(projectName);
    const basePath = `/wedding-invitation/${publishTarget.id}/${encodedName}`;
    const examplePath = `${basePath}/NamaTamu`;
    const fullExampleUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${examplePath}`
        : examplePath;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/40 px-5">
        <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-white px-6 py-7 shadow-[0_24px_64px_rgba(45,45,45,0.12)]">
          <h3
            className="text-xl font-medium tracking-[-0.02em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {isAlreadyPublished
              ? "Undangan sudah dipublikasikan"
              : "Publikasikan undangan"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-primary/55">
            Undangan{" "}
            <span className="font-medium text-primary">
              &quot;{publishTarget.name || "Tanpa Nama"}&quot;
            </span>{" "}
            bisa dibuka lewat link di bawah. Ubah bagian terakhir dengan nama
            tamu.
          </p>

          {publishError && (
            <p className="mt-3 text-sm text-red-600/90">{publishError}</p>
          )}

          {!isAlreadyPublished && (planExpired || slotsFull) && (
            <p className="mt-3 text-sm text-amber-800/80">
              {planExpired
                ? "Paket Anda sudah berakhir. Perpanjang untuk mempublikasikan."
                : `Slot undangan aktif penuh (${slotLabel}). Arsipkan undangan lain terlebih dahulu.`}
            </p>
          )}

          {!isAlreadyPublished && (
            <button
              type="button"
              className="landing-btn landing-btn-primary mt-6 w-full disabled:opacity-60"
              disabled={publishLoading || planExpired || slotsFull}
              onClick={async () => {
                setPublishLoading(true);
                setPublishError(null);
                const res = await api.patch<ProjectData>(
                  `/api/projects/${publishTarget.id}`,
                  { status: "published" }
                );
                if (res.success && res.data) {
                  setProjects((prev) =>
                    prev.map((p) =>
                      p.id === publishTarget.id
                        ? { ...p, status: "published" }
                        : p
                    )
                  );
                  setPublishTarget((prev) =>
                    prev ? { ...prev, status: "published" } : prev
                  );
                } else {
                  setPublishError(
                    res.success === false
                      ? res.error || "Gagal mempublikasikan undangan."
                      : "Gagal mempublikasikan undangan."
                  );
                }
                setPublishLoading(false);
              }}
            >
              {publishLoading ? "Memublikasikan…" : "Publikasikan sekarang"}
            </button>
          )}

          <div className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
              Link undangan
            </p>
            <div className="mt-3 flex items-start gap-2">
              <code className="min-w-0 flex-1 break-all rounded-xl border border-primary/10 bg-[#f7f6f3] px-3 py-2 text-[12px] text-primary/70">
                {fullExampleUrl}
              </code>
              <button
                type="button"
                className="landing-btn landing-btn-ghost shrink-0 !px-3 !py-2 text-sm"
                onClick={() => {
                  if (typeof window === "undefined") return;
                  void navigator.clipboard.writeText(fullExampleUrl);
                }}
              >
                Salin
              </button>
            </div>
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-primary/40">
            Format:{" "}
            <code className="text-primary/55">
              /wedding-invitation/{publishTarget.id}/{encodedName}/NamaTamu
            </code>
          </p>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm"
              onClick={() => {
                setPublishTarget(null);
                setPublishError(null);
                setPublishLoading(false);
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ArchiveModal = () => {
    if (!archiveTarget) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/40 px-5">
        <div className="w-full max-w-sm rounded-2xl border border-primary/10 bg-white px-6 py-7 shadow-[0_24px_64px_rgba(45,45,45,0.12)]">
          <h3
            className="text-xl font-medium tracking-[-0.02em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Arsipkan proyek?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-primary/55">
            Proyek{" "}
            <span className="font-medium text-primary">
              &quot;{archiveTarget.name || "Tanpa Nama"}&quot;
            </span>{" "}
            akan diarsipkan. Link undangan tidak bisa diakses sampai diaktifkan
            lagi.
          </p>

          {archiveError && (
            <p className="mt-3 text-sm text-red-600/90">{archiveError}</p>
          )}

          <div className="mt-8 flex justify-end gap-2">
            <button
              type="button"
              className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm"
              disabled={archiveLoading}
              onClick={() => {
                setArchiveTarget(null);
                setArchiveError(null);
              }}
            >
              Batal
            </button>
            <button
              type="button"
              className="landing-btn landing-btn-primary !px-4 !py-2 text-sm disabled:opacity-60"
              disabled={archiveLoading}
              onClick={async () => {
                if (!archiveTarget) return;
                setArchiveLoading(true);
                setArchiveError(null);

                const res = await api.patch<ProjectData>(
                  `/api/projects/${archiveTarget.id}`,
                  { status: "archived" }
                );

                if (res.success) {
                  setProjects((prev) =>
                    prev.map((p) =>
                      p.id === archiveTarget.id
                        ? { ...p, status: "archived" }
                        : p
                    )
                  );
                  setArchiveTarget(null);
                } else {
                  setArchiveError(
                    res.error || "Gagal mengarsipkan proyek. Coba lagi."
                  );
                }

                setArchiveLoading(false);
              }}
            >
              {archiveLoading ? "Mengarsipkan…" : "Arsipkan"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="landing-root flex min-h-screen flex-col bg-[#f7f6f3] text-primary">
      <Navbar />
      <DeleteModal />
      <PublishModal />
      <ArchiveModal />

      {!authReady ? (
        <div className="flex flex-1 items-center justify-center px-5 py-32">
          <p className="text-sm text-primary/45">Memeriksa sesi…</p>
        </div>
      ) : (
      <div className="flex flex-1 flex-col">
        <section className="px-5 pb-8 pt-36 sm:px-8 lg:px-14 lg:pt-40">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary/40">
                Proyek
              </p>
              <h1
                className="mt-4 max-w-[16ch] text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[0.95] tracking-[-0.035em] text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Undangan Anda
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary/50">
                Lanjutkan edit, publikasikan, atau arsipkan undangan yang sudah
                dibuat.
              </p>
              {!loading && entitlements && (
                <p className="mt-4 text-sm text-primary/60">
                  <span className="font-medium text-primary">{slotLabel}</span>
                  {planExpired
                    ? " · Paket berakhir — publikasi dinonaktifkan"
                    : slotsFull
                      ? " · Slot penuh — arsipkan undangan lain untuk menerbitkan baru"
                      : null}
                </p>
              )}
            </div>
            <Link
              href="/templates"
              className="landing-btn landing-btn-primary shrink-0"
            >
              Buat proyek baru
            </Link>
          </div>
        </section>

        <section className="flex-1 px-5 pb-20 sm:px-8 lg:px-14 lg:pb-28">
          <div className="mx-auto max-w-[1200px]">
            {loading && (
              <p className="border-t border-primary/8 py-12 text-sm text-primary/45">
                Memuat proyek…
              </p>
            )}

            {!loading && projects.length === 0 && (
              <div className="border-t border-primary/8 py-16">
                <h2
                  className="text-2xl font-medium tracking-[-0.02em] text-primary"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Belum ada proyek
                </h2>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-primary/50">
                  Pilih template dan buat undangan pertama Anda.
                </p>
                <Link
                  href="/templates"
                  className="landing-btn landing-btn-primary mt-8 inline-flex"
                >
                  Pilih template
                </Link>
              </div>
            )}

            {!loading && projects.length > 0 && (
              <ul className="divide-y divide-primary/8 border-t border-primary/8">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="flex flex-col gap-6 py-8 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      {editingId === project.id ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="min-w-[12rem] flex-1 rounded-xl border border-primary/10 bg-white px-3 py-2 text-sm text-primary outline-none transition-[border-color] duration-200 focus:border-primary/35"
                          />
                          <button
                            type="button"
                            className="text-sm font-medium text-primary"
                            onClick={async () => {
                              if (!editingName.trim()) return;
                              const res = await api.patch<ProjectData>(
                                `/api/projects/${project.id}`,
                                { name: editingName.trim() }
                              );
                              if (res.success) {
                                setProjects((prev) =>
                                  prev.map((p) =>
                                    p.id === project.id
                                      ? { ...p, name: editingName.trim() }
                                      : p
                                  )
                                );
                                setEditingId(null);
                              }
                            }}
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            className="text-sm text-primary/45"
                            onClick={() => {
                              setEditingId(null);
                              setEditingName("");
                            }}
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h2
                            className="text-xl font-medium tracking-[-0.02em] text-primary"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {project.name}
                          </h2>
                          <button
                            type="button"
                            className="text-[13px] text-primary/45 underline decoration-primary/20 underline-offset-2 transition-colors duration-200 hover:text-primary"
                            onClick={() => {
                              setEditingId(project.id);
                              setEditingName(project.name);
                            }}
                          >
                            Ubah nama
                          </button>
                        </div>
                      )}

                      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                        {statusLabel(project.status)}
                        <span className="mx-2 text-primary/20">·</span>
                        {project.template_type ?? project.template_slug ?? "—"}
                        <span className="mx-2 text-primary/20">·</span>
                        {Number(project.view_count || 0).toLocaleString("id-ID")}{" "}
                        views
                      </p>

                      <p className="mt-4 text-sm text-primary/45">
                        Dibuat{" "}
                        {project.created_at
                          ? new Date(project.created_at).toLocaleDateString("id-ID")
                          : "—"}
                        <span className="mx-2 text-primary/20">·</span>
                        Diubah{" "}
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleDateString("id-ID")
                          : "—"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:max-w-md lg:justify-end">
                      <Link
                        href={`/editor/${project.id}`}
                        className="landing-btn landing-btn-primary !px-4 !py-2 text-sm"
                      >
                        Lanjutkan edit
                      </Link>
                      <Link
                        href={`/projects/${project.id}/tamu`}
                        className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm"
                      >
                        Tamu / RSVP
                      </Link>

                      {project.status !== "archived" && (
                        <button
                          type="button"
                          className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
                          disabled={
                            publishLoading && publishTarget?.id === project.id
                          }
                          onClick={() => {
                            setPublishTarget(project);
                            setPublishError(null);
                          }}
                        >
                          {project.status === "published"
                            ? "Salin link"
                            : "Publikasikan"}
                        </button>
                      )}

                      {project.status === "archived" ? (
                        <button
                          type="button"
                          className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
                          disabled={reactivateId === project.id}
                          onClick={async () => {
                            setReactivateId(project.id);
                            const res = await api.patch<ProjectData>(
                              `/api/projects/${project.id}`,
                              { status: "draft" }
                            );
                            if (res.success) {
                              setProjects((prev) =>
                                prev.map((p) =>
                                  p.id === project.id
                                    ? { ...p, status: "draft" }
                                    : p
                                )
                              );
                            }
                            setReactivateId(null);
                          }}
                        >
                          {reactivateId === project.id
                            ? "Mengaktifkan…"
                            : "Aktifkan"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
                          disabled={archiveLoading}
                          onClick={() => {
                            setArchiveTarget(project);
                            setArchiveError(null);
                          }}
                        >
                          Arsipkan
                        </button>
                      )}

                      <button
                        type="button"
                        className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm text-red-700/80 hover:border-red-300 disabled:opacity-50"
                        disabled={deletingId === project.id}
                        onClick={() => {
                          setDeleteTarget(project);
                          setDeleteError(null);
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
      )}

      <Footer />
    </main>
  );
}
