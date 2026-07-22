"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bot, Loader2, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import type { AdminChatMessage, AdminConversationItem } from "@/lib/types/rag";

function formatTime(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function anonLabel(item: AdminConversationItem): string {
  if (item.user_email_hash) {
    return `Anon-${item.user_email_hash.slice(0, 6)}`;
  }
  if (item.user_id) {
    return `Anon-${item.user_id.slice(0, 6)}`;
  }
  return "Anon-????";
}

export default function ChatControlPage() {
  const [activeTab, setActiveTab] = useState<"monitor" | "sandbox">("monitor");
  const [items, setItems] = useState<AdminConversationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setListLoading(true);
    setError(null);
    api
      .listChatConversations()
      .then((r) => {
        setItems(r.items || []);
        if (r.items?.length && !selectedId) {
          setSelectedId(r.items[0].conversation_id);
        }
      })
      .catch((e) =>
        setError(
          e instanceof Error
            ? e.message
            : "No se pudieron cargar las conversaciones"
        )
      )
      .finally(() => setListLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    setMessagesLoading(true);
    api
      .getChatMessages(selectedId)
      .then(setMessages)
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "No se pudieron cargar los mensajes"
        )
      )
      .finally(() => setMessagesLoading(false));
  }, [selectedId]);

  const selected = items.find((i) => i.conversation_id === selectedId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">
            Chat Control
          </h2>
          <p className="text-muted-foreground">
            Supervisa las conversaciones de pacientes (fuente: backend Alma).
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("monitor")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "monitor"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monitor
          </button>
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "sandbox"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {error && activeTab === "monitor" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <span className="block text-xs mt-1 text-red-600/80">
            Requiere endpoints /admin/chat/* en el backend (ver plano de
            integración).
          </span>
        </div>
      )}

      {activeTab === "monitor" ? (
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-1/3 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-medium">Conversaciones Recientes</h3>
              {listLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {!listLoading && items.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No hay conversaciones
                </div>
              )}
              {items.map((chat) => (
                <button
                  type="button"
                  key={chat.conversation_id}
                  onClick={() => setSelectedId(chat.conversation_id)}
                  className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedId === chat.conversation_id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">{anonLabel(chat)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(chat.last_message_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {chat.last_message_preview || "—"}
                  </p>
                  {typeof chat.message_count === "number" && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {chat.message_count} mensajes
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  {selected ? anonLabel(selected) : "Selecciona una conversación"}
                </h3>
                {selected && (
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: {selected.conversation_id}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled
                  title="Próximamente"
                  className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg opacity-50 cursor-not-allowed"
                >
                  Marcar Error
                </button>
                <button
                  type="button"
                  disabled
                  title="Próximamente"
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg opacity-50 cursor-not-allowed"
                >
                  Tomar Control
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-muted/10">
              {messagesLoading && (
                <div className="flex justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
              {!messagesLoading && selectedId && messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Sin mensajes en esta conversación.
                </p>
              )}
              {!selectedId && !messagesLoading && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Elige una conversación a la izquierda.
                </p>
              )}
              {/* Paciente (user) a la izquierda; AI a la derecha — vista staff */}
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                const isAi = msg.sender === "ai" || msg.sender === "system";
                return (
                  <div
                    key={msg.message_id}
                    className={`flex ${isUser ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                        isUser
                          ? "bg-white border border-border rounded-tl-none"
                          : "bg-primary text-primary-foreground rounded-tr-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content_encrypted}
                      </p>
                      {isAi && msg.meta?.evidence_quality && (
                        <span
                          className={`mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full ${
                            isUser
                              ? "bg-muted text-muted-foreground"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          evidence: {msg.meta.evidence_quality}
                          {typeof msg.meta.sources_count === "number"
                            ? ` · ${msg.meta.sources_count} fuentes`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md text-center space-y-4 bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading">Sandbox — Próximamente</h3>
            <p className="text-sm text-muted-foreground">
              La edición de system prompt y temperatura no está conectada al
              chatbot PelvAI vía Alma. Esta pestaña no guarda ni envía nada al
              modelo hasta que el backend exponga un contrato de sandbox.
            </p>
            <div className="flex items-start gap-2 text-left text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Para probar el asistente, usa la app de la paciente (frontend) o
                espera el endpoint admin de smoke test.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
