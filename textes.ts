// ─── Dictionnaire bilingue VEGESOFT ───
// Règle du chantier : aucun texte en dur dans les écrans.
// Chaque lot ajoute ses textes ici, en français ET en anglais.
// Si une clé manque dans une langue, TypeScript refuse le build : garde-fou par construction.

export type Langue = "fr" | "en";

const fr = {
  commun: {
    nomApp: "VEGESOFT",
    sousTitre: "Site agricole pilote de Missole-Banda",
    chantier: "v2 — chantier en cours · Paquet 0.1",
    chargement: "Ouverture de VEGESOFT…",
  },
  connexion: {
    email: "Adresse email",
    emailExemple: "prenom@exemple.com",
    motDePasse: "Mot de passe",
    bouton: "Se connecter",
    boutonEnCours: "Connexion…",
    erreurIdentifiants: "Email ou mot de passe incorrect.",
    erreurGenerique: "Connexion impossible : ",
    aide: "Identifiants oubliés ? Contacter l'administrateur du site (WhatsApp).",
  },
  accueil: {
    deconnexion: "Se déconnecter",
    socleTitre: "Socle v2 en place ✅",
    socleTexte:
      "La connexion fonctionne sur la nouvelle base Next.js. Les modules de la v1 arriveront paquet par paquet, chacun porté puis enrichi, sans jamais toucher à la v1 en production.",
    prochaineTitre: "Prochaine étape du chantier",
    prochaineTexte:
      "Paquet 0.2 — le schéma vegesoft dans CoreBaseDks, sans interruption de la v1.",
  },
  config: {
    titre: "Configuration incomplète",
    texte:
      "Les variables d'environnement Supabase ne sont pas encore renseignées pour ce déploiement :",
    consigne:
      "Dans Vercel : Settings → Environment Variables, ajouter ces deux variables, puis relancer un déploiement.",
  },
};

type Dictionnaire = typeof fr;

const en: Dictionnaire = {
  commun: {
    nomApp: "VEGESOFT",
    sousTitre: "Missole-Banda pilot farm site",
    chantier: "v2 — under construction · Package 0.1",
    chargement: "Opening VEGESOFT…",
  },
  connexion: {
    email: "Email address",
    emailExemple: "name@example.com",
    motDePasse: "Password",
    bouton: "Sign in",
    boutonEnCours: "Signing in…",
    erreurIdentifiants: "Incorrect email or password.",
    erreurGenerique: "Unable to sign in: ",
    aide: "Forgot your credentials? Contact the site administrator (WhatsApp).",
  },
  accueil: {
    deconnexion: "Sign out",
    socleTitre: "v2 foundation in place ✅",
    socleTexte:
      "Sign-in now runs on the new Next.js foundation. The v1 modules will arrive package by package, each one ported and then enriched, without ever touching v1 in production.",
    prochaineTitre: "Next step",
    prochaineTexte:
      "Package 0.2 — the vegesoft schema in CoreBaseDks, with no interruption to v1.",
  },
  config: {
    titre: "Setup incomplete",
    texte:
      "The Supabase environment variables are not yet set for this deployment:",
    consigne:
      "In Vercel: Settings → Environment Variables, add these two variables, then trigger a new deployment.",
  },
};

export const TEXTES: Record<Langue, Dictionnaire> = { fr, en };
export type { Dictionnaire };
