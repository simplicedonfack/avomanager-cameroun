"use client";

import { useLangue } from "@/lib/langue";
import type { Langue } from "@/lib/textes";

const LANGUES: { code: Langue; libelle: string }[] = [
  { code: "fr", libelle: "FR" },
  { code: "en", libelle: "EN" },
];

// Sélecteur FR | EN — présent sur l'écran de connexion et dans l'en-tête.
// surFondVert : variante pour l'en-tête vert foncé.
export default function SelecteurLangue({
  surFondVert = false,
}: {
  surFondVert?: boolean;
}) {
  const { langue, changerLangue } = useLangue();

  return (
    <div
      role="group"
      aria-label="Langue / Language"
      className={
        "inline-flex rounded-xl p-1 gap-1 " +
        (surFondVert ? "bg-vg-800/40" : "bg-vg-100")
      }
    >
      {LANGUES.map((l) => {
        const actif = l.code === langue;
        let classes = "h-11 w-12 rounded-lg text-sm font-semibold transition-colors ";
        if (actif) {
          classes += surFondVert ? "bg-white text-vg-800" : "bg-vg-600 text-white";
        } else {
          classes += surFondVert
            ? "text-white/80 hover:bg-vg-700"
            : "text-vg-700 hover:bg-vg-200";
        }
        return (
          <button
            key={l.code}
            type="button"
            aria-pressed={actif}
            onClick={() => changerLangue(l.code)}
            className={classes}
          >
            {l.libelle}
          </button>
        );
      })}
    </div>
  );
}
