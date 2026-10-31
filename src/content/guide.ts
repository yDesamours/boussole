import type { Guide } from '../types/guide';

/**
 * Le guide du framework : tout ce qu'il faut savoir pour comprendre la démarche
 * sans avoir à créer de projet.
 */
export const guide: Guide = {
  title: "Le guide du framework",

  intro: [
    {
      kind: "paragraph",
      text:
        "Écrire du code n'est qu'une partie du métier d'ingénieur logiciel. Avant le code, il faut comprendre le problème, " +
        "explorer les solutions possibles, décider de ce qu'on construit et organiser le travail. Après, il faut confronter " +
        "le produit à de vrais utilisateurs. Ce guide décrit une démarche en six phases pour passer d'une idée vague à un " +
        "produit qui résout un vrai problème.",
    },
    {
      kind: "paragraph",
      text:
        "Ce n'est pas un chemin balisé, c'est une **boussole**. En pratique, tu reviendras souvent en arrière : une " +
        "contrainte découverte en construisant peut remettre en cause un choix fait en explorant. C'est normal, et c'est " +
        "même le signe que la démarche fonctionne.",
    },
    {
      kind: "rule",
      text: "Tu n'as pas besoin de toutes les réponses pour commencer. Tu as besoin des bonnes questions, dans le bon ordre.",
    },
  ],

  sections: [
    // ────────────────────────────────────────────────────────────
    {
      id: "vue-ensemble",
      title: "Les six phases en bref",
      blocks: [
        {
          kind: "table",
          headers: ["Phase", "La question", "Ce qu'elle produit"],
          rows: [
            ["1. Comprendre", "Quel problème, pour qui ?", "Le problème réel, le persona, la métrique de résolution"],
            ["2. Explorer", "Quelles approches sont possibles ?", "Les approches comparées, celle retenue et pourquoi"],
            ["3. Cadrer", "Que construit-on d'abord ?", "Le MVP : couche viable, couche différenciante, hors périmètre"],
            ["4. Planifier", "Dans quel ordre ?", "Les inconnues, les dépendances, les technologies, les cycles"],
            ["5. Construire", "Comment avancer sans se perdre ?", "Le MVP livré cycle par cycle, la dette technique notée"],
            ["6. Confronter", "Est-ce que ça marche vraiment ?", "Les mesures, les retours, ce qu'on a appris"],
          ],
        },
        {
          kind: "paragraph",
          text:
            "Chaque phase produit un document qui sert de point de départ à la suivante. Et les six phases forment une " +
            "**boucle** : à chaque nouvelle version du produit, on recommence à Comprendre, mais avec ce qu'on a appris.",
        },
        {
          kind: "paragraph",
          text:
            "Les trois premières phases disent **quoi** construire et pour qui. La quatrième dit **quand** et dans quel " +
            "ordre. Les deux dernières construisent et vérifient. Si tu cherches à savoir quoi coder dès la phase " +
            "Comprendre, tu sautes à la solution.",
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "comprendre",
      title: "1. Comprendre",
      blocks: [
        {
          kind: "paragraph",
          text:
            "**Objectif :** transformer une idée ou une demande vague en problème clairement formulé. Pas encore de " +
            "solution, pas encore de technologie : seulement le problème.",
        },
      ],
      sections: [
        {
          id: "solution-deguisee",
          title: "La solution déguisée en besoin",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Une demande arrive presque toujours sous la forme d'une solution : « je veux un site éducatif », « on veut " +
                "un réseau social ». Quelqu'un a déjà imaginé la réponse avant de formuler la question. Le réflexe du " +
                "développeur, choisir un framework ou une base de données, est exactement ce qu'il ne faut pas faire à ce " +
                "stade. Ton travail est de reculer d'un cran : pourquoi cette demande ? Que se passe-t-il aujourd'hui ?",
            },
            {
              kind: "rule",
              text:
                "Une idée de départ qui ressemble à une solution n'est pas un défaut : c'est le point de départ normal. " +
                "Garde-la telle quelle. En la comparant à ton problème final, tu verras le chemin parcouru.",
            },
          ],
        },
        {
          id: "trois-questions",
          title: "Les trois questions",
          blocks: [
            {
              kind: "paragraph",
              text: "La phase est terminée quand tu peux répondre sans hésiter à ces trois questions :",
            },
            {
              kind: "list",
              ordered: true,
              items: [
                "**Quel est le problème réel ?** Pas le symptôme, pas la demande de surface : la cause profonde.",
                "**Pour qui exactement ?** Une personne précise, le persona, pas un segment abstrait.",
                "**Comment saura-t-on que le problème est résolu ?** Un comportement observable, la métrique.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "Attention au mot : la question n'est pas « quand saura-t-on que c'est **fini** ? » mais « quand saura-t-on " +
                "que c'est **résolu** ? ». Fini parle de la construction. Résolu parle de ce qui change pour la personne.",
            },
          ],
        },
        {
          id: "cinq-pourquoi",
          title: "Les 5 Pourquoi",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Pour trouver le problème réel, on part de l'idée et on demande « pourquoi ? », puis on redemande « pourquoi ? » " +
                "sur la réponse, jusqu'à atteindre une cause qui ne parle plus de solution. Les règles qui font une bonne chaîne :",
            },
            {
              kind: "list",
              items: [
                "La **première question** part de l'idée (« pourquoi cette application ? »), mais sa **réponse** doit déjà décrire ce que vit une personne.",
                "Chaque « pourquoi » se pose **sur la réponse précédente** : la chaîne descend, elle ne s'étale pas.",
                "Une réponse doit **apprendre quelque chose** qui n'était pas dans la question. Si elle la reformule, elle tourne en rond.",
                "**Une seule cause par niveau.** Deux causes reliées par « de plus » sont deux pistes : garde la plus profonde au centre.",
                "Raconte la chaîne **du point de vue de la personne** qui vit le problème, pas de l'organisation ou de l'outil.",
                "Méfie-toi des réponses qui décrivent une **solution absente** (« il n'existe pas de… ») : c'est déjà ton idée qui parle.",
                "**Arrête-toi** quand la réponse devient une contrainte qu'on ne peut plus creuser. Trois à cinq niveaux suffisent.",
              ],
            },
            {
              kind: "example",
              bad: "Pourquoi un site éducatif ? → Parce qu'il est difficile d'apprendre en ligne.",
              good:
                "Pourquoi un site éducatif ? → Les jeunes de mon quartier veulent apprendre un métier, mais les cours en " +
                "ligne sont en anglais et ne correspondent pas à leur réalité.",
              why:
                "La première réponse répète l'idée avec d'autres mots. La seconde décrit des personnes, ce qu'elles veulent, " +
                "et ce qui les en empêche : le « pourquoi » suivant a de quoi creuser.",
            },
          ],
        },
        {
          id: "probleme-reel",
          title: "Le problème réel",
          blocks: [
            {
              kind: "paragraph",
              text: "Rassemble ta chaîne de « pourquoi » en deux ou trois phrases. Une structure en trois temps aide :",
            },
            {
              kind: "list",
              ordered: true,
              items: [
                "**La situation** : ce que la personne veut faire.",
                "**Le mécanisme** : pourquoi elle n'y arrive pas.",
                "**La conséquence** : ce que ça lui coûte. Sans elle, ton problème ressemble à une simple remarque.",
              ],
            },
            {
              kind: "rule",
              text: "Le problème décrit ce que vivent des personnes, pas ce que tu vas construire.",
            },
            {
              kind: "example",
              bad: "Twitter est devenu instable.",
              good:
                "Les personnes qui utilisaient Twitter pour des conversations publiques courtes n'ont plus de plateforme de " +
                "confiance, et veulent retrouver cette expérience avec les gens qu'elles suivent déjà.",
              why: "La première phrase décrit une situation. La seconde nomme le besoin humain qui n'est plus couvert.",
            },
            {
              kind: "paragraph",
              text:
                "Demande-toi aussi ce que ça coûte vraiment de ne pas résoudre le problème. Une vraie frustration, ou un simple " +
                "« dommage » ? Et la personne **ressent-elle** le problème ? On ne cherche pas de solution à une douleur " +
                "qu'on ne remarque pas.",
            },
          ],
        },
        {
          id: "persona",
          title: "Le persona",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Le persona représente l'utilisateur cible sous la forme d'une **personne précise**. Chaque décision du projet " +
                "se teste contre lui : on ne décide pas « pour les utilisateurs », on décide pour lui. Un bon persona :",
            },
            {
              kind: "list",
              items: [
                "est **une personne** : un prénom, un âge, une situation, des habitudes. Pas « les étudiants », pas « tout le monde ».",
                "a **un seul besoin principal**, celui qui tranche quand il y a un conflit.",
                "explique **pourquoi ce qu'il utilise aujourd'hui ne lui suffit pas**. Si une solution existe déjà, c'est cette frustration qui justifie ton projet.",
                "dit **ce qu'il fait aujourd'hui** à la place. Ses solutions actuelles sont tes vrais concurrents, et le plus redoutable est souvent l'habitude.",
                "contient **une scène vécue** qui illustre le problème, et cette scène est **cohérente** avec le problème réel.",
                "ne contient que des détails qui **servent une décision**. Un détail qui n'éclaire pas son comportement est superflu.",
                "s'inspire d'**une personne réelle**, ou de toi-même. Un persona inspiré du réel tient mieux qu'un portrait imaginé.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "Un persona vague produit des décisions vagues. Même les produits de masse ont commencé par un persona précis : " +
                "Facebook avec les étudiants de Harvard, Threads avec les utilisateurs d'Instagram. On élargit après, jamais avant.",
            },
            {
              kind: "example",
              bad: "Les jeunes qui veulent apprendre.",
              good:
                "Jean-Pierre, 19 ans. Il a terminé le secondaire mais n'a pas les moyens d'aller à l'université. Il a un " +
                "smartphone avec une connexion limitée. Il veut apprendre un savoir-faire utile pour trouver un emploi.",
              why:
                "On ne peut prendre aucune décision « pour les jeunes ». Avec Jean-Pierre, chaque choix se teste : " +
                "est-ce que ça marche avec sa connexion limitée ?",
            },
          ],
        },
        {
          id: "besoin-principal",
          title: "Le besoin principal",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Ton persona a sûrement plusieurs besoins, mais un seul guide la première version. Vouloir tout résoudre en " +
                "même temps produit un produit moyen sur tous les fronts. Le besoin principal passe trois tests :",
            },
            {
              kind: "list",
              ordered: true,
              items: [
                "**Pas de « et ».** Sinon, ce sont deux besoins. Un « ou » peut en revanche décrire deux moments d'un même besoin.",
                "**Il décrit ce que la personne veut obtenir**, pas ce qu'elle fait. « Chercher » est une action ; « connaître », « trouver », « se sentir en sécurité » sont des résultats.",
                "**Il couvre toutes les situations** que tu veux servir. Relis tes scènes : le verbe choisi ne doit en exclure aucune.",
              ],
            },
            {
              kind: "example",
              bad: "Protéger ses données, mieux connaître les produits et se faire rembourser facilement.",
              good: "Acheter en ligne sans avoir le sentiment d'être surveillée.",
              why:
                "La première phrase contient trois besoins. La seconde garde celui qui ferait vraiment changer la personne de solution.",
            },
            {
              kind: "rule",
              text: "Une fois écrit, le besoin principal devient le filtre de tout le projet : chaque idée doit aider à le satisfaire.",
            },
          ],
        },
        {
          id: "plusieurs-personas",
          title: "Plusieurs personas",
          blocks: [
            {
              kind: "paragraph",
              text: "Tu peux avoir plusieurs personas, mais **un seul est prioritaire**. C'est lui qui décide en cas de conflit.",
            },
            {
              kind: "list",
              items: [
                "**Identifie-les tous, priorise-les explicitement**, construis d'abord pour le premier, et vérifie que ce que tu construis ne nuit pas aux autres.",
                "Dans une **plateforme à deux faces** (vendeurs et acheteurs, organisateurs et public), un côté ne peut pas exister sans l'autre. Les deux comptent, mais on commence toujours par un.",
                "Un persona secondaire peut être **indispensable** : ce dont il a besoin pour que le produit fonctionne entre dans le MVP. Ce qui ne sert que lui attend une itération future.",
                "Son problème principal doit être **le miroir** de celui du persona principal. Sinon, il n'aura aucune raison de participer.",
                "Certains personas ont des **besoins opposés** au principal, comme un annonceur qui veut vendre. En cas de conflit, le persona principal prime.",
                "On n'introduit un **nouveau persona** que lorsque le problème du principal est résolu. Ajouter trop tôt rend le produit moyen pour tout le monde.",
              ],
            },
          ],
        },
        {
          id: "metrique",
          title: "La métrique",
          blocks: [
            {
              kind: "paragraph",
              text: "Elle répond à la troisième question : comment saura-t-on que le problème est résolu ? Une bonne métrique :",
            },
            {
              kind: "list",
              items: [
                "décrit **un comportement observable**. La satisfaction ne s'observe pas, ce que fait la personne, si.",
                "mesure **la résolution**, pas le démarrage. S'inscrire, envoyer un premier message ou installer l'application prouve qu'on a essayé, pas que le problème est résolu.",
                "mesure **le besoin**, pas seulement la transaction. Si le besoin est la confiance, la métrique doit montrer la confiance.",
                "reste **vraie dans la durée** : plusieurs semaines après, pas seulement le jour du lancement.",
                "est **adaptée au produit**. Un réseau social vit de visites quotidiennes ; on n'achète pas tous les jours dans une boutique.",
                "est **définie avant de construire**. Définie après, on est tenté de choisir celle qui confirme ce qu'on veut croire.",
              ],
            },
            {
              kind: "example",
              bad: "Sacha s'est inscrite et a envoyé son premier message.",
              good: "Sacha revient chaque jour, passe du temps sur la plateforme et n'a plus besoin de retourner sur Twitter.",
              why: "La première est une métrique de démarrage. La seconde mesure la rétention, donc la résolution durable du problème.",
            },
            {
              kind: "paragraph",
              text:
                "Une scène qui montre le problème résolu complète bien la métrique, surtout si elle répond à la scène du persona : " +
                "avant, la personne apprenait trop tard ; après, elle apprend à temps et agit.",
            },
          ],
        },
        {
          id: "comprendre-fin",
          title: "Quand est-ce terminé ?",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Quand tu réponds aux trois questions, et que ta réponse ne contient encore aucune fonctionnalité ni technologie. " +
                "L'ordre des champs est celui du document final, pas forcément celui de ta réflexion : les « pourquoi » font " +
                "apparaître le persona, et le persona aide à préciser les « pourquoi ». Vérifie à la fin que tout raconte la même histoire.",
            },
            {
              kind: "rule",
              text: "Signal d'alarme : si tu as encore envie de parler de fonctionnalités, la phase n'est pas terminée.",
            },
            {
              kind: "paragraph",
              text:
                "**Ce que la phase produit :** le document de compréhension. C'est le contrat du projet : en cas de doute " +
                "plus tard, ou si quelqu'un remet une décision en question, on y revient.",
            },
          ],
        },
        {
          id: "comprendre-pieges",
          title: "Pièges à éviter",
          blocks: [
            {
              kind: "list",
              items: [
                "S'arrêter à la demande de surface au lieu de creuser le problème.",
                "Écrire des « pourquoi » qui répètent la question ou empilent plusieurs causes.",
                "Décrire un groupe au lieu d'une personne précise.",
                "Donner plusieurs besoins principaux au persona.",
                "Oublier d'expliquer pourquoi les solutions existantes ne suffisent pas.",
                "Choisir une métrique de démarrage, ou une métrique qui décrit la livraison du produit.",
                "Confondre « le produit est livré » et « le problème est résolu ».",
              ],
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "explorer",
      title: "2. Explorer",
      blocks: [
        {
          kind: "paragraph",
          text:
            "**Objectif :** trouver la meilleure solution possible, pas formaliser celle qu'on a déjà en tête. On ne sait " +
            "pas encore ce que sera la solution : on la découvre.",
        },
      ],
      sections: [
        {
          id: "diverger-converger",
          title: "Diverger, puis converger",
          blocks: [
            {
              kind: "list",
              ordered: true,
              items: [
                "**Diverger** : génère toutes les approches possibles, sans filtre. Y compris la plus simple : peut-on résoudre le problème sans code ?",
                "**Confronter au persona** : pour chaque approche, est-ce qu'elle sert son besoin principal ?",
                "**Converger** : au fil de cette confrontation, des éléments de clarté apparaissent, et une direction se dessine.",
              ],
            },
            {
              kind: "rule",
              text: "Chaque idée explorée est confrontée au persona et à son besoin principal. Si elle ne le sert pas, elle est secondaire.",
            },
            {
              kind: "paragraph",
              text:
                "Parfois, l'exploration révèle que tu comparais les mauvaises choses. On peut comparer quatre modèles commerciaux " +
                "et découvrir qu'aucun ne touche le vrai problème, et que la différence se joue ailleurs. Ce n'est pas un échec " +
                "de l'exploration, c'est exactement son but.",
            },
          ],
        },
        {
          id: "explorer-outils",
          title: "Les outils",
          blocks: [
            {
              kind: "list",
              items: [
                "**L'analyse de l'existant** : qui résout ce problème aujourd'hui ? Comment ? Que reprochent les utilisateurs à ces solutions ? Les avis négatifs sont une mine d'or. Où est le vide ?",
                "**La matrice des contraintes** : liste ce qui limite la solution, en quatre catégories : temps, argent, compétences, dépendances externes. Elle t'évite de tomber amoureux d'une solution irréalisable.",
              ],
            },
          ],
        },
        {
          id: "explorer-fin",
          title: "Quand est-ce terminé ?",
          blocks: [
            {
              kind: "paragraph",
              text: "Quand trois conditions sont réunies **en même temps** :",
            },
            {
              kind: "list",
              ordered: true,
              items: [
                "l'approche retenue satisfait le besoin principal du persona ;",
                "tu as pesé le pour et le contre de plusieurs options, pas seulement validé la première idée ;",
                "tu la juges réalisable avec les moyens, le temps et les compétences disponibles.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "**Ce que la phase produit :** les approches explorées, **pourquoi chacune a été écartée**, et l'approche " +
                "retenue avec ses raisons. Sans les raisons des rejets, quelqu'un relancera plus tard un débat déjà tranché.",
            },
          ],
        },
        {
          id: "explorer-pieges",
          title: "Pièges à éviter",
          blocks: [
            {
              kind: "list",
              items: [
                "Arriver avec une solution préconçue et chercher à la justifier.",
                "S'arrêter à la première idée qui semble tenir.",
                "Comparer des approches sur des critères qui ne touchent pas le besoin du persona.",
                "Oublier de noter pourquoi les autres options ont été écartées.",
              ],
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "cadrer",
      title: "3. Cadrer",
      blocks: [
        {
          kind: "paragraph",
          text:
            "**Objectif :** définir le MVP (produit minimum viable) : la version minimale qui permet de vérifier que " +
            "l'idée résout vraiment le problème. On ne détaille pas toute la solution, on identifie l'indispensable.",
        },
        {
          kind: "paragraph",
          text:
            "Un MVP n'est pas un prototype. Un prototype est une maquette, souvent non fonctionnelle, pour illustrer une idée. " +
            "Un MVP est un vrai produit, minimal, qu'on peut confier à de vrais utilisateurs.",
        },
      ],
      sections: [
        {
          id: "deux-couches",
          title: "Les deux couches du MVP",
          blocks: [
            {
              kind: "list",
              items: [
                "**La couche viable** : ce qui fait que c'est un produit qui fonctionne. Sans elle, il n'y a pas de produit.",
                "**La couche différenciante** : ce qui résout directement le besoin principal du persona. Sans elle, il n'y a aucune raison de choisir ton produit plutôt qu'un autre.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "Pour trouver la couche différenciante, pars des **causes** du problème identifiées en phase Comprendre, pas " +
                "d'une liste de fonctionnalités. Chaque cause appelle une réponse.",
            },
            {
              kind: "rule",
              text:
                "Pour chaque fonctionnalité envisagée : sans elle, le problème principal du persona reste-t-il non résolu ? " +
                "Si la réponse est non, elle n'a pas sa place dans le MVP.",
            },
          ],
        },
        {
          id: "hors-perimetre",
          title: "Ce qu'on ne construit pas",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Documenter ce qui est **hors périmètre** est aussi important que le reste : sinon, ces fonctionnalités " +
                "reviennent en douce en cours de route. Rien n'est jeté pour autant, c'est mis de côté pour une itération future.",
            },
            {
              kind: "paragraph",
              text:
                "La méthode **MoSCoW** aide à trier : *Must have* (indispensable), *Should have* (important mais pas bloquant), " +
                "*Could have* (agréable), *Won't have* (explicitement exclu de cette version).",
            },
            {
              kind: "paragraph",
              text:
                "Le périmètre peut changer en cours de route. C'est acceptable à condition de le faire **consciemment** et de " +
                "mettre à jour le document de cadrage. Si les ajouts se multiplient, demande-toi si le persona en a vraiment besoin.",
            },
          ],
        },
        {
          id: "cadrer-pieges",
          title: "Pièges à éviter",
          blocks: [
            {
              kind: "list",
              items: [
                "Construire un produit techniquement complet mais sans couche différenciante : il ressemble à tous les autres.",
                "Tout juger indispensable parce qu'on est attaché à ses idées.",
                "Laisser le hors-périmètre implicite.",
                "Faire entrer par la petite porte un persona ou un besoin qui n'appartient pas à cette version.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "**Ce que la phase produit :** la couche viable, la couche différenciante et le hors-périmètre, chacun listé explicitement.",
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "planifier",
      title: "4. Planifier",
      blocks: [
        {
          kind: "paragraph",
          text: "**Objectif :** organiser la construction du MVP. Planifier juste assez pour commencer, pas plus.",
        },
      ],
      sections: [
        {
          id: "inconnues",
          title: "Les inconnues critiques",
          blocks: [
            {
              kind: "paragraph",
              text: "Pour chaque fonctionnalité du MVP, réponds à trois questions :",
            },
            {
              kind: "list",
              items: [
                "**Est-ce que je sais la construire ?** Si non, c'est une inconnue critique.",
                "**De quoi dépend-elle ?** Certaines fonctionnalités ne peuvent pas être construites avant d'autres.",
                "**Quel est le risque ?** Qu'est-ce qui pourrait bloquer ou prendre plus de temps que prévu ?",
              ],
            },
            {
              kind: "rule",
              text: "On traite les inconnues critiques en premier, pas en dernier. Une inconnue ignorée devient un blocage au milieu du projet.",
            },
            {
              kind: "paragraph",
              text:
                "Ne jamais estimer ce qu'on ne comprend pas encore : on **prototype d'abord**, on estime ensuite. Un doute non " +
                "vérifié peut modifier toute l'architecture. Croire, à tort, qu'il faut un serveur pour générer des documents " +
                "aurait ajouté un hébergement payant ; un test d'une heure suffit à trancher.",
            },
            {
              kind: "paragraph",
              text:
                "Repère aussi **la fondation** : l'élément dont tout le reste dépend, et que tout le reste doit respecter. " +
                "C'est la première chose à construire.",
            },
          ],
        },
        {
          id: "technologies",
          title: "Choisir les technologies",
          blocks: [
            {
              kind: "paragraph",
              text:
                "On choisit une technologie parce qu'elle répond à des besoins précis, pas parce qu'on l'aime bien. En deux temps :",
            },
            {
              kind: "list",
              ordered: true,
              items: [
                "**Les contraintes non négociables**, souvent issues du persona (sécurité, confidentialité, connexion limitée). Toute technologie qui ne les respecte pas est éliminée d'office.",
                "**Les critères pratiques** : compétences disponibles, budget, délais, travail seul ou en équipe.",
              ],
            },
          ],
        },
        {
          id: "cycles",
          title: "Organiser en cycles courts",
          blocks: [
            {
              kind: "paragraph",
              text:
                "On ne construit pas tout d'un coup. On découpe le MVP en cycles courts, d'une à deux semaines. Chaque cycle " +
                "planifie ce qu'il va livrer, l'implémente, le teste et le valide, et produit **quelque chose de montrable**. " +
                "Une tâche doit pouvoir être faite par une personne en moins d'une journée ; sinon, on la découpe encore.",
            },
            {
              kind: "paragraph",
              text:
                "Un bon ordre : la fondation, puis les inconnues critiques, puis **une fonctionnalité complète de bout en bout** " +
                "plutôt que toutes à moitié. Une seule partie vraiment utilisable peut déjà être testée par quelqu'un.",
            },
          ],
        },
        {
          id: "planifier-pieges",
          title: "Pièges à éviter",
          blocks: [
            {
              kind: "list",
              items: [
                "Sur-planifier au lieu de commencer. La plupart des réponses qu'on cherche avant de commencer, on ne les obtient qu'en commençant.",
                "Choisir une technologie par goût plutôt que par contrainte.",
                "Estimer ce qu'on ne comprend pas.",
                "Garder les tâches risquées pour la fin.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "**Ce que la phase produit :** les inconnues et comment les lever, les dépendances, les technologies retenues " +
                "et leurs raisons, et le découpage en cycles.",
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "construire",
      title: "5. Construire",
      blocks: [
        {
          kind: "paragraph",
          text: "**Objectif :** produire le MVP en suivant les cycles définis, sans se perdre en route.",
        },
      ],
      sections: [
        {
          id: "dans-un-cycle",
          title: "À l'intérieur d'un cycle",
          blocks: [
            {
              kind: "list",
              ordered: true,
              items: [
                "Développer ce qui est prévu pour le cycle.",
                "Tester : ce qui a été construit fonctionne-t-il correctement ?",
                "Valider : cela correspond-il à ce qui était attendu ?",
                "Si un problème apparaît, planifier un cycle correctif.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "Qui valide ? Le client si tu travailles pour un client, l'équipe ou une autre équipe si tu travailles en équipe, " +
                "toi-même si tu travailles seul. Mais dans tous ces cas, **l'utilisateur final est absent** de la validation : " +
                "personne ne vérifie encore que son problème est résolu. C'est le rôle de la phase suivante.",
            },
          ],
        },
        {
          id: "montrer-tot",
          title: "Montrer tôt",
          blocks: [
            {
              kind: "paragraph",
              text:
                "On n'attend pas que tout le MVP soit prêt pour obtenir des retours. Dès qu'un cycle produit quelque chose " +
                "d'utilisable, on le montre à quelques **early users**, ou **bêta-testeurs** : un petit groupe de personnes qui " +
                "ressemblent au persona et qui acceptent de tester un produit qu'elles savent en construction. Ce n'est pas le " +
                "grand public.",
            },
          ],
        },
        {
          id: "dette-technique",
          title: "La dette technique",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Prendre un raccourci pour aller plus vite est acceptable, à condition que ce soit **une décision consciente et " +
                "documentée**. Pour chaque raccourci, note ce que tu as fait, pourquoi, et ce qu'il faudra corriger plus tard.",
            },
            {
              kind: "rule",
              text: "Une dette non documentée devient une bombe à retardement.",
            },
          ],
        },
        {
          id: "cycles-agile",
          title: "Cycles et méthode agile",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Travailler par cycles n'exige pas d'adopter une méthode agile. L'agile formalise ces cycles avec des rôles, des " +
                "rituels et des outils, pour organiser une équipe. Un développeur seul qui avance par petites itérations n'est " +
                "pas agile au sens strict, il est pragmatique. La vraie question est : **est-ce que je construis par petits " +
                "morceaux livrables, plutôt que tout d'un coup ?**",
            },
          ],
        },
        {
          id: "construire-pieges",
          title: "Pièges à éviter",
          blocks: [
            {
              kind: "list",
              items: [
                "Tout construire avant de montrer quoi que ce soit.",
                "Prendre des raccourcis sans les noter.",
                "Confondre la validation technique avec la satisfaction de l'utilisateur.",
              ],
            },
            {
              kind: "paragraph",
              text: "**Ce que la phase produit :** le MVP, livré cycle par cycle, et la liste de la dette technique.",
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "confronter",
      title: "6. Confronter",
      blocks: [
        {
          kind: "paragraph",
          text:
            "**Objectif :** exposer le produit à de vrais utilisateurs, mesurer si le problème du persona est résolu, et apprendre.",
        },
      ],
      sections: [
        {
          id: "deux-niveaux",
          title: "Deux niveaux d'exposition",
          blocks: [
            {
              kind: "list",
              items: [
                "**Les bêta-testeurs** : un groupe restreint qui correspond au persona. On obtient des retours précis avant de se montrer au grand public.",
                "**Le grand public** : quand le produit est stable et validé. Lancer trop tôt, c'est risquer une mauvaise première impression, difficile à effacer, et recevoir trop de retours à la fois pour savoir quoi prioriser.",
              ],
            },
          ],
        },
        {
          id: "mesurer",
          title: "Mesurer et observer",
          blocks: [
            {
              kind: "paragraph",
              text:
                "On mesure avec **la métrique définie en phase Comprendre**, pas avec une métrique choisie après coup. Et on " +
                "observe plutôt qu'on ne demande : donne une tâche à une personne réelle et regarde-la faire, sans intervenir. " +
                "Là où elle bute, ton produit a un problème.",
            },
          ],
        },
        {
          id: "apprendre",
          title: "Ce qu'on fait des retours",
          blocks: [
            {
              kind: "paragraph",
              text:
                "Un MVP qui ne satisfait pas le persona n'est pas un échec : c'est de l'information, obtenue vite et à moindre coût. " +
                "Ce qu'il a fait, où il a buté, ce qu'il a dit, ce qu'il n'a pas utilisé : tout cela nourrit la prochaine boucle.",
            },
            {
              kind: "list",
              items: [
                "**Le persona n'est pas satisfait** : on repense la stratégie pour lui, avec les données en main.",
                "**Le persona est satisfait** : on peut envisager d'élargir, avec un nouveau besoin ou un nouveau persona.",
              ],
            },
            {
              kind: "paragraph",
              text:
                "**Ce que la phase produit :** les mesures, les retours, et ce qu'on en a appris. C'est le point de départ de l'itération suivante.",
            },
          ],
        },
        {
          id: "confronter-pieges",
          title: "Pièges à éviter",
          blocks: [
            {
              kind: "list",
              items: [
                "Choisir les métriques après le lancement.",
                "Interpréter les données pour confirmer ce qu'on veut croire.",
                "Lancer au grand public avant d'avoir appris avec un petit groupe.",
              ],
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "boucle",
      title: "La boucle : itérer",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le MVP est la première version, pas le produit final. Les six phases se répètent pendant toute la vie du produit : " +
            "Comprendre, Explorer, Cadrer, Planifier, Construire, Confronter, puis Comprendre à nouveau.",
        },
        {
          kind: "rule",
          text: "La première boucle part d'hypothèses. Les suivantes partent de faits.",
        },
        {
          kind: "list",
          items: [
            "Chaque itération repart de **Comprendre**, avec ce que la phase Confronter de la précédente a appris.",
            "Les réponses peuvent être reprises et affinées, mais **chaque critère doit être revérifié** avec les nouveaux faits.",
            "Demande-toi si tu résous **un nouveau besoin pour le même persona** (dans la continuité du produit) ou si tu t'adresses à **un nouveau persona** (qui peut remettre en cause des décisions prises).",
            "Le persona principal reste prioritaire **tant que son problème n'est pas résolu**.",
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "pieges",
      title: "Les pièges qui reviennent partout",
      blocks: [
        {
          kind: "list",
          items: [
            "**La paralysie par l'analyse** : vouloir répondre à toutes les questions avant de commencer. La certitude totale n'existe pas ; le framework dit jusqu'où réfléchir avant d'agir.",
            "**Sauter à la solution** : parler de fonctionnalités ou de technologies avant d'avoir compris le problème.",
            "**Confondre livrer et résoudre** : du code en production n'est pas un problème résolu.",
            "**Le persona vague** : « tout le monde » n'est pas un persona.",
            "**Ajouter sans raison** : chaque fonctionnalité doit servir le besoin principal du persona.",
            "**Ignorer la dette technique** : un raccourci non noté devient un problème invisible.",
            "**Définir la réussite après coup** : les métriques se choisissent avant de construire.",
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────
    {
      id: "utiliser-boussole",
      title: "Utiliser Boussole",
      blocks: [
        {
          kind: "list",
          items: [
            "**Crée un projet** avec ton idée de départ, telle qu'elle te vient. Boussole la conserve sans la modifier.",
            "**Chaque phase** commence par son explication, repliable : objectif, démarche, pièges, ce qu'elle produit.",
            "**Chaque champ** a une consigne, et un exemple de bonne et de mauvaise réponse à déplier.",
            "**Les alertes** signalent, pendant que tu écris, les formulations floues ou qui parlent déjà de solution. Elles ne bloquent jamais : c'est à toi de juger.",
            "**À partir de la phase Explorer**, un rappel de ton persona reste en haut de la page : son besoin principal est le juge de chaque décision.",
            "**Chaque phase produit un document** à télécharger en Markdown, HTML, PDF ou Word. Le document complet d'une itération s'exporte depuis la page du projet.",
            "**La checklist de sortie**, en bas de chaque phase, te dit si la phase peut être considérée comme terminée. Tu peux avancer sans la compléter, mais la phase reste marquée incomplète.",
            "**Une nouvelle itération** repart de Comprendre avec ce que tu as appris : ce que tu as écrit dans la phase Confronter est proposé comme point de départ. Les itérations précédentes restent consultables.",
            "**Tes projets restent sur ton appareil**, dans ton navigateur. Rien n'est envoyé ailleurs. Le stockage dépend du navigateur et de l'adresse : un autre navigateur, ou la même application servie sur un autre port, ne voit pas les mêmes projets.",
            "**Pour sauvegarder ou changer de navigateur**, exporte tes projets depuis l'accueil, puis importe le fichier dans l'autre navigateur. Avant d'importer, Boussole montre un aperçu de ce qui va changer.",
            "**Un import n'efface jamais un travail plus récent.** Si la version de l'appareil est plus récente que celle du fichier, la version du fichier est ajoutée comme copie : tu choisis ensuite laquelle garder.",
          ],
        },
      ],
    },
  ],
};
