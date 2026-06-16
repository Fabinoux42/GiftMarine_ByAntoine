/* ====================================================================
   CONFIG.JS — Toutes les données et constantes de l'application
   --------------------------------------------------------------------
   C'est ici qu'on modifie le contenu sans toucher à la logique.
   - Mot de passe / énigmes
   - Messages du guide Mini Anto-Man
   - Roue du destin
   - Quêtes du simulateur
   - Quiz
   - Étapes de progression
==================================================================== */

/* ------------------------------------------------------------------
   MOT DE PASSE — énigmes aléatoires (thème Attaque des Titans)
   Pour ajouter un personnage : { riddle, answer, hints }
   → 5 hints : 1 générique + 3 progressifs + 1 "commence par X"
------------------------------------------------------------------ */
const PASSWORD_RIDDLES = [
    {
        riddle: "Je hurle des menaces d'extermination à la moindre contrariété, j'ai un humour de chacal enragé, et sous le coup de la colère je me transforme en montagne de muscles fumante. Qui suis-je ?",
        answer: "eren",
        hints: [
            "Raté, mais stylé. Retente, amor.",
            "Indice : la patience n'est pas vraiment son fort.",
            "Indice : « Tatakae » (= bats-toi), c'est un peu son mantra.",
            "Indice : Marine, concentre-toi. Même un Titan aurait trouvé.",
            "Indice final : son prénom commence par E."
        ]
    },
    {
        riddle: "Je ne quitte jamais mon écharpe rouge, je reste glaciale même au cœur du chaos, et pour moi le monde est cruel mais aussi très beau. Qui suis-je ?",
        answer: "mikasa",
        hints: [
            "Raté, mais stylé. Retente, amor.",
            "Indice : son écharpe rouge a une très grande valeur sentimentale.",
            "Indice : son nom de famille fait trembler les Titans (et les autres).",
            "Indice : Marine, concentre-toi. Même un Titan aurait trouvé.",
            "Indice final : son prénom commence par M."
        ]
    },
    {
        riddle: "Je suis petit, je déteste la poussière encore plus que les Titans, et mon regard pourrait faire fondre un glacier. « Capitaine », pour les intimes. Qui suis-je ?",
        answer: "levi",
        hints: [
            "Raté, mais stylé. Retente, amor.",
            "Indice : pour lui, le ménage est une question d'honneur.",
            "Indice : sa taille n'a jamais empêché personne de le redouter.",
            "Indice : Marine, concentre-toi. Même un Titan aurait trouvé.",
            "Indice final : son prénom commence par L."
        ]
    },
    {
        riddle: "Je suis le cerveau de la bande, je rêve depuis toujours de voir l'océan, et un jour je deviens soudainement beaucoup, beaucoup plus grand que prévu. Qui suis-je ?",
        answer: "armin",
        hints: [
            "Raté, mais stylé. Retente, amor.",
            "Indice : il a toujours un plan, même quand ça part en vrille.",
            "Indice : la mer, il en parle depuis le tout premier épisode.",
            "Indice : Marine, concentre-toi. Même un Titan aurait trouvé.",
            "Indice final : son prénom commence par A."
        ]
    },
    {
        riddle: "Je donne des ordres qui font pleurer des générations entières de fans, je sacrifie tout pour l'humanité, et niveau bras, j'en ai connu de meilleurs jours. Qui suis-je ?",
        answer: "erwin",
        hints: [
            "Raté, mais stylé. Retente, amor.",
            "Indice : « Chargez ! » est à peu près sa réplique signature.",
            "Indice : ses sourcils sont presque aussi célèbres que lui.",
            "Indice : Marine, concentre-toi. Même un Titan aurait trouvé.",
            "Indice final : son prénom commence par E."
        ]
    }
];

/* ------------------------------------------------------------------
   MESSAGES DU GUIDE (Mini Anto-Man)
   Chaque clé correspond à un moment précis de l'expérience.
------------------------------------------------------------------ */
const GUIDE_MESSAGES = {
    passwordSuccess: "Bienvenue Marine. Zone hautement romantique.",
    noButtonFlee: "Le Non a quitté la conversation.",
    yesChoice: "Excellent choix.",
    wheelSpin: "Le destin amoureux se met en marche…",
    wheelRespin: "Le destin amoureux retente sa chance…",
    wheelResult: "Je n'aurais pas fait mieux.",
    quizExpress: "Mode Quiz Express activé.",
    simulatorIntro: "Le voyage vient de s'agrandir. Courage, amor.",
    allQuestsDone: "Succès débloqué.",
    kirikouReaction: "Cette conversation a pris une direction inattendue.",
    quizDone: "Marine power loading…",
    theEnd: "Mission accomplie. Bisous réglementaire."
};

// Bannière affichée quand la jauge atteint 100 %
const GAUGE_COMPLETE_MESSAGE = "VIVE MARINE, VIVE LES GROS NICHONS, VIVE NOUS.";

/* ------------------------------------------------------------------
   SON — déblocage de Kirikou
   Chemin du mp3 joué au moment précis où Kirikou est débloqué
   dans le simulateur. Le son est stoppé dès qu'on quitte la section.
   → Logique : js/sound.js (lecture) + js/navigation.js (arrêt)
------------------------------------------------------------------ */
const KIRIKOU_SOUND = "sounds/KirikouSong.mp3";

/* ------------------------------------------------------------------
   ROUE DU DESTIN
   6 secteurs de 60° alternant "simulator" et "quiz".
   Garder un nombre pair pour que le dégradé CSS reste équilibré.

   ⚠️ La roue est désormais un HUB : on y revient entre les mini-jeux.
   Les deux mini-jeux ("simulator" et "quiz") sont obligatoires ;
   une fois les deux terminés, la roue propose l'écran de fin.
------------------------------------------------------------------ */
const WHEEL_SEGMENTS = ["simulator", "quiz", "simulator", "quiz", "simulator", "quiz"];

/* ------------------------------------------------------------------
   JAUGE DE PROGRESSION — répartition des 100 %
   --------------------------------------------------------------------
     password   → 10 %  (mot secret trouvé)
     impossible → 10 %  (clic sur « Oui »)
     simulator  → 40 %  (réparti sur les 6 quêtes du simulateur)
     quiz       → 40 %  (réparti sur les 5 quiz)
   Total = 100 %. Chaque mini-jeu remplit sa part au fur et à mesure.
   → Calcul : js/state.js (State.gaugePercent)
------------------------------------------------------------------ */
const GAUGE_WEIGHTS = {
    password: 10,
    impossible: 10,
    simulator: 40,
    quiz: 40
};

/* ------------------------------------------------------------------
   SIMULATEUR — quêtes
   Pour ajouter / retirer une quête :
   1. Modifier ce tableau
   2. Ajouter / supprimer le <li data-quest="..."> correspondant dans index.html
------------------------------------------------------------------ */
const SIMULATOR_QUESTS = [
    {key: "quest1", title: "Préparer un repas ensemble", guideMessage: "La cuisine a survécu. C'est déjà une victoire."},
    {key: "quest2", title: "Regarder une série ensemble", guideMessage: "Spoiler évité de 0,3 seconde. Record battu."},
    {key: "quest3", title: "Jouer aux jeux vidéo", guideMessage: "Antoine a perdu. Marine le savait déjà."},
    {key: "quest4", title: "Se chamailler pour rien", guideMessage: "Dispute résolue en un temps record. Champions."},
    {key: "quest5", title: "Faire rire Marine", guideMessage: "Rire authentique détecté. Mission critique réussie."},
    {key: "quest6", title: "Câlin sous plaid", guideMessage: "Niveau cocooning : maximum atteint."}
];

// Répliques aléatoires de Marine (running gag)
const MARINE_LINES = [
    "Vive les gros nichons.",
    "Je maintiens ma position : vive les gros nichons.",
    "Je refuse d'élaborer davantage.",
    "…",
    "Vive les gros nichons."
];
const MARINE_COMMENT_CHANCE = 0.4; // 40 % de chance par quête

// Dialogue de déblocage de Kirikou
const KIRIKOU_DIALOGUE = [
    {who: "Kirikou", text: "Kirikou est petit mais il est vaillant !"},
    {who: "Marine", text: "Vive les gros nichons."},
    {who: "Mini Anto-Man", text: "Cette conversation a pris une direction inattendue."}
];

/* ------------------------------------------------------------------
   QUIZ
   --------------------------------------------------------------------
   Deux types de questions :

   1) Question « pour le fun » — toutes les réponses sont valides,
      n'importe quel clic passe à la suite :
        { question: "…", options: ["A", "B", "C"] }

   2) Question « à bonne réponse » — ajouter ces 3 champs :
        correct:           index (0 = 1ʳᵉ option) de la bonne réponse
        positiveFeedback:  ce que dit Mini Anto-Man si c'est juste
        negativeFeedbacks: tableau de répliques en cas d'erreur
                           (1ʳᵉ erreur → [0], 2ᵉ erreur → [1], …)

      Comportement : si la réponse est bonne → Mini Anto-Man dit le
      positiveFeedback puis on passe à la question suivante. Si elle est
      fausse → le bouton choisi devient rouge, Mini Anto-Man dit le
      negativeFeedback correspondant, et on reste sur la question pour
      laisser choisir une autre réponse.
   → Moteur : js/quiz.js
------------------------------------------------------------------ */
const QUIZZES = {

    politique: {
        progressKey: "quizPolitique",
        next: "section-quiz-twd",
        result: "Compatibilité politique : 100%. La gauche du cœur est largement majoritaire. 🌹",
        questions: [
            {
                question: "Quelqu'un te dit : 'Franchement, Patrick Bruel, en vrai, il est gentil.'",
                options: ["Je hausse un sourcil à -40°C", "Je sors mon meilleur regard noir", "Je change de sujet et je parle de toi"]
            },
            {
                question: "Le mot préféré de Marine est :",
                options: ["Et moi je suis Spider-Man.", "Bien sûr", "Je vais t'enculer"],
                correct: 2,
                positiveFeedback: "Et en plus ça fait mal.",
                negativeFeedbacks: [
                    "MDR tu dis jamais ça.",
                    "Ah super, donc maintenant on invente une nouvelle Marine.",
                    "Je pensais que t’étais plus attentive à ton langage fleuri."
                ]
            },
            {
                question: "Océan t'envoie : 'J'ai un truc à te raconter.",
                options: ["Répond immédiatement.", "Met son plaid.", "Adore les Gossips", "Les trois"],
                correct: 3,
                positiveFeedback: "Bien sûr que c'est les trois.",
                negativeFeedbacks: [
                    "Ah... c'était les trois.",
                    "Tu savais très bien que c’était les trois, fais pas genre.",
                    "Le plaid, le gossip, la réponse immédiate… tout était là."
                ]
            },
            {
                question: "Face à l'injustice, tu préfères : manif, débat, ou regard noir ultra efficace ?",
                options: ["Manif, pancarte faite main", "Débat, mais qui dérape vite", "Le regard noir, ça règle 90% des cas"]
            }
        ]
    },

    twd: {
        progressKey: "quizTWD",
        next: "section-quiz-italie",
        result: "Survie validée. Marine peut officiellement rejoindre le groupe. Antoine garde le plaid (et Daryl, on partage). 🧟",
        questions: [
            {
                question: "Dans une apocalypse zombie, Marine serait plutôt :",
                options: ["La stratège qui a déjà un plan B, C et D", "Celle qui sauve le chat avant tout le reste", "La leader"]
            },
            {
                question: "Qui survivrait le plus longtemps entre Antoine et Marine ?",
                options: ["Marine, sans hésitation", "Antoine, juste pour râler plus longtemps", "Aucun des deux, trop occupés à se chamailler"]
            },
            {
                question: "Si Daryl entre dans la pièce, Marine fait quoi ?",
                options: ["Elle reste très calme. Très. Calme.", "Elle regarde Antoine. Antoine regarde ailleurs.", "L'amour. L'amour est la seule réponse possible"]
            },
            {
                question: "Si Daryl arrive pendant un câlin, quelle est la priorité ?",
                options: ["Finir le câlin, Daryl attendra", "Coucou Daryl", "On négocie. Tout se négocie."]
            }
        ]
    },

    italie: {
        progressKey: "quizItalie",
        next: "section-quiz-ocean",
        result: "Marine est italienne à 94%. Les 6% restants sont probablement du grognichon. 🍝",
        questions: [
            {
                question: "La vraie carbonara contient-elle de la crème ?",
                options: ["Non. Jamais. C'est un crime.", "Un peu, pour la texture… (Marine, NON.)", "Crème ? Quelle crème ?"]
            },
            {
                question: "Quel est le niveau acceptable de drama dans une famille italienne ?",
                options: ["Modéré. Juste assez pour un bon repas.", "Illimité. C'est une fonctionnalité, pas un bug.", "Drama ? On appelle ça de la passion."]
            },
            {
                question: "Si quelqu'un casse les spaghetti avant cuisson, que faire ?",
                options: ["On range gentiment la casserole. Et la personne.", "Silence pesant de trois générations.", "On en reparle encore à Noël. Tous les Noëls."]
            },
            {
                question: "Le pesto maison est-il une religion ou juste une sauce ?",
                options: ["Une religion, avec des rituels précis", "Les deux, et ça ne se discute pas", "Une sauce. Sacrée. Mais une sauce."]
            }
        ]
    },

    ocean: {
        progressKey: "quizOcean",
        next: "section-quiz-soeur",
        result: "Océane energy detected. Amitié validée à 100%. 🌊",
        questions: [
            {
                question: "Selon Océane, Mr Faby c’est…",
                options: ["Un oignon", "Un héros incompris", "Moi", "Toi"],
                correct: 0,
                positiveFeedback: "Bah oui c’est logique Marine wake up.",
                negativeFeedbacks: [
                    "Ah bah d’accord, tu t’en fous de moi ou quoi ?",
                    "J’en étais sûre. Tu préfères Antoine, bravo.",
                    "Tu veux ma mort dès la première question ou comment ça se passe ?"
                ]
            },
            {
                question: "Pour Océane, le One Piece c’est…",
                options: ["Un trésor légendaire", "Une cuisse de poulet (parce qu’elle est noire 👀)", "Une métaphore politique", "Un truc dont tu auras pas la ref donc tu vas choisir poulet"],
                correct: 1,
                positiveFeedback: "Ahh bah bravooo c’est raciste même si tu avais raison.",
                negativeFeedbacks: [
                    "Ah super, donc maintenant tu fais genre tu connais One Piece.",
                    "J’en étais sûre, tu m’écoutes pas quand je parle.",
                    "Tu veux ma mort, c’est confirmé."
                ]
            },
            {
                question: "La série préférée d’Océane, c’est…",
                options: ["South Park", "BoJack Horseman", "The Walking Dead", "Les Feux de l’amour en vrai de vrai"],
                correct: 0,
                positiveFeedback: "Tu veux ma mort si tu te trompes.",
                negativeFeedbacks: [
                    "Ah bah voilà, tu veux ma mort.",
                    "J’en étais sûre. Tu préfères Antoine.",
                    "Ah super, donc mon existence c’est une option maintenant."
                ]
            },
            {
                question: "Dans BoJack Horseman, Océane s’identifie le plus à…",
                options: ["Diane", "Todd", "Princess Carolyn", "BoJack"],
                correct: 0,
                positiveFeedback: "D’après TikTok quand tu penses être Diane c’est que t’es BoJack et ça c’est pas cool.",
                negativeFeedbacks: [
                    "Ah d’accord, donc tu me connais pas. Super.",
                    "J’en étais sûre, tu vas dire que je suis Todd maintenant.",
                    "Okay d'accord, Marine, Okay d'accord"
                ]
            },
            {
                question: "Texte à trou :\n\"Tu es pareil que moi, on dirait que je parle à mon miroir…\"",
                options: ["J’ai enfin un ami noir", "Tu racontes quoi mon reuf ?", "Comme dans Blanche-Neige", "Pas d’inspiration"],
                correct: 0,
                positiveFeedback: "Tout simplement La La Land en mieux.",
                negativeFeedbacks: [
                    "Ah super, donc tu t'en  souviens plus de notre idole.",
                    "J’en étais sûre, tu préfères Antoine tu m'oublie",
                    "Tu veux ma mort, mais en comédie musicale."
                ]
            }
        ]
    },

    soeur: {
        progressKey: "quizSoeur",
        next: "section-wheel", // dernier quiz → retour au hub (la roue décide de la fin)
        result: "Sœur radar activé. Rien ne lui échappe. 👀",
        questions: [
            {
                question: "Marine dit qu'elle n'est pas grognichon.",
                options: ["Elle juge en silence", "Elle rigole", "Elle expose la vérité", "Elle appelle Océane en renfort"]
            },
            {
                question: "Antoine fait une blague trop longue.",
                options: ["Elle juge en silence", "Elle rigole", "Elle expose la vérité", "Elle appelle Océane en renfort"]
            },
            {
                question: "Marine part vivre dans une cabane romantique.",
                options: ["Elle juge en silence", "Elle rigole", "Elle expose la vérité", "Elle appelle Océane en renfort"]
            },
            {
                question: "Marine regarde Antoine avec son air de jugement suprême.",
                options: ["Elle juge en silence", "Elle rigole", "Elle expose la vérité", "Elle appelle Océane en renfort"]
            }
        ]
    }

};

/* ------------------------------------------------------------------
   ÉTAPES DE PROGRESSION
   "fin" doit toujours être la dernière.
   +6 quêtes simulateur si path === "simulator" (calculé dynamiquement).
------------------------------------------------------------------ */
const BASE_STEPS = [
    "password",      // 1. Mot de passe trouvé
    "impossible",    // 2. Question impossible validée
    "wheel",         // 3. Roue tournée
    "quizPolitique", // 4. Quiz politique terminé
    "quizTWD",       // 5. Quiz Walking Dead terminé
    "quizItalie",    // 6. Test italien terminé
    "quizOcean",     // 7. Quiz Océane terminé
    "quizSoeur",     // 8. Quiz sœur terminé
    "fin"            // 9. Fin romantique
];

// Clé localStorage — changer ici si on veut repartir de zéro côté stockage
const STORAGE_KEY = "marine4mois";
