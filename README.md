# Boussole

De l'idée vague au premier jour de code.

Boussole guide un développeur à travers les six phases d'un projet (Comprendre, Explorer, Cadrer, Planifier, Construire, Confronter) et recommence à chaque nouvelle version du produit. Elle explique chaque phase, aide à formuler des réponses précises, et produit un document par phase.

Application personnelle : aucun compte, aucun serveur. Les projets restent dans le navigateur (IndexedDB).

## Démarrer

```bash
npm install
npm run dev         # serveur de développement
npm test            # tests (Vitest)
npm run type-check  # vérification des types
npm run build       # version de production dans dist/
npm run preview     # sert la version de production
```

Le dossier `dist/` est un site statique : il peut être servi depuis n'importe quel hébergement statique ou en local.

## Organisation

```
src/
  types/schema.ts      Le schéma des données : contenu du framework, projets et itérations, modèle d'export
  content/             Le contenu pédagogique, une phase par fichier (seule Comprendre est rédigée)
  lib/                 Logique pure : projets, itérations, statut des phases, détection du flou
  db/database.ts       Stockage local (Dexie / IndexedDB)
  stores/projects.ts   État de l'application et sauvegarde automatique (Pinia)
  views/               Écrans : liste des projets, projet, phase, nouvelle itération
  components/          Parcours des phases, champs de saisie, indicateur d'enregistrement
tests/                 Tests du détecteur de flou, de la logique des itérations et du stockage
```

## Principes de conception

- **Le contenu est séparé du code.** Ajouter ou modifier une phase se fait dans `src/content/`, sans toucher aux écrans.
- **Le statut d'une phase est calculé, jamais stocké** : il ne peut pas contredire les réponses.
- **Un projet est une suite d'itérations.** Seule la dernière est modifiable ; les précédentes restent consultables. Une nouvelle itération part de ce que la précédente a appris, peut reprendre ses réponses, et remet toujours les checklists à zéro.
- **Rien n'est bloquant.** Les checklists et les alertes signalent, elles n'empêchent pas d'avancer.

## Avancement

| Cycle | Contenu | État |
|---|---|---|
| 1. Fondations | Projets, itérations, stockage, navigation, saisie | Terminé |
| 2. Phase 1 complète | Explications, exemples, checklist, alertes, export Markdown, sauvegarde en fichier | À faire |
| 3. Phases 2 et 3 | Contenu, export HTML, PDF et Word | À faire |
| 4. Phases 4 à 6 | Contenu | À faire |
| 5. Finitions | Ajustements suite aux retours | À faire |
