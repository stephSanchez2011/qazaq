# Qazaq — apprendre le kazakh

Application web pour francophones : alphabet cyrillique et latin, leçons de vocabulaire, flashcards à répétition espacée, quiz, phrases de voyage et mini-leçons de grammaire.

## Lancer

```bash
npm install
npm run dev
```

Ouvrez l’URL affichée (souvent `http://localhost:5173`).

## Contenu

- 14 leçons guidées
- Lexique searchable
- Atelier : écrire (clavier әғқңөүұ), associer, écouter
- Dialogues (thé, bazar, hôtel…)
- ~200 mots, 40 phrases
- Alphabet (42 lettres)
- 8 fiches de grammaire
- Progression, série et objectif du jour dans le navigateur

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

Le site : https://stephSanchez2011.github.io/qazaq/

GitHub Pages a des pannes sur l’action `deploy-pages` (erreur 503). On publie donc le site **déjà compilé** dans `/docs` :

1. Dépôt → **Settings → Pages**
2. Source : **Deploy from a branch** (pas GitHub Actions)
3. Branch : `main` — dossier : `/docs`
4. Save

Puis ouvrez https://stephSanchez2011.github.io/qazaq/
