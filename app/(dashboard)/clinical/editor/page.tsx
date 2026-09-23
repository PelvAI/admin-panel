"use client";
// forcing recompile

import { Suspense, useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon, CheckSquare, AlignLeft, ArrowLeft, Save, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ContextRulesMatrix } from "./components/ContextRulesMatrix";
import { ScoringRulesEditor } from "./components/ScoringRulesEditor";
import { Settings } from "lucide-react";
import { FormSettingsDialog } from "./components/FormSettingsDialog";

function ClinicalFormEditor() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const formId = searchParams.get("id");

    // We treat the form state as the "Draft". 
    // We will assume 1 section for now to simplify the UI loop.
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(!!formId);
    const [saving, setSaving] = useState(false);
    const [targets, setTargets] = useState<any[]>([]);

    // Matrix Modal State
    const [activeMatrixQuestionIdx, setActiveMatrixQuestionIdx] = useState<number | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        // Load targets
        api.getTargets().then(setTargets).catch(console.error);

        if (formId) {
            loadForm(formId);
        } else {
            setForm({
                code: "",
                title_key: "",
                description_key: "",
                target_ids: [],
                sections: [{
                    section_id: "temp_sec_1",
                    questions: [],
                }],
                scoring_rules: []
            });
        }
    }, [formId]);

    const loadForm = async (id: string) => {
        try {
            const data = await api.getForm(id);
            // Ensure at least one section exists
            if (!data.sections || data.sections.length === 0) {
                data.sections = [{ section_id: "temp_sec_existing_empty", questions: [] }];
            }
            // El backend devuelve los segmentos como objetos; el editor trabaja
            // con la lista de ids que después envía al guardar.
            data.target_ids = (data.targets || []).map((t: any) => t.target_id);
            setForm(data);
        } catch (err) {
            alert("Error cargando formulario");
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = () => {
        const newQ = {
            question_id: `temp_${Date.now()}`,
            text_key: "",
            type: "single", // Default
            options: [],
            order_index: (form.sections[0].questions.length || 0) + 1,
            required: false
        };

        const newSections = [...form.sections];
        newSections[0].questions.push(newQ);
        setForm({ ...form, sections: newSections });
    };

    const handleDeleteQuestion = async (qIdx: number, qId: string) => {
        if (!confirm("¿Eliminar pregunta?")) return;

        // If it's a real question (not temp), delete from API immediately? 
        // Or wait for save? User expectation on web is usually "Save to apply".
        // BUT, we defined API logic to be granular deletions.
        // Let's do immediate delete for Real IDs.
        if (!qId.startsWith("temp_")) {
            try {
                await api.deleteQuestion(qId);
            } catch (e) {
                alert("Error eliminando del servidor");
                return;
            }
        }

        const newSections = [...form.sections];
        newSections[0].questions.splice(qIdx, 1);
        setForm({ ...form, sections: newSections });
    };

    const handleUpdateQuestion = (qIdx: number, field: string, value: any) => {
        const newSections = [...form.sections];
        newSections[0].questions[qIdx] = { ...newSections[0].questions[qIdx], [field]: value };
        setForm({ ...form, sections: newSections });
    };

    const handleAddOption = (qIdx: number) => {
        const newSections = [...form.sections];
        const q = newSections[0].questions[qIdx];
        if (!q.options) q.options = [];

        q.options.push({
            option_id: `temp_opt_${Date.now()}`,
            value: "", // Value stored in DB
            label_key: "", // Display text
            score: 0,
            order_index: q.options.length
        });
        setForm({ ...form, sections: newSections });
    };

    const handleUpdateOption = (qIdx: number, optIdx: number, field: string, value: any) => {
        const newSections = [...form.sections];
        const opts = newSections[0].questions[qIdx].options;
        opts[optIdx] = { ...opts[optIdx], [field]: value };
        // Sync value to label for simple UX if label is empty
        if (field === 'label_key' && !opts[optIdx].value) {
            opts[optIdx].value = value.toLowerCase().replace(/\s+/g, '_');
        }
        setForm({ ...form, sections: newSections });
    };

    const handleDeleteOption = (qIdx: number, optIdx: number) => {
        const newSections = [...form.sections];
        newSections[0].questions[qIdx].options.splice(optIdx, 1);
        setForm({ ...form, sections: newSections });
    };

    // --- Scoring Rules Handlers ---
    const handleAddRule = () => {
        const newRule = {
            rule_id: `temp_rule_${Date.now()}`,
            variable_name: "",
            formula: "",
            alert_condition: "",
            alert_type: "derivacion_clinica",
            target_id: null,
            order_index: (form.scoring_rules?.length || 0) + 1
        };
        setForm({ ...form, scoring_rules: [...(form.scoring_rules || []), newRule] });
    };

    const handleUpdateRule = (ruleIdx: number, field: string, value: any) => {
        const newRules = [...(form.scoring_rules || [])];
        newRules[ruleIdx] = { ...newRules[ruleIdx], [field]: value };
        setForm({ ...form, scoring_rules: newRules });
    };

    const handleDeleteRule = async (ruleIdx: number, ruleId: string) => {
        if (!ruleId.startsWith("temp_")) {
            if (!confirm("¿Eliminar regla permanentemente?")) return;
            try {
                await api.deleteScoringRule(ruleId);
            } catch (e) {
                alert("Error eliminando regla");
                return;
            }
        }
        const newRules = [...(form.scoring_rules || [])];
        newRules.splice(ruleIdx, 1);
        setForm({ ...form, scoring_rules: newRules });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let activeFormId = formId;
            let activeSectionId = form.sections[0].section_id;

            // 1. Create/Update Form Metadata
            const formData = {
                code: form.code,
                title_key: form.title_key,
                description_key: form.description_key,
                target_ids: form.target_ids || [],
                frecuencia: form.frecuencia,
                disparador: form.disparador
            };

            if (!activeFormId) {
                const newForm = await api.createForm(formData);
                activeFormId = newForm.form_id;

                // Create Default Section
                const newSec = await api.createSection(activeFormId!, {
                    title_key: "Principal",
                    bloque: "MAIN",
                    order_index: 0
                });
                activeSectionId = newSec.section_id;
            } else {
                await api.updateForm(activeFormId, formData);
                // Find real section ID if we loaded it
                const realSec = form.sections.find((s: any) => !s.section_id.startsWith('temp_'));
                if (realSec) activeSectionId = realSec.section_id;
                else {
                    const newSec = await api.createSection(activeFormId!, { title_key: "Principal", bloque: "MAIN", order_index: 0 });
                    activeSectionId = newSec.section_id;
                }
            }

            // 2. Sync Questions
            const questions = form.sections[0].questions;
            for (const q of questions) {
                const payload = {
                    variable_name: q.variable_name || q.text_key, // Fallback if empty
                    text_key: q.text_key,
                    type: q.type,
                    order_index: q.order_index,
                    help_text: q.help_text,
                    show_if: q.show_if,
                    is_required: q.is_required,
                    // If options exist, backend creates them via Nested Pydantic in create_question?
                    options: q.options?.map((o: any) => ({
                        value: o.value || o.label_key?.toLowerCase().replace(/\s+/g, '_') || "val",
                        label_key: o.label_key || "Opción",
                        score: o.score || 0,
                        context_rules: o.context_rules, // Persist Granular Rules
                        order_index: o.order_index
                    }))
                };

                if (q.question_id.startsWith("temp_")) {
                    await api.createQuestion(activeSectionId, payload);
                } else {
                    // Update: admin_forms.py update_question does NOT accept options list to replace.
                    // It expects separate option endpoints.
                    // For MVP simplicity, update metadata. 
                    await api.updateQuestion(q.question_id, payload);

                    // Sync Options (Manual Diff)
                    if (q.options) {
                        for (const opt of q.options) {
                            const optPayload = {
                                value: opt.value || opt.label_key?.toLowerCase().replace(/\s+/g, '_') || "val",
                                label_key: opt.label_key || "Opción",
                                score: opt.score || 0,
                                context_rules: opt.context_rules,
                                order_index: opt.order_index
                            };

                            if (opt.option_id && !opt.option_id.startsWith("temp_")) {
                                try {
                                    await api.updateOption(opt.option_id, optPayload);
                                } catch (e) {
                                    console.error("Failed to update option", opt.option_id, e);
                                }
                            } else {
                                try {
                                    // New Option
                                    await api.createOption(q.question_id, optPayload);
                                } catch (e) {
                                    console.error("Failed to create option", e);
                                }
                            }
                        }
                    }
                }
            }

            // 3. Sync Scoring Rules
            const rules = form.scoring_rules || [];
            for (const r of rules) {
                const payload = {
                    variable_name: r.variable_name,
                    formula: r.formula,
                    alert_condition: r.alert_condition,
                    alert_type: r.alert_type,
                    target_id: r.target_id,
                    order_index: r.order_index
                };

                if (r.rule_id.startsWith("temp_")) {
                    await api.createScoringRule(activeFormId!, payload);
                } else {
                    await api.updateScoringRule(r.rule_id, payload);
                }
            }

            alert("Guardado correctamente");
            if (!formId) {
                router.push(`/clinical/editor?id=${activeFormId}`);
            } else {
                window.location.reload(); // Reload to get fresh IDs
            }

        } catch (e: any) {
            console.error(e);
            alert(`Error guardando: ${e.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando formulario...</span>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="p-8 text-center border-2 border-dashed rounded-xl mt-8">
                <p className="text-muted-foreground">No se pudo cargar el formulario o no existe.</p>
                <div className="mt-4">
                    <Link href="/clinical" className="text-primary hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Volver al listado
                    </Link>
                </div>
            </div>
        );
    }

    const activeQuestions = form?.sections?.[0]?.questions || [];

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/clinical" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold font-heading text-foreground">
                        {formId ? "Editar Formulario" : "Nuevo Formulario"}
                    </h2>
                    <p className="text-sm text-muted-foreground">Diseña la estructura de tu evaluación clínica.</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted" onClick={() => handleSave()}>Vista Previa</button>
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        Guardar
                    </button>
                </div>
            </div>



            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {/* Form Header */}
                    <div className="bg-card rounded-xl border-t-8 border-t-primary border-x border-b border-border shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                value={form?.title_key || ""}
                                onChange={(e) => setForm({ ...form, title_key: e.target.value })}
                                className="text-3xl font-bold w-full border-b border-transparent hover:border-border focus:border-primary focus:outline-none bg-transparent transition-colors pb-2"
                                placeholder="Título del Formulario"
                            />
                            <p className="text-sm text-muted-foreground mt-1 max-w-2xl px-1">
                                {form?.description_key || "Sin descripción definida."}
                            </p>
                        </div>

                        <button
                            onClick={() => setShowSettings(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg shadow-sm hover:bg-muted transition-colors text-sm font-medium text-foreground whitespace-nowrap"
                        >
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            Configuración Avanzada
                        </button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                        {activeQuestions.map((q: any, idx: number) => (
                            <div key={q.question_id || idx} className="group bg-card rounded-xl border border-border shadow-sm p-6 relative hover:shadow-md transition-all">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-transparent group-hover:bg-primary/50 rounded-l-xl transition-colors" />

                                {/* Delete Button */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeleteQuestion(idx, q.question_id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="pl-4 space-y-4">
                                    {/* Top Row: Question Text & Type */}
                                    <div className="flex gap-4 pr-10">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={q.text_key || ""}
                                                onChange={(e) => handleUpdateQuestion(idx, 'text_key', e.target.value)}
                                                className="w-full text-lg font-medium bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                                placeholder="Escribe la pregunta aquí..."
                                            />
                                            {/* Advanced Identifiers Row */}
                                            <div className="flex gap-2 text-xs">
                                                <input
                                                    type="text"
                                                    value={q.variable_name || ""}
                                                    onChange={(e) => handleUpdateQuestion(idx, 'variable_name', e.target.value)}
                                                    className="bg-muted/50 px-2 py-1 rounded border-none focus:ring-1 focus:ring-primary w-40 font-mono text-muted-foreground"
                                                    placeholder="ID Variable (ej: edad)"
                                                    title="Nombre de variable para lógica (ej: edad, tiene_hijos)"
                                                />
                                                <input
                                                    type="text"
                                                    value={q.show_if || ""}
                                                    onChange={(e) => handleUpdateQuestion(idx, 'show_if', e.target.value)}
                                                    className="bg-blue-50/50 px-2 py-1 rounded border-none focus:ring-1 focus:ring-primary flex-1 font-mono text-blue-600 placeholder:text-blue-300"
                                                    placeholder="Condición (ej: edad > 18)"
                                                    title="Lógica Show If (ej: pregunta_anterior == 'si')"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <select
                                                value={q.type}
                                                onChange={(e) => handleUpdateQuestion(idx, 'type', e.target.value)}
                                                className="w-40 px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium"
                                            >
                                                <optgroup label="Básicos">
                                                    <option value="single">Selección Única</option>
                                                    <option value="multi">Múltiple</option>
                                                    <option value="text">Texto Corto</option>
                                                    <option value="paragraph">Párrafo</option>
                                                    <option value="boolean">Sí/No</option>
                                                </optgroup>
                                                <optgroup label="Avanzados">
                                                    <option value="dropdown">Desplegable</option>
                                                    <option value="scale">Escala (Slider)</option>
                                                    <option value="ranking">Ranking</option>
                                                    <option value="date">Fecha</option>
                                                    <option value="info">Bloque Informativo</option>
                                                </optgroup>
                                            </select>

                                            <div className="flex items-center gap-2 justify-end">
                                                <label className="text-xs text-muted-foreground">Obligatorio</label>
                                                <input
                                                    type="checkbox"
                                                    checked={q.is_required || false}
                                                    onChange={(e) => handleUpdateQuestion(idx, 'is_required', e.target.checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Help Text */}
                                    <input
                                        type="text"
                                        value={q.help_text || ""}
                                        onChange={(e) => handleUpdateQuestion(idx, 'help_text', e.target.value)}
                                        className="w-full text-xs text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none"
                                        placeholder="Texto de ayuda o subtítulo (opcional)"
                                    />

                                    {/* Options Editor */}
                                    {(q.type === 'single' || q.type === 'multi' || q.type === 'dropdown' || q.type === 'ranking') && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opciones de Respuesta</label>
                                                <button
                                                    onClick={() => setActiveMatrixQuestionIdx(idx)}
                                                    className="text-xs flex items-center gap-1 text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors"
                                                >
                                                    <AlignLeft className="h-3 w-3" /> Configurar Reglas de Contexto
                                                </button>
                                            </div>

                                            <div className="ml-2 space-y-2 border-l-2 border-muted pl-4 mt-2">
                                                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground mb-1">
                                                    <div className="col-span-1"></div>
                                                    <div className="col-span-7">Opción</div>
                                                    <div className="col-span-3">Score</div>
                                                    <div className="col-span-1"></div>
                                                </div>
                                                {q.options?.map((opt: any, optIdx: number) => (
                                                    <div key={optIdx} className="grid grid-cols-12 gap-2 items-center group/opt">
                                                        <div className="col-span-1 flex justify-center">
                                                            {q.type === 'single' && <div className="h-3 w-3 rounded-full border border-muted-foreground"></div>}
                                                            {q.type === 'multi' && <div className="h-3 w-3 rounded border border-muted-foreground"></div>}
                                                            {q.type === 'ranking' && <span className="text-xs font-mono">{optIdx + 1}</span>}
                                                        </div>
                                                        <div className="col-span-7">
                                                            <input
                                                                className="w-full text-sm bg-transparent border-b border-transparent focus:border-primary outline-none"
                                                                placeholder="Etiqueta"
                                                                value={opt.label_key}
                                                                onChange={(e) => handleUpdateOption(idx, optIdx, 'label_key', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <input
                                                                className="w-full text-xs font-mono bg-muted/30 px-1 rounded border-none focus:ring-1 focus:ring-primary"
                                                                placeholder="0"
                                                                type="number"
                                                                value={opt.score}
                                                                onChange={(e) => handleUpdateOption(idx, optIdx, 'score', parseInt(e.target.value))}
                                                            />
                                                            {/* Visual indicator if context rules exist */}
                                                            {opt.context_rules && opt.context_rules.length > 0 && (
                                                                <div className="text-[10px] text-primary flex items-center gap-0.5 mt-0.5" title="Tiene reglas de contexto">
                                                                    <AlignLeft className="h-2 w-2" /> {opt.context_rules.length} reglas
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-span-1 text-right opacity-0 group-hover/opt:opacity-100">
                                                            <button onClick={() => handleDeleteOption(idx, optIdx)}><X className="h-3 w-3 text-muted-foreground hover:text-red-500" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={() => handleAddOption(idx)} className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-2">
                                                    <Plus className="h-3 w-3" /> Añadir Opción
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Info Block Preview */}
                                    {q.type === 'info' && (
                                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-100">
                                            Este bloque se mostrará como texto informativo sin requerir respuesta.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {activeQuestions.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                                <p className="text-muted-foreground">No hay preguntas aún.</p>
                            </div>
                        )}
                    </div>

                    {/* Matrix Modal */}
                    {activeMatrixQuestionIdx !== null && activeQuestions[activeMatrixQuestionIdx] && (
                        <ContextRulesMatrix
                            question={activeQuestions[activeMatrixQuestionIdx]}
                            targets={targets}
                            questionIdx={activeMatrixQuestionIdx}
                            onClose={() => setActiveMatrixQuestionIdx(null)}
                            onSave={(qIdx, updatedOptions) => {
                                const newSections = [...form.sections];
                                newSections[0].questions[qIdx].options = updatedOptions;
                                setForm({ ...form, sections: newSections });
                            }}
                        />
                    )}

                    {/* Global Settings Modal */}
                    <FormSettingsDialog
                        isOpen={showSettings}
                        onClose={() => setShowSettings(false)}
                        form={form}
                        setForm={setForm}
                        targets={targets}
                        onAddRule={handleAddRule}
                        onUpdateRule={handleUpdateRule}
                        onDeleteRule={handleDeleteRule}
                    />

                    {/* Floating Add Button */}
                    <div className="fixed right-8 bottom-8">
                        <button
                            onClick={handleAddQuestion}
                            className="h-14 w-14 bg-primary text-primary-foreground shadow-lg rounded-full flex items-center justify-center hover:scale-105 transition-all"
                            title="Añadir Pregunta"
                        >
                            <Plus className="h-7 w-7" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ClinicalEditorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClinicalFormEditor />
        </Suspense>
    );
}
