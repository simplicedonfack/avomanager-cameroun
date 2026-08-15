import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Les valeurs vivent dans Vercel (Settings → Environment Variables),
// jamais dans le code — décision D3.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si les variables manquent OU sont mal formées (ex. URL incomplète), on ne
// plante pas : App affiche un panneau pédagogique qui explique quoi faire.
// Le try/catch protège spécifiquement contre une URL invalide, qui ferait
// sinon échouer le build en plein pré-rendu (leçon du paquet 0.1).
// À partir du paquet 0.2, ce client sera configuré avec db: { schema: "vegesoft" }.
function creerClientSupabase(): SupabaseClient | null {
  if (!url || !cle) return null;
  try {
    return createClient(url, cle);
  } catch {
    return null;
  }
}

export const supabase: SupabaseClient | null = creerClientSupabase();
