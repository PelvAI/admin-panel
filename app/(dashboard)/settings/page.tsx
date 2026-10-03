"use client";

import { User, Lock, Mail, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-6">
            <PageHeader
                title="Configuración"
                description="Gestiona tu perfil y preferencias de seguridad."
            />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information */}
                <Card>
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Información Personal
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre Completo</label>
                            <Input type="text" defaultValue="Admin User" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" defaultValue="admin@alma.com" icon={<Mail className="h-4 w-4" />} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rol</label>
                            <Input type="text" defaultValue="Super Admin" disabled icon={<Shield className="h-4 w-4" />} />
                        </div>
                        <Button className="w-full">Guardar Cambios</Button>
                    </div>
                </Card>

                {/* Security */}
                <Card>
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Seguridad
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contraseña Actual</label>
                            <Input type="password" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nueva Contraseña</label>
                            <Input type="password" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirmar Nueva Contraseña</label>
                            <Input type="password" />
                        </div>
                        <Button variant="outline" className="w-full">Actualizar Contraseña</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
