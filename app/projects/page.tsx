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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Delete confirmation modal */}
      <DeleteModal />

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

                      <div className="mt-auto flex gap-2">
                        <Link
                          href={`/editor/${project.id}`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary-light transition-colors"
                        >
                          Lanjutkan Edit
                        </Link>
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

