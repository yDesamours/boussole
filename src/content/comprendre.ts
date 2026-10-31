import type { PhaseDefinition } from '../types/schema';

/**
 * Phase 1 — Comprendre
 *
 * Objectif : transformer une demande vague en problème clairement formulé.
 * Sortie   : Document 1 — Compréhension.
 */
export const comprendre: PhaseDefinition = {
  id: 'comprendre',
  order: 1,
  title: 'Comprendre',

  // ──────────────────────────────────────────────────────────────
  // Partie pédagogique
  // ──────────────────────────────────────────────────────────────

  objective:
    'Transformer une idée ou une demande vague en un problème clairement formulé : ' +
    'quel est le vrai problème, pour qui, et comment saura-t-on qu\'il est résolu.',

  explanation: `
Une demande arrive presque toujours sous la forme d'une solution : « je veux un site éducatif », « on veut un réseau social », « il nous faut une application ». C'est une **solution déguisée en besoin**. Quelqu'un a déjà sauté une étape : il a imaginé la réponse avant d'avoir formulé la question.

Le réflexe naturel d'un développeur est de passer directement à la technique : quel framework, quelle base de données. C'est exactement ce qu'il ne faut pas faire à ce stade.

Ton travail dans cette phase est de **reculer d'un cran**. Pas encore de solution, pas encore de technologie : seulement le problème.

### Trois questions

1. **Quel est le problème réel ?** Pas le symptôme, pas la demande de surface. Pour le trouver, on creuse avec les *5 Pourquoi* : on demande « pourquoi ? » jusqu'à atteindre la cause profonde.
2. **Pour qui exactement ?** Une personne précise — le *persona* — avec un besoin principal et une raison claire de ne pas être satisfaite par ce qui existe déjà.
3. **Comment saura-t-on que le problème est résolu ?** Une *métrique* observable, directement liée au besoin du persona.

### Pourquoi c'est important

Tout ce qui suit s'appuie sur cette phase. Le persona servira de juge pour chaque décision : quelle approche choisir, quelle fonctionnalité garder, quelle technologie retenir. La métrique servira à savoir, une fois le produit entre les mains de vrais utilisateurs, si tu as réussi.

Une phase Comprendre bâclée produit un projet qui résout un problème que personne n'a.
`.trim(),

  whenIsItDone:
    'Tu peux répondre sans hésiter aux trois questions — problème réel, persona, métrique — ' +
    'et ta réponse ne contient encore aucune fonctionnalité ni technologie. ' +
    'Si tu as encore envie de parler de solution, la phase n\'est pas terminée. ' +
    'L\'ordre des champs est celui du document final, pas forcément celui de ta réflexion : ' +
    'n\'hésite pas à revenir sur un champ quand un autre te fait découvrir quelque chose.',

  pitfalls: [
    'S\'arrêter à la demande de surface (« je veux une application ») au lieu de creuser le problème.',
    'Décrire un groupe (« les étudiants », « tout le monde ») au lieu d\'une personne précise.',
    'Donner plusieurs besoins principaux au persona : vouloir tout résoudre produit un produit moyen partout.',
    'Oublier d\'expliquer pourquoi les solutions existantes ne suffisent pas.',
    'Confondre « le produit est livré » et « le problème est résolu ».',
    'Choisir une métrique de démarrage (inscription, premier message) au lieu d\'une métrique de résolution.',
  ],

  output:
    'Document 1 — Compréhension : le problème réel, le persona principal (et les éventuels personas secondaires) ' +
    'et la métrique de résolution. C\'est le contrat de compréhension du projet : en cas de doute plus tard, on y revient.',

  // ──────────────────────────────────────────────────────────────
  // Partie opérationnelle
  // ──────────────────────────────────────────────────────────────

  fields: [
    {
      id: 'pourquoi',
      label: 'Les 5 Pourquoi',
      help:
        'La première question part de ton idée de départ (« pourquoi cette application ? »), mais sa réponse ' +
        'doit déjà décrire ce que vit une personne, pas l\'application. Pose ensuite chaque « pourquoi ? » sur la ' +
        'réponse précédente. Chaque réponse doit apprendre quelque chose qui n\'était pas dans la question. ' +
        'Arrête-toi quand tu atteins une cause qui ne parle plus de solution : trois à cinq niveaux suffisent généralement.',
      type: 'list',
      ordered: true,
      required: true,
      examples: [
        {
          bad:
            '1. Pourquoi un site éducatif ? → Parce que c\'est utile.\n' +
            '2. Pourquoi ? → Parce que les gens veulent apprendre.',
          good:
            '1. Pourquoi un site éducatif ? → Les jeunes de mon quartier n\'ont pas accès à une bonne éducation.\n' +
            '2. Pourquoi ? → Les écoles sont chères et de qualité inégale.\n' +
            '3. Pourquoi n\'ont-ils pas d\'alternative ? → Le contenu en ligne est en anglais et ne correspond pas à leur réalité.\n' +
            '4. Pourquoi personne ne l\'a fait ? → Le marché n\'a pas encore attiré d\'investissement sérieux.',
          why:
            'Le mauvais exemple tourne en rond avec des réponses générales. Le bon exemple descend à chaque niveau ' +
            'vers une cause plus précise, jusqu\'à faire apparaître un problème concret : du contenu inadapté au contexte.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['parce que c\'est utile', 'parce que c\'est cool', 'parce que ça manque', 'parce que les gens veulent'],
          message:
            'Cette réponse est trop générale pour faire avancer le raisonnement. Demande-toi : utile à qui, ' +
            'pour faire quoi, et qu\'est-ce qui se passe aujourd\'hui sans cette solution ?',
        },
      ],
    },

    {
      id: 'problemeReel',
      label: 'Le problème réel',
      help:
        'À partir de ta chaîne de « pourquoi », formule le problème en deux ou trois phrases. ' +
        'Décris une situation vécue par des personnes, pas un produit à construire.',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'Il manque une plateforme e-commerce qui respecte la vie privée.',
          good:
            'Des acheteurs en ligne réguliers sont de plus en plus mal à l\'aise avec l\'exploitation de leurs données ' +
            'par les grandes plateformes — publicités ciblées, sentiment d\'être surveillés — mais n\'ont pas d\'alternative fiable.',
          why:
            'Le mauvais exemple décrit une solution (« une plateforme »). Le bon décrit ce que vivent des personnes : ' +
            'un malaise concret et l\'absence d\'alternative.',
        },
        {
          bad: 'Twitter est devenu instable.',
          good:
            'Les personnes qui utilisaient Twitter pour des conversations publiques courtes n\'ont plus de plateforme ' +
            'de confiance, et veulent retrouver cette expérience avec les gens qu\'elles suivent déjà.',
          why:
            'Le mauvais exemple décrit une situation. Le bon nomme le besoin humain qui n\'est plus couvert.',
        },
      ],
      vaguenessRules: [
        {
          terms: [
            'application', 'appli', 'site web', 'logiciel', 'fonctionnalité',
            'base de données', 'api', 'react', 'vue.js', 'angular', 'node.js', 'python', 'backend', 'frontend',
          ],
          message:
            'Ton problème parle de solution ou de technologie. À ce stade, décris ce que vivent les personnes concernées, ' +
            'pas ce que tu vas construire.',
        },
        {
          terms: ['il manque', 'il n\'existe pas', 'il faudrait', 'on a besoin d\'un', 'on a besoin d\'une'],
          message:
            'Cette formulation part souvent de la solution absente plutôt que du problème vécu. ' +
            'Qu\'est-ce que les gens subissent concrètement aujourd\'hui ?',
        },
      ],
    },

    {
      id: 'personaDescription',
      label: 'Le persona principal',
      help:
        'Décris une seule personne précise : un prénom, sa situation, ses habitudes, ce qu\'elle essaie d\'accomplir. ' +
        'Pas un segment de marché, une personne que tu pourrais imaginer en face de toi.',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'Les jeunes qui veulent apprendre.',
          good:
            'Jean-Pierre, 19 ans. Il a terminé le secondaire mais n\'a pas les moyens d\'aller à l\'université. ' +
            'Il a un smartphone avec une connexion limitée. Il veut apprendre un savoir-faire utile pour trouver un emploi ' +
            'ou lancer une petite activité.',
          why:
            'Le mauvais exemple décrit un groupe : impossible de prendre une décision « pour les jeunes ». ' +
            'Avec Jean-Pierre, chaque choix futur peut être testé : est-ce que ça fonctionne avec sa connexion limitée ?',
        },
      ],
      vaguenessRules: [
        {
          terms: ['tout le monde', 'tous les', 'n\'importe qui', 'le grand public', 'tout public'],
          message:
            'Un produit qui cible tout le monde ne convainc personne. Même les produits de masse ont commencé par un persona précis : ' +
            'Facebook, les étudiants de Harvard ; Threads, les utilisateurs d\'Instagram.',
        },
        {
          terms: ['les utilisateurs', 'les gens', 'les clients', 'les étudiants', 'les jeunes', 'les entreprises'],
          message:
            'Tu décris un groupe. Le persona est une personne précise, avec un prénom et une situation concrète.',
        },
      ],
    },

    {
      id: 'besoinPrincipal',
      label: 'Son besoin principal',
      help:
        'Un seul besoin, en une phrase. Ton persona en a sûrement d\'autres, mais c\'est celui-ci qui tranchera ' +
        'toutes les décisions quand il y aura un conflit.',
      type: 'text',
      required: true,
      examples: [
        {
          bad: 'Protéger ses données, mieux connaître les produits et se faire rembourser facilement.',
          good: 'Acheter en ligne sans avoir le sentiment d\'être surveillée.',
          why:
            'Le mauvais exemple contient trois besoins : on ne peut pas tous les résoudre correctement dans une première version. ' +
            'Le bon exemple en retient un seul, celui qui ferait vraiment changer de solution.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['et', 'ainsi que', 'aussi', 'en plus'],
          wholeWord: true,
          message:
            'Ta phrase semble contenir plusieurs besoins. Lequel est le plus important — celui qui ferait vraiment ' +
            'changer ton persona de solution ?',
        },
      ],
    },

    {
      id: 'frictionExistant',
      label: 'Pourquoi les solutions existantes ne lui suffisent pas',
      help:
        'Qu\'utilise ton persona aujourd\'hui, et qu\'est-ce qui le frustre dans cette solution ? ' +
        'Si une solution existe déjà, c\'est cette frustration qui justifie l\'existence de ton projet.',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'Les solutions existantes ne sont pas terribles.',
          good:
            'Sacha utilise Amazon depuis des années. Elle est de plus en plus mal à l\'aise avec les publicités qui la suivent ' +
            'et les recommandations qui en savent trop sur elle. Elle continue faute d\'alternative de confiance.',
          why:
            'Le mauvais exemple ne nomme ni la solution actuelle ni la frustration. Le bon nomme les deux, ' +
            'et explique pourquoi le persona ne part pas encore : il n\'a nulle part où aller.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['pas terrible', 'pas top', 'nul', 'mauvais', 'pas bien', 'pas génial'],
          message:
            'Ce jugement est trop général. Qu\'est-ce qui, précisément, frustre ton persona dans la solution qu\'il utilise ?',
        },
        {
          terms: ['rien n\'existe', 'aucune solution', 'il n\'y a rien'],
          message:
            'Il existe presque toujours une solution de contournement — un tableur, un groupe de discussion, ne rien faire. ' +
            'Que fait ton persona aujourd\'hui à la place ?',
        },
      ],
    },

    {
      id: 'personasSecondaires',
      label: 'Personas secondaires',
      help:
        'D\'autres types d\'utilisateurs viendront peut-être plus tard. Note-les ici pour ne pas les oublier, ' +
        'mais ils ne guideront pas la première version. Une ligne par persona.',
      type: 'list',
      required: false,
      examples: [
        {
          bad: 'Tout le monde pourra l\'utiliser ensuite.',
          good: 'Chef de projet qui veut guider son équipe à travers la démarche (après le MVP).',
          why: 'Un persona secondaire reste une personne identifiable, simplement mise en attente.',
        },
      ],
    },

    {
      id: 'metrique',
      label: 'Comment saura-t-on que le problème est résolu ?',
      help:
        'Décris un comportement observable de ton persona qui prouve que son besoin principal est satisfait. ' +
        'Pas « le produit est en ligne » : ça, c\'est la livraison, pas la résolution.',
      type: 'longText',
      required: true,
      examples: [
        {
          bad: 'Sacha s\'est inscrite et a envoyé son premier message.',
          good: 'Sacha revient chaque jour, passe du temps sur la plateforme et n\'a plus besoin de retourner sur Twitter.',
          why:
            'Le mauvais exemple est une métrique de démarrage : elle prouve que Sacha a essayé, pas qu\'elle est satisfaite. ' +
            'Le bon exemple mesure la rétention, donc la résolution durable du problème.',
        },
        {
          bad: 'Sacha fait des achats régulièrement.',
          good: 'Sacha fait un premier achat, puis revient régulièrement consulter la plateforme, même entre deux achats.',
          why:
            'Le besoin de Sacha est la confiance. Revenir sans acheter montre qu\'elle n\'a pas peur d\'être surveillée : ' +
            'la métrique mesure le besoin, pas seulement la transaction.',
        },
      ],
      vaguenessRules: [
        {
          terms: [
            'est en ligne', 'mis en ligne', 'en production',
            'est livré', 'a été livré', 'est lancé', 'a été lancé', 'est déployé', 'a été déployé',
            'est terminé', 'est fini', 'est développé',
          ],
          message:
            'Tu décris la livraison du produit, pas la résolution du problème. Qu\'est-ce que ton persona fera différemment ' +
            'si son problème est vraiment résolu ?',
        },
        {
          terms: ['satisfait', 'content', 'heureux', 'aime', 'apprécie'],
          message:
            'La satisfaction ne s\'observe pas directement. Quel comportement de ton persona prouverait qu\'il est satisfait ?',
        },
        {
          terms: ['inscri', 'premier message', 'télécharg', 'crée un compte', 'créé un compte'],
          message:
            'C\'est une métrique de démarrage : elle montre que ton persona a essayé, pas que son problème est résolu. ' +
            'Pense à ce qu\'il fait les semaines suivantes.',
        },
      ],
    },
  ],

  checklist: [
    {
      id: 'creuse',
      label: 'J\'ai creusé au-delà de la demande de départ avec au moins trois « pourquoi ».',
    },
    {
      id: 'sansSolution',
      label: 'Mon problème est formulé sans mentionner de solution ni de technologie.',
      hint: 'Relis-le : si on y trouve « application », « site » ou un nom d\'outil, reformule.',
    },
    {
      id: 'personnePrecise',
      label: 'Mon persona est une personne précise, pas un groupe.',
    },
    {
      id: 'unBesoin',
      label: 'Mon persona a un seul besoin principal.',
    },
    {
      id: 'friction',
      label: 'J\'ai expliqué pourquoi ce que mon persona utilise aujourd\'hui ne lui suffit pas.',
    },
    {
      id: 'prioritaire',
      label: 'S\'il y a plusieurs personas, un seul est prioritaire pour la première version.',
    },
    {
      id: 'observable',
      label: 'Ma métrique décrit un comportement observable.',
    },
    {
      id: 'resolution',
      label: 'Ma métrique mesure la résolution du problème, pas la livraison du produit.',
      hint: 'Elle doit rester vraie dans plusieurs semaines, pas seulement le jour du lancement.',
    },
  ],
};
