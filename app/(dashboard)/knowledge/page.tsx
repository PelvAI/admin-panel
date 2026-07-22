"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { api } from "@/lib/api";
import type { RagDocument, ReindexStatus } from "@/lib/types/rag";

export default function KnowledgePage() {
  const [docs, setDocs] = useState<RagDocument[]>([]);
  const [status, setStatus] = useState<ReindexStatus | null>(null);
  const [summary, setSummary] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await api.listRagDocuments();
    setDocs(data.documents || []);
    const st = await api.getReindexStatus();
    setStatus(st);
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh()
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));

    api
      .getRagAnalyticsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [refresh]);

  useEffect(() => {
    if (!status?.running) return;
    const t = setInterval(() => {
      api.getReindexStatus().then(setStatus).catch(console.error);
    }, 2500);
    return () => clearInterval(t);
  }, [status?.running]);

  async function onUpload(fileList: FileList | null) {
    if (!fileList?.length) return;
    setBusy(true);
    setError(null);
    try {
      await api.uploadRagDocuments(Array.from(fileList));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload falló");
    } finally {
      setBusy(false);
    }
  }

  async function onReindex() {
    setBusy(true);
    setError(null);
    try {
      await api.confirmReindex(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reindex falló");
    } finally {
      setBusy(false);
    }
  }

  async function onToggleIndexed(doc: RagDocument) {
    setBusy(true);
    setError(null);
    try {
      await api.patchRagDocument(doc.id, { indexed: !doc.indexed });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(doc: RagDocument) {
    if (!confirm(`¿Eliminar ${doc.filename}?`)) return;
    setBusy(true);
    setError(null);
    try {
      await api.deleteRagDocument(doc.id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-heading flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Conocimiento RAG
        </h2>
        <p className="text-muted-foreground">
          Sube guías clínicas y actualiza el índice del asistente. Todas las
          peticiones van al backend Alma (nunca al chatbot directamente).
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Solo fuentes confiables. El texto ingerido se trata como no confiable por
        el asistente (no sustituye valoración clínica).
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium cursor-pointer hover:bg-muted transition-colors disabled:opacity-50">
            <Upload className="h-4 w-4" />
            Subir documentos
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.html,.epub,.xhtml"
              disabled={busy || loading}
              className="hidden"
              onChange={(e) => {
                onUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          <button
            type="button"
            disabled={busy || status?.running || loading}
            onClick={onReindex}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            {status?.running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {status?.running ? "Indexando…" : "Indexar documentos"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Tras subir, pulsa &quot;Indexar documentos&quot; para actualizar el vector
          store. Formatos: PDF, TXT, HTML, EPUB.
        </p>

        {status && (
          <pre className="text-xs bg-muted/40 p-3 rounded-lg overflow-auto max-h-40">
            {JSON.stringify(status, null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-medium">Documentos</h3>
          {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Cargando documentos…
          </div>
        ) : docs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No hay documentos. Sube una guía clínica para empezar.
            <br />
            <span className="text-xs">
              Si el backend aún no expone /admin/rag/*, verás un error arriba.
            </span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left">
              <tr>
                <th className="p-3">Archivo</th>
                <th className="p-3">Indexado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-medium">{d.filename}</div>
                    {d.rel_path && (
                      <div className="text-xs text-muted-foreground truncate max-w-md">
                        {d.rel_path}
                      </div>
                    )}
                  </td>
                  <td className="p-3">{d.indexed ? "Sí" : "No"}</td>
                  <td className="p-3 space-x-3">
                    <button
                      type="button"
                      disabled={busy}
                      className="text-primary text-xs font-medium disabled:opacity-50"
                      onClick={() => onToggleIndexed(d)}
                    >
                      Toggle índice
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className="text-red-600 text-xs font-medium inline-flex items-center gap-1 disabled:opacity-50"
                      onClick={() => onDelete(d)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <h3 className="font-medium">Analytics RAG</h3>
        <p className="text-xs text-muted-foreground">
          Resumen del motor RAG (distinto de &quot;Analíticas de Salud&quot; clínicas).
        </p>
        {summary ? (
          <pre className="text-xs bg-muted/40 p-3 rounded-lg overflow-auto max-h-64">
            {JSON.stringify(summary, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin datos de analytics (endpoint no disponible o vacío).
          </p>
        )}
      </div>
    </div>
  );
}
