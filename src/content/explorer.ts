import type { PhaseDefinition } from '../types/schema';

/**
 * Phase 2 — Explorer
 *
 * Objectif : trouver la meilleure approche possible, pas justifier celle qu'on a déjà en tête.
 * Sortie   : Document 2 — Exploration.
 */
export const explorer: PhaseDefinition = {
  id: 'explorer',
  order: 2,
  title: 'Explorer',

  objective:
    'Trouver la meilleure approche possible pour résoudre le problème du persona, pas formaliser celle qu\'on a déjà en tête.',

  explanation: `
À ce stade, tu sais quel problème résoudre et pour qui. Tu ne sais pas encore **comment**. Et c'est voulu : si tu arrives avec une solution déjà choisie, tu chercheras à la justifier au lieu d'explorer.

### Diverger, puis converger

1. **Diverger** : génère toutes les approches possibles, sans filtre. Y compris la plus simple : peut-on résoudre le problème sans code, ou presque ?
2. **Confronter au persona** : pour chaque approche, demande-toi si elle sert son besoin principal. Le rappel en haut de la page est là pour ça.
3. **Converger** : au fil de cette confrontation, des éléments de clarté apparaissent, et une direction se dessine.

### Ce qui peut arriver

Parfois, l'exploration révèle que tu comparais les mauvaises choses. On peut comparer quatre modèles commerciaux et découvrir qu'aucun ne touche le vrai problème, et que la différence se joue ailleurs. Ce n'est pas un échec de l'exploration : c'est exactement son but.

### Deux outils

- **L'analyse de l'existant** : qui résout ce problème aujourd'hui, comment, et que lui reprochent ses utilisateurs ? Les avis négatifs sont une mine d'or.
- **Les contraintes** : temps, argent, compétences, dépendances externes. Elles t'évitent de tomber amoureux d'une approche irréalisable.
`.trim(),

  whenIsItDone:
    'Trois conditions réunies en même temps : l\'approche retenue satisfait le besoin principal du persona, tu as comparé ' +
    'plusieurs options au lieu de valider la première, et tu la juges réalisable avec tes moyens, ton temps et tes compétences.',

  pitfalls: [
    'Arriver avec une solution préconçue et chercher à la justifier.',
    'S\'arrêter à la première idée qui semble tenir.',
    'Comparer des approches sur des critères qui ne touchent pas le besoin du persona.',
    'Oublier de noter pourquoi les autres options ont été écartées : quelqu\'un relancera le débat plus tard.',
    'Ignorer les contraintes, puis découvrir en construisant que l\'approche est irréalisable.',
  ],

  output:
    'Document 2 — Exploration : ce qui existe, les contraintes, les approches comparées, les décisions avec leurs raisons, ' +
    'et la direction retenue.',

  fields: [
    {
      id: 'existant',
      label: 'Ce qui existe déjà',
      help:
        'Qui résout ce problème aujourd\'hui, et comment ? Que reprochent ses utilisateurs à ces solutions ? ' +
        'Où est le vide que personne ne comble ?',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'Il y a Amazon et quelques autres, mais ils ne sont pas terribles.',
          good:
            'Amazon domine, avec un catalogue immense et une livraison rapide. Ses utilisateurs lui reprochent les ' +
            'publicités qui les suivent, les prix qui varient et l\'opacité sur l\'usage de leurs données. Les petites ' +
            'boutiques indépendantes ne disent rien de leurs pratiques. Aucune ne fait de la vie privée sa promesse principale.',
          why:
            'Le mauvais exemple ne nomme ni les reproches ni le vide. Le bon dit ce que les solutions font bien, ce que leurs ' +
            'utilisateurs leur reprochent, et où se trouve l\'espace libre.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['pas terrible', 'pas top', 'nul', 'mauvais', 'pas génial'],
          message:
            'Ce jugement est trop général. Qu\'est-ce que leurs utilisateurs leur reprochent précisément ?',
        },
        {
          terms: ['rien n\'existe', 'aucune solution', 'il n\'y a rien', 'aucun concurrent'],
          message:
            'Il existe presque toujours une solution de contournement : un tableur, un groupe de discussion, une habitude. ' +
            'Que fait ton persona aujourd\'hui à la place ?',
        },
      ],
    },

    {
      id: 'contraintes',
      label: 'Les contraintes',
      help:
        'Ce qui limite les approches possibles, en quatre familles : temps, argent, compétences, dépendances externes. ' +
        'Pour chacune, note ce qu\'elle implique.',
      type: 'table',
      required: true,
      columns: [
        { id: 'contrainte', label: 'Contrainte' },
        { id: 'implication', label: 'Ce qu\'elle implique' },
      ],
      examples: [
        {
          bad: 'Budget : limité.',
          good:
            'Budget : quelques centaines d\'euros au départ. Implication : pas de stock important, pas d\'hébergement coûteux.',
          why: 'Une contrainte n\'est utile que si l\'on sait ce qu\'elle exclut.',
        },
      ],
    },

    {
      id: 'approches',
      label: 'Les approches possibles',
      help:
        'Génère toutes les approches, sans filtre, y compris la plus simple ou une approche sans code. ' +
        'Pour chacune : comment elle sert le besoin principal du persona, et ses limites.',
      type: 'table',
      required: true,
      columns: [
        { id: 'approche', label: 'Approche' },
        { id: 'besoin', label: 'Comment elle sert le besoin du persona' },
        { id: 'limites', label: 'Limites et risques' },
      ],
      examples: [
        {
          bad: 'Une seule ligne : « Faire une boutique en ligne ».',
          good:
            'Quatre lignes : stock propre, plateforme de vendeurs tiers, modèle hybride, dropshipping. Pour chacune, ' +
            'son effet sur les données de Sacha et ses limites (budget, contrôle, données transmises à des tiers).',
          why:
            'Une seule approche, c\'est valider sa première idée. Plusieurs approches comparées sur le besoin du persona, ' +
            'c\'est explorer.',
        },
      ],
    },

    {
      id: 'revelations',
      label: 'Ce que l\'exploration a révélé',
      help:
        'En confrontant les approches au persona, qu\'as-tu découvert ? Un axe de différenciation inattendu, une approche ' +
        'que tu n\'avais pas envisagée, une contrainte qui change tout ?',
      type: 'longText',
      required: false,
      examples: [
        {
          bad: 'Rien de particulier.',
          good:
            'Quel que soit le modèle commercial, la boutique reste le point de contact qui collecte les données de Sacha. ' +
            'Le modèle ne résout donc pas son problème : la différence se joue sur la façon dont la boutique traite les données.',
          why:
            'Le bon exemple montre une découverte qui réoriente toute l\'exploration. C\'est souvent le moment le plus précieux de la phase.',
        },
      ],
    },

    {
      id: 'decisions',
      label: 'Décisions',
      help:
        'Pour chaque approche : retenue ou écartée, et pourquoi. Les raisons des rejets sont aussi importantes que le choix : ' +
        'elles évitent de relancer un débat déjà tranché.',
      type: 'table',
      required: true,
      columns: [
        { id: 'approche', label: 'Approche' },
        { id: 'decision', label: 'Décision' },
        { id: 'raison', label: 'Raison' },
      ],
      examples: [
        {
          bad: 'Dropshipping : écarté.',
          good:
            'Dropshipping : écarté. Il transmet le nom et l\'adresse de Sacha à des fournisseurs qu\'elle ne connaît pas, ' +
            'ce qui contredit la promesse faite sur ses données.',
          why: 'Sans raison, une décision se rediscute. Avec une raison liée au persona, elle tient.',
        },
      ],
    },

    {
      id: 'directionRetenue',
      label: 'La direction retenue',
      help:
        'Décris l\'approche retenue en quelques phrases. Explique pourquoi elle satisfait le besoin principal du persona, ' +
        'et pourquoi elle est réalisable avec tes moyens.',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'On part sur une boutique en ligne, ça devrait marcher.',
          good:
            'Une boutique au catalogue restreint, en stock propre, qui se distingue par son traitement des données : elle ' +
            'ne collecte que ce qu\'exige la commande, ne revend rien et permet de tout effacer. Un seul acteur manipule ' +
            'les données de Sacha, la promesse est donc tenable, et le catalogue restreint limite le risque financier.',
          why:
            'Le bon exemple relie la direction au besoin du persona et à la faisabilité. « Ça devrait marcher » n\'est pas une raison.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['ça devrait marcher', 'ça devrait aller', 'on verra', 'normalement ça'],
          message:
            'C\'est un pari, pas une raison. Pourquoi cette approche satisfait-elle le besoin principal de ton persona ?',
        },
      ],
    },

    {
      id: 'questionsOuvertes',
      label: 'Questions à traiter plus tard',
      help:
        'Ce qui reste ouvert sans bloquer la suite : modèle économique, persona secondaire, définition à préciser… ' +
        'Une question par ligne. Les noter évite de les oublier, et de les traiter trop tôt.',
      type: 'list',
      required: false,
      examples: [
        {
          bad: 'Plein de choses à voir.',
          good: 'Faudra-t-il accueillir des vendeurs tiers quand le catalogue devra s\'élargir ?',
          why: 'Une question précise peut être traitée le moment venu. « Plein de choses » ne le sera jamais.',
        },
      ],
    },
  ],

  checklist: [
    { id: 'plusieurs', label: 'J\'ai généré plusieurs approches avant d\'en évaluer une seule.' },
    { id: 'simple', label: 'J\'ai envisagé au moins une approche très simple, ou sans code.' },
    { id: 'existant', label: 'J\'ai regardé ce qui existe et ce que ses utilisateurs lui reprochent.' },
    { id: 'confrontees', label: 'Chaque approche a été confrontée au besoin principal du persona.' },
    { id: 'raisons', label: 'J\'ai noté pourquoi chaque approche écartée l\'a été.' },
    { id: 'satisfait', label: 'L\'approche retenue satisfait le besoin principal du persona.' },
    { id: 'realisable', label: 'Elle est réalisable avec mes moyens, mon temps et mes compétences.' },
    {
      id: 'honnete',
      label: 'Je ne suis pas en train de justifier l\'idée que j\'avais au départ.',
      hint: 'Si l\'approche retenue est exactement ton idée de départ, demande-toi si tu as vraiment exploré.',
    },
  ],
};
