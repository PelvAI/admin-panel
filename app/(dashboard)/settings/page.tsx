"use client";

import { User, Lock, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Configuración</h2>
                <p className="text-muted-foreground">Gestiona tu perfil y preferencias de seguridad.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Información Personal
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre Completo</label>
                            <input
                                type="text"
                                defaultValue="Admin User"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    defaultValue="admin@vela.com"
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rol</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    defaultValue="Super Admin"
                                    disabled
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg font-medium transition-colors">
                            Guardar Cambios
                        </button>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Seguridad
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contraseña Actual</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nueva Contraseña</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <button className="w-full border border-border hover:bg-muted py-2 rounded-lg font-medium transition-colors">
                            Actualizar Contraseña
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
