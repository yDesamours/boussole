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

### Avec un dev container

Le dossier `.devcontainer/` fournit un environnement prêt à l'emploi (Node 24, extensions Vue et Vitest). Dans VS Code, ouvre le projet puis choisis **Dev Containers: Reopen in Container**, ou crée un Codespace sur GitHub. Les dépendances s'installent automatiquement ; lance ensuite `npm run dev`. Le port 5173 est redirigé et s'ouvre dans ton navigateur.

## Organisation

```
src/
  types/schema.ts      Le schéma des données : contenu du framework, projets et itérations, modèle d'export
  types/guide.ts       Les blocs de contenu du guide et du projet exemple
  content/             Le contenu pédagogique : une phase par fichier,
                       guide.ts (le guide du framework) et example.ts (le projet exemple)
  lib/                 Logique pure : projets, itérations, statut, détection du flou, sauvegarde, documents
  lib/exporters/       Un exporteur par format : Markdown, HTML, PDF (pdfmake), Word (docx)
  db/database.ts       Stockage local (Dexie / IndexedDB)
  stores/projects.ts   État de l'application et sauvegarde automatique (Pinia)
  views/               Écrans : projets, projet, phase, nouvelle itération, guide, exemple
  components/          Parcours, champs avec alertes et exemples, checklist, rappel du persona, export, guide
tests/                 Contenu des phases, détecteur de flou, itérations, stockage, sauvegarde, documents, guide
```

## Principes de conception

- **Le contenu est séparé du code.** Ajouter ou modifier une phase se fait dans `src/content/`, sans toucher aux écrans.
- **Le statut d'une phase est calculé, jamais stocké** : il ne peut pas contredire les réponses.
- **Un projet est une suite d'itérations.** Seule la dernière est modifiable ; les précédentes restent consultables. Une nouvelle itération part de ce que la précédente a appris, peut reprendre ses réponses, et remet toujours les checklists à zéro.
- **Rien n'est bloquant.** Les checklists et les alertes signalent, elles n'empêchent pas d'avancer.

## Avancement

La version 1.0 couvre tout le périmètre du MVP défini au cadrage.

| Partie | Contenu | État |
|---|---|---|
| Fondations | Projets, itérations, stockage local, navigation, saisie, checklist de sortie | Terminé |
| Contenu | Les six phases : explication, champs, exemples, alertes, checklist | Terminé |
| Aide dans les phases | Explication repliable, exemples par champ, alertes de flou, rappel du persona | Terminé |
| Documents | Export d'une phase ou d'une itération en Markdown, HTML, PDF et Word | Terminé |
| Pédagogie | Guide du framework et projet exemple, consultables sans créer de projet | Terminé |
| Sauvegarde | Export et import de fichiers, aperçu avant import, sans perte de travail récent | Terminé |

Pistes pour une prochaine itération, à décider après usage réel : synchronisation entre appareils (via GitHub), choix projet par projet lors d'un import en conflit, rappel de sauvegarde.
