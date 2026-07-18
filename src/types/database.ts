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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          tour_interest: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          tour_interest?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          tour_interest?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_tour_interest_fkey"
            columns: ["tour_interest"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_country: string | null
          author_name: string
          comment_en: string | null
          comment_es: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          rating: number | null
          tour_id: string | null
        }
        Insert: {
          author_country?: string | null
          author_name: string
          comment_en?: string | null
          comment_es?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          tour_id?: string | null
        }
        Update: {
          author_country?: string | null
          author_name?: string
          comment_en?: string | null
          comment_es?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_images: {
        Row: {
          alt_text_en: string | null
          alt_text_es: string | null
          display_order: number | null
          id: string
          is_cover: boolean | null
          storage_path: string
          tour_id: string | null
        }
        Insert: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          display_order?: number | null
          id?: string
          is_cover?: boolean | null
          storage_path: string
          tour_id?: string | null
        }
        Update: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          display_order?: number | null
          id?: string
          is_cover?: boolean | null
          storage_path?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_images_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          category: string
          child_price_usd: number | null
          created_at: string | null
          description_en: string
          description_es: string
          difficulty: string | null
          display_order: number | null
          duration_minutes: number
          excludes: string[] | null

          id: string
          includes: string[] | null
          is_active: boolean | null
          itinerary: Json | null
          languages: string[] | null
          max_people: number | null
          min_age: number | null
          price_usd: number | null
          slug: string
          tide_table: Json | null
          title_en: string
          title_es: string
        }
        Insert: {
          category: string
          child_price_usd?: number | null
          created_at?: string | null
          description_en: string
          description_es: string
          difficulty?: string | null
          display_order?: number | null
          duration_minutes: number
          excludes?: string[] | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          max_people?: number | null
          min_age?: number | null
          price_usd?: number | null
          slug: string
          tide_table?: Json | null
          title_en: string
          title_es: string
        }
        Update: {
          category?: string
          child_price_usd?: number | null
          created_at?: string | null
          description_en?: string
          description_es?: string
          difficulty?: string | null
          display_order?: number | null
          duration_minutes?: number
          excludes?: string[] | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          max_people?: number | null
          min_age?: number | null
          price_usd?: number | null
          slug?: string
          tide_table?: Json | null
          title_en?: string
          title_es?: string
        }
        Relationships: []
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

const Constants = {
  public: {
    Enums: {},
  },
} as const