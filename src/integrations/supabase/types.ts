export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ausencias: {
        Row: {
          created_at: string
          data_ausencia: string
          equipe_id: string
          id: string
          motivo: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data_ausencia: string
          equipe_id: string
          id?: string
          motivo?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data_ausencia?: string
          equipe_id?: string
          id?: string
          motivo?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ausencias_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      convites: {
        Row: {
          accepted_at: string | null
          convidado_por: string | null
          created_at: string
          email: string
          equipe_id: string | null
          expires_at: string
          id: string
          igreja_id: string
          status: Database["public"]["Enums"]["invite_status"]
          tipo: Database["public"]["Enums"]["app_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          convidado_por?: string | null
          created_at?: string
          email: string
          equipe_id?: string | null
          expires_at: string
          id?: string
          igreja_id: string
          status?: Database["public"]["Enums"]["invite_status"]
          tipo: Database["public"]["Enums"]["app_role"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          convidado_por?: string | null
          created_at?: string
          email?: string
          equipe_id?: string | null
          expires_at?: string
          id?: string
          igreja_id?: string
          status?: Database["public"]["Enums"]["invite_status"]
          tipo?: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "convites_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_igreja_id_fkey"
            columns: ["igreja_id"]
            isOneToOne: false
            referencedRelation: "igrejas"
            referencedColumns: ["id"]
          },
        ]
      }
      equipes: {
        Row: {
          created_at: string
          dia_formulario_ausencia:
            | Database["public"]["Enums"]["dia_semana"]
            | null
          horario_formulario_ausencia: string | null
          id: string
          igreja_id: string
          lider_id: string | null
          nome: string
          quantidade_por_culto: number | null
          quantidade_suplentes: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dia_formulario_ausencia?:
            | Database["public"]["Enums"]["dia_semana"]
            | null
          horario_formulario_ausencia?: string | null
          id?: string
          igreja_id: string
          lider_id?: string | null
          nome: string
          quantidade_por_culto?: number | null
          quantidade_suplentes?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dia_formulario_ausencia?:
            | Database["public"]["Enums"]["dia_semana"]
            | null
          horario_formulario_ausencia?: string | null
          id?: string
          igreja_id?: string
          lider_id?: string | null
          nome?: string
          quantidade_por_culto?: number | null
          quantidade_suplentes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipes_igreja_id_fkey"
            columns: ["igreja_id"]
            isOneToOne: false
            referencedRelation: "igrejas"
            referencedColumns: ["id"]
          },
        ]
      }
      escala_membros: {
        Row: {
          confirmado: boolean | null
          created_at: string
          escala_id: string
          id: string
          user_id: string
        }
        Insert: {
          confirmado?: boolean | null
          created_at?: string
          escala_id: string
          id?: string
          user_id: string
        }
        Update: {
          confirmado?: boolean | null
          created_at?: string
          escala_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escala_membros_escala_id_fkey"
            columns: ["escala_id"]
            isOneToOne: false
            referencedRelation: "escalas"
            referencedColumns: ["id"]
          },
        ]
      }
      escalas: {
        Row: {
          created_at: string
          data_escala: string
          equipe_id: string
          evento_id: string
          gerada_em: string
          gerada_por: string | null
          id: string
        }
        Insert: {
          created_at?: string
          data_escala: string
          equipe_id: string
          evento_id: string
          gerada_em?: string
          gerada_por?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          data_escala?: string
          equipe_id?: string
          evento_id?: string
          gerada_em?: string
          gerada_por?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalas_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalas_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          created_at: string
          dia_semana: Database["public"]["Enums"]["dia_semana"]
          horario: string
          id: string
          igreja_id: string
          nome: string | null
        }
        Insert: {
          created_at?: string
          dia_semana: Database["public"]["Enums"]["dia_semana"]
          horario: string
          id?: string
          igreja_id: string
          nome?: string | null
        }
        Update: {
          created_at?: string
          dia_semana?: Database["public"]["Enums"]["dia_semana"]
          horario?: string
          id?: string
          igreja_id?: string
          nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_igreja_id_fkey"
            columns: ["igreja_id"]
            isOneToOne: false
            referencedRelation: "igrejas"
            referencedColumns: ["id"]
          },
        ]
      }
      igrejas: {
        Row: {
          created_at: string
          endereco: string | null
          id: string
          nome: string
          organizador_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          endereco?: string | null
          id?: string
          nome: string
          organizador_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          endereco?: string | null
          id?: string
          nome?: string
          organizador_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      member_contacts: {
        Row: {
          created_at: string
          created_by: string
          email: string
          equipe_id: string
          id: string
          nome: string
          status: string
          updated_at: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          email: string
          equipe_id: string
          id?: string
          nome: string
          status?: string
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          email?: string
          equipe_id?: string
          id?: string
          nome?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_contacts_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          agendada_para: string
          created_at: string
          enviada: boolean | null
          enviada_em: string | null
          escala_id: string | null
          id: string
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          agendada_para: string
          created_at?: string
          enviada?: boolean | null
          enviada_em?: string | null
          escala_id?: string | null
          id?: string
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          agendada_para?: string
          created_at?: string
          enviada?: boolean | null
          enviada_em?: string | null
          escala_id?: string | null
          id?: string
          mensagem?: string
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_escala_id_fkey"
            columns: ["escala_id"]
            isOneToOne: false
            referencedRelation: "escalas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apelido: string | null
          confirmado: boolean
          created_at: string
          data_nascimento: string | null
          email: string
          id: string
          nome_completo: string
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          apelido?: string | null
          confirmado?: boolean
          created_at?: string
          data_nascimento?: string | null
          email: string
          id?: string
          nome_completo: string
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          apelido?: string | null
          confirmado?: boolean
          created_at?: string
          data_nascimento?: string | null
          email?: string
          id?: string
          nome_completo?: string
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          equipe_id: string | null
          id: string
          igreja_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          equipe_id?: string | null
          id?: string
          igreja_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          equipe_id?: string | null
          id?: string
          igreja_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_igreja_id_fkey"
            columns: ["igreja_id"]
            isOneToOne: false
            referencedRelation: "igrejas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_belongs_to_equipe: {
        Args: { _equipe_id: string; _user_id: string }
        Returns: boolean
      }
      user_belongs_to_igreja: {
        Args: { _igreja_id: string; _user_id: string }
        Returns: boolean
      }
      user_is_lider_of_equipe: {
        Args: { _equipe_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "organizador" | "lider" | "membro"
      dia_semana:
        | "domingo"
        | "segunda"
        | "terca"
        | "quarta"
        | "quinta"
        | "sexta"
        | "sabado"
      invite_status: "pending" | "accepted" | "expired"
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
    Enums: {
      app_role: ["organizador", "lider", "membro"],
      dia_semana: [
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado",
      ],
      invite_status: ["pending", "accepted", "expired"],
    },
  },
} as const
