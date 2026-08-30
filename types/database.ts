/**
 * Types de la base Supabase — Heneris.
 *
 * Écrits à la main pour correspondre à `supabase/migrations/`. À régénérer
 * quand la CLI Supabase sera reliée au projet :
 *   npx supabase gen types typescript --linked > types/database.ts
 * Le schéma SQL reste la source de vérité.
 */

export type UserRole = "client" | "shopper";
export type ShopperStatus = "en_revue" | "actif" | "refuse" | "suspendu";
export type Availability = "ouvert" | "complet" | "pause";

type Timestamps = { created_at: string };

export interface ProfileRow extends Timestamps {
  id: string;
  user_id: string;
  role: UserRole;
  prenom: string;
  nom: string;
  avatar_url: string | null;
  ville: string | null;
}

export interface ShopperProfileRow extends Timestamps {
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
  updated_at: string;
}

export interface PortfolioItemRow extends Timestamps {
  id: string;
  shopper_id: string;
  image_path: string;
  legende: string;
  position: number;
}

export interface ConversationRow extends Timestamps {
  id: string;
  client_id: string;
  shopper_id: string;
  last_message_at: string;
}

export interface BriefRow extends Timestamps {
  id: string;
  conversation_id: string;
  categorie: string;
  budget_min: number | null;
  budget_max: number | null;
  description: string;
  delai: string | null;
  updated_at: string;
}

export interface MessageRow extends Timestamps {
  id: string;
  conversation_id: string;
  sender_id: string;
  contenu: string;
  read_at: string | null;
}

export interface ReviewRow extends Timestamps {
  id: string;
  shopper_id: string;
  client_id: string;
  note: number;
  commentaire: string;
}

type TableShape<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableShape<
        ProfileRow,
        Pick<ProfileRow, "user_id"> & Partial<ProfileRow>
      >;
      shopper_profiles: TableShape<
        ShopperProfileRow,
        Pick<ShopperProfileRow, "profile_id" | "slug"> & Partial<ShopperProfileRow>
      >;
      portfolio_items: TableShape<
        PortfolioItemRow,
        Pick<PortfolioItemRow, "shopper_id" | "image_path"> & Partial<PortfolioItemRow>
      >;
      conversations: TableShape<
        ConversationRow,
        Pick<ConversationRow, "client_id" | "shopper_id"> & Partial<ConversationRow>
      >;
      briefs: TableShape<
        BriefRow,
        Pick<BriefRow, "conversation_id" | "categorie"> & Partial<BriefRow>
      >;
      messages: TableShape<
        MessageRow,
        Pick<MessageRow, "conversation_id" | "sender_id" | "contenu"> & Partial<MessageRow>
      >;
      reviews: TableShape<
        ReviewRow,
        Pick<ReviewRow, "shopper_id" | "client_id" | "note"> & Partial<ReviewRow>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      current_profile_id: { Args: Record<string, never>; Returns: string };
    };
    Enums: {
      user_role: UserRole;
      shopper_status: ShopperStatus;
      availability: Availability;
    };
  };
};
