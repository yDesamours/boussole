import type { PhaseDefinition } from '../types/schema';

/**
 * Phase 4 — Planifier
 *
 * Objectif : organiser la construction du MVP, juste assez pour commencer.
 * Sortie   : Document 4 — Planification.
 */
export const planifier: PhaseDefinition = {
  id: 'planifier',
  order: 4,
  title: 'Planifier',

  objective: 'Organiser la construction du MVP : planifier juste assez pour commencer, pas plus.',

  explanation: `
Tu sais quoi construire. Il reste à savoir **dans quel ordre**, avec quoi, et ce qui risque de te bloquer.

### Les inconnues critiques

Pour chaque fonctionnalité du MVP, trois questions :

1. **Est-ce que je sais la construire ?** Si non, c'est une inconnue critique.
2. **De quoi dépend-elle ?** Certaines fonctionnalités ne peuvent pas être construites avant d'autres.
3. **Quel est le risque ?** Qu'est-ce qui pourrait bloquer ou prendre plus de temps que prévu ?

On traite les inconnues critiques **en premier**. Une inconnue ignorée devient un blocage au milieu du projet, quand on a déjà investi du temps. Et on n'estime jamais ce qu'on ne comprend pas : on prototype d'abord, on estime ensuite. Un doute non vérifié peut modifier toute l'architecture.

### La fondation

Repère l'élément dont tout le reste dépend, et que tout le reste doit respecter. C'est la première chose à construire.

### Les technologies

On choisit une technologie parce qu'elle répond à des besoins précis, pas parce qu'on l'aime bien. D'abord les **contraintes non négociables**, souvent issues du persona : sécurité, confidentialité, connexion limitée. Ensuite les critères pratiques : compétences, budget, délais.

### Les cycles

On découpe le MVP en cycles courts, d'une à deux semaines. Chaque cycle produit **quelque chose de montrable**. Un bon ordre : la fondation, puis les inconnues critiques, puis une fonctionnalité complète de bout en bout plutôt que toutes à moitié.
`.trim(),

  whenIsItDone:
    'Les inconnues critiques sont identifiées et placées dans les premiers cycles, la fondation est connue, les technologies ' +
    'sont choisies pour des raisons liées aux contraintes, et chaque cycle produit quelque chose de montrable.',

  pitfalls: [
    'Sur-planifier au lieu de commencer : la plupart des réponses qu\'on cherche, on ne les obtient qu\'en commençant.',
    'Choisir une technologie par goût plutôt que par contrainte.',
    'Estimer ce qu\'on ne comprend pas encore.',
    'Garder les tâches risquées pour la fin.',
    'Construire toutes les fonctionnalités à moitié au lieu d\'une seule de bout en bout.',
  ],

  output:
    'Document 4 — Planification : la fondation, les inconnues et comment les lever, l\'ordre de construction, les ' +
    'contraintes non négociables, les technologies et leurs raisons, et le découpage en cycles.',

  fields: [
    {
      id: 'fondation',
      label: 'La fondation',
      help: 'L\'élément dont tout le reste dépend, et que tout le reste devra respecter. Pourquoi est-ce lui ?',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'La base de données.',
          good:
            'La politique de données. Tout le reste devra la respecter : ce qu\'on collecte, ce qu\'on garde, ce qu\'on efface. ' +
            'Elle est rédigée avant la première ligne de code.',
          why:
            'La base de données est un outil. La fondation est ce qui contraint tout le reste, et dans ce projet c\'est la promesse faite au persona.',
        },
      ],
    },

    {
      id: 'inconnues',
      label: 'Les inconnues critiques',
      help:
        'Ce que tu ne sais pas encore construire, ou dont tu n\'es pas sûr. Pour chacune : pourquoi c\'est risqué, et comment ' +
        'tu vas la lever (un prototype, un test, une vérification).',
      type: 'table',
      required: true,
      columns: [
        { id: 'inconnue', label: 'Inconnue' },
        { id: 'risque', label: 'Pourquoi c\'est risqué' },
        { id: 'levee', label: 'Comment la lever' },
      ],
      examples: [
        {
          bad: 'La recherche. Risque : moyen. On verra.',
          good:
            'La recherche sans profilage. Risque : sans historique, les résultats pourraient être mauvais. ' +
            'Comment la lever : un prototype au premier cycle, testé sur une centaine de produits.',
          why: '« On verra » repousse le risque au milieu du projet. Un prototype le lève dès le début.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['on verra', 'à voir', 'plus tard'],
          message: 'Une inconnue critique se traite en premier, pas plus tard. Comment peux-tu la lever dès le début ?',
        },
      ],
    },

    {
      id: 'dependances',
      label: 'L\'ordre de construction',
      help: 'Ce qui doit exister avant quoi. Une étape par ligne, dans l\'ordre.',
      type: 'list',
      ordered: true,
      required: true,
      examples: [
        {
          bad: 'Tout en parallèle.',
          good: 'Politique de données, puis catalogue, puis recherche, puis panier, puis commande et paiement, puis effacement des données.',
          why: 'Construire en parallèle des éléments qui dépendent les uns des autres, c\'est s\'exposer à tout refaire.',
        },
      ],
    },

    {
      id: 'contraintesNonNegociables',
      label: 'Les contraintes non négociables',
      help:
        'Ce que toute technologie retenue doit respecter, souvent à cause du persona. Une technologie qui ne les respecte pas est éliminée d\'office.',
      type: 'list',
      required: true,
      examples: [
        {
          bad: 'Que ce soit rapide et moderne.',
          good: 'Aucun traceur ni outil de mesure d\'audience tiers : la promesse faite à Sacha l\'interdit.',
          why: '« Rapide et moderne » s\'applique à tout projet. Une vraie contrainte vient du problème de ce persona.',
        },
      ],
    },

    {
      id: 'technologies',
      label: 'Les technologies',
      help:
        'Pour chaque besoin technique, la technologie choisie et sa raison : une contrainte non négociable, une compétence déjà acquise, le budget…',
      type: 'table',
      required: true,
      columns: [
        { id: 'besoin', label: 'Besoin' },
        { id: 'technologie', label: 'Technologie' },
        { id: 'raison', label: 'Raison du choix' },
      ],
      examples: [
        {
          bad: 'Interface : React, parce que c\'est à la mode.',
          good: 'Interface : Vue, parce que je la maîtrise déjà et que le budget ne permet pas d\'apprendre en construisant.',
          why: 'Une technologie se justifie par une contrainte du projet, pas par la mode.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['à la mode', 'tendance', 'tout le monde l\'utilise', 'j\'aime bien'],
          message: 'C\'est une préférence, pas une raison. Quelle contrainte du projet ce choix respecte-t-il ?',
        },
      ],
    },

    {
      id: 'cycles',
      label: 'Les cycles',
      help:
        'Découpe le MVP en cycles courts, d\'une à deux semaines. Pour chacun : ce qu\'il contient, et ce qu\'on pourra montrer à la fin.',
      type: 'table',
      required: true,
      columns: [
        { id: 'cycle', label: 'Cycle' },
        { id: 'contenu', label: 'Contenu' },
        { id: 'resultat', label: 'Résultat montrable' },
      ],
      examples: [
        {
          bad: 'Cycle 1 : le backend. Cycle 2 : le frontend. Cycle 3 : les tests.',
          good:
            'Cycle 1 : politique de données, fondations, catalogue. Résultat : on parcourt le catalogue. ' +
            'Cycle 2 : recherche et panier. Résultat : on trouve un produit et on remplit son panier.',
          why:
            'Découper par couche technique ne produit rien de montrable avant la fin. Découper par fonctionnalité livre quelque chose à chaque cycle.',
        },
      ],
    },
  ],

  checklist: [
    { id: 'fondation', label: 'J\'ai identifié la fondation, et elle est construite en premier.' },
    { id: 'inconnues', label: 'J\'ai passé chaque fonctionnalité du MVP au crible des trois questions.' },
    { id: 'premiers', label: 'Les inconnues critiques sont traitées dans les premiers cycles.' },
    { id: 'estimation', label: 'Je n\'ai rien estimé que je ne comprends pas encore.' },
    { id: 'technos', label: 'Mes technologies sont choisies d\'abord selon les contraintes non négociables.' },
    { id: 'montrable', label: 'Chaque cycle produit quelque chose de montrable.' },
    { id: 'boutEnBout', label: 'Une fonctionnalité complète de bout en bout arrive tôt, pour être testée.' },
    {
      id: 'justeAssez',
      label: 'J\'ai planifié juste assez pour commencer.',
      hint: 'Si tu détailles déjà le cycle 5, tu sur-planifies : il changera de toute façon.',
    },
  ],
};
