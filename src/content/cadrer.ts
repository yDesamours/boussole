import type { PhaseDefinition } from '../types/schema';

/**
 * Phase 3 — Cadrer
 *
 * Objectif : définir le MVP, ce qu'on construit et ce qu'on ne construit pas.
 * Sortie   : Document 3 — Cadrage.
 */
export const cadrer: PhaseDefinition = {
  id: 'cadrer',
  order: 3,
  title: 'Cadrer',

  objective:
    'Définir le MVP : la version minimale qui permet de vérifier que la direction retenue résout vraiment le problème du persona.',

  explanation: `
Tu as une direction. Il serait tentant de tout détailler et de tout construire. C'est l'inverse qu'il faut faire : identifier **l'indispensable**, et seulement lui.

Un MVP (produit minimum viable) n'est pas un prototype. Un prototype est une maquette, souvent non fonctionnelle. Un MVP est un vrai produit, minimal, qu'on peut confier à de vrais utilisateurs.

### Les deux couches du MVP

- **La couche viable** : ce qui fait que c'est un produit qui fonctionne. Sans elle, il n'y a pas de produit.
- **La couche différenciante** : ce qui résout directement le besoin principal du persona. Sans elle, il n'y a aucune raison de choisir ton produit plutôt qu'un autre.

Pour trouver la couche différenciante, pars des **causes** du problème, pas d'une liste de fonctionnalités. Chaque cause appelle une réponse.

### Le critère

Pour chaque fonctionnalité envisagée, une seule question : *sans elle, le problème principal du persona reste-t-il non résolu ?* Si la réponse est non, elle n'a pas sa place dans le MVP.

### Ce qu'on ne construit pas

Documenter le hors-périmètre est aussi important que le reste : sinon, ces fonctionnalités reviennent en douce. Rien n'est jeté pour autant, c'est mis de côté pour une itération future. Le périmètre peut changer en cours de route, à condition de le faire consciemment et de le noter ici.
`.trim(),

  whenIsItDone:
    'Chaque fonctionnalité du MVP appartient à la couche viable ou à la couche différenciante, chaque élément différenciant ' +
    'répond à une cause du problème, le hors-périmètre est écrit, et le MVP tient en une phrase.',

  pitfalls: [
    'Construire un produit complet techniquement mais sans couche différenciante : il ressemble à tous les autres.',
    'Tout juger indispensable parce qu\'on est attaché à ses idées.',
    'Laisser le hors-périmètre implicite.',
    'Faire entrer par la petite porte un besoin ou un persona qui n\'appartient pas à cette version.',
    'Confondre MVP et prototype : un MVP doit pouvoir être utilisé par de vraies personnes.',
  ],

  output:
    'Document 3 — Cadrage : le MVP en une phrase, sa couche viable, sa couche différenciante reliée aux causes du problème, ' +
    'le hors-périmètre, et les changements de périmètre décidés en cours de route.',

  fields: [
    {
      id: 'mvpEnUnePhrase',
      label: 'Le MVP en une phrase',
      help: 'Si tu ne peux pas le décrire en une phrase, il est probablement trop gros.',
      type: 'text',
      required: true,
      examples: [
        {
          bad: 'Une boutique complète avec toutes les fonctionnalités d\'Amazon, mais respectueuse de la vie privée.',
          good: 'Une boutique au catalogue restreint où l\'on achète sans compte, sans traceur, et où l\'on peut tout effacer.',
          why: 'Le mauvais exemple promet tout. Le bon dit ce qui sera livré, et ce qui le distingue.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['toutes les fonctionnalités', 'tout ce qu', 'complet', 'complète'],
          message: 'Un MVP n\'est pas complet par définition. Qu\'est-ce qui est vraiment indispensable ?',
        },
      ],
    },

    {
      id: 'causes',
      label: 'Les causes du problème à traiter',
      help:
        'Avant de lister des fonctionnalités, liste ce qui, dans la situation actuelle, cause le problème du persona. ' +
        'Une cause par ligne. La couche différenciante y répondra.',
      type: 'list',
      required: true,
      examples: [
        {
          bad: 'Amazon n\'est pas bien.',
          good: 'Les publicités ciblées suivent Sacha d\'un site à l\'autre.',
          why: 'Une cause précise appelle une réponse précise. Un jugement général n\'appelle rien.',
        },
      ],
    },

    {
      id: 'coucheViable',
      label: 'La couche viable',
      help: 'Les fonctionnalités sans lesquelles le produit ne fonctionne pas du tout. Une par ligne.',
      type: 'list',
      required: true,
      examples: [
        {
          bad: 'Recherche, panier, commande, livraison, comparateur de prix, liste d\'envies, avis clients, programme de fidélité.',
          good: 'Catalogue et recherche. Panier. Commande et paiement. Livraison et suivi.',
          why:
            'Le comparateur, la liste d\'envies ou la fidélité ne sont pas nécessaires pour qu\'un achat ait lieu. Ils attendent.',
        },
      ],
    },

    {
      id: 'coucheDifferenciante',
      label: 'La couche différenciante',
      help:
        'Ce qui résout directement le besoin principal du persona. Pour chaque élément, indique à quelle cause du problème il répond.',
      type: 'table',
      required: true,
      columns: [
        { id: 'element', label: 'Élément' },
        { id: 'cause', label: 'Cause à laquelle il répond' },
      ],
      examples: [
        {
          bad: 'Un design moderne.',
          good: 'Effacer son compte et ses données en une seule action. Répond à : Sacha ignore ce que deviennent ses données.',
          why: 'Un design moderne ne répond à aucune cause du problème de Sacha. L\'effacement, si.',
        },
      ],
    },

    {
      id: 'horsPerimetre',
      label: 'Hors périmètre',
      help:
        'Ce qu\'on ne construit pas dans cette version, et pourquoi pas maintenant. Rien n\'est jeté : c\'est mis de côté.',
      type: 'table',
      required: true,
      columns: [
        { id: 'element', label: 'Ce qu\'on ne construit pas' },
        { id: 'raison', label: 'Pourquoi pas maintenant' },
      ],
      examples: [
        {
          bad: 'Application mobile : plus tard.',
          good: 'Recommandations personnalisées : elles exigeraient de profiler Sacha, ce qui contredit son besoin.',
          why: 'La raison rend la décision défendable, et dit quand elle pourrait changer.',
        },
      ],
    },

    {
      id: 'changementsPerimetre',
      label: 'Changements de périmètre',
      help:
        'Le périmètre peut évoluer en cours de route. Note ici chaque ajout ou retrait, et sa raison. Si les ajouts se ' +
        'multiplient, demande-toi si le persona en a vraiment besoin.',
      type: 'table',
      required: false,
      columns: [
        { id: 'changement', label: 'Changement' },
        { id: 'raison', label: 'Raison' },
      ],
      examples: [
        {
          bad: 'Ajout de l\'export Word.',
          good: 'Ajout de l\'export Word. Raison : le persona partage ses documents avec des personnes qui n\'utilisent que Word.',
          why: 'Un changement noté avec sa raison est une décision consciente. Sans raison, c\'est une dérive.',
        },
      ],
    },
  ],

  checklist: [
    { id: 'unePhrase', label: 'Mon MVP tient en une phrase.' },
    { id: 'causes', label: 'J\'ai listé les causes du problème avant de lister des fonctionnalités.' },
    {
      id: 'critere',
      label: 'Pour chaque fonctionnalité, j\'ai posé la question : sans elle, le problème reste-t-il non résolu ?',
    },
    { id: 'viable', label: 'La couche viable ne contient que ce qui est nécessaire au fonctionnement du produit.' },
    { id: 'differenciante', label: 'Chaque élément différenciant répond à une cause du problème du persona.' },
    {
      id: 'distingue',
      label: 'Sans la couche différenciante, mon persona n\'aurait aucune raison de changer : elle est bien là.',
    },
    { id: 'horsPerimetre', label: 'Le hors-périmètre est écrit, avec ses raisons.' },
    { id: 'utilisable', label: 'Mon MVP est un vrai produit qu\'on peut confier à des utilisateurs, pas une maquette.' },
  ],
};
