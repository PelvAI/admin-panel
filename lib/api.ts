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

export const api = {
    // Generic request handler
    request: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
        const headers = {
            "Content-Type": "application/json",
            // NOTE: In development mode, we use a fixed token for testing with the mock user 'test_uid_123'. 
            // In production, this should be replaced by a real Firebase ID Token from a logged-in admin session.
            "Authorization": "Bearer test_uid_123",
            ...options.headers,
        };

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.detail || `Error ${res.status}`);
        }

        return res.json();
    },

    // Clinical Forms
    getForms: async (page = 0, limit = 20): Promise<FormPagination> => {
        return api.request<FormPagination>(`/admin/forms?skip=${page * limit}&limit=${limit}`);
    },

    getForm: async (formId: string): Promise<any> => { // Type as any for MVP or define FullFormDetail type
        return api.request<any>(`/admin/forms/${formId}`);
    },

    createForm: async (data: any): Promise<any> => {
        return api.request<any>(`/admin/forms`, { method: "POST", body: JSON.stringify(data) });
    },

    updateForm: async (formId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/forms/${formId}`, { method: "PUT", body: JSON.stringify(data) });
    },

    deleteForm: async (formId: string): Promise<void> => {
        return api.request<void>(`/admin/forms/${formId}`, { method: "DELETE" });
    },

    // Sections
    createSection: async (formId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/forms/${formId}/sections`, { method: "POST", body: JSON.stringify(data) });
    },

    // Questions
    createQuestion: async (sectionId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/sections/${sectionId}/questions`, { method: "POST", body: JSON.stringify(data) });
    },

    updateQuestion: async (questionId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/questions/${questionId}`, { method: "PUT", body: JSON.stringify(data) });
    },

    deleteQuestion: async (questionId: string): Promise<void> => {
        return api.request<void>(`/admin/questions/${questionId}`, { method: "DELETE" });
    },

    // Options
    createOption: async (questionId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/questions/${questionId}/options`, { method: "POST", body: JSON.stringify(data) });
    },

    updateOption: async (optionId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/options/${optionId}`, { method: "PUT", body: JSON.stringify(data) });
    },

    deleteOption: async (optionId: string): Promise<void> => {
        return api.request<void>(`/admin/options/${optionId}`, { method: "DELETE" });
    },

    // Scoring Rules
    createScoringRule: async (formId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/forms/${formId}/rules`, { method: "POST", body: JSON.stringify(data) });
    },

    updateScoringRule: async (ruleId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/rules/${ruleId}`, { method: "PUT", body: JSON.stringify(data) });
    },

    deleteScoringRule: async (ruleId: string): Promise<void> => {
        return api.request<void>(`/admin/rules/${ruleId}`, { method: "DELETE" });
    },

    // Targets
    getTargets: async (): Promise<any> => {
        return api.request<any>(`/admin/targets`);
    },

    createTarget: async (data: any): Promise<any> => {
        return api.request<any>(`/admin/targets`, { method: "POST", body: JSON.stringify(data) });
    },

    updateTarget: async (targetId: string, data: any): Promise<any> => {
        return api.request<any>(`/admin/targets/${targetId}`, { method: "PUT", body: JSON.stringify(data) });
    },

    deleteTarget: async (targetId: string): Promise<void> => {
        return api.request<void>(`/admin/targets/${targetId}`, { method: "DELETE" });
    },
};
