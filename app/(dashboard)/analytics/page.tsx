"use client";

import { ArrowUp, ArrowDown, Activity, Heart, Brain, Calendar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Analíticas de Salud"
                description="Impacto clínico y evolución de síntomas en la población."
                action={<Button variant="outline">Exportar PDF</Button>}
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        Mejora de Síntomas (PFDI-20)
                    </h3>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
                        <p className="text-muted-foreground">Gráfico de Línea: Evolución Promedio (Placeholder)</p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Los usuarios reportan una mejora del <span className="font-bold text-success">45%</span> en sus síntomas tras 4 semanas de uso.
                    </p>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-info" />
                        Adherencia al Tratamiento
                    </h3>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
                        <p className="text-muted-foreground">Gráfico de Barras: Sesiones por Semana (Placeholder)</p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        El <span className="font-bold text-foreground">68%</span> de los usuarios completa al menos 3 sesiones semanales.
                    </p>
                </Card>
            </div>
        </div>
    );
}
