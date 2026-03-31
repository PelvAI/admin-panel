"use client";

import { ThumbsDown, AlertCircle, Send, RefreshCw, Bot } from "lucide-react";
import { useState } from "react";

const conversations = [
    { id: 1, user: "Anon-8392", lastMessage: "¿Es normal sentir dolor después del ejercicio?", time: "Hace 5m", sentiment: "Neutral", flagged: false },
    { id: 2, user: "Anon-1204", lastMessage: "No entiendo cómo hacer el ejercicio 3.", time: "Hace 12m", sentiment: "Negative", flagged: true },
    { id: 3, user: "Anon-5591", lastMessage: "¡Me siento mucho mejor hoy!", time: "Hace 45m", sentiment: "Positive", flagged: false },
];

export default function ChatControlPage() {
    const [activeTab, setActiveTab] = useState<"monitor" | "sandbox">("monitor");

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">Chat Control</h2>
                    <p className="text-muted-foreground">Supervisa las interacciones y prueba el modelo.</p>
                </div>
                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("monitor")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'monitor' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Monitor
                    </button>
                    <button
                        onClick={() => setActiveTab("sandbox")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sandbox' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Sandbox (Test)
                    </button>
                </div>
            </div>

            {activeTab === "monitor" ? (
                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Sidebar List */}
                    <div className="w-1/3 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/30">
                            <h3 className="font-medium">Conversaciones Recientes</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.map((chat) => (
                                <div key={chat.id} className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${chat.flagged ? 'bg-red-50/50' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-sm">{chat.user}</span>
                                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{chat.lastMessage}</p>
                                    {chat.flagged && (
                                        <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-medium">
                                            <AlertCircle className="h-3 w-3" />
                                            Intervención Requerida
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Detail */}
                    <div className="flex-1 bg-card rounded-xl border border-border shadow-sm flex flex-col">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">Anon-1204</h3>
                                <p className="text-xs text-muted-foreground">ID: 8f92-1204-ab91</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg">Marcar Error</button>
                                <button className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg">Tomar Control</button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-muted/10">
                            <div className="flex justify-end">
                                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                                    <p className="text-sm">Hola, ¿cómo puedo ayudarte hoy con tu salud pélvica?</p>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white border border-border px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%]">
                                    <p className="text-sm">No entiendo cómo hacer el ejercicio 3.</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                                    <p className="text-sm">Entiendo. El ejercicio 3 es &quot;Contracción sostenida&quot;. Debes apretar como si aguantaras las ganas de orinar por 5 segundos. ¿Quieres ver el video de nuevo?</p>
                                </div>
                                <div className="flex flex-col justify-end ml-2 gap-1">
                                    <ThumbsDown className="h-4 w-4 text-red-400 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Configuration Panel */}
                    <div className="w-1/3 bg-card rounded-xl border border-border shadow-sm p-6 overflow-y-auto">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            Configuración del Modelo
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">System Prompt</label>
                                <textarea
                                    className="w-full h-40 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                    defaultValue="Eres un asistente experto en salud pélvica. Tu tono es empático, profesional y motivador..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Temperatura (Creatividad)</label>
                                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-primary" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Preciso (0.0)</span>
                                    <span>Creativo (1.0)</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <button className="w-full bg-muted text-foreground hover:bg-muted/80 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Resetear Contexto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Sandbox */}
                    <div className="flex-1 bg-card rounded-xl border border-border shadow-sm flex flex-col">
                        <div className="p-4 border-b border-border bg-muted/30">
                            <h3 className="font-medium">Vista Previa (Sandbox)</h3>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-white border border-border px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                                    <p className="text-sm">¡Hola! Soy tu AI Coach. ¿En qué puedo ayudarte hoy?</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-border bg-white rounded-b-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje de prueba..."
                                    className="w-full pl-4 pr-12 py-3 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                                />
                                <button className="absolute right-2 top-2 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
