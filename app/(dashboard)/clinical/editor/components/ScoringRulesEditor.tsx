import { Trash2, AlertTriangle, Calculator, Activity, ArrowRight, Settings2 } from "lucide-react";
import { useState } from "react";
import { RuleConfigDialog } from "./RuleConfigDialog";

interface ScoringRule {
    rule_id: string;
    variable_name: string;
    formula: string;
    alert_condition: string;
    alert_type: string;
    target_id: string | null;
    is_total: boolean;
    interpretation_ranges: Record<string, string> | null;
    order_index: number;
}

interface ScoringRulesEditorProps {
    rules: ScoringRule[];
    targets: any[];
    onAdd: () => void;
    onUpdate: (idx: number, field: string, value: any) => void;
    onDelete: (idx: number, ruleId: string) => void;
}

export function ScoringRulesEditor({ rules, targets, onAdd, onUpdate, onDelete }: ScoringRulesEditorProps) {
    const [activeRuleIdx, setActiveRuleIdx] = useState<number | null>(null);

    // Helper to get active rule data safely
    const activeRule = activeRuleIdx !== null ? rules[activeRuleIdx] : null;

    if (!rules || rules.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/5 space-y-3">
                <div className="flex justify-center">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-muted-foreground" />
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-foreground">No hay reglas de interpretación</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                        Define fórmulas matemáticas para calcular puntajes totales y configura alertas automáticas basándote en los resultados.
                    </p>
                </div>
                <button
                    onClick={onAdd}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Crear Primera Regla
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {rules.map((rule, idx) => (
                    <div key={rule.rule_id || idx} className="group bg-card border border-border shadow-sm rounded-xl p-5 hover:border-primary/50 transition-colors relative">
                        {/* Delete Action */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onDelete(idx, rule.rule_id)}
                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Eliminar regla"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Left Column: Definition */}
                            <div className="md:col-span-4 space-y-4 border-r border-border/50 pr-4">
                                <div>
                                    <label className="text-[10px] items-center gap-1.5 font-bold text-muted-foreground uppercase flex mb-1.5">
                                        <Activity className="h-3 w-3" /> Variable de Salida
                                    </label>
                                    <input
                                        type="text"
                                        value={rule.variable_name || ""}
                                        onChange={(e) => onUpdate(idx, 'variable_name', e.target.value)}
                                        className="w-full text-base font-bold font-mono bg-muted/30 px-3 py-2 rounded-lg border border-transparent focus:border-primary focus:outline-none focus:bg-background transition-all placeholder:font-normal"
                                        placeholder="ej: iciq_score_total"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">Nombre único para usar en otras fórmulas.</p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Aplica a (Contexto)</label>
                                    <select
                                        value={rule.target_id || ""}
                                        onChange={(e) => onUpdate(idx, 'target_id', e.target.value || null)}
                                        className="w-full text-sm bg-background px-2 py-2 rounded-lg border border-input focus:border-primary focus:outline-none"
                                    >
                                        <option value="">🌎 Global (Todos los usuarios)</option>
                                        {targets.map(t => (
                                            <option key={t.target_id} value={t.target_id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Middle Column: Calculation */}
                            <div className="md:col-span-4 space-y-4">
                                <div>
                                    <label className="text-[10px] items-center gap-1.5 font-bold text-muted-foreground uppercase flex mb-1.5">
                                        <Calculator className="h-3 w-3" /> Fórmula Matemática
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={rule.formula || ""}
                                            onChange={(e) => onUpdate(idx, 'formula', e.target.value)}
                                            className="w-full text-sm font-mono bg-blue-50/50 text-blue-900 px-3 py-2 rounded-lg border border-blue-100 focus:border-blue-500 focus:outline-none transition-all placeholder:text-blue-300"
                                            placeholder="ej: q1_freq + q2_amount + (q3 * 2)"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Usa los IDs de las preguntas (ej: <code>frequency</code>, <code>amount</code>) y operadores matemáticos (+, -, *, /). Agregá <code>__valor</code> al ID para usar la respuesta en crudo en vez de su puntaje.</p>
                                </div>

                                <label className="flex items-start gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={!!rule.is_total}
                                        onChange={(e) => onUpdate(idx, 'is_total', e.target.checked)}
                                        className="mt-0.5 accent-primary"
                                    />
                                    <span>
                                        <span className="text-xs font-semibold text-foreground block">Este es el puntaje total</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            Es el número que ve la paciente al terminar. Marcá una sola regla por formulario.
                                        </span>
                                    </span>
                                </label>

                                {rule.is_total && (
                                    <div className="space-y-2 pl-6">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                                            Interpretación del puntaje
                                        </label>
                                        {Object.entries(rule.interpretation_ranges || {}).map(
                                            ([rango, etiqueta], i) => (
                                                <div key={i} className="flex gap-1.5 items-center">
                                                    <input
                                                        type="text"
                                                        value={rango}
                                                        onChange={(e) => {
                                                            const pares = Object.entries(rule.interpretation_ranges || {});
                                                            pares[i] = [e.target.value, etiqueta];
                                                            onUpdate(idx, 'interpretation_ranges', Object.fromEntries(pares));
                                                        }}
                                                        className="w-24 text-xs font-mono bg-muted/30 px-2 py-1.5 rounded border border-input focus:border-primary focus:outline-none"
                                                        placeholder="0-5"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={etiqueta}
                                                        onChange={(e) => {
                                                            const pares = Object.entries(rule.interpretation_ranges || {});
                                                            pares[i] = [rango, e.target.value];
                                                            onUpdate(idx, 'interpretation_ranges', Object.fromEntries(pares));
                                                        }}
                                                        className="flex-1 text-xs bg-muted/30 px-2 py-1.5 rounded border border-input focus:border-primary focus:outline-none"
                                                        placeholder="Leve"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const pares = Object.entries(rule.interpretation_ranges || {});
                                                            pares.splice(i, 1);
                                                            onUpdate(idx, 'interpretation_ranges', Object.fromEntries(pares));
                                                        }}
                                                        className="text-muted-foreground hover:text-red-600 transition-colors"
                                                        aria-label={`Quitar el rango ${rango}`}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const actuales = rule.interpretation_ranges || {};
                                                onUpdate(idx, 'interpretation_ranges', { ...actuales, "": "" });
                                            }}
                                            className="text-[11px] font-medium text-primary hover:underline"
                                        >
                                            + Agregar rango
                                        </button>
                                        <p className="text-[10px] text-muted-foreground">
                                            Acepta <code>0-5</code>, <code>&gt;=10</code>, <code>&lt;3</code> o un número exacto. Gana el primero que coincide.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Alert/Action (Clean View) */}
                            <div className="md:col-span-4 space-y-4 pl-4 border-l border-border/50 h-full flex flex-col justify-center">
                                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex flex-col gap-3">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-orange-600/80 mb-1 block">Estado de Alerta</label>
                                        <div className="font-semibold text-orange-900 text-sm flex items-center gap-2">
                                            {rule.alert_type === 'derivacion_clinica' ? '🔴 Derivación' :
                                                rule.alert_type === 'activar_plan' ? '🟡 Activar Plan' :
                                                    rule.alert_type === 'mensaje_app' ? '💬 Mensaje' : '🟢 Seguimiento'}

                                            {rule.alert_condition ? (
                                                <span className="text-[10px] px-2 py-0.5 bg-white/50 rounded-full border border-orange-200 text-orange-700 truncate max-w-[120px]">
                                                    {rule.alert_condition}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground font-normal italic">Sin condición</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setActiveRuleIdx(idx)}
                                        className="w-full py-2 bg-white border border-orange-200 shadow-sm rounded-lg text-xs font-semibold text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Settings2 className="h-3.5 w-3.5" /> Configurar Reglas Avanzadas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onAdd}
                className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
                <Calculator className="h-4 w-4" /> Agregar Nueva Regla de Cálculo
            </button>

            {/* Modal for Advanced Logic */}
            {activeRule && (
                <RuleConfigDialog
                    isOpen={true}
                    onClose={() => setActiveRuleIdx(null)}
                    title={`Configuración Avanzada: ${activeRule.variable_name || 'Nueva Regla'}`}
                    description="Define condiciones lógicas complejas y las acciones que desencadenan."
                    alertCondition={activeRule.alert_condition}
                    alertType={activeRule.alert_type}
                    formula={activeRule.formula}
                    variables={["iciq_total", "frecuencia_score", "cantidad_score", "total_score", "q1_val", "q2_val"]}
                    onConditionChange={(val) => onUpdate(activeRuleIdx!, 'alert_condition', val)}
                    onTypeChange={(val) => onUpdate(activeRuleIdx!, 'alert_type', val)}
                />
            )}
        </div>
    );
}
