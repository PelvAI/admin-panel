"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Video,
    Stethoscope,
    BarChart3,
    MessageSquare,
    Trophy,
    CreditCard,
    Megaphone,
    ChevronDown,
    Activity,
    BookOpen,
} from "lucide-react";
import { useState } from "react";

const menuGroups = [
    {
        title: "General",
        items: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/" },
        ]
    },
    {
        title: "Usuarios & Crecimiento",
        items: [
            { icon: Users, label: "Usuarios", href: "/users" },
            { icon: CreditCard, label: "Suscripciones", href: "/subscriptions" },
            { icon: Megaphone, label: "Publicidad Interna", href: "/ads" },
        ]
    },
    {
        title: "Estudio Clínico",
        items: [
            { icon: Stethoscope, label: "Evaluaciones", href: "/clinical" },
            { icon: Activity, label: "Targets / Perfiles", href: "/clinical/targets" },
            { icon: BarChart3, label: "Analíticas de Salud", href: "/analytics" },
        ]
    },
    {
        title: "Contenido & Experiencia",
        items: [
            { icon: Video, label: "Biblioteca", href: "/content" },
            { icon: Trophy, label: "Gamificación", href: "/gamification" },
        ]
    },
    {
        title: "AI & Soporte",
        items: [
            { icon: MessageSquare, label: "Chat Control", href: "/chat" },
            { icon: BookOpen, label: "Conocimiento RAG", href: "/knowledge" },
        ]
    }
];

export function Sidebar() {
    // Force HMR Update
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState<string[]>(menuGroups.map(g => g.title));

    const toggleGroup = (title: string) => {
        setOpenGroups(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    return (
        <div className="flex h-screen w-64 flex-col bg-white border-r border-border shadow-sm overflow-y-auto">
            <div className="flex h-16 items-center justify-start border-b border-border px-6">
                <Image src="/logo.svg" alt="ALMA Logo" width={100} height={32} className="h-8 w-auto" priority />
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {menuGroups.map((group, idx) => {
                    const isOpen = openGroups.includes(group.title);
                    return (
                        <div key={idx} className="space-y-1">
                            <button
                                onClick={() => toggleGroup(group.title)}
                                className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                            >
                                {group.title}
                                <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen ? "transform rotate-0" : "transform -rotate-90")} />
                            </button>

                            {isOpen && (
                                <div className="space-y-1 pl-2">
                                    {group.items.map((item) => {
                                        const isActive =
                                            pathname === item.href ||
                                            (item.href !== "/" && pathname.startsWith(item.href + "/"));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
