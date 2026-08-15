"use client";

// ─── Composant à hooks (décision D1) ───
// Tous les hooks de données des futurs modules vivront ici (ou plus bas),
// jamais dans le shell App.

import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useTextes } from "@/lib/langue";
import Feuille from "@/components/Feuille";
import SelecteurLangue from "@/components/SelecteurLangue";

export default function MainApp({ session }: { session: Session }) {
  const t = useTextes();
  const [enCours, setEnCours] = useState(false);

  async function seDeconnecter() {
    if (!supabase) return;
    setEnCours(true);
    await supabase.auth.signOut();
    // App bascule tout seul vers l'écran de connexion.
  }

  return (
    <div className="min-h-dvh bg-vg-50">
      <header className="bg-vg-700 text-white shadow">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-vg-600 text-vg-100 flex items-center justify-center shrink-0">
            <Feuille className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-tight">{t.commun.nomApp}</p>
            <p className="text-xs text-vg-200 truncate">{session.user.email}</p>
          </div>
          <SelecteurLangue surFondVert />
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        <section className="bg-white rounded-carte shadow p-5">
          <h2 className="text-lg font-bold text-vg-900">{t.accueil.socleTitre}</h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">{t.accueil.socleTexte}</p>
        </section>

        <section className="bg-vg-100 border border-vg-200 rounded-carte p-5">
          <h3 className="text-sm font-semibold text-vg-800">{t.accueil.prochaineTitre}</h3>
          <p className="mt-1 text-sm text-vg-800/80">{t.accueil.prochaineTexte}</p>
        </section>

        <button
          type="button"
          onClick={seDeconnecter}
          disabled={enCours}
          className="w-full h-12 rounded-carte border border-stone-300 bg-white text-stone-700 font-medium hover:bg-stone-50 active:bg-stone-100 disabled:opacity-60"
        >
          {t.accueil.deconnexion}
        </button>

        <p className="text-center text-xs text-stone-400">{t.commun.chantier}</p>
      </main>
    </div>
  );
}
