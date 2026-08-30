/**
 * Types de la base Supabase — Heneris.
 *
 * Écrits à la main, dans la forme attendue par @supabase/supabase-js v2
 * (Row / Insert / Update / Relationships par table). À régénérer quand la CLI
 * Supabase sera reliée :
 *   npx supabase gen types typescript --linked > types/database.ts
 * Le schéma SQL (supabase/migrations/) reste la source de vérité.
 */

export type UserRole = "client" | "shopper";
export type ShopperStatus = "en_revue" | "actif" | "refuse" | "suspendu";
export type Availability = "ouvert" | "complet" | "pause";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          prenom: string;
          nom: string;
          avatar_url: string | null;
          ville: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: UserRole;
          prenom?: string;
          nom?: string;
          avatar_url?: string | null;
          ville?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: UserRole;
          prenom?: string;
          nom?: string;
          avatar_url?: string | null;
          ville?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      shopper_profiles: {
        Row: {
          id: string;
          profile_id: string;
          slug: string;
          titre: string;
          bio: string;
          specialites: string[];
          styles: string[];
          budget_min: number | null;
          budget_max: number | null;
          disponibilite: Availability;
          statut: ShopperStatus;
          note_moyenne: number | null;
          nb_avis: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          slug: string;
          titre?: string;
          bio?: string;
          specialites?: string[];
          styles?: string[];
          budget_min?: number | null;
          budget_max?: number | null;
          disponibilite?: Availability;
          statut?: ShopperStatus;
          note_moyenne?: number | null;
          nb_avis?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          slug?: string;
          titre?: string;
          bio?: string;
          specialites?: string[];
          styles?: string[];
          budget_min?: number | null;
          budget_max?: number | null;
          disponibilite?: Availability;
          statut?: ShopperStatus;
          note_moyenne?: number | null;
          nb_avis?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shopper_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_items: {
        Row: {
          id: string;
          shopper_id: string;
          image_path: string;
          legende: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shopper_id: string;
          image_path: string;
          legende?: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shopper_id?: string;
          image_path?: string;
          legende?: string;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_items_shopper_id_fkey";
            columns: ["shopper_id"];
            isOneToOne: false;
            referencedRelation: "shopper_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          client_id: string;
          shopper_id: string;
          created_at: string;
          last_message_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          shopper_id: string;
          created_at?: string;
          last_message_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          shopper_id?: string;
          created_at?: string;
          last_message_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_shopper_id_fkey";
            columns: ["shopper_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      briefs: {
        Row: {
          id: string;
          conversation_id: string;
          categorie: string;
          budget_min: number | null;
          budget_max: number | null;
          description: string;
          delai: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          categorie: string;
          budget_min?: number | null;
          budget_max?: number | null;
          description?: string;
          delai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          categorie?: string;
          budget_min?: number | null;
          budget_max?: number | null;
          description?: string;
          delai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "briefs_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: true;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          contenu: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          contenu: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          contenu?: string;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          nom: string;
          email: string;
          sujet: string;
          message: string;
          auteur_id: string | null;
          traite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          email: string;
          sujet: string;
          message: string;
          auteur_id?: string | null;
          traite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          email?: string;
          sujet?: string;
          message?: string;
          auteur_id?: string | null;
          traite?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_messages_auteur_id_fkey";
            columns: ["auteur_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          shopper_id: string;
          client_id: string;
          note: number;
          commentaire: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shopper_id: string;
          client_id: string;
          note: number;
          commentaire?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          shopper_id?: string;
          client_id?: string;
          note?: number;
          commentaire?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_shopper_id_fkey";
            columns: ["shopper_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      current_profile_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      shopper_status: ShopperStatus;
      availability: Availability;
    };
    CompositeTypes: Record<never, never>;
  };
};

/* Alias pratiques ---------------------------------------------------------- */
type Tables = Database["public"]["Tables"];
export type ProfileRow = Tables["profiles"]["Row"];
export type ShopperProfileRow = Tables["shopper_profiles"]["Row"];
export type PortfolioItemRow = Tables["portfolio_items"]["Row"];
export type ConversationRow = Tables["conversations"]["Row"];
export type BriefRow = Tables["briefs"]["Row"];
export type MessageRow = Tables["messages"]["Row"];
export type ReviewRow = Tables["reviews"]["Row"];
export type ContactMessageRow = Tables["contact_messages"]["Row"];

export type { Json };
