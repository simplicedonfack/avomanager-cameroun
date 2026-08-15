"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useTextes } from "@/lib/langue";
import Feuille from "@/components/Feuille";
import SelecteurLangue from "@/components/SelecteurLangue";

export default function Login() {
  const t = useTextes();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  async function seConnecter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setErreur("");
    setEnCours(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: motDePasse,
    });
    if (error) {
      setErreur(
        error.message.includes("Invalid login credentials")
          ? t.connexion.erreurIdentifiants
          : t.connexion.erreurGenerique + error.message
      );
      setEnCours(false);
    }
    // En cas de succès, App bascule tout seul vers MainApp (onAuthStateChange).
  }

  return (
    <main className="min-h-dvh bg-linear-to-b from-vg-100 to-vg-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-carte bg-vg-700 text-vg-100 flex items-center justify-center shadow-lg">
            <Feuille className="h-9 w-9" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-vg-900">
            {t.commun.nomApp}
          </h1>
          <p className="mt-1 text-sm text-stone-500 text-center">{t.commun.sousTitre}</p>
        </div>

        <form onSubmit={seConnecter} className="bg-white rounded-carte shadow-lg p-6 space-y-4">
          {erreur ? (
            <p role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3">
              {erreur}
            </p>
          ) : null}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              {t.connexion.email}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder={t.connexion.emailExemple}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-stone-300 text-base bg-white focus:outline-none focus:ring-2 focus:ring-vg-500 focus:border-vg-500"
            />
          </div>

          <div>
            <label htmlFor="mot-de-passe" className="block text-sm font-medium text-stone-700 mb-1">
              {t.connexion.motDePasse}
            </label>
            <input
              id="mot-de-passe"
              type="password"
              required
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-stone-300 text-base bg-white focus:outline-none focus:ring-2 focus:ring-vg-500 focus:border-vg-500"
            />
          </div>

          <button
            type="submit"
            disabled={enCours}
            className="w-full h-12 rounded-xl bg-vg-600 hover:bg-vg-700 active:bg-vg-800 text-white text-base font-semibold shadow disabled:opacity-60 transition-colors"
          >
            {enCours ? t.connexion.boutonEnCours : t.connexion.bouton}
          </button>

          <p className="text-xs text-stone-400 text-center">{t.connexion.aide}</p>
        </form>

        <div className="mt-6 flex justify-center">
          <SelecteurLangue />
        </div>
        <p className="mt-4 text-center text-xs text-stone-400">{t.commun.chantier}</p>
      </div>
    </main>
  );
}
