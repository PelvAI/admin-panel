import { Save, AlertTriangle } from "lucide-react";
import { VisualRuleBuilder } from "./VisualRuleBuilder";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

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
        <Modal className="max-h-[90vh]">
            <ModalHeader onClose={onClose}>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    {title}
                </h2>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </ModalHeader>

            <ModalBody className="space-y-8">
                    {/* Visual Builder Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-label block">
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
                        <label className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-label block">
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
            </ModalBody>

            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                    Cerrar
                </Button>
                <Button onClick={onClose}>
                    <Save className="h-4 w-4" /> Guardar Configuración
                </Button>
            </ModalFooter>
        </Modal>
    );
}
