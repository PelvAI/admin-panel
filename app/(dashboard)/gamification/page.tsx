"use client";

import { Trophy, Star, Zap, Plus, Edit2 } from "lucide-react";

export default function GamificationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Gamificación</h2>
                    <p className="text-muted-foreground">Configura niveles, recompensas y reglas de experiencia (XP).</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* XP Rules */}
                <div className="col-span-2 bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Reglas de XP
                    </h3>
                    <div className="space-y-4">
                        {[
                            { action: "Completar Sesión Diaria", xp: 50 },
                            { action: "Racha de 7 días", xp: 100 },
                            { action: "Completar Evaluación", xp: 200 },
                            { action: "Leer Artículo Educativo", xp: 20 },
                        ].map((rule, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                                <span className="font-medium">{rule.action}</span>
                                <div className="flex items-center gap-2">
                                    <input type="number" defaultValue={rule.xp} className="w-16 px-2 py-1 rounded border border-input text-right" />
                                    <span className="text-xs text-muted-foreground">XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors">
                        Guardar Cambios
                    </button>
                </div>

                {/* Levels Preview */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-orange-500" />
                        Niveles
                    </h3>
                    <div className="space-y-4 relative">
                        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-border" />
                        {[
                            { level: 1, name: "Novato", xp: 0 },
                            { level: 2, name: "Aprendiz", xp: 500 },
                            { level: 3, name: "Constante", xp: 1500 },
                            { level: 4, name: "Experto", xp: 3000 },
                            { level: 5, name: "Maestro", xp: 5000 },
                        ].map((lvl) => (
                            <div key={lvl.level} className="relative flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-background border-2 border-primary z-10 flex items-center justify-center font-bold text-xs">
                                    {lvl.level}
                                </div>
                                <div className="flex-1 p-2 bg-muted/50 rounded-lg">
                                    <p className="font-bold text-sm">{lvl.name}</p>
                                    <p className="text-xs text-muted-foreground">{lvl.xp} XP Requeridos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
