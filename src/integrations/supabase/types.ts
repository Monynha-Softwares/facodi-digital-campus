export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      comentarios: {
        Row: {
          conteudo_id: string | null
          created_at: string
          curtidas: number | null
          id: string
          texto: string
          unidade_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          conteudo_id?: string | null
          created_at?: string
          curtidas?: number | null
          id?: string
          texto: string
          unidade_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          conteudo_id?: string | null
          created_at?: string
          curtidas?: number | null
          id?: string
          texto?: string
          unidade_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades_curriculares"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudos: {
        Row: {
          created_at: string
          descricao: string | null
          duracao_minutos: number | null
          id: string
          tipo: string | null
          titulo: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number | null
          id?: string
          tipo?: string | null
          titulo: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number | null
          id?: string
          tipo?: string | null
          titulo?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      conteudos_tags: {
        Row: {
          conteudo_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          conteudo_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          conteudo_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conteudos_tags_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conteudos_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          created_at: string
          descricao: string | null
          duracao_semestres: number | null
          ects_total: number | null
          id: string
          nome: string
          universidade_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          duracao_semestres?: number | null
          ects_total?: number | null
          id?: string
          nome: string
          universidade_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          duracao_semestres?: number | null
          ects_total?: number | null
          id?: string
          nome?: string
          universidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cursos_universidade_id_fkey"
            columns: ["universidade_id"]
            isOneToOne: false
            referencedRelation: "universidades"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos_unidades: {
        Row: {
          curso_id: string | null
          id: string
          obrigatoria: boolean | null
          unidade_id: string | null
        }
        Insert: {
          curso_id?: string | null
          id?: string
          obrigatoria?: boolean | null
          unidade_id?: string | null
        }
        Update: {
          curso_id?: string | null
          id?: string
          obrigatoria?: boolean | null
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cursos_unidades_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cursos_unidades_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades_curriculares"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          nome: string
          universidade_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          nome: string
          universidade_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          nome?: string
          universidade_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progresso: {
        Row: {
          concluido: boolean | null
          conteudo_id: string | null
          created_at: string
          data_conclusao: string | null
          id: string
          unidade_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          concluido?: boolean | null
          conteudo_id?: string | null
          created_at?: string
          data_conclusao?: string | null
          id?: string
          unidade_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          concluido?: boolean | null
          conteudo_id?: string | null
          created_at?: string
          data_conclusao?: string | null
          id?: string
          unidade_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progresso_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progresso_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades_curriculares"
            referencedColumns: ["id"]
          },
        ]
      }
      repositorios: {
        Row: {
          aprovado: boolean | null
          arquivo_url: string
          created_at: string
          descricao: string | null
          downloads: number | null
          id: string
          tamanho_kb: number | null
          tipo_arquivo: string | null
          titulo: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          aprovado?: boolean | null
          arquivo_url: string
          created_at?: string
          descricao?: string | null
          downloads?: number | null
          id?: string
          tamanho_kb?: number | null
          tipo_arquivo?: string | null
          titulo: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          aprovado?: boolean | null
          arquivo_url?: string
          created_at?: string
          descricao?: string | null
          downloads?: number | null
          id?: string
          tamanho_kb?: number | null
          tipo_arquivo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          cor: string | null
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      unidades_conteudos: {
        Row: {
          conteudo_id: string | null
          id: string
          ordem: number | null
          unidade_id: string | null
        }
        Insert: {
          conteudo_id?: string | null
          id?: string
          ordem?: number | null
          unidade_id?: string | null
        }
        Update: {
          conteudo_id?: string | null
          id?: string
          ordem?: number | null
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unidades_conteudos_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unidades_conteudos_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades_curriculares"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades_curriculares: {
        Row: {
          ano_curricular: number | null
          created_at: string
          descricao: string | null
          ects: number
          id: string
          nome: string
          semestre: number
          updated_at: string
        }
        Insert: {
          ano_curricular?: number | null
          created_at?: string
          descricao?: string | null
          ects?: number
          id?: string
          nome: string
          semestre: number
          updated_at?: string
        }
        Update: {
          ano_curricular?: number | null
          created_at?: string
          descricao?: string | null
          ects?: number
          id?: string
          nome?: string
          semestre?: number
          updated_at?: string
        }
        Relationships: []
      }
      universidades: {
        Row: {
          cidade: string | null
          created_at: string
          id: string
          nome: string
          pais: string | null
          sigla: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          id?: string
          nome: string
          pais?: string | null
          sigla?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          id?: string
          nome?: string
          pais?: string | null
          sigla?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      usuarios_cursos: {
        Row: {
          ativo: boolean | null
          curso_id: string | null
          data_inscricao: string
          id: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          curso_id?: string | null
          data_inscricao?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          curso_id?: string | null
          data_inscricao?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_cursos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
