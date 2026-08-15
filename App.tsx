"use client";

// ─── Shell d'authentification (décision D1) ───
// App ne fait qu'une chose : savoir si quelqu'un est connecté, puis afficher
// le bon écran. Tous les hooks de données vivront dans MainApp — jamais ici.
// Cette séparation règle le piège React #310 par construction.

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { LangueProvider, useTextes } from "@/lib/langue";
import Feuille from "@/components/Feuille";
import Login from "@/components/Login";
import MainApp from "@/components/MainApp";

export default function App() {
  return (
    <LangueProvider>
      <Coquille />
    </LangueProvider>
  );
}

function Coquille() {
  const [session, setSession] = useState<Session | null>(null);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setPret(true);
      return;
    }
    let actif = true;
    supabase.auth.getSession().then(({ data }) => {
      if (actif) {
        setSession(data.session);
        setPret(true);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evenement, nouvelleSession) => {
      setSession(nouvelleSession);
    });
    return () => {
      actif = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!supabase) return <PanneauConfig />;
  if (!pret) return <Splash />;
  if (!session) return <Login />;
  return <MainApp session={session} />;
}

function Splash() {
  const t = useTextes();
  return (
    <main className="min-h-dvh bg-vg-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-carte bg-vg-700 text-vg-100 flex items-center justify-center shadow-lg">
          <Feuille className="h-9 w-9" />
        </div>
        <p className="text-sm text-stone-500">{t.commun.chargement}</p>
      </div>
    </main>
  );
}

// Refus pédagogique : si les variables d'environnement manquent,
// on explique quoi faire au lieu de planter.
function PanneauConfig() {
  const t = useTextes();
  return (
    <main className="min-h-dvh bg-vg-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-carte shadow-lg p-6">
        <h1 className="text-lg font-bold text-amber-700">{t.config.titre}</h1>
        <p className="mt-2 text-sm text-stone-600">{t.config.texte}</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <code className="bg-stone-100 rounded px-2 py-1">NEXT_PUBLIC_SUPABASE_URL</code>
          </li>
          <li>
            <code className="bg-stone-100 rounded px-2 py-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </li>
        </ul>
        <p className="mt-3 text-sm text-stone-600">{t.config.consigne}</p>
      </div>
    </main>
  );
}
