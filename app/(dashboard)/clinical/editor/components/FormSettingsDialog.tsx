import { Settings, Activity } from "lucide-react";
import { ScoringRulesEditor } from "./ScoringRulesEditor";
import { Input } from "@/components/ui/Input";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

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
        <Modal className="max-w-4xl h-[85vh]">
            <ModalHeader onClose={onClose}>
                <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Configuración Avanzada del Formulario
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Define metadatos técnicos, frecuencia y reglas de interpretación.</p>
            </ModalHeader>

            {/* Body - Scrollable */}
            <ModalBody className="p-8 space-y-8">

                    {/* Section 1: Metadata */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-label border-b border-border pb-2 mb-4">
                            Metadatos y Contexto
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Código Técnico (ID)</label>
                                <Input
                                    type="text"
                                    value={form?.code || ""}
                                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    className="font-mono bg-muted/30"
                                    placeholder="ej: ICIQ-SF"
                                />
                                <p className="text-[10px] text-muted-foreground">Identificador único usado por el sistema.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Segmentos</label>
                                {targets.length === 0 ? (
                                    <p className="text-xs text-muted-foreground py-2">
                                        No hay segmentos cargados. Creá uno en Clínica → Segmentos.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {targets.map((t) => {
                                            const seleccionado = (form?.target_ids || []).includes(t.target_id);
                                            return (
                                                <button
                                                    key={t.target_id}
                                                    type="button"
                                                    aria-pressed={seleccionado}
                                                    onClick={() => {
                                                        const actuales: string[] = form?.target_ids || [];
                                                        setForm({
                                                            ...form,
                                                            target_ids: seleccionado
                                                                ? actuales.filter((id) => id !== t.target_id)
                                                                : [...actuales, t.target_id],
                                                        });
                                                    }}
                                                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                                        seleccionado
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-muted/30 text-muted-foreground border-input hover:border-primary"
                                                    }`}
                                                >
                                                    {t.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <p className="text-[10px] text-muted-foreground">
                                    {(form?.target_ids || []).length === 0
                                        ? "Sin segmentos: el formulario alcanza a todas las usuarias."
                                        : "El formulario solo se muestra a quienes tengan alguno de estos segmentos."}
                                </p>
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
                                <p className="text-[10px] text-muted-foreground">
                                    {form?.frecuencia === "unica_vez" || !form?.frecuencia
                                        ? "Se responde una sola vez y después queda marcado como completado."
                                        : form?.frecuencia === "a_demanda"
                                        ? "Siempre disponible: la usuaria decide cuándo repetirlo."
                                        : "Vuelve a ofrecerse cumplido el período, contado desde la última respuesta. Los períodos salteados no se acumulan."}
                                </p>
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
                                <p className="text-[10px] text-muted-foreground">
                                    {form?.disparador === "manual"
                                        ? "No aparece en el listado de la app: se llega por enlace directo."
                                        : form?.disparador === "bloqueante"
                                        ? "Encabeza el listado y se marca para que la usuaria empiece por ahí."
                                        : form?.disparador === "dia_7" || form?.disparador === "dia_30"
                                        ? "Recién aparece cumplido ese plazo desde que la usuaria se registró."
                                        : "Disponible desde que la usuaria se registra."}
                                </p>
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
                            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-label flex items-center gap-2">
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
            </ModalBody>

            <ModalFooter>
                <Button onClick={onClose}>Listo</Button>
            </ModalFooter>
        </Modal>
    );
}
