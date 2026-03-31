"use client";

import { ArrowUp, ArrowDown, Activity, Heart, Brain, Calendar, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Analíticas de Salud</h2>
                    <p className="text-muted-foreground">Impacto clínico y evolución de síntomas en la población.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium bg-white border border-border rounded-lg hover:bg-muted">Exportar PDF</button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Mejora de Síntomas (PFDI-20)
                    </h3>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
                        <p className="text-muted-foreground">Gráfico de Línea: Evolución Promedio (Placeholder)</p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Los usuarios reportan una mejora del <span className="font-bold text-green-600">45%</span> en sus síntomas tras 4 semanas de uso.
                    </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Adherencia al Tratamiento
                    </h3>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
                        <p className="text-muted-foreground">Gráfico de Barras: Sesiones por Semana (Placeholder)</p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        El <span className="font-bold text-foreground">68%</span> de los usuarios completa al menos 3 sesiones semanales.
                    </p>
                </div>
            </div>
        </div>
    );
}
