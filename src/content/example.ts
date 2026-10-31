import type { ExampleProject } from '../types/guide';

/**
 * Projet exemple : un concurrent d'Amazon, fictif, parcouru à travers les six phases
 * puis au début d'une deuxième itération.
 *
 * Les réponses qui portent un fieldId correspondent aux champs de la phase : les tests
 * vérifient qu'elles ne déclenchent pas les alertes de flou.
 */
export const example: ExampleProject = {
  name: "Discrète",
  pitch: "Une boutique en ligne pour les acheteurs qui ne veulent plus se sentir surveillés.",
  disclaimer:
    "Projet fictif, né d'un exercice : concurrencer Amazon. Il illustre le framework de bout en bout, avec les " +
    "hésitations et les corrections d'un vrai projet. Les résultats de la phase Confronter sont inventés.",

  iterations: [
    // ════════════════════════════════════════════════════════════
    {
      number: 1,
      startingPointLabel: "L'idée de départ",
      startingPoint: "Un site de commerce en ligne pour concurrencer Amazon.",
      phases: [
        // ── Comprendre ──────────────────────────────────────────
        {
          phaseId: "comprendre",
          blocks: [
            {
              kind: "answer",
              fieldId: "pourquoi",
              label: "Les 5 Pourquoi",
              ordered: true,
              items: [
                "Pourquoi une nouvelle boutique en ligne, alors qu'Amazon existe ? → Certains acheteurs réguliers sont de plus en plus mal à l'aise sur Amazon : des publicités les suivent d'un site à l'autre, des recommandations en savent trop sur eux.",
                "Pourquoi ce malaise ? → Ils ont le sentiment que chacun de leurs clics est enregistré et exploité, sans savoir par qui ni comment.",
                "Pourquoi continuent-ils à y acheter ? → Ils ne connaissent pas d'autre boutique aussi pratique à laquelle ils feraient davantage confiance.",
              ],
            },
            {
              kind: "remark",
              text:
                "La première question part de l'idée, mais sa réponse parle déjà d'acheteurs et de ce qu'ils vivent. La chaîne " +
                "s'arrête quand elle touche une contrainte : l'absence d'alternative de confiance.",
            },
            {
              kind: "answer",
              fieldId: "problemeReel",
              label: "Le problème réel",
              text:
                "Des acheteurs en ligne réguliers ont le sentiment d'être surveillés sur les grandes boutiques : des publicités " +
                "les suivent, des recommandations en savent trop sur eux, et ils ignorent ce que deviennent leurs données. " +
                "Faute d'alternative de confiance, ils continuent d'acheter, mais à contrecœur.",
            },
            {
              kind: "answer",
              fieldId: "personaDescription",
              label: "Le persona principal",
              text:
                "Sacha, 34 ans, infirmière. Elle commande en ligne deux à trois fois par mois : des livres, du petit " +
                "électroménager, des cadeaux. Elle utilise Amazon depuis des années. Mais depuis qu'une publicité pour un " +
                "article qu'elle avait seulement regardé l'a suivie pendant une semaine, elle se sent observée à chaque clic. " +
                "Elle hésite désormais à consulter certains produits, de peur de ce que la boutique en déduira.",
            },
            {
              kind: "answer",
              fieldId: "besoinPrincipal",
              label: "Son besoin principal",
              text: "Acheter en ligne sans avoir le sentiment d'être surveillée.",
            },
            {
              kind: "example",
              badLabel: "Première version du persona",
              goodLabel: "Besoin principal retenu",
              bad:
                "Sacha aime faire ses achats en ligne mais s'inquiète de l'usage de ses données. Elle souhaite aussi tout " +
                "savoir sur un produit avant de l'acheter, et se faire rembourser rapidement en cas d'abus.",
              good: "Acheter en ligne sans avoir le sentiment d'être surveillée.",
              why:
                "La première version mêlait trois frustrations de poids différents : la vie privée, l'information sur les " +
                "produits, le remboursement. Vouloir les trois revenait à n'en résoudre aucune correctement. La vie privée a " +
                "été retenue : c'est la seule qui ferait vraiment quitter Amazon.",
            },
            {
              kind: "answer",
              fieldId: "frictionExistant",
              label: "Pourquoi les solutions existantes ne lui suffisent pas",
              text:
                "Sacha reste sur Amazon parce que c'est pratique et qu'elle ne connaît pas d'alternative de confiance. Mais " +
                "elle ignore ce que la plateforme fait de ses données, et les publicités ciblées lui rappellent sans cesse " +
                "qu'elle est observée. Les petites boutiques indépendantes ne la rassurent pas davantage : elle ne sait rien " +
                "de leurs pratiques.",
            },
            {
              kind: "remark",
              text:
                "Une solution existe déjà : sans cette friction, rien ne justifierait une boutique de plus. Notez aussi ce qui " +
                "retient Sacha sur Amazon, la commodité : c'est ce que le produit devra égaler.",
            },
            {
              kind: "answer",
              fieldId: "personasSecondaires",
              label: "Personas secondaires",
              items: [
                "Un vendeur indépendant qui voudrait vendre sans dépendre des règles d'une grande plateforme. À reconsidérer si le modèle retenu accueille des vendeurs tiers.",
              ],
            },
            {
              kind: "answer",
              fieldId: "metrique",
              label: "Comment saura-t-on que le problème est résolu ?",
              text: "Sacha fait un premier achat, puis revient régulièrement consulter la boutique, même entre deux achats.",
            },
            {
              kind: "example",
              badLabel: "Premières idées",
              goodLabel: "Métrique retenue",
              bad:
                "La fréquence d'usage. Puis : Sacha revient faire ses achats suivants chez nous plutôt que sur Amazon (le taux de réachat).",
              good: "Sacha fait un premier achat, puis revient régulièrement consulter la boutique, même entre deux achats.",
              why:
                "La fréquence d'usage convient à un réseau social, pas à une boutique : on n'achète pas tous les jours. Le " +
                "taux de réachat ne mesurait que la transaction. Or le besoin de Sacha est la confiance : revenir consulter " +
                "sans acheter montre qu'elle n'a plus peur d'être observée.",
            },
          ],
        },

        // ── Explorer ────────────────────────────────────────────
        {
          phaseId: "explorer",
          blocks: [
            {
              kind: "paragraph",
              text: "Quatre modèles commerciaux ont d'abord été générés, sans filtre :",
            },
            {
              kind: "table",
              headers: ["Approche", "Forces", "Limites"],
              rows: [
                ["Stock propre", "Contrôle total de l'expérience", "Budget important, risque financier élevé"],
                ["Plateforme de vendeurs tiers", "Peu de stock, catalogue large", "Deux personas à satisfaire ; les vendeurs voient les commandes"],
                ["Hybride", "Flexible", "Complexe à gérer pour une première version"],
                ["Dropshipping", "Aucun stock", "Peu de contrôle sur la livraison ; le fournisseur reçoit le nom et l'adresse de chaque acheteur"],
              ],
            },
            {
              kind: "remark",
              text:
                "En confrontant ces modèles à Sacha, une évidence est apparue : quel que soit le modèle, la boutique reste le " +
                "point de contact qui collecte ses données. Le modèle commercial ne résout pas son problème. Le vrai axe de " +
                "différenciation est **la façon dont la boutique traite les données**. Les modèles ont alors été réévalués à " +
                "cette lumière.",
            },
            {
              kind: "table",
              headers: ["Approche", "Décision", "Raison"],
              rows: [
                ["Stock propre, catalogue restreint", "Retenue", "Un seul acteur manipule les données de Sacha, la promesse est tenable ; le catalogue restreint limite le risque financier"],
                ["Plateforme de vendeurs tiers", "Écartée pour le MVP", "Chaque vendeur accéderait aux données de commande ; à reconsidérer plus tard"],
                ["Hybride", "Écartée", "Cumule les difficultés des deux modèles"],
                ["Dropshipping", "Écartée", "Transmet les données de Sacha à des fournisseurs qu'elle ne connaît pas : contraire à la promesse"],
              ],
            },
            {
              kind: "answer",
              label: "Direction retenue",
              text:
                "Une boutique au catalogue restreint, en stock propre, qui se distingue par son traitement des données : elle " +
                "ne collecte que ce qu'exige la commande, ne revend rien, et permet de tout effacer.",
            },
            {
              kind: "remark",
              text:
                "Les quatre modèles répondaient à « comment vendre ? ». Le persona posait une autre question : « comment " +
                "rassurer Sacha ? ». Et chaque rejet est noté avec sa raison : personne ne relancera le débat sur le dropshipping " +
                "sans savoir pourquoi il a été écarté.",
            },
          ],
        },

        // ── Cadrer ──────────────────────────────────────────────
        {
          phaseId: "cadrer",
          blocks: [
            {
              kind: "answer",
              label: "Couche viable",
              items: ["Catalogue et recherche", "Panier", "Commande et paiement", "Livraison et suivi de commande"],
            },
            {
              kind: "answer",
              label: "Couche différenciante",
              items: [
                "Une politique de données courte, en langage simple, montrée avant le premier achat",
                "Commander sans créer de compte",
                "Effacer son compte et ses données en une seule action",
                "Aucune publicité ciblée, aucune revente de données",
                "Le même prix pour tout le monde : pas de prix qui varient selon le profil",
              ],
            },
            {
              kind: "remark",
              text:
                "Avant de lister ces éléments, on a listé ce qui fait que Sacha se méfie d'Amazon : les publicités ciblées, les " +
                "prix qui varient, la revente de données, le sentiment d'être observée. Chaque élément différenciant répond à " +
                "l'une de ces causes.",
            },
            {
              kind: "answer",
              label: "Hors périmètre",
              items: [
                "Recommandations personnalisées : elles exigeraient de profiler Sacha",
                "Comparaison de prix",
                "Alertes de rupture de stock",
                "Programme de fidélité",
                "Vendeurs tiers",
                "Application mobile",
              ],
            },
            {
              kind: "example",
              badLabel: "Première version du MVP",
              goodLabel: "Version retenue",
              bad: "Recherche, panier, commande, livraison.",
              good:
                "Recherche, panier, commande, livraison, plus une politique de données claire, la commande sans compte et " +
                "l'effacement complet des données.",
              why:
                "La première version décrivait un produit qui fonctionne, mais rien qui le distingue d'Amazon. Sans couche " +
                "différenciante, Sacha n'a aucune raison de changer.",
            },
          ],
        },

        // ── Planifier ───────────────────────────────────────────
        {
          phaseId: "planifier",
          blocks: [
            {
              kind: "answer",
              label: "Inconnues critiques",
              items: [
                "**La politique de données** : c'est la fondation, tout le reste devra la respecter. Elle est rédigée avant la première ligne de code.",
                "**La recherche sans profilage** : comment proposer des résultats pertinents sans historique de navigation ? À prototyper dès le début.",
                "**Le prestataire de paiement** : il ne doit pas réutiliser les données d'achat. À vérifier avant de s'engager.",
                "**L'hébergement** : il doit garantir le contrôle des données. C'est un critère éliminatoire, pas un détail.",
              ],
            },
            {
              kind: "answer",
              label: "Dépendances",
              text: "Politique de données → catalogue → recherche → panier → commande et paiement → effacement des données.",
            },
            {
              kind: "answer",
              label: "Technologies",
              items: [
                "**Non négociable** : un hébergement qui garantit le contrôle des données, et aucun outil de mesure d'audience ni traceur tiers.",
                "**Pratique** : les technologies déjà maîtrisées, pour livrer vite.",
              ],
            },
            {
              kind: "table",
              headers: ["Cycle", "Contenu", "Résultat montrable"],
              rows: [
                ["1", "Politique de données, fondations, catalogue", "On parcourt le catalogue"],
                ["2", "Recherche sans profilage, panier", "On trouve un produit et on remplit son panier : premier test avec trois personnes"],
                ["3", "Commande, paiement, commande sans compte", "On achète réellement"],
                ["4", "Page « Vos données », effacement complet", "On voit et on efface ses données"],
                ["5", "Corrections et finitions", "Prêt pour la phase Confronter"],
              ],
            },
            {
              kind: "remark",
              text:
                "La fondation passe en premier, et l'inconnue la plus forte, la recherche, est traitée dès le deuxième cycle, " +
                "avant de construire le reste autour.",
            },
          ],
        },

        // ── Construire ──────────────────────────────────────────
        {
          phaseId: "construire",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Chaque cycle suit le même rythme : développer, tester, valider. Dès la fin du cycle 2, trois personnes qui " +
                "ressemblent à Sacha ont testé la recherche et le panier.",
            },
            {
              kind: "answer",
              label: "Retour des premiers testeurs (cycle 2)",
              text: "Le panier est clair. La recherche ne trouve rien dès qu'on fait une faute de frappe.",
            },
            {
              kind: "answer",
              label: "Dette technique notée",
              items: [
                "**Cycle 2** : recherche par correspondance exacte des mots, sans tolérance aux fautes. Pourquoi : livrer le panier à temps. À corriger : avant l'ouverture au grand public.",
                "**Cycle 3** : courriels de confirmation envoyés pendant la commande, ce qui la ralentit. Pourquoi : c'était la solution la plus simple. À corriger : dès que le nombre de commandes augmente.",
              ],
            },
            {
              kind: "remark",
              text:
                "Le problème de recherche n'a pas été ignoré, ni corrigé dans l'urgence : il a été noté comme une dette, avec " +
                "sa raison et son échéance. Le raccourci est conscient.",
            },
          ],
        },

        // ── Confronter ──────────────────────────────────────────
        {
          phaseId: "confronter",
          blocks: [
            {
              kind: "answer",
              label: "Le test",
              text: "Douze personnes qui correspondent au persona ont utilisé la boutique pendant six semaines.",
            },
            {
              kind: "table",
              headers: ["Ce qu'on mesure", "Résultat"],
              rows: [
                ["Premier achat", "9 personnes sur 12"],
                ["Retour régulier entre deux achats", "3 personnes sur 9"],
              ],
            },
            {
              kind: "answer",
              label: "Ce qu'on a observé",
              items: [
                "La promesse attire, mais la politique de données est très peu lue. Une question revient : « Comment je sais que c'est vrai ? »",
                "L'effacement des données rassure ceux qui le découvrent, mais peu le trouvent.",
                "Le catalogue restreint renvoie vers Amazon pour le reste des achats. Et une fois là-bas, on y reste.",
              ],
            },
            {
              kind: "answer",
              label: "Ce qu'on a appris",
              text:
                "Le problème est réel : on vient pour la promesse. Mais une promesse écrite ne suffit pas, il faut pouvoir la " +
                "vérifier. Et le catalogue trop restreint ramène Sacha vers Amazon.",
            },
            {
              kind: "remark",
              text:
                "La métrique n'est pas atteinte : seules 3 personnes sur 9 reviennent. Ce n'est pas un échec, c'est de " +
                "l'information. Et comme la métrique avait été fixée en phase Comprendre, impossible d'en choisir une autre " +
                "après coup pour se rassurer.",
            },
          ],
        },
      ],
    },

    // ════════════════════════════════════════════════════════════
    {
      number: 2,
      startingPointLabel: "Ce que l'itération 1 a appris",
      startingPoint:
        "Sacha vient pour la promesse, mais ne peut pas la vérifier : la politique de données n'est presque pas lue, et " +
        "plusieurs testeurs se demandent si c'est vrai. Le catalogue restreint la renvoie vers Amazon pour le reste de ses achats.",
      status: "Itération en cours : la phase Comprendre est en train d'être reprise.",
      phases: [
        {
          phaseId: "comprendre",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Les réponses de l'itération 1 ont été reprises comme point de départ. Les checklists, elles, repartent de " +
                "zéro : chaque critère doit être revérifié à la lumière des faits.",
            },
            {
              kind: "answer",
              fieldId: "problemeReel",
              label: "Le problème réel, affiné",
              text:
                "Sacha croit la promesse de la boutique, mais ne peut pas la vérifier. Une politique écrite, même claire, reste " +
                "une promesse : faute de preuve, son sentiment d'être observée ne disparaît pas, et elle retourne vers Amazon " +
                "dès que le catalogue ne suffit pas.",
            },
            {
              kind: "answer",
              fieldId: "besoinPrincipal",
              label: "Son besoin principal, affiné",
              text: "Pouvoir constater par elle-même que ses données ne sont pas exploitées.",
            },
            {
              kind: "remark",
              text:
                "Ce n'est pas un nouveau persona : c'est un besoin affiné pour Sacha, dans la continuité du produit. Le " +
                "catalogue trop restreint est noté, mais il ne devient pas le besoin principal : il relève de la couche viable.",
            },
            {
              kind: "remark",
              text:
                "La première boucle partait d'hypothèses. Celle-ci part de faits : douze personnes, six semaines, et une " +
                "question qui revient.",
            },
          ],
        },
      ],
    },
  ],
};
