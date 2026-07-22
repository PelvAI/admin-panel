export interface RagDocument {
  id: number;
  rel_path: string;
  filename: string;
  categories?: string[];
  tags?: string[];
  indexed?: boolean;
  updated_at?: string;
}

export interface ReindexStatus {
  running: boolean;
  run_id?: string | null;
  last_ok?: boolean | null;
  last_error?: string | null;
  [key: string]: unknown;
}

export interface AdminConversationItem {
  conversation_id: string;
  user_id?: string;
  user_email_hash?: string;
  last_message_preview?: string;
  last_message_at?: string;
  message_count?: number;
}

export interface AdminChatMessage {
  message_id: string;
  sender: "user" | "ai" | "system";
  content_encrypted: string;
  created_at?: string;
  meta?: {
    evidence_quality?: string;
    sources_count?: number;
    source_labels?: string[];
  };
}
