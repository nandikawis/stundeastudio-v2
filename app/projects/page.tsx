"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProjectData } from "../lib/mockData";
import { api, setAccessToken } from "../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
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
    const storedUserId =
      typeof window !== "undefined" ? localStorage.getItem("user_uuid") : null;
    setUserId(storedUserId);

    if (!storedUserId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const res = await api.get<ProjectData[]>("/api/projects");
      if (cancelled) return;
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        if (res.success === false && res.error?.toLowerCase().includes("auth")) {
          setAccessToken(null);
        }
        setProjects([]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const DeleteModal = () => {
    if (!deleteTarget) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Hapus Proyek?
          </h3>
          <p className="text-sm text-muted mb-4">
            Proyek{" "}
            <span className="font-semibold">
              "{deleteTarget.name || "Tanpa Nama"}"
            </span>{" "}
            akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>

          {deleteError && (
            <p className="text-xs text-red-600 mb-3">{deleteError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-full border border-border text-xs text-muted hover:bg-gray-50 transition-colors"
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
              className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
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
                    res.error || "Gagal menghapus proyek. Coba lagi beberapa saat."
                  );
                }

                setDeletingId(null);
                setDeleteLoading(false);
              }}
            >
              {deleteLoading ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PublishModal = () => {
    if (!publishTarget) return null;

    const isAlreadyPublished = publishTarget.status === "published";
    // Use project name directly (URL-encoded) instead of slug column
    const projectName = publishTarget.name || publishTarget.id;
    const encodedName = encodeURIComponent(projectName);
    // Public-facing wedding invitation URL (separate route namespace)
    const basePath = `/wedding-invitation/${publishTarget.id}/${encodedName}`;
    const examplePath = `${basePath}/NamaTamu`;
    const fullExampleUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${examplePath}`
        : examplePath;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <h3 className="text-lg font-semibold text-primary mb-2">
            {isAlreadyPublished ? "Undangan sudah dipublikasikan" : "Publikasikan Undangan"}
          </h3>
          <p className="text-sm text-muted mb-4">
            Undangan{" "}
            <span className="font-semibold">
              "{publishTarget.name || "Tanpa Nama"}"
            </span>{" "}
            akan dapat diakses dengan link di bawah ini. Kamu bisa mengubah bagian
            terakhir link dengan nama tamu, misalnya{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">
              Albert&amp;Rose
            </code>
            .
          </p>

          {publishError && (
            <p className="text-xs text-red-600 mb-3">{publishError}</p>
          )}

          {!isAlreadyPublished && (
            <button
              type="button"
              className="w-full mb-4 px-4 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary-light transition-colors disabled:opacity-60"
              disabled={publishLoading}
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
                      p.id === publishTarget.id ? { ...p, status: "published" } : p
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
              {publishLoading ? "Memublikasikan..." : "Publikasikan Sekarang"}
            </button>
          )}

          <div className="mb-3">
            <p className="text-xs font-semibold text-primary mb-1">
              Link Undangan:
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <code className="block text-[11px] bg-gray-100 px-2 py-1 rounded break-all">
                  {fullExampleUrl}
                </code>
              </div>
              <button
                type="button"
                className="shrink-0 px-3 py-1.5 rounded-full border border-border text-[11px] text-primary hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (typeof window === "undefined") return;
                  void navigator.clipboard.writeText(fullExampleUrl);
                }}
              >
                Salin
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted mb-4">
            Format:{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">
              /wedding-invitation/{publishTarget.id}/{encodedName}/NamaTamu
            </code>
            . Ubah <code className="bg-gray-100 px-1 py-0.5 rounded">NamaTamu</code>{" "}
            menjadi nama tamu yang ingin kamu kirimi link.
          </p>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-full border border-border text-xs text-muted hover:bg-gray-50 transition-colors"
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Arsipkan Proyek?
          </h3>
          <p className="text-sm text-muted mb-4">
            Proyek{" "}
            <span className="font-semibold">
              &quot;{archiveTarget.name || "Tanpa Nama"}&quot;
            </span>{" "}
            akan diarsipkan. Link undangan tidak lagi dapat diakses sampai kamu
            mengaktifkan kembali dan memublikasikan lagi.
          </p>

          {archiveError && (
            <p className="text-xs text-red-600 mb-3">{archiveError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-full border border-border text-xs text-muted hover:bg-gray-50 transition-colors"
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
              className="px-4 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary-light transition-colors disabled:opacity-60"
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
                      p.id === archiveTarget.id ? { ...p, status: "archived" } : p
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
              {archiveLoading ? "Mengarsipkan..." : "Arsipkan"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Delete confirmation modal */}
      <DeleteModal />
      {/* Publish modal */}
      <PublishModal />
      {/* Archive confirmation modal */}
      <ArchiveModal />

      <section className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Proyek Undangan Saya
              </h1>
              <p className="text-sm text-muted mt-2">
                Lihat dan lanjutkan undangan yang sudah kamu buat.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/templates"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
              >
                + Buat Proyek Baru
              </Link>
            </div>
          </div>

          {!userId && (
            <div className="border border-border rounded-2xl bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-primary mb-2">
                Silakan masuk terlebih dahulu
              </h2>
              <p className="text-sm text-muted mb-4">
                Kamu perlu login untuk melihat dan menyimpan proyek undanganmu.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
              >
                Masuk ke Akun
              </Link>
            </div>
          )}

          {userId && (
            <>
              {loading ? (
                <p className="text-sm text-muted">Memuat proyek...</p>
              ) : projects.length === 0 ? (
                <div className="border border-dashed border-border rounded-2xl bg-white/60 p-8 h-[50vh] flex flex-col justify-center items-center text-center">
                  <h2 className="text-lg font-semibold text-primary mb-2">
                    Belum ada proyek
                  </h2>
                  <p className="text-sm text-muted mb-4">
                    Mulai dengan memilih template dan buat undangan pertamamu.
                  </p>
                  <Link
                    href="/templates"
                    className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
                  >
                    Pilih Template
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="bg-white border border-border rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          {editingId === project.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="px-2 py-1 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                              />
                              <button
                                type="button"
                                className="text-[11px] text-primary font-medium"
                                onClick={async () => {
                                  if (!editingName.trim()) return;
                                  const res = await api.patch<ProjectData>(
                                    `/api/projects/${project.id}`,
                                    { name: editingName.trim() }
                                  );
                                  if (res.success) {
                                    setProjects((prev) =>
                                      prev.map((p) =>
                                        p.id === project.id ? { ...p, name: editingName.trim() } : p
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
                                className="text-[11px] text-muted"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingName("");
                                }}
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h2 className="text-base font-semibold text-primary">
                                {project.name}
                              </h2>
                              <button
                                type="button"
                                className="text-[11px] text-primary underline"
                                onClick={() => {
                                  setEditingId(project.id);
                                  setEditingName(project.name);
                                }}
                              >
                                Ubah nama
                              </button>
                            </div>
                          )}
                          <p className="text-xs text-muted">
                            Template: {project.template_type ?? project.template_slug ?? "—"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            project.status === "published"
                              ? "bg-green-100 text-green-700"
                              : project.status === "archived"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {project.status === "draft"
                            ? "Draft"
                            : project.status === "published"
                            ? "Published"
                            : "Archived"}
                        </span>
                      </div>

                      <div className="text-xs text-muted mb-4">
                        <p>
                          Dibuat:{" "}
                          {project.created_at
                            ? new Date(project.created_at).toLocaleString()
                            : "-"}
                        </p>
                        <p>
                          Terakhir diubah:{" "}
                          {project.updated_at
                            ? new Date(project.updated_at).toLocaleString()
                            : "-"}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/editor/${project.id}`}
                            className="flex-1 min-w-0 inline-flex items-center justify-center px-3 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary-light transition-colors"
                          >
                            Lanjutkan Edit
                          </Link>
                          {project.status === "archived" ? (
                            <button
                              type="button"
                              className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-primary/40 text-[11px] text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
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
                                      p.id === project.id ? { ...p, status: "draft" } : p
                                    )
                                  );
                                }
                                setReactivateId(null);
                              }}
                            >
                              {reactivateId === project.id ? "Mengaktifkan..." : "Aktifkan Kembali"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-gray-300 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                            className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-red-200 text-[11px] text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            disabled={deletingId === project.id}
                            onClick={() => {
                              setDeleteTarget(project);
                              setDeleteError(null);
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                        {project.status !== "archived" && (
                          <button
                            type="button"
                            className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-border text-[11px] text-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={publishLoading && publishTarget?.id === project.id}
                            onClick={() => {
                              setPublishTarget(project);
                              setPublishError(null);
                            }}
                          >
                            {project.status === "published"
                              ? "Lihat & Salin Link"
                              : "Publikasikan & Lihat Link"}
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

