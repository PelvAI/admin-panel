import { getToken, clearSession } from "@/lib/auth";
import type {
  AdminChatMessage,
  AdminConversationItem,
  RagDocument,
  ReindexStatus,
} from "@/lib/types/rag";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Types matching Backend FormListResponse
export interface ClinicalForm {
  form_id: string;
  code: string;
  title_key: string;
  version: number;
  status: string;
  target: string;
  frecuencia: string;
  is_active: boolean;
  question_count: number;
  created_at: string;
}

export interface FormPagination {
  total: number;
  page: number;
  size: number;
  items: ClinicalForm[];
}

function formatApiError(error: { detail?: unknown }, status: number): string {
  const detail = error.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: { msg?: string }) => d.msg || JSON.stringify(d))
      .join("; ");
  }
  return `Error ${status}`;
}

export const api = {
  request: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = getToken();
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      clearSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("No autenticado");
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(formatApiError(error, res.status));
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  },

  login: (email: string, firebase_uid: string) =>
    api.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, firebase_uid, is_active: true }),
    }),

  // Clinical Forms
  getForms: async (page = 0, limit = 20): Promise<FormPagination> => {
    return api.request<FormPagination>(
      `/admin/forms?skip=${page * limit}&limit=${limit}`
    );
  },

  // Clinical methods keep `any` to match existing editor pages (MVP)
  getForm: async (formId: string): Promise<any> => {
    return api.request(`/admin/forms/${formId}`);
  },

  createForm: async (data: any): Promise<any> => {
    return api.request(`/admin/forms`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateForm: async (formId: string, data: any): Promise<any> => {
    return api.request(`/admin/forms/${formId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteForm: async (formId: string): Promise<void> => {
    return api.request<void>(`/admin/forms/${formId}`, { method: "DELETE" });
  },

  createSection: async (formId: string, data: any): Promise<any> => {
    return api.request(`/admin/forms/${formId}/sections`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  createQuestion: async (sectionId: string, data: any): Promise<any> => {
    return api.request(`/admin/sections/${sectionId}/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateQuestion: async (questionId: string, data: any): Promise<any> => {
    return api.request(`/admin/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteQuestion: async (questionId: string): Promise<void> => {
    return api.request<void>(`/admin/questions/${questionId}`, {
      method: "DELETE",
    });
  },

  createOption: async (questionId: string, data: any): Promise<any> => {
    return api.request(`/admin/questions/${questionId}/options`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateOption: async (optionId: string, data: any): Promise<any> => {
    return api.request(`/admin/options/${optionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteOption: async (optionId: string): Promise<void> => {
    return api.request<void>(`/admin/options/${optionId}`, { method: "DELETE" });
  },

  createScoringRule: async (formId: string, data: any): Promise<any> => {
    return api.request(`/admin/forms/${formId}/rules`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateScoringRule: async (ruleId: string, data: any): Promise<any> => {
    return api.request(`/admin/rules/${ruleId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteScoringRule: async (ruleId: string): Promise<void> => {
    return api.request<void>(`/admin/rules/${ruleId}`, { method: "DELETE" });
  },

  getTargets: async (): Promise<any> => {
    return api.request(`/admin/targets`);
  },

  createTarget: async (data: any): Promise<any> => {
    return api.request(`/admin/targets`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateTarget: async (targetId: string, data: any): Promise<any> => {
    return api.request(`/admin/targets/${targetId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteTarget: async (targetId: string): Promise<void> => {
    return api.request<void>(`/admin/targets/${targetId}`, { method: "DELETE" });
  },

  // ─── RAG (via Alma backend proxy — never call chatbot :8000) ─────────────

  listRagDocuments: () =>
    api.request<{ documents: RagDocument[] }>("/admin/rag/documents"),

  uploadRagDocuments: async (files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    return api.request<{ ok: boolean; uploaded: unknown[] }>(
      "/admin/rag/documents/upload",
      { method: "POST", body: fd }
    );
  },

  patchRagDocument: (
    id: number,
    body: { categories?: string[]; tags?: string[]; indexed?: boolean }
  ) =>
    api.request(`/admin/rag/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteRagDocument: (id: number) =>
    api.request(`/admin/rag/documents/${id}`, { method: "DELETE" }),

  getReindexStatus: () => api.request<ReindexStatus>("/admin/rag/reindex/status"),

  confirmReindex: (sync = false) =>
    api.request(`/admin/rag/reindex/confirm?sync=${sync ? "true" : "false"}`, {
      method: "POST",
    }),

  getRagAnalyticsSummary: () =>
    api.request<unknown>("/admin/rag/analytics/summary"),

  getRagAnalyticsChunks: () =>
    api.request<unknown>("/admin/rag/analytics/chunks"),

  // ─── Chat monitor (staff) ────────────────────────────────────────────────

  listChatConversations: (limit = 50, offset = 0) =>
    api.request<{ items: AdminConversationItem[]; total: number }>(
      `/admin/chat/conversations?limit=${limit}&offset=${offset}`
    ),

  getChatMessages: (conversationId: string) =>
    api.request<AdminChatMessage[]>(
      `/admin/chat/conversations/${conversationId}/messages`
    ),
};
