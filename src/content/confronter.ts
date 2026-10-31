import type { PhaseDefinition } from '../types/schema';

/**
 * Phase 6 — Confronter
 *
 * Objectif : exposer le produit à de vrais utilisateurs, mesurer, apprendre.
 * Sortie   : Document 6 — Confrontation, point de départ de l'itération suivante.
 */
export const confronter: PhaseDefinition = {
  id: 'confronter',
  order: 6,
  title: 'Confronter',

  objective:
    'Exposer le produit à de vrais utilisateurs, mesurer si le problème du persona est résolu, et en tirer ce qui guidera la suite.',

  explanation: `
Jusqu'ici, toutes les validations étaient techniques. Cette phase pose enfin la seule question qui compte : **le problème du persona est-il résolu ?**

### Deux niveaux d'exposition

- **Les bêta-testeurs** : un groupe restreint qui correspond au persona. On obtient des retours précis avant de se montrer au grand public.
- **Le grand public** : quand le produit est stable et validé. Lancer trop tôt, c'est risquer une mauvaise première impression, difficile à effacer, et recevoir trop de retours à la fois pour savoir quoi prioriser.

### Mesurer et observer

On mesure avec **la métrique définie en phase Comprendre**, rappelée en haut de la page. Pas avec une métrique choisie après coup : on serait tenté de prendre celle qui confirme ce qu'on veut croire.

Et on observe plutôt qu'on ne demande. Donne une tâche à une personne réelle et regarde-la faire, sans intervenir. Là où elle bute, ton produit a un problème.

### Ce qu'on fait des retours

Un MVP qui ne satisfait pas le persona n'est pas un échec : c'est de l'information, obtenue vite et à moindre coût.

- **Le persona n'est pas satisfait** : la prochaine itération repense la stratégie pour lui, avec les données en main.
- **Le persona est satisfait** : on peut envisager d'élargir, avec un nouveau besoin ou un nouveau persona.

Ce que tu écris dans « Ce que tu as appris » deviendra le point de départ de l'itération suivante.
`.trim(),

  whenIsItDone:
    'Le produit a été utilisé par des personnes qui correspondent au persona, la métrique de la phase Comprendre a été ' +
    'mesurée honnêtement, et tu sais ce que tu as appris et ce que tu fais ensuite.',

  pitfalls: [
    'Choisir les métriques après le lancement.',
    'Interpréter les données pour confirmer ce qu\'on veut croire.',
    'Demander aux gens s\'ils aiment le produit au lieu d\'observer ce qu\'ils font.',
    'Tester avec des proches bienveillants qui ne ressemblent pas au persona.',
    'Lancer au grand public avant d\'avoir appris avec un petit groupe.',
  ],

  output:
    'Document 6 — Confrontation : qui a testé, les mesures, les observations, si la métrique est atteinte, ce qu\'on a ' +
    'appris et la décision pour la suite. C\'est le point de départ de l\'itération suivante.',

  fields: [
    {
      id: 'testeurs',
      label: 'Qui a testé',
      help:
        'Combien de personnes, pendant combien de temps, et en quoi elles correspondent au persona. Bêta-testeurs ou grand public ?',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'Quelques amis.',
          good: 'Douze personnes qui commandent en ligne au moins une fois par mois et se méfient des grandes plateformes, pendant six semaines.',
          why:
            'Le nombre, la durée et la ressemblance avec le persona disent quel poids donner aux résultats.',
        },
      ],
    },

    {
      id: 'mesures',
      label: 'Les mesures',
      help:
        'Mesure la métrique définie en phase Comprendre, rappelée en haut de la page. Pour chaque élément mesuré, le résultat chiffré ou observé.',
      type: 'table',
      required: true,
      columns: [
        { id: 'mesure', label: 'Ce qu\'on mesure' },
        { id: 'resultat', label: 'Résultat' },
      ],
      examples: [
        {
          bad: 'Satisfaction : bonne.',
          good: 'Premier achat : 9 personnes sur 12. Retour régulier entre deux achats : 3 personnes sur 9.',
          why: '« Bonne » ne se compare à rien. Un résultat chiffré sur la métrique prévue se compare à l\'objectif.',
        },
      ],
    },

    {
      id: 'observations',
      label: 'Ce que tu as observé',
      help:
        'Ce que les testeurs ont fait, où ils ont buté, ce qu\'ils n\'ont pas utilisé, ce qu\'ils ont dit. Une observation par ligne. ' +
        'Les actes comptent plus que les opinions.',
      type: 'list',
      required: true,
      examples: [
        {
          bad: 'Les retours sont globalement positifs.',
          good: 'La politique de données est très peu lue. Une question revient : « Comment je sais que c\'est vrai ? »',
          why: 'Une impression générale ne dit pas quoi changer. Une observation précise, si.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['globalement positif', 'retours positifs', 'ils ont aimé', 'ont adoré', 'ont trouvé ça bien', 'tout le monde a aimé'],
          message: 'C\'est une impression. Qu\'ont-ils fait concrètement, et où ont-ils buté ?',
        },
      ],
    },

    {
      id: 'metriqueAtteinte',
      label: 'La métrique est-elle atteinte ?',
      help: 'Oui, non ou en partie, et en une phrase pourquoi. Sois honnête : c\'est la réponse la plus utile de tout le cycle.',
      type: 'text',
      required: true,
      examples: [
        {
          bad: 'Presque, on est sur la bonne voie.',
          good: 'Non : seules 3 personnes sur 9 reviennent consulter la boutique entre deux achats.',
          why: '« Sur la bonne voie » évite la question. Une réponse nette, appuyée sur la mesure, permet de décider.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['bonne voie', 'presque', 'ça progresse', 'encourageant'],
          message: 'Cette formulation évite de trancher. La métrique est-elle atteinte : oui, non, ou en partie ?',
        },
      ],
    },

    {
      id: 'apprentissages',
      label: 'Ce que tu as appris',
      help:
        'Ce que cette itération t\'a appris sur le problème, sur le persona et sur ton produit. Ce texte sera proposé comme ' +
        'point de départ de l\'itération suivante.',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'Il faut améliorer le produit.',
          good:
            'Le problème est réel : on vient pour la promesse. Mais une promesse écrite ne suffit pas, il faut pouvoir la ' +
            'vérifier. Et le catalogue trop restreint ramène Sacha vers Amazon.',
          why:
            '« Améliorer le produit » vaut pour tous les produits. Le bon exemple dit ce qui est confirmé, ce qui ne l\'est pas, et pourquoi.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['améliorer le produit', 'tout va bien', 'ça marche bien', 'continuer comme ça'],
          message: 'C\'est trop général pour guider la suite. Qu\'as-tu appris de précis sur le problème ou sur le persona ?',
        },
      ],
    },

    {
      id: 'suite',
      label: 'La suite',
      help:
        'Le persona est-il satisfait ? Si non, que faut-il repenser pour lui ? Si oui, quel nouveau besoin ou quel nouveau ' +
        'persona envisager ? Ce choix oriente l\'itération suivante.',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'On ajoute des fonctionnalités.',
          good:
            'Sacha n\'est pas encore satisfaite. La prochaine itération reste centrée sur elle : rendre la promesse vérifiable. ' +
            'L\'élargissement du catalogue sera traité comme une question de couche viable.',
          why:
            'Ajouter des fonctionnalités sans savoir pour quel besoin, c\'est recommencer à l\'aveugle. Le bon exemple dit pour qui, et pourquoi.',
        },
      ],
    },
  ],

  checklist: [
    { id: 'persona', label: 'Le produit a été utilisé par des personnes qui correspondent au persona.' },
    { id: 'metrique', label: 'J\'ai mesuré la métrique définie en phase Comprendre, pas une autre choisie après coup.' },
    { id: 'observe', label: 'J\'ai observé ce que les testeurs font, pas seulement ce qu\'ils disent.' },
    { id: 'bute', label: 'J\'ai noté où ils ont buté et ce qu\'ils n\'ont pas utilisé.' },
    { id: 'honnete', label: 'J\'ai dit honnêtement si la métrique est atteinte.' },
    { id: 'appris', label: 'J\'ai tiré des apprentissages précis sur le problème et le persona.' },
    {
      id: 'suite',
      label: 'J\'ai décidé de la suite : repenser pour le même persona, ou élargir.',
      hint: 'On n\'élargit que si le problème du persona principal est résolu.',
    },
  ],
};
