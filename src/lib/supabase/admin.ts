import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/validation/env";

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          name: string;
          mime_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
        Relationships: [];
      };
      document_chunks: {
        Row: {
          id: string;
          document_id: string;
          content: string;
          source: string;
          chunk_index: number;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          content: string;
          source: string;
          chunk_index: number;
          embedding: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["document_chunks"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_document_chunks: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          document_id: string;
          content: string;
          source: string;
          chunk_index: number;
          document_name: string;
          similarity: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export function createSupabaseAdminClient() {
  const env = getServerEnv();

  return createClient<Database, "public">(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
