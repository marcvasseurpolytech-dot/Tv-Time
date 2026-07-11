# Suivi Séries

App perso : calendrier des sorties + suivi de progression (épisodes vus) pour les séries suivies, à la TV Time. Données via TMDB, stockage dans un Gist GitHub privé.

## 1. Créer le repo GitHub

Crée un repo **privé** sur `marcvasseurpolytech-dot` (ex: `series-tracker`) et pousse ces fichiers.

```bash
cd series-tracker
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:marcvasseurpolytech-dot/series-tracker.git
git push -u origin main
```

## 2. Clé API TMDB

1. Crée un compte gratuit sur https://www.themoviedb.org/
2. Paramètres du compte → API → demande une clé "Developer" (gratuite, immédiate)
3. Note la clé **API Key (v3 auth)**

## 3. Gist privé pour le stockage

1. Va sur https://gist.github.com/
2. Crée un nouveau Gist **secret** (pas public)
3. Nom du fichier : `series-tracker.json`
4. Contenu initial :
   ```json
   { "shows": [] }
   ```
5. Crée le Gist, puis récupère son ID dans l'URL : `https://gist.github.com/marcvasseurpolytech-dot/XXXXXXXXXXXX` → `XXXXXXXXXXXX` est le `GIST_ID`.

## 4. Token GitHub pour écrire dans le Gist

1. https://github.com/settings/tokens → **Generate new token (classic)**
2. Coche uniquement le scope **gist**
3. Génère et note le token (`GITHUB_TOKEN`)

## 5. Déployer sur Vercel

1. Importe le repo GitHub privé dans Vercel (comme pour KwikTOEIC / bornes-polytech)
2. Dans **Settings → Environment Variables**, ajoute :
   - `TMDB_API_KEY` = ta clé TMDB
   - `GITHUB_TOKEN` = le token créé à l'étape 4
   - `GIST_ID` = l'ID du Gist créé à l'étape 3
3. Déploie.

## Utilisation

- **Rechercher** : cherche une série (TMDB), clique "Suivre" pour l'ajouter.
- **Mes séries** : clique sur une série pour déplier les saisons, coche les épisodes vus. Sauvegarde automatique dans le Gist.
- **Calendrier** : liste triée des prochains épisodes à venir pour toutes les séries suivies (rafraîchi à chaque ouverture depuis TMDB).

## Notes techniques

- `api/tmdb.js` : proxy serverless vers TMDB (cache la clé côté serveur).
- `api/shows.js` : lecture/écriture du Gist (séries suivies + épisodes vus).
- Aucune base de données : tout est dans le fichier JSON du Gist.
- Usage mono-utilisateur, pas d'authentification — ne pas rendre l'URL Vercel publique/partagée si tu veux garder ça privé (ou ajoute une protection par mot de passe via Vercel Password Protection, dispo sur les plans payants).

---
MARC VASSEUR — POLYTECH LILLE — marc.vasseur@polytech-lille.fr
