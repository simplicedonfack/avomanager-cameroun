"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { TEXTES, type Dictionnaire, type Langue } from "@/lib/textes";

// La langue choisie est mémorisée sur l'appareil : au retour, l'app s'ouvre
// dans la langue de l'utilisateur, même hors ligne.
const CLE_STOCKAGE = "vegesoft-langue";

const ContexteLangue = createContext<{
  langue: Langue;
  changerLangue: (l: Langue) => void;
}>({ langue: "fr", changerLangue: () => {} });

export function LangueProvider({ children }: { children: ReactNode }) {
  const [langue, setLangue] = useState<Langue>("fr");

  useEffect(() => {
    const memorisee = window.localStorage.getItem(CLE_STOCKAGE);
    if (memorisee === "fr" || memorisee === "en") setLangue(memorisee);
  }, []);

  useEffect(() => {
    document.documentElement.lang = langue;
  }, [langue]);

  function changerLangue(l: Langue) {
    setLangue(l);
    try {
      window.localStorage.setItem(CLE_STOCKAGE, l);
    } catch {
      // Stockage indisponible (navigation privée stricte) : la langue vaut pour la session.
    }
  }

  return (
    <ContexteLangue.Provider value={{ langue, changerLangue }}>
      {children}
    </ContexteLangue.Provider>
  );
}

export function useLangue() {
  return useContext(ContexteLangue);
}

export function useTextes(): Dictionnaire {
  return TEXTES[useLangue().langue];
}
