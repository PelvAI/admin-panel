"use client";

import { Stethoscope, FileText, Plus, Edit2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, ClinicalForm } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ClinicalPage() {
    const [forms, setForms] = useState<ClinicalForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadForms = async () => {
        try {
            setLoading(true);
            const data = await api.getForms();
            setForms(data.items);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error cargando formularios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadForms();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de archivar este formulario?")) return;
        try {
            await api.deleteForm(id);
            loadForms();
        } catch (err) {
            alert("Error eliminando formulario");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Estudio Clínico</h2>
                    <p className="text-muted-foreground">Diseña y gestiona los cuestionarios de evaluación.</p>
                </div>
                <Link href="/clinical/editor" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Formulario
                </Link>
            </div>

            {loading && <p>Cargando formularios...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && forms.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-xl">
                    <p className="text-muted-foreground">No hay formularios creados.</p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                    <div key={form.form_id} className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                form.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            )}>
                                {form.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold font-heading mb-2">{form.code}</h3>
                        <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2" title={form.title_key}>
                            {form.title_key || "Sin título"}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                            <span className="flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
                                {form.question_count} Preguntas
                            </span>
                            <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                v{form.version}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/clinical/editor?id=${form.form_id}`} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors">
                                <Edit2 className="h-4 w-4" />
                                Editar
                            </Link>
                            <button onClick={() => handleDelete(form.form_id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
