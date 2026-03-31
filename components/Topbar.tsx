"use client";

import { Search, Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Topbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6 shadow-sm z-10 relative">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="search"
                        placeholder="Buscar en PelvIA..."
                        className="h-10 w-80 rounded-full border border-input bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 hover:bg-muted transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 pl-4 border-l border-border hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-none text-foreground">Admin User</p>
                            <p className="text-xs text-muted-foreground">Super Admin</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-500 font-bold border-2 border-white shadow-sm">
                            AU
                        </div>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-white shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-3 py-2 border-b border-border mb-1">
                                <p className="text-sm font-medium">admin@pelvia.com</p>
                                <p className="text-xs text-muted-foreground">ID: 8392-ADMIN</p>
                            </div>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors mx-1 rounded-lg"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <Settings className="h-4 w-4" />
                                Configuración
                            </Link>
                            <div className="border-t border-border my-1" />
                            <button
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mx-1 rounded-lg"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    router.push("/login");
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
