import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Les valeurs vivent dans Vercel (Settings → Environment Variables),
// jamais dans le code — décision D3.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si les variables manquent, on ne plante pas :
// App affiche un panneau pédagogique qui explique quoi faire.
// À partir du paquet 0.2, ce client sera configuré avec db: { schema: "vegesoft" }.
export const supabase: SupabaseClient | null =
  url && cle ? createClient(url, cle) : null;
