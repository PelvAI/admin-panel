import { X, Save, Settings, Activity } from "lucide-react";
import { ScoringRulesEditor } from "./ScoringRulesEditor";

interface FormSettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;

    // Form Metadata
    form: any;
    setForm: (form: any) => void;

    // Dependencies
    targets: any[];

    // Handlers for Rules (Proxying to parent or handling here)
    onAddRule: () => void;
    onUpdateRule: (idx: number, field: string, value: any) => void;
    onDeleteRule: (idx: number, id: string) => void;
}

export function FormSettingsDialog({
    isOpen,
    onClose,
    form,
    setForm,
    targets,
    onAddRule,
    onUpdateRule,
    onDeleteRule
}: FormSettingsDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl rounded-xl shadow-2xl border border-border flex flex-col h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/5">
                    <div>
                        <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Configuración Avanzada del Formulario
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Define metadatos técnicos, frecuencia y reglas de interpretación.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* Section 1: Metadata */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2 mb-4">
                            Metadatos y Contexto
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Código Técnico (ID)</label>
                                <input
                                    type="text"
                                    value={form?.code || ""}
                                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    className="w-full text-sm font-mono bg-muted/30 px-3 py-2 rounded-lg border border-input focus:border-primary focus:outline-none"
                                    placeholder="ej: ICIQ-SF"
                                />
                                <p className="text-[10px] text-muted-foreground">Identificador único usado por el sistema.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Target Principal</label>
                                <select
                                    value={form?.target || "todas"}
                                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                                    className="w-full text-sm bg-muted/30 px-3 py-2 rounded-lg border border-input focus:border-primary focus:outline-none"
                                >
                                    <option value="todas">Todas</option>
                                    <option value="embarazadas">Embarazadas</option>
                                    <option value="post_parto">Post Parto</option>
                                    <option value="menopausia">Menopausia</option>
                                    <option value="lactancia">Lactancia</option>
                                    <option value="deportista">Deportista</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Frecuencia de Envío</label>
                                <select
                                    value={form?.frecuencia || "unica_vez"}
                                    onChange={(e) => setForm({ ...form, frecuencia: e.target.value })}
                                    className="w-full text-sm bg-muted/30 px-3 py-2 rounded-lg border border-input focus:border-primary focus:outline-none"
                                >
                                    <option value="unica_vez">Única Vez</option>
                                    <option value="diario">Diario</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="a_demanda">A Demanda</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Disparador Automático</label>
                                <select
                                    value={form?.disparador || "al_registro"}
                                    onChange={(e) => setForm({ ...form, disparador: e.target.value })}
                                    className="w-full text-sm bg-muted/30 px-3 py-2 rounded-lg border border-input focus:border-primary focus:outline-none"
                                >
                                    <option value="manual">Ninguno (Manual)</option>
                                    <option value="al_registro">Al Registro</option>
                                    <option value="bloqueante">Bloqueante (Onboarding)</option>
                                    <option value="dia_7">Día 7</option>
                                    <option value="dia_30">Día 30</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5 mt-4">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Descripción Interna</label>
                            <textarea
                                value={form?.description_key || ""}
                                onChange={(e) => setForm({ ...form, description_key: e.target.value })}
                                className="w-full text-sm bg-muted/30 px-3 py-2 rounded-lg border border-input focus:border-primary focus:outline-none resize-none"
                                rows={2}
                                placeholder="Notas internas sobre el propósito de este formulario..."
                            />
                        </div>
                    </section>

                    {/* Section 2: Scoring Rules */}
                    <section className="space-y-4 pt-4">
                        <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Reglas de Interpretación y Alertas
                            </h3>
                        </div>

                        <div className="bg-muted/10 p-1 rounded-xl">
                            <ScoringRulesEditor
                                rules={form.scoring_rules || []}
                                targets={targets}
                                onAdd={onAddRule}
                                onUpdate={onUpdateRule}
                                onDelete={onDeleteRule}
                            />
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/5 flex justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
    );
}
