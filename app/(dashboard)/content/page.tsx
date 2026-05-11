"use client";

import { useState } from "react";
import { Search, Plus, Play, Clock, Tag, MoreVertical } from "lucide-react";

// Mock Data
const exercises = [
    { id: 1, title: "Contracciones Rápidas", category: "Fortalecimiento", duration: "5 min", thumbnail: "/thumbnails/kegel_fast.jpg" },
    { id: 2, title: "Respiración Diafragmática", category: "Relajación", duration: "10 min", thumbnail: "/thumbnails/breathing.jpg" },
    { id: 3, title: "Coordinación Pélvica", category: "Control Motor", duration: "12 min", thumbnail: "/thumbnails/coordination.jpg" },
    { id: 4, title: "Estiramiento Lumbar", category: "Flexibilidad", duration: "8 min", thumbnail: "/thumbnails/stretch.jpg" },
    { id: 5, title: "Puente de Glúteos", category: "Fortalecimiento", duration: "15 min", thumbnail: "/thumbnails/bridge.jpg" },
];

const categories = ["Todos", "Fortalecimiento", "Relajación", "Control Motor", "Flexibilidad"];

export default function ContentPage() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredExercises = exercises.filter(ex =>
        selectedCategory === "Todos" || ex.category === selectedCategory
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Biblioteca de Contenido</h2>
                    <p className="text-muted-foreground">Gestiona los videos de ejercicios y material educativo.</p>
                </div>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Ejercicio
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar ejercicio..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExercises.map((ex) => (
                    <div key={ex.id} className="group relative bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden">
                        <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                            {/* Placeholder for thumbnail */}
                            <div className="text-muted-foreground/20">
                                <Play className="h-12 w-12 fill-current" />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button className="bg-white/90 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                                </button>
                            </div>
                            <div className="absolute top-2 right-2">
                                <button className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                                    <MoreVertical className="h-4 w-4 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-foreground line-clamp-1" title={ex.title}>{ex.title}</h3>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {ex.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    {ex.category}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex-1 text-xs font-medium border border-border rounded-lg py-2 hover:bg-muted transition-colors">
                                    Editar
                                </button>
                                <button className="flex-1 text-xs font-medium bg-primary/10 text-primary border border-transparent rounded-lg py-2 hover:bg-primary/20 transition-colors">
                                    Asignar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
