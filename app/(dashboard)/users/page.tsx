"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, Shield, Ban, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "@/components/ui/Table";
import { StatusPill } from "@/components/ui/StatusPill";

// Mock Data
const users = [
    { id: 1, name: "Ana García", email: "ana@example.com", role: "User", status: "Active", joined: "2023-10-15" },
    { id: 2, name: "Carlos López", email: "carlos@example.com", role: "User", status: "Active", joined: "2023-10-20" },
    { id: 3, name: "Admin User", email: "admin@alma.com", role: "Admin", status: "Active", joined: "2023-09-01" },
    { id: 4, name: "Maria Rodriguez", email: "maria@example.com", role: "User", status: "Inactive", joined: "2023-11-05" },
    { id: 5, name: "Sofia Martinez", email: "sofia@example.com", role: "User", status: "Active", joined: "2023-11-12" },
];

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Usuarios"
                description="Gestiona las cuentas y permisos de los usuarios."
                action={<Button>Exportar CSV</Button>}
            />

            <Card padding="sm" className="flex items-center gap-4">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        icon={<Search className="h-4 w-4" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                    <Filter className="h-4 w-4" />
                    Filtros
                </button>
            </Card>

            <Card padding="none" className="overflow-hidden">
                <Table>
                    <TableHead>
                        <tr>
                            <Th>Usuario</Th>
                            <Th>Rol</Th>
                            <Th>Estado</Th>
                            <Th>Fecha Registro</Th>
                            <Th className="text-right">Acciones</Th>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <Td>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-identity-wash flex items-center justify-center text-identity font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </Td>
                                <Td>
                                    <StatusPill tone={user.role === 'Admin' ? 'info' : 'neutral'}>
                                        {user.role === 'Admin' && <Shield className="h-3 w-3" />}
                                        {user.role}
                                    </StatusPill>
                                </Td>
                                <Td>
                                    <StatusPill tone={user.status === 'Active' ? 'success' : 'danger'}>
                                        {user.status === 'Active' ? 'Activo' : 'Inactivo'}
                                    </StatusPill>
                                </Td>
                                <Td className="text-muted-foreground">
                                    {new Date(user.joined).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Enviar Email">
                                            <Mail className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 hover:bg-danger-wash rounded-lg text-muted-foreground hover:text-danger transition-colors" title="Bloquear">
                                            <Ban className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>
                                </Td>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
