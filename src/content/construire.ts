import type { PhaseDefinition } from '../types/schema';

/**
 * Phase 5 — Construire
 *
 * Objectif : produire le MVP cycle par cycle, sans se perdre.
 * Sortie   : Document 5 — Construction.
 */
export const construire: PhaseDefinition = {
  id: 'construire',
  order: 5,
  title: 'Construire',

  objective: 'Produire le MVP en suivant les cycles prévus, en gardant une trace de ce qui est livré, appris et différé.',

  explanation: `
Cette phase est celle du code, mais elle ne se résume pas au code. Elle consiste à avancer par petits morceaux livrables, à montrer tôt, et à garder une trace honnête de ce qui se passe.

### À l'intérieur d'un cycle

1. Développer ce qui est prévu pour le cycle.
2. Tester : ce qui a été construit fonctionne-t-il correctement ?
3. Valider : cela correspond-il à ce qui était attendu ?
4. Si un problème apparaît, planifier un cycle correctif.

Qui valide ? Le client si tu travailles pour un client, l'équipe si tu travailles en équipe, toi-même si tu travailles seul. Mais dans tous ces cas, **l'utilisateur final est absent** de la validation : personne ne vérifie encore que son problème est résolu. C'est le rôle de la phase suivante.

### Montrer tôt

On n'attend pas que tout le MVP soit prêt. Dès qu'un cycle produit quelque chose d'utilisable, on le montre à quelques **bêta-testeurs** : un petit groupe de personnes qui ressemblent au persona et qui savent que le produit est en construction. Ce n'est pas le grand public.

### La dette technique

Prendre un raccourci pour aller plus vite est acceptable, à condition que ce soit une décision **consciente et notée** : ce que tu as fait, pourquoi, et quand il faudra le corriger. Une dette non notée devient une bombe à retardement.

### Cycles et méthode agile

Travailler par cycles n'exige pas d'adopter une méthode agile, qui formalise ces cycles pour organiser une équipe. Un développeur seul qui avance par petites itérations est simplement pragmatique. La vraie question : est-ce que je construis par petits morceaux livrables, plutôt que tout d'un coup ?
`.trim(),

  whenIsItDone:
    'Le MVP prévu au cadrage est construit, testé et validé cycle par cycle, il a été montré à quelques personnes qui ' +
    'ressemblent au persona, chaque raccourci est noté, et le produit est prêt à être confronté à de vrais utilisateurs.',

  pitfalls: [
    'Tout construire avant de montrer quoi que ce soit.',
    'Prendre des raccourcis sans les noter.',
    'Confondre la validation technique avec la satisfaction de l\'utilisateur.',
    'Laisser le périmètre grossir en silence, sans mettre à jour le cadrage.',
  ],

  output:
    'Document 5 — Construction : le journal des cycles, les premiers retours d\'utilisateurs, la dette technique notée, ' +
    'et les écarts par rapport au plan.',

  fields: [
    {
      id: 'journal',
      label: 'Journal des cycles',
      help:
        'Pour chaque cycle terminé : ce qui a été livré, comment c\'est testé et validé, et ce que tu as appris en chemin.',
      type: 'table',
      required: true,
      columns: [
        { id: 'cycle', label: 'Cycle' },
        { id: 'livre', label: 'Ce qui a été livré' },
        { id: 'validation', label: 'Tests et validation' },
        { id: 'appris', label: 'Ce qu\'on a appris' },
      ],
      examples: [
        {
          bad: 'Cycle 2 : fait.',
          good:
            'Cycle 2 : recherche et panier livrés. Validé sur une centaine de produits. Appris : la recherche ne trouve ' +
            'rien dès qu\'on fait une faute de frappe.',
          why: '« Fait » ne dit ni ce qui marche, ni ce qui a été découvert. Le journal sert de mémoire au projet.',
        },
      ],
    },

    {
      id: 'premiersRetours',
      label: 'Premiers retours d\'utilisateurs',
      help:
        'À qui as-tu montré le produit en cours de construction ? Combien de personnes, qui ressemblent-elles au persona, ' +
        'et qu\'ont-elles fait ou dit ?',
      type: 'longText',
      required: false,
      examples: [
        {
          bad: 'Mes amis ont trouvé ça bien.',
          good:
            'Trois personnes qui commandent régulièrement en ligne ont testé la recherche et le panier. Le panier est clair. ' +
            'Deux ont abandonné la recherche après une faute de frappe.',
          why:
            'Des amis bienveillants ne ressemblent pas forcément au persona, et « trouvé ça bien » n\'est pas une observation. ' +
            'Ce qu\'ils ont fait, et où ils ont buté, l\'est.',
        },
      ],
      vaguenessRules: [
        {
          terms: ['ont trouvé ça bien', 'ont aimé', 'ont adoré', 'ont bien aimé', 'retours positifs', 'globalement positif'],
          message:
            'Une impression n\'est pas une observation. Qu\'ont-ils fait concrètement, et où ont-ils buté ?',
        },
      ],
    },

    {
      id: 'dette',
      label: 'Dette technique',
      help: 'Chaque raccourci pris volontairement : ce que tu as fait, pourquoi, et quand il faudra le corriger.',
      type: 'table',
      required: false,
      columns: [
        { id: 'raccourci', label: 'Raccourci' },
        { id: 'pourquoi', label: 'Pourquoi' },
        { id: 'echeance', label: 'À corriger quand' },
      ],
      examples: [
        {
          bad: 'Code un peu sale dans la recherche.',
          good:
            'Recherche par correspondance exacte, sans tolérance aux fautes. Pourquoi : livrer le panier à temps. ' +
            'À corriger : avant l\'ouverture au grand public.',
          why: 'Une dette sans raison ni échéance ne sera jamais remboursée. Notée, elle devient une décision.',
        },
      ],
    },

    {
      id: 'ecarts',
      label: 'Écarts par rapport au plan',
      help:
        'Ce qui a changé par rapport au cadrage et à la planification : fonctionnalité ajoutée, retirée ou repoussée. ' +
        'Pense à reporter les changements de périmètre dans la phase Cadrer.',
      type: 'list',
      required: false,
      examples: [
        {
          bad: 'Quelques changements.',
          good: 'Le suivi de livraison est repoussé : le transporteur ne fournit pas d\'information de suivi exploitable.',
          why: 'Un écart précis et justifié se comprend dans six mois. « Quelques changements », non.',
        },
      ],
    },
  ],

  checklist: [
    { id: 'montrable', label: 'Chaque cycle a produit quelque chose de montrable.' },
    { id: 'valide', label: 'Chaque cycle a été testé et validé avant de passer au suivant.' },
    {
      id: 'tot',
      label: 'J\'ai montré le produit à quelques personnes qui ressemblent au persona avant la fin.',
    },
    { id: 'dette', label: 'Chaque raccourci est noté, avec sa raison et son échéance.' },
    { id: 'ecarts', label: 'Les changements de périmètre sont reportés dans le cadrage.' },
    {
      id: 'pret',
      label: 'Le MVP prévu est construit et prêt à être confronté à de vrais utilisateurs.',
      hint: 'Prêt ne veut pas dire parfait : la phase Confronter est faite pour découvrir ce qui manque.',
    },
  ],
};
