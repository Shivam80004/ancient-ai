export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          id: string
          issued_at: string | null
          pdf_url: string | null
          semester_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          semester_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          semester_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_published: boolean | null
          order_index: number
          points_reward: number
          semester_id: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_published?: boolean | null
          order_index: number
          points_reward?: number
          semester_id?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number
          points_reward?: number
          semester_id?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      earned_rewards: {
        Row: {
          earned_at: string | null
          id: string
          reward_kind: string | null
          reward_ref: string | null
          rule_id: string | null
          user_id: string | null
        }
        Insert: {
          earned_at?: string | null
          id?: string
          reward_kind?: string | null
          reward_ref?: string | null
          rule_id?: string | null
          user_id?: string | null
        }
        Update: {
          earned_at?: string | null
          id?: string
          reward_kind?: string | null
          reward_ref?: string | null
          rule_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gift_claims: {
        Row: {
          admin_note: string | null
          created_at: string | null
          gift_id: string | null
          id: string
          resolved_at: string | null
          shipping_info: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string | null
          gift_id?: string | null
          id?: string
          resolved_at?: string | null
          shipping_info?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string | null
          gift_id?: string | null
          id?: string
          resolved_at?: string | null
          shipping_info?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gifts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          point_cost: number | null
          stock: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          point_cost?: number | null
          stock?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          point_cost?: number | null
          stock?: number | null
          title?: string
        }
        Relationships: []
      }
      lesson_completions: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          body: string | null
          content_type: string | null
          content_url: string | null
          course_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          order_index: number
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          body?: string | null
          content_type?: string | null
          content_url?: string | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index: number
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          body?: string | null
          content_type?: string | null
          content_url?: string | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      point_ledger: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reason: string
          ref_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reason: string
          ref_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reason?: string
          ref_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string
          shipping_info: Json | null
          total_points: number
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string
          shipping_info?: Json | null
          total_points?: number
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
          shipping_info?: Json | null
          total_points?: number
          xp?: number
        }
        Relationships: []
      }
      reward_rules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          reward_kind: string | null
          reward_ref: string | null
          rule_type: string
          semester_id: string | null
          threshold: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reward_kind?: string | null
          reward_ref?: string | null
          rule_type: string
          semester_id?: string | null
          threshold: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reward_kind?: string | null
          reward_ref?: string | null
          rule_type?: string
          semester_id?: string | null
          threshold?: number
        }
        Relationships: []
      }
      semesters: {
        Row: {
          created_at: string | null
          id: string
          is_published: boolean | null
          order_index: number
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index: number
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: number
          season_name: string | null
          season_start: string | null
        }
        Insert: {
          id?: number
          season_name?: string | null
          season_start?: string | null
        }
        Update: {
          id?: number
          season_name?: string | null
          season_start?: string | null
        }
        Relationships: []
      }
      streaks: {
        Row: {
          current_streak: number
          last_active_date: string | null
          longest_streak: number
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          user_id: string
        }
        Update: {
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          user_id?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          completed_at: string | null
          created_at: string | null
          evidence_url: string | null
          id: string
          status: string | null
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          status?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          status?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          criteria: string | null
          description: string | null
          due_date: string | null
          id: string
          is_active: boolean | null
          points_reward: number
          requires_approval: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          criteria?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          points_reward?: number
          requires_approval?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          criteria?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          points_reward?: number
          requires_approval?: boolean | null
          title?: string
        }
        Relationships: []
      }
      vibe_likes: {
        Row: {
          created_at: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      vibe_posts: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          kind: string
          like_count: number
          media_url: string | null
          order_index: number
          points_reward: number
          poster_url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          kind: string
          like_count?: number
          media_url?: string | null
          order_index?: number
          points_reward?: number
          poster_url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          kind?: string
          like_count?: number
          media_url?: string | null
          order_index?: number
          points_reward?: number
          poster_url?: string | null
        }
        Relationships: []
      }
      vibe_views: {
        Row: {
          created_at: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          full_name: string
          id: string
          rank: number
          total_points: number
          xp: number
        }[]
      }
      get_season_leaderboard: {
        Args: { since: string }
        Returns: {
          avatar_url: string
          full_name: string
          id: string
          points: number
          rank: number
        }[]
      }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
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
