"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertTriangle } from "lucide-react";

interface ContextRulesMatrixProps {
    question: any;
    targets: any[];
    onSave: (questionIdx: number, updatedOptions: any[]) => void;
    onClose: () => void;
    questionIdx: number;
}

/**
 * Regla que combina varios segmentos sobre una misma opción.
 *
 * El tipo está nombrado a propósito: antes se repetía en línea en el estado y
 * en su inicialización, las dos copias divergieron —una omitía `alert`— y eso
 * dejó al panel sin poder compilarse para producción.
 */
type CombinedRule = {
    id: string;
    targets: string[];
    score: number;
    alert?: { type: string; message: string };
};

export function ContextRulesMatrix({ question, targets, onSave, onClose, questionIdx }: ContextRulesMatrixProps) {
    // Local state to manage the matrix edits before saving (Single Target)
    const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>({});

    // State for Combined Rules (Multi-target), indexado por optIdx.
    const [combinedRules, setCombinedRules] = useState<Record<string, CombinedRule[]>>({});

    // UI State for new rule creation
    const [newRule, setNewRule] = useState<{ optIdx: number | null, targets: string[], score: string, alertType: string, alertMessage: string }>({
        optIdx: null,
        targets: [],
        score: "",
        alertType: "",
        alertMessage: ""
    });

    useEffect(() => {
        // Initialize matrix and combinedRules from existing context_rules
        const initialMatrix: Record<string, Record<string, number>> = {};
        const initialCombined: Record<string, CombinedRule[]> = {};

        question.options?.forEach((opt: any, optIdx: number) => {
            if (opt.context_rules) {
                opt.context_rules.forEach((rule: any) => {
                    const ruleTargets = rule.conditions?.targets || [];

                    if (ruleTargets.length === 1) {
                        // Single Target -> Goes to Matrix
                        const targetId = ruleTargets[0];
                        if (!initialMatrix[optIdx]) initialMatrix[optIdx] = {};
                        initialMatrix[optIdx][targetId] = rule.override_score;
                    } else if (ruleTargets.length > 1) {
                        // Multiple Targets -> Goes to Combined Rules
                        if (!initialCombined[optIdx]) initialCombined[optIdx] = [];
                        initialCombined[optIdx].push({
                            id: Math.random().toString(36).substr(2, 9), // Temp ID for UI
                            targets: ruleTargets,
                            score: rule.override_score,
                            alert: rule.alert_config ? { type: rule.alert_config.type, message: rule.alert_config.message } : undefined
                        });
                    }
                });
            }
        });
        setMatrix(initialMatrix);
        setCombinedRules(initialCombined);
    }, [question]);

    const handleCellChange = (optIdx: number, targetId: string, value: string) => {
        const val = value === "" ? undefined : parseInt(value);
        setMatrix(prev => {
            const row = prev[optIdx] || {};
            if (val === undefined) {
                delete row[targetId];
            } else {
                row[targetId] = val;
            }
            return { ...prev, [optIdx]: row };
        });
    };

    const handleAddCombinedRule = () => {
        if (newRule.optIdx === null || newRule.targets.length < 2 || !newRule.score) return;

        const optIdx = newRule.optIdx;
        setCombinedRules(prev => {
            const current = prev[optIdx] || [];
            return {
                ...prev,
                [optIdx]: [...current, {
                    id: Math.random().toString(36).substr(2, 9),
                    targets: newRule.targets,
                    score: parseInt(newRule.score),
                    alert: newRule.alertType ? { type: newRule.alertType, message: newRule.alertMessage } : undefined
                }]
            };
        });

        // Reset form, keep option selected for convenience
        setNewRule(prev => ({ ...prev, targets: [], score: "", alertType: "", alertMessage: "" }));
    };

    const removeCombinedRule = (optIdx: number, ruleId: string) => {
        setCombinedRules(prev => ({
            ...prev,
            [optIdx]: prev[optIdx].filter(r => r.id !== ruleId)
        }));
    };

    const toggleTargetSelection = (targetId: string) => {
        setNewRule(prev => {
            const exists = prev.targets.includes(targetId);
            if (exists) return { ...prev, targets: prev.targets.filter(t => t !== targetId) };
            return { ...prev, targets: [...prev.targets, targetId] };
        });
    };

    const handleSave = () => {
        const updatedOptions = question.options.map((opt: any, optIdx: number) => {
            let rules: any[] = [];

            // 1. Add Matrix Rules (Single Target)
            const matrixRow = matrix[optIdx];
            if (matrixRow) {
                Object.entries(matrixRow).forEach(([targetId, score]) => {
                    rules.push({
                        conditions: { targets: [targetId] },
                        override_score: score
                    });
                });
            }

            // 2. Add Combined Rules (Multi Target)
            const combinedRow = combinedRules[optIdx];
            if (combinedRow) {
                combinedRow.forEach(r => {
                    rules.push({
                        conditions: { targets: r.targets },
                        override_score: r.score,
                        alert_config: r.alert ? { type: r.alert.type, message: r.alert.message } : null
                    });
                });
            }

            return {
                ...opt,
                context_rules: rules.length > 0 ? rules : null
            };
        });

        onSave(questionIdx, updatedOptions);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                    <div>
                        <h3 className="text-lg font-bold">Matriz de Contexto</h3>
                        <p className="text-sm text-muted-foreground">Define puntuaciones para <span className="font-mono text-primary font-medium">{question.text_key || question.variable_name}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-6 space-y-8">

                    {/* SECTION 1: SIMPLE MATRIX */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            Reglas Simples (1 Target)
                        </h4>
                        <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-3 border-b border-border bg-muted/40 sticky top-0 left-0 z-10 min-w-[200px]">
                                                Opción \ Contexto
                                            </th>
                                            {targets.map(t => (
                                                <th key={t.target_id} className="text-center p-2 border-b border-border bg-muted/40 min-w-[100px]">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-bold">{t.name}</span>
                                                        <code className="text-[10px] text-muted-foreground px-1 bg-background rounded border border-border mt-0.5">{t.code}</code>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {question.options?.map((opt: any, optIdx: number) => (
                                            <tr key={optIdx} className="hover:bg-muted/5 border-b border-border/50 transition-colors">
                                                <td className="p-3 border-r border-border sticky left-0 bg-background font-medium">
                                                    {opt.label_key || opt.value}
                                                    <div className="text-xs text-muted-foreground">Base: {opt.score}</div>
                                                </td>
                                                {targets.map(t => {
                                                    const override = matrix[optIdx]?.[t.target_id];
                                                    const hasOverride = override !== undefined;
                                                    return (
                                                        <td key={t.target_id} className={`p-2 text-center border-l border-border/30 ${hasOverride ? 'bg-primary/5' : ''}`}>
                                                            <input
                                                                type="number"
                                                                className={`w-full max-w-[60px] text-center p-1 rounded border transition-all ${hasOverride ? 'border-primary font-bold text-primary shadow-sm' : 'border-input text-muted-foreground/50 focus:text-foreground'} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                                                                placeholder={opt.score.toString()}
                                                                value={override !== undefined ? override : ""}
                                                                onChange={(e) => handleCellChange(optIdx, t.target_id, e.target.value)}
                                                            />
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: COMBINED RULES */}
                    <div className="bg-slate-50 border border-border p-5 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Reglas Avanzadas (Combinaciones)
                            </h4>
                        </div>

                        {/* Existing Combined Rules List */}
                        <div className="space-y-2">
                            {Object.entries(combinedRules).map(([optIdxStr, rules]) => {
                                const optIdx = parseInt(optIdxStr);
                                const option = question.options[optIdx];
                                if (!option || rules.length === 0) return null;

                                return rules.map(rule => (
                                    <div key={rule.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-border shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="font-medium text-sm min-w-[150px]">
                                                Opción: <span className="font-bold">{option.label_key || option.value}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-xs text-muted-foreground mr-1">Si es:</span>
                                                {rule.targets.map(tid => {
                                                    const t = targets.find(tg => tg.target_id === tid);
                                                    return (
                                                        <span key={tid} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold border border-blue-200">
                                                            {t ? t.name : tid}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Nuevo Score:</span>
                                                <span className="font-bold font-mono text-lg text-primary">{rule.score}</span>
                                            </div>
                                            {rule.alert && (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-100/50 text-orange-700 rounded border border-orange-200 text-xs">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    <span className="font-bold uppercase">{rule.alert.type === 'derivacion_clinica' ? 'Derivación' : rule.alert.type === 'activar_plan' ? 'Plan' : 'Seguimiento'}</span>
                                                    {rule.alert.message && <span className="text-orange-600/70 border-l border-orange-200 pl-1 ml-1">{rule.alert.message}</span>}
                                                </div>
                                            )}
                                            <button onClick={() => removeCombinedRule(optIdx, rule.id)} className="text-muted-foreground hover:text-red-500 p-1">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ));
                            })}
                        </div>

                        {/* Add New Rule Form */}
                        <div className="bg-white p-4 rounded-lg border border-border/60 shadow-sm mt-4">
                            <h5 className="text-xs font-semibold mb-3">Agregar Nueva Regla Combinada</h5>
                            <div className="flex flex-wrap gap-4 items-end">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Opción</label>
                                    <select
                                        className="block w-48 text-sm p-2 rounded border border-input bg-transparent"
                                        value={newRule.optIdx === null ? "" : newRule.optIdx}
                                        onChange={e => setNewRule({ ...newRule, optIdx: e.target.value === "" ? null : parseInt(e.target.value) })}
                                    >
                                        <option value="">Selecciona opción...</option>
                                        {question.options?.map((o: any, i: number) => (
                                            <option key={i} value={i}>{o.label_key || o.value}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1 flex-1 min-w-[300px]">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Combinación (Selecciona 2+)</label>
                                    <div className="flex flex-wrap gap-2 p-2 border border-input rounded-lg bg-background min-h-[38px]">
                                        {targets.map(t => {
                                            const isSelected = newRule.targets.includes(t.target_id);
                                            return (
                                                <button
                                                    key={t.target_id}
                                                    onClick={() => toggleTargetSelection(t.target_id)}
                                                    className={`px-2 py-1 text-xs rounded transition-colors border ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted hover:bg-muted/80 border-transparent'}`}
                                                >
                                                    {t.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Score</label>
                                    <input
                                        type="number"
                                        className="block w-20 text-sm p-2 rounded border border-input bg-transparent"
                                        placeholder="0"
                                        value={newRule.score}
                                        onChange={e => setNewRule({ ...newRule, score: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1 pl-4 border-l border-border/50">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground text-orange-600 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Alerta (Opcional)
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            className="block w-32 text-sm p-2 rounded border border-input bg-transparent"
                                            value={newRule.alertType}
                                            onChange={e => setNewRule({ ...newRule, alertType: e.target.value })}
                                        >
                                            <option value="">Sin Alerta</option>
                                            <option value="derivacion_clinica">🔴 Derivación</option>
                                            <option value="activar_plan">🟡 Activar Plan</option>
                                            <option value="seguimiento">🟢 Seguimiento</option>
                                        </select>
                                        {newRule.alertType && (
                                            <input
                                                type="text"
                                                className="block w-40 text-sm p-2 rounded border border-input bg-transparent"
                                                placeholder="Mensaje..."
                                                value={newRule.alertMessage}
                                                onChange={e => setNewRule({ ...newRule, alertMessage: e.target.value })}
                                            />
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddCombinedRule}
                                    disabled={newRule.optIdx === null || newRule.targets.length < 2 || !newRule.score}
                                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/10 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"> Cancelar </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <Save className="h-4 w-4" /> Guardar Todo
                    </button>
                </div>
            </div>
        </div>
    );
}
