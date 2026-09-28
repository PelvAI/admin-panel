"use client";
// forcing recompile

import { Suspense, useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon, CheckSquare, AlignLeft, ArrowLeft, Save, Loader2, X, Send, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
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
    const [publicando, setPublicando] = useState(false);
    const [targets, setTargets] = useState<any[]>([]);
    // Borrados a aplicar al guardar. Ver registrarBorrado.
    const [pendientes, setPendientes] = useState<{
        questions: string[]; options: string[]; rules: string[]; sections: string[];
    }>({ questions: [], options: [], rules: [], sections: [] });

    // Matrix Modal State
    // La matriz de reglas ahora necesita saber de qué sección viene la pregunta.
    const [activeMatrixQuestionIdx, setActiveMatrixQuestionIdx] = useState<{ secIdx: number; qIdx: number } | null>(null);
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
                    title_key: "",
                    bloque: "",
                    order_index: 0,
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
                data.sections = [{
                    section_id: "temp_sec_existing_empty",
                    title_key: "",
                    bloque: "",
                    order_index: 0,
                    questions: [],
                }];
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

    // Todo cambio es local hasta Guardar, borrados incluidos. Antes eliminar
    // una pregunta impactaba el servidor de inmediato mientras el resto
    // esperaba al botón: si alguien borraba y cerraba sin guardar, el borrado
    // ya había ocurrido y no había forma de deshacerlo (F13).
    const registrarBorrado = (tipo: "questions" | "options" | "rules" | "sections", id: string) => {
        if (id.startsWith("temp_")) return; // nunca existió en el servidor
        setPendientes((p) => ({ ...p, [tipo]: [...p[tipo], id] }));
    };

    const mutarSecciones = (cambio: (secciones: any[]) => void) => {
        const secciones = form.sections.map((s: any) => ({
            ...s,
            questions: (s.questions || []).map((q: any) => ({
                ...q,
                options: q.options ? [...q.options] : q.options,
            })),
        }));
        cambio(secciones);
        setForm({ ...form, sections: secciones });
    };

    // --- Secciones ---------------------------------------------------------

    const handleAddSection = () => {
        mutarSecciones((secciones) => {
            secciones.push({
                section_id: `temp_sec_${Date.now()}`,
                title_key: "",
                bloque: "",
                order_index: secciones.length,
                questions: [],
            });
        });
    };

    const handleUpdateSection = (secIdx: number, field: string, value: any) => {
        mutarSecciones((secciones) => {
            secciones[secIdx] = { ...secciones[secIdx], [field]: value };
        });
    };

    const handleDeleteSection = (secIdx: number) => {
        const seccion = form.sections[secIdx];
        const cuantas = (seccion.questions || []).length;
        const aviso = cuantas > 0
            ? `Se eliminará la sección y sus ${cuantas} pregunta(s). Se aplica al guardar.`
            : "Se eliminará la sección al guardar.";
        if (!confirm(aviso)) return;

        registrarBorrado("sections", seccion.section_id);
        mutarSecciones((secciones) => {
            secciones.splice(secIdx, 1);
            secciones.forEach((s, i) => { s.order_index = i; });
        });
    };

    const handleMoveSection = (secIdx: number, direccion: -1 | 1) => {
        const destino = secIdx + direccion;
        if (destino < 0 || destino >= form.sections.length) return;
        mutarSecciones((secciones) => {
            const [movida] = secciones.splice(secIdx, 1);
            secciones.splice(destino, 0, movida);
            secciones.forEach((s, i) => { s.order_index = i; });
        });
    };

    // --- Preguntas ---------------------------------------------------------

    const handleAddQuestion = (secIdx: number) => {
        mutarSecciones((secciones) => {
            secciones[secIdx].questions.push({
                question_id: `temp_${Date.now()}`,
                text_key: "",
                type: "single",
                options: [],
                order_index: secciones[secIdx].questions.length,
                is_required: false,
            });
        });
    };

    const handleDeleteQuestion = (secIdx: number, qIdx: number, qId: string) => {
        if (!confirm("Se eliminará la pregunta al guardar. ¿Continuar?")) return;
        registrarBorrado("questions", qId);
        mutarSecciones((secciones) => {
            secciones[secIdx].questions.splice(qIdx, 1);
            secciones[secIdx].questions.forEach((q: any, i: number) => { q.order_index = i; });
        });
    };

    const handleMoveQuestion = (secIdx: number, qIdx: number, direccion: -1 | 1) => {
        const destino = qIdx + direccion;
        if (destino < 0 || destino >= form.sections[secIdx].questions.length) return;
        mutarSecciones((secciones) => {
            const preguntas = secciones[secIdx].questions;
            const [movida] = preguntas.splice(qIdx, 1);
            preguntas.splice(destino, 0, movida);
            preguntas.forEach((q: any, i: number) => { q.order_index = i; });
        });
    };

    const handleUpdateQuestion = (secIdx: number, qIdx: number, field: string, value: any) => {
        mutarSecciones((secciones) => {
            secciones[secIdx].questions[qIdx] = {
                ...secciones[secIdx].questions[qIdx],
                [field]: value,
            };
        });
    };

    // --- Opciones ----------------------------------------------------------

    const handleAddOption = (secIdx: number, qIdx: number) => {
        mutarSecciones((secciones) => {
            const q = secciones[secIdx].questions[qIdx];
            if (!q.options) q.options = [];
            q.options.push({
                option_id: `temp_opt_${Date.now()}`,
                value: "",
                label_key: "",
                score: 0,
                order_index: q.options.length,
            });
        });
    };

    const handleUpdateOption = (secIdx: number, qIdx: number, optIdx: number, field: string, value: any) => {
        mutarSecciones((secciones) => {
            const opts = secciones[secIdx].questions[qIdx].options;
            opts[optIdx] = { ...opts[optIdx], [field]: value };
            // El valor interno se deriva de la etiqueta mientras nadie lo haya
            // fijado a mano.
            if (field === "label_key" && !opts[optIdx].value) {
                opts[optIdx].value = String(value).toLowerCase().replace(/\s+/g, "_");
            }
        });
    };

    const handleDeleteOption = (secIdx: number, qIdx: number, optIdx: number) => {
        const opcion = form.sections[secIdx].questions[qIdx].options[optIdx];
        registrarBorrado("options", opcion.option_id);
        mutarSecciones((secciones) => {
            secciones[secIdx].questions[qIdx].options.splice(optIdx, 1);
        });
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
            is_total: false,
            interpretation_ranges: null,
            interpretation_validated: false,
            order_index: (form.scoring_rules?.length || 0) + 1
        };
        setForm({ ...form, scoring_rules: [...(form.scoring_rules || []), newRule] });
    };

    const handleUpdateRule = (ruleIdx: number, field: string, value: any) => {
        const newRules = [...(form.scoring_rules || [])];
        newRules[ruleIdx] = { ...newRules[ruleIdx], [field]: value };
        setForm({ ...form, scoring_rules: newRules });
    };

    const handleDeleteRule = (ruleIdx: number, ruleId: string) => {
        if (!confirm("Se eliminará la regla al guardar. ¿Continuar?")) return;
        registrarBorrado("rules", ruleId);
        const newRules = [...(form.scoring_rules || [])];
        newRules.splice(ruleIdx, 1);
        setForm({ ...form, scoring_rules: newRules });
    };

    // Publicar y despublicar guardan primero: de lo contrario se publicaría la
    // versión del servidor y no la que la persona tiene en pantalla.
    const handlePublish = async () => {
        if (!formId) return;
        if (!confirm("Se guardan los cambios y el formulario pasa a estar visible para las usuarias. ¿Publicar?")) return;
        setPublicando(true);
        try {
            await handleSave({ recargar: false });
            const actualizado = await api.publishForm(formId);
            setForm({ ...form, status: actualizado.status });
        } catch (e: any) {
            alert(e?.message || "No se pudo publicar");
        } finally {
            setPublicando(false);
        }
    };

    const handleUnpublish = async () => {
        if (!formId) return;
        if (!confirm("Dejará de mostrarse en la app. Las respuestas ya cargadas no se tocan.")) return;
        setPublicando(true);
        try {
            const actualizado = await api.unpublishForm(formId);
            setForm({ ...form, status: actualizado.status });
        } catch (e: any) {
            alert(e?.message || "No se pudo despublicar");
        } finally {
            setPublicando(false);
        }
    };

    const handleSave = async ({ recargar = true }: { recargar?: boolean } = {}) => {
        setSaving(true);
        try {
            let activeFormId = formId;

            // 1. Metadatos del formulario
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
            } else {
                await api.updateForm(activeFormId, formData);
            }

            // 2. Borrados pendientes, antes de crear nada: si alguien borró una
            //    pregunta y agregó otra con el mismo código, el orden importa.
            //    Las secciones van al final porque arrastran sus preguntas.
            for (const id of pendientes.options) await api.deleteOption(id);
            for (const id of pendientes.questions) await api.deleteQuestion(id);
            for (const id of pendientes.rules) await api.deleteScoringRule(id);
            for (const id of pendientes.sections) await api.deleteSection(id);

            // 3. Secciones, cada una con sus preguntas
            for (const [secIdx, section] of form.sections.entries()) {
                const seccionPayload = {
                    title_key: section.title_key || "",
                    bloque: section.bloque || "",
                    order_index: secIdx,
                };

                let sectionId = section.section_id;
                if (sectionId.startsWith("temp_")) {
                    const nueva = await api.createSection(activeFormId!, seccionPayload);
                    sectionId = nueva.section_id;
                } else {
                    await api.updateSection(sectionId, seccionPayload);
                }

                for (const [qIdx, q] of (section.questions || []).entries()) {
                    const opcionPayload = (o: any) => ({
                        value: o.value || o.label_key?.toLowerCase().replace(/\s+/g, '_') || "val",
                        label_key: o.label_key || "Opción",
                        score: o.score || 0,
                        context_rules: o.context_rules,
                        order_index: o.order_index
                    });

                    const payload: any = {
                        variable_name: q.variable_name || q.text_key,
                        text_key: q.text_key,
                        data_key: q.data_key,
                        type: q.type,
                        order_index: qIdx,
                        help_text: q.help_text,
                        show_if: q.show_if,
                        is_required: q.is_required,
                    };

                    if (q.question_id.startsWith("temp_")) {
                        // Las opciones viajan con la pregunta en la creación.
                        await api.createQuestion(sectionId, {
                            ...payload,
                            options: (q.options || []).map(opcionPayload),
                        });
                    } else {
                        await api.updateQuestion(q.question_id, payload);

                        // Al actualizar, las opciones van por su propio camino.
                        for (const opt of q.options || []) {
                            const cuerpo = opcionPayload(opt);
                            if (opt.option_id && !opt.option_id.startsWith("temp_")) {
                                await api.updateOption(opt.option_id, cuerpo);
                            } else {
                                await api.createOption(q.question_id, cuerpo);
                            }
                        }
                    }
                }
            }

            // 4. Reglas de puntuación
            for (const r of form.scoring_rules || []) {
                const payload = {
                    variable_name: r.variable_name,
                    formula: r.formula,
                    alert_condition: r.alert_condition,
                    alert_type: r.alert_type,
                    target_id: r.target_id,
                    is_total: !!r.is_total,
                    interpretation_validated: !!r.interpretation_validated,
                    interpretation_ranges: r.is_total ? (r.interpretation_ranges || null) : null,
                    order_index: r.order_index
                };

                if (r.rule_id.startsWith("temp_")) {
                    await api.createScoringRule(activeFormId!, payload);
                } else {
                    await api.updateScoringRule(r.rule_id, payload);
                }
            }

            setPendientes({ questions: [], options: [], rules: [], sections: [] });

            if (recargar) {
                alert("Guardado correctamente");
                if (!formId) {
                    router.push(`/clinical/editor?id=${activeFormId}`);
                } else {
                    window.location.reload(); // Reload to get fresh IDs
                }
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


    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/clinical" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold font-heading text-foreground">
                            {formId ? "Editar Formulario" : "Nuevo Formulario"}
                        </h2>
                        {formId && (
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    form.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : form.status === "archived"
                                        ? "bg-gray-200 text-gray-600"
                                        : "bg-amber-100 text-amber-800"
                                }`}
                            >
                                {form.status === "active"
                                    ? "Publicado"
                                    : form.status === "archived"
                                    ? "Archivado"
                                    : "Borrador"}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {form.status === "active"
                            ? "Está en vivo: lo que cambies acá lo ven las usuarias al guardar."
                            : "Diseña la estructura de tu evaluación clínica."}
                    </p>
                    {form.submission_count > 0 && (
                        <p className="text-xs text-amber-700 mt-1">
                            {form.submission_count === 1
                                ? "Ya hay 1 evaluación respondida con este formulario."
                                : `Ya hay ${form.submission_count} evaluaciones respondidas con este formulario.`}{" "}
                            Cambiar las preguntas altera el significado de esas respuestas.
                        </p>
                    )}
                </div>
                <div className="ml-auto flex gap-2">
                    {formId && form.status === "draft" && (
                        <button
                            onClick={handlePublish}
                            disabled={saving || publicando}
                            className="px-4 py-2 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 flex items-center gap-2 disabled:opacity-50"
                        >
                            {publicando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Publicar
                        </button>
                    )}
                    {formId && form.status === "active" && (
                        <button
                            onClick={handleUnpublish}
                            disabled={saving || publicando}
                            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-2 disabled:opacity-50"
                        >
                            {publicando ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
                            Despublicar
                        </button>
                    )}
                    <button onClick={() => handleSave()} disabled={saving} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
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

                    {/* Secciones */}
                    <div className="space-y-8">
                        {form.sections.map((section: any, secIdx: number) => (
                            <section key={section.section_id} className="space-y-4">
                                {/* Cabecera de la sección */}
                                <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-4 py-3">
                                    <span className="text-xs font-mono text-muted-foreground tabular-nums">
                                        {secIdx + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={section.title_key || ""}
                                        onChange={(e) => handleUpdateSection(secIdx, 'title_key', e.target.value)}
                                        className="flex-1 font-semibold bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-1"
                                        placeholder={`Sección ${secIdx + 1}`}
                                    />
                                    <input
                                        type="text"
                                        value={section.bloque || ""}
                                        onChange={(e) => handleUpdateSection(secIdx, 'bloque', e.target.value)}
                                        className="w-40 text-xs font-mono bg-background px-2 py-1.5 rounded border border-input focus:border-primary focus:outline-none uppercase"
                                        placeholder="BLOQUE"
                                        title="Agrupación clínica, usada para analizar los resultados por bloque"
                                    />
                                    <button
                                        onClick={() => handleMoveSection(secIdx, -1)}
                                        disabled={secIdx === 0}
                                        aria-label="Subir sección"
                                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleMoveSection(secIdx, 1)}
                                        disabled={secIdx === form.sections.length - 1}
                                        aria-label="Bajar sección"
                                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSection(secIdx)}
                                        disabled={form.sections.length === 1}
                                        aria-label="Eliminar sección"
                                        title={form.sections.length === 1 ? "Un formulario necesita al menos una sección" : "Eliminar sección"}
                                        className="p-1.5 text-muted-foreground hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Preguntas de la sección */}
                        {(section.questions || []).map((q: any, idx: number) => (
                            <div key={q.question_id || idx} className="group bg-card rounded-xl border border-border shadow-sm p-6 relative hover:shadow-md transition-all">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-transparent group-hover:bg-primary/50 rounded-l-xl transition-colors" />

                                {/* Delete Button */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleMoveQuestion(secIdx, idx, -1)}
                                        disabled={idx === 0}
                                        aria-label="Subir pregunta"
                                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleMoveQuestion(secIdx, idx, 1)}
                                        disabled={idx === (section.questions || []).length - 1}
                                        aria-label="Bajar pregunta"
                                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(secIdx, idx, q.question_id)}
                                        aria-label="Eliminar pregunta"
                                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full"
                                    >
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
                                                onChange={(e) => handleUpdateQuestion(secIdx, idx, 'text_key', e.target.value)}
                                                className="w-full text-lg font-medium bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                                placeholder="Escribe la pregunta aquí..."
                                            />
                                            {/* Advanced Identifiers Row */}
                                            <div className="flex gap-2 text-xs">
                                                <input
                                                    type="text"
                                                    value={q.variable_name || ""}
                                                    onChange={(e) => handleUpdateQuestion(secIdx, idx, 'variable_name', e.target.value)}
                                                    className="bg-muted/50 px-2 py-1 rounded border-none focus:ring-1 focus:ring-primary w-40 font-mono text-muted-foreground"
                                                    placeholder="ID Variable (ej: edad)"
                                                    title="Nombre de variable para lógica (ej: edad, tiene_hijos)"
                                                />
                                                <input
                                                    type="text"
                                                    value={q.show_if || ""}
                                                    onChange={(e) => handleUpdateQuestion(secIdx, idx, 'show_if', e.target.value)}
                                                    className="bg-blue-50/50 px-2 py-1 rounded border-none focus:ring-1 focus:ring-primary flex-1 font-mono text-blue-600 placeholder:text-blue-300"
                                                    placeholder="Condición (ej: edad > 18)"
                                                    title="Lógica Show If (ej: pregunta_anterior == 'si')"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <select
                                                value={q.type}
                                                onChange={(e) => handleUpdateQuestion(secIdx, idx, 'type', e.target.value)}
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
                                                    onChange={(e) => handleUpdateQuestion(secIdx, idx, 'is_required', e.target.checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Help Text */}
                                    <input
                                        type="text"
                                        value={q.help_text || ""}
                                        onChange={(e) => handleUpdateQuestion(secIdx, idx, 'help_text', e.target.value)}
                                        className="w-full text-xs text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none"
                                        placeholder="Texto de ayuda o subtítulo (opcional)"
                                    />

                                    {/* Options Editor */}
                                    {(q.type === 'single' || q.type === 'multi' || q.type === 'dropdown' || q.type === 'ranking') && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opciones de Respuesta</label>
                                                <button
                                                    onClick={() => setActiveMatrixQuestionIdx({ secIdx, qIdx: idx })}
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
                                                                onChange={(e) => handleUpdateOption(secIdx, idx, optIdx, 'label_key', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <input
                                                                className="w-full text-xs font-mono bg-muted/30 px-1 rounded border-none focus:ring-1 focus:ring-primary"
                                                                placeholder="0"
                                                                type="number"
                                                                value={opt.score}
                                                                onChange={(e) => handleUpdateOption(secIdx, idx, optIdx, 'score', parseInt(e.target.value))}
                                                            />
                                                            {/* Visual indicator if context rules exist */}
                                                            {opt.context_rules && opt.context_rules.length > 0 && (
                                                                <div className="text-[10px] text-primary flex items-center gap-0.5 mt-0.5" title="Tiene reglas de contexto">
                                                                    <AlignLeft className="h-2 w-2" /> {opt.context_rules.length} reglas
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-span-1 text-right opacity-0 group-hover/opt:opacity-100">
                                                            <button onClick={() => handleDeleteOption(secIdx, idx, optIdx)}><X className="h-3 w-3 text-muted-foreground hover:text-red-500" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={() => handleAddOption(secIdx, idx)} className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-2">
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

                                {(section.questions || []).length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                                        <p className="text-sm text-muted-foreground">Esta sección todavía no tiene preguntas.</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleAddQuestion(secIdx)}
                                    className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Añadir pregunta
                                </button>
                            </section>
                        ))}

                        <button
                            onClick={handleAddSection}
                            className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Añadir sección
                        </button>
                    </div>

                    {/* Matrix Modal */}
                    {activeMatrixQuestionIdx !== null &&
                        form.sections[activeMatrixQuestionIdx.secIdx]?.questions?.[activeMatrixQuestionIdx.qIdx] && (
                        <ContextRulesMatrix
                            question={form.sections[activeMatrixQuestionIdx.secIdx].questions[activeMatrixQuestionIdx.qIdx]}
                            targets={targets}
                            questionIdx={activeMatrixQuestionIdx.qIdx}
                            onClose={() => setActiveMatrixQuestionIdx(null)}
                            onSave={(qIdx, updatedOptions) => {
                                const { secIdx } = activeMatrixQuestionIdx;
                                mutarSecciones((secciones) => {
                                    secciones[secIdx].questions[qIdx].options = updatedOptions;
                                });
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
