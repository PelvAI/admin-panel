import { X, Save, AlertTriangle } from "lucide-react";
import { VisualRuleBuilder } from "./VisualRuleBuilder";

interface RuleConfigDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;

    // Values to edit
    alertCondition: string;
    alertType: string;
    formula: string; // Passed for reference or context in builder if needed

    variables: string[];

    // Update handlers
    onConditionChange: (condition: string) => void;
    onTypeChange: (type: string) => void;
}

export function RuleConfigDialog({
    isOpen,
    onClose,
    title,
    description,
    alertCondition,
    alertType,
    formula,
    variables,
    onConditionChange,
    onTypeChange
}: RuleConfigDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            {title}
                        </h2>
                        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8 overflow-y-auto flex-1">
                    {/* Visual Builder Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Condiciones Lógicas
                        </label>
                        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                            <VisualRuleBuilder
                                initialFormula={formula}
                                initialCondition={alertCondition}
                                variables={variables}
                                onChange={(_, newCondition) => onConditionChange(newCondition)}
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Define las condiciones que deben cumplirse para activar esta alerta. Puedes combinar múltiples variables.
                        </p>
                    </div>

                    {/* Action Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Acción a Disparar
                        </label>
                        <select
                            value={alertType || "derivacion_clinica"}
                            onChange={(e) => onTypeChange(e.target.value)}
                            className="w-full text-sm bg-background px-3 py-3 rounded-lg border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        >
                            <option value="derivacion_clinica">🔴 Derivación Clínica (Bloqueante)</option>
                            <option value="activar_plan">🟡 Activar Plan Específico</option>
                            <option value="seguimiento">🟢 Seguimiento Normal</option>
                            <option value="mensaje_app">💬 Mostrar Mensaje en App</option>
                        </select>
                        <p className="text-[11px] text-muted-foreground">
                            Determina qué sucede en la aplicación del usuario cuando se cumple la condición.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    );
}
