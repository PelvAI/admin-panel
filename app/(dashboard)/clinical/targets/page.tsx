"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, Save, Target } from "lucide-react"; // Using Target icon if available, else Users
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";

export default function TargetsPage() {
    const [targets, setTargets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTarget, setEditingTarget] = useState<any>(null); // null = creating

    // Form State
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: ""
    });

    const loadTargets = async () => {
        try {
            setLoading(true);
            const data = await api.getTargets();
            setTargets(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTargets();
    }, []);

    const handleOpenModal = (target: any = null) => {
        if (target) {
            setEditingTarget(target);
            setFormData({
                code: target.code,
                name: target.name,
                description: target.description || ""
            });
        } else {
            setEditingTarget(null);
            setFormData({ code: "", name: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingTarget) {
                // El código es inmutable: se omite a propósito en vez de
                // enviarlo para que el backend lo descarte en silencio.
                const { code, ...editable } = formData;
                await api.updateTarget(editingTarget.target_id, editable);
            } else {
                await api.createTarget(formData);
            }
            setIsModalOpen(false);
            loadTargets();
        } catch (e) {
            alert("Error guardando target");
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este target?")) return;
        try {
            await api.deleteTarget(id);
            loadTargets();
        } catch (e) {
            alert("Error eliminando target");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestor de Targets"
                description="Define los perfiles de usuario (Etiquetas) para segmentación y scoring."
                action={
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="h-4 w-4" />
                        Nuevo Target
                    </Button>
                }
            />

            {/* List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {targets.map((t) => (
                    <Card key={t.target_id} padding="sm" className="hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Target className="h-5 w-5" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(t)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(t.target_id)} className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger-wash rounded">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg">{t.name}</h3>
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{t.code}</code>

                        {t.description && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                {t.description}
                            </p>
                        )}
                    </Card>
                ))}

                {!loading && targets.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed border-border rounded-xl">
                        <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Target className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No hay targets definidos</h3>
                        <p className="text-muted-foreground mb-4">Crea etiquetas como "Atleta", "Post-parto" o "Embarazo" para personalizar la experiencia.</p>
                        <button onClick={() => handleOpenModal()} className="text-primary font-medium hover:underline">
                            Crear primer Target
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <Modal className="max-w-md">
                    <ModalHeader onClose={() => setIsModalOpen(false)}>
                        <h3 className="text-lg font-bold">{editingTarget ? "Editar Target" : "Nuevo Target"}</h3>
                    </ModalHeader>

                    <ModalBody className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Nombre (Público/Interno)</label>
                                <Input
                                    className="bg-transparent"
                                    placeholder="Ej: Atleta de Alto Rendimiento"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Código (Identificador Único)</label>
                                <div>
                                    <Input
                                        className="bg-muted/30 font-mono uppercase"
                                        placeholder="ATLETA_PRO"
                                        value={formData.code}
                                        disabled={!!editingTarget}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        {editingTarget
                                            ? "El código no se puede cambiar: la segmentación automática lo usa para reconocer el segmento."
                                            : "Usado en reglas de lógica. Ej: ATHLETE, PREGNANT"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Descripción (Opcional)</label>
                                <textarea
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                                    placeholder="Describe cuándo se aplica esta etiqueta..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={!formData.name || !formData.code}>
                            <Save className="h-4 w-4" />
                            Guardar Target
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
}
