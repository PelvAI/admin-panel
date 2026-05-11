import { Plus, X, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

interface Condition {
    id: string;
    variable: string;
    operator: string;
    value: string;
}

interface VisualRuleBuilderProps {
    initialFormula: string;
    initialCondition: string;
    variables: string[]; // List of available variables (Q IDs, totals)
    onChange: (formula: string, condition: string) => void;
}

export function VisualRuleBuilder({ initialFormula, initialCondition, variables, onChange }: VisualRuleBuilderProps) {
    // We will try to parse simple "AND" conditions.
    // Complex formulas still fallback to text, but we offer a builder for common cases.

    // Mode: "Advanced" (Text) vs "Visual" (Builder)
    const [mode, setMode] = useState<"visual" | "advanced">("visual");

    const [conditions, setConditions] = useState<Condition[]>([]);

    // Parse initial on mount (Simplistic parser for demo)
    useEffect(() => {
        if (!initialCondition) {
            setConditions([{ id: "1", variable: "", operator: ">", value: "" }]);
            return;
        }
        // Try to parse "var > val". 
        // This is a rough heuristic.
        if (initialCondition.includes(" and ") || initialCondition.includes(" or ")) {
            // Complex logic -> Generic text mode
            // setMode("advanced");
        }
        // For now, let's start fresh or use text.
    }, []);

    const updateCondition = (id: string, field: keyof Condition, val: string) => {
        const newConds = conditions.map(c => c.id === id ? { ...c, [field]: val } : c);
        setConditions(newConds);
        emitChange(newConds);
    };

    const addCondition = () => {
        setConditions([...conditions, { id: Math.random().toString(), variable: "", operator: ">", value: "" }]);
    };

    const removeCondition = (id: string) => {
        const newConds = conditions.filter(c => c.id !== id);
        setConditions(newConds);
        emitChange(newConds);
    };

    const emitChange = (conds: Condition[]) => {
        // Construct Python-style logic string
        // e.g. "var1 > 10 and var2 == 'val'"
        if (conds.length === 0) {
            onChange("", "");
            return;
        }

        const conditionStr = conds.map(c => {
            let val = c.value;
            // Quote string values if not number
            if (isNaN(Number(val)) && val !== "true" && val !== "false") {
                val = `'${val}'`;
            }
            return `${c.variable} ${c.operator} ${val}`;
        }).join(" and "); // Default to AND for now

        // Formula? For "Alert Only" rules, formula might be just a boolean aggregation or empty.
        // User implied they want to check thresholds.
        onChange(initialFormula, conditionStr);
    };

    if (mode === "advanced") {
        return (
            <div className="space-y-2">
                <textarea
                    value={initialCondition}
                    onChange={(e) => onChange(initialFormula, e.target.value)}
                    className="w-full text-sm font-mono p-2 border rounded"
                    placeholder="var1 > 10 and var2 == 'x'"
                />
                <button onClick={() => setMode("visual")} className="text-xs text-primary hover:underline">Cambiar a Visual</button>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-border/50">
            {conditions.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-xs font-bold text-muted-foreground uppercase w-8 text-center">Y</span>}

                    <select
                        value={c.variable}
                        onChange={(e) => updateCondition(c.id, "variable", e.target.value)}
                        className="flex-1 text-sm p-1.5 rounded border border-input bg-background"
                    >
                        <option value="">Selecciona Variable...</option>
                        {variables.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>

                    <select
                        value={c.operator}
                        onChange={(e) => updateCondition(c.id, "operator", e.target.value)}
                        className="w-24 text-sm p-1.5 rounded border border-input bg-background font-mono"
                    >
                        <option value=">">{">"} Mayor</option>
                        <option value=">=">{">="} Mayor/Igual</option>
                        <option value="<">{"<"} Menor</option>
                        <option value="<=">{"<="} Menor/Igual</option>
                        <option value="==">{"="} Igual</option>
                        <option value="!=">{"!="} Distinto</option>
                    </select>

                    <input
                        type="text"
                        value={c.value}
                        onChange={(e) => updateCondition(c.id, "value", e.target.value)}
                        className="flex-1 text-sm p-1.5 rounded border border-input bg-background"
                        placeholder="Valor (ej: 10, 'si')"
                    />

                    <button onClick={() => removeCondition(c.id)} className="p-1 text-muted-foreground hover:text-red-500">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}

            <button onClick={addCondition} className="text-xs flex items-center gap-1 text-primary font-medium hover:underline mt-2">
                <Plus className="h-3 w-3" /> Agregar Condición
            </button>

            <button onClick={() => setMode("advanced")} className="text-[10px] text-muted-foreground hover:text-foreground block mt-4">
                modo avanzado (texto)
            </button>
        </div>
    );
}
