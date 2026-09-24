"use client";

import {
    ArchiveRestore,
    Edit2,
    EyeOff,
    FileText,
    Plus,
    Send,
    Stethoscope,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, ClinicalForm } from "@/lib/api";
import { cn } from "@/lib/utils";

type Vista = "todos" | "draft" | "active" | "archived";

const VISTAS: { id: Vista; etiqueta: string; vacio: string }[] = [
    { id: "todos", etiqueta: "Todos", vacio: "No hay formularios creados." },
    { id: "draft", etiqueta: "Borradores", vacio: "No hay borradores." },
    { id: "active", etiqueta: "Publicados", vacio: "Todavía no publicaste ningún formulario." },
    { id: "archived", etiqueta: "Archivados", vacio: "No hay formularios archivados." },
];

const ESTADOS: Record<string, { texto: string; clase: string }> = {
    active: { texto: "Publicado", clase: "bg-green-100 text-green-700" },
    draft: { texto: "Borrador", clase: "bg-amber-100 text-amber-800" },
    archived: { texto: "Archivado", clase: "bg-gray-200 text-gray-600" },
};

export default function ClinicalPage() {
    const [forms, setForms] = useState<ClinicalForm[]>([]);
    const [vista, setVista] = useState<Vista>("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ocupado, setOcupado] = useState<string | null>(null);

    const loadForms = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getForms(0, 20, vista === "todos" ? undefined : vista);
            setForms(data.items);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Error cargando formularios");
        } finally {
            setLoading(false);
        }
    }, [vista]);

    useEffect(() => {
        loadForms();
    }, [loadForms]);

    const ejecutar = async (id: string, accion: () => Promise<unknown>, falla: string) => {
        setOcupado(id);
        try {
            await accion();
            await loadForms();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : falla);
        } finally {
            setOcupado(null);
        }
    };

    const publicar = (form: ClinicalForm) => {
        if (form.question_count === 0) {
            alert("Agregá al menos una pregunta antes de publicar.");
            return;
        }
        ejecutar(form.form_id, () => api.publishForm(form.form_id), "No se pudo publicar");
    };

    const despublicar = (form: ClinicalForm) => {
        if (!confirm("Dejará de mostrarse en la app. Las respuestas ya cargadas no se tocan.")) return;
        ejecutar(form.form_id, () => api.unpublishForm(form.form_id), "No se pudo despublicar");
    };

    const archivar = (form: ClinicalForm) => {
        if (!confirm("Se archiva y deja de mostrarse. Vas a poder restaurarlo desde la pestaña Archivados.")) return;
        ejecutar(form.form_id, () => api.deleteForm(form.form_id), "No se pudo archivar");
    };

    const restaurar = (form: ClinicalForm) => {
        ejecutar(form.form_id, () => api.restoreForm(form.form_id), "No se pudo restaurar");
    };

    const vistaActual = VISTAS.find((v) => v.id === vista)!;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Estudio Clínico</h2>
                    <p className="text-muted-foreground">Diseña y gestiona los cuestionarios de evaluación.</p>
                </div>
                <Link
                    href="/clinical/editor"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Formulario
                </Link>
            </div>

            <div className="flex gap-1 border-b border-border">
                {VISTAS.map((v) => (
                    <button
                        key={v.id}
                        onClick={() => setVista(v.id)}
                        aria-current={vista === v.id ? "page" : undefined}
                        className={cn(
                            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                            vista === v.id
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {v.etiqueta}
                    </button>
                ))}
            </div>

            {loading && <p className="text-muted-foreground">Cargando formularios...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && forms.length === 0 && (
                <div className="text-center py-10 bg-muted/30 rounded-xl">
                    <p className="text-muted-foreground">{vistaActual.vacio}</p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => {
                    const estado = ESTADOS[form.status] ?? { texto: form.status, clase: "bg-gray-100 text-gray-700" };
                    const trabajando = ocupado === form.form_id;

                    return (
                        <div
                            key={form.form_id}
                            className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-all flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", estado.clase)}>
                                    {estado.texto}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold font-heading mb-2">{form.code}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2" title={form.title_key}>
                                {form.title_key || "Sin título"}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                    <Stethoscope className="h-3 w-3" />
                                    {form.question_count} preguntas
                                </span>
                                <span className="px-2 py-0.5 bg-muted rounded">v{form.version}</span>
                                {form.targets.length > 0 ? (
                                    form.targets.map((t) => (
                                        <span key={t.target_id} className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                                            {t.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="px-2 py-0.5 bg-muted rounded">Todas</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-auto">
                                {form.status === "archived" ? (
                                    <button
                                        onClick={() => restaurar(form)}
                                        disabled={trabajando}
                                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        <ArchiveRestore className="h-4 w-4" />
                                        Restaurar
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href={`/clinical/editor?id=${form.form_id}`}
                                            className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-muted text-foreground rounded-lg py-2 hover:bg-muted/70 transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Editar
                                        </Link>

                                        {form.status === "draft" ? (
                                            <button
                                                onClick={() => publicar(form)}
                                                disabled={trabajando}
                                                title="Publicar: a partir de acá lo ven las usuarias"
                                                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                                            >
                                                <Send className="h-4 w-4" />
                                                Publicar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => despublicar(form)}
                                                disabled={trabajando}
                                                title="Volver a borrador: deja de mostrarse en la app"
                                                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium border border-border rounded-lg py-2 hover:bg-muted transition-colors disabled:opacity-50"
                                            >
                                                <EyeOff className="h-4 w-4" />
                                                Despublicar
                                            </button>
                                        )}

                                        <button
                                            onClick={() => archivar(form)}
                                            disabled={trabajando}
                                            title="Archivar"
                                            aria-label={`Archivar ${form.code}`}
                                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
