/* ====================================================================
   4 MOIS AVEC MARINE — script.js
   --------------------------------------------------------------------
   Sommaire :
     1. CONFIGURATION         → tout ce qui est facile à modifier
     2. ÉTAT DE L'APPLICATION
     3. RÉFÉRENCES DOM
     4. MINI ANTO-MAN (guide)
     5. NAVIGATION ENTRE SECTIONS
     6. JAUGE DE PROGRESSION (totale dynamique selon le chemin)
     7. ÉCRAN MOT DE PASSE
     8. ACCUEIL → QUESTION IMPOSSIBLE
     9. QUESTION IMPOSSIBLE (bouton "Non" qui fuit)
    10. ROUE DU DESTIN AMOUREUX
    11. ANTOINE & MARINE SIMULATOR (quêtes, Love XP, Kirikou)
    12. MOTEUR DE QUIZ GÉNÉRIQUE
    13. FIN ROMANTIQUE
    14. SAUVEGARDE / RÉINITIALISATION (localStorage)
    15. INITIALISATION
==================================================================== */


/* ====================================================================
   1. CONFIGURATION — modifie ici sans toucher au reste du code
==================================================================== */

/* Le mot de passe change à CHAQUE chargement de page : on tire au
   hasard une énigme dans cette liste, toutes sur le thème de
   l'Attaque des Titans (SNK). La comparaison reste insensible à la
   casse, donc "Eren", "EREN" et "eren" fonctionnent tous.

   Pour ajouter un personnage : ajoute un objet { riddle, answer, hints }
   avec exactement 5 indices (1 message "raté" générique + 3 indices
   progressifs + 1 indice final "commence par X"), même structure que
   les autres. */
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

// Tirage au sort d'une énigme pour CETTE page (change à chaque
// chargement / rechargement de la page, avant même le mot de passe).
const currentRiddle = PASSWORD_RIDDLES[Math.floor(Math.random() * PASSWORD_RIDDLES.length)];
const PASSWORD = currentRiddle.answer;
const PASSWORD_HINTS = currentRiddle.hints;

// Affiche l'énigme tirée au sort dans l'écran de mot de passe
// (les « » autour restent fixes dans le HTML, seul le texte change).
const riddleTextEl = document.getElementById("riddle-text");
if (riddleTextEl) riddleTextEl.textContent = currentRiddle.riddle;

// Messages de Mini Anto-Man pour les grands moments du site.
// "il commente : les erreurs, les réussites, les succès, les passages
// importants" — chaque clé correspond à un de ces moments.
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

// Message affiché dans une bannière quand la jauge atteint 100%.
const GAUGE_COMPLETE_MESSAGE = "VIVE MARINE, VIVE LES GROS NICHONS, VIVE NOUS.";

/* La roue : 6 secteurs de 60° alternant les deux destins possibles.
   Tu peux changer l'ordre ou le nombre de secteurs (garde un nombre
   pair pour que le dégradé CSS reste équilibré), le résultat reste
   toujours soit "simulator" soit "quiz". */
const WHEEL_SEGMENTS = ["simulator", "quiz", "simulator", "quiz", "simulator", "quiz"];

/* Les 6 quêtes du simulateur. Pour en ajouter / retirer une, ajoute ou
   supprime un objet ici ET le <li class="quest-item" data-quest="..."> 
   correspondant dans index.html (même clé "key"). */
const SIMULATOR_QUESTS = [
  {
    key: "quest1",
    title: "Préparer un repas ensemble",
    guideMessage: "La cuisine a survécu. C'est déjà une victoire."
  },
  {
    key: "quest2",
    title: "Regarder une série ensemble",
    guideMessage: "Spoiler évité de 0,3 seconde. Record battu."
  },
  {
    key: "quest3",
    title: "Jouer aux jeux vidéo",
    guideMessage: "Antoine a perdu. Marine le savait déjà."
  },
  {
    key: "quest4",
    title: "Se chamailler pour rien",
    guideMessage: "Dispute résolue en un temps record. Champions."
  },
  {
    key: "quest5",
    title: "Faire rire Marine",
    guideMessage: "Rire authentique détecté. Mission critique réussie."
  },
  {
    key: "quest6",
    title: "Câlin sous plaid",
    guideMessage: "Niveau cocooning : maximum atteint."
  }
];
const SIMULATOR_QUEST_KEYS = SIMULATOR_QUESTS.map((q) => q.key);

/* Répliques aléatoires de Marine — le running gag du site. À chaque
   quête terminée, Marine a MARINE_COMMENT_CHANCE de chances de
   placer une de ces phrases. */
const MARINE_LINES = [
  "Vive les gros nichons.",
  "Je maintiens ma position : vive les gros nichons.",
  "Je refuse d'élaborer davantage.",
  "…",
  "Vive les gros nichons."
];
const MARINE_COMMENT_CHANCE = 0.4; // 40%

/* Le petit dialogue affiché ligne par ligne au déblocage de Kirikou. */
const KIRIKOU_DIALOGUE = [
  { who: "Kirikou", text: "Kirikou est petit mais il est vaillant !" },
  { who: "Marine", text: "Vive les gros nichons." },
  { who: "Mini Anto-Man", text: "Cette conversation a pris une direction inattendue." }
];

/* Les 5 quiz. Chaque question a plusieurs réponses possibles : toutes
   sont "valides" (c'est pour le fun, pas un vrai test !). À la fin,
   un message de résultat fixe s'affiche, puis on enchaîne sur la
   section suivante.

   Pour ajouter / retirer une question : ajoute ou supprime un objet
   { question: "...", options: ["...", "...", "..."] } dans le
   tableau "questions" correspondant. Tu peux mettre 2, 3, 4 options
   ou plus, ça s'adapte automatiquement. */
const QUIZZES = {

  politique: {
    progressKey: "quizPolitique",
    next: "section-quiz-twd",
    result: "Compatibilité : 100%. La gauche du cœur est largement majoritaire. 🌹",
    questions: [
      {
        question: "Quelqu'un te dit : 'Franchement, Patrick Bruel, en vrai, il est gentil.",
        options: [
          "Je hausse un sourcil à -40°C",
          "Je sors mon meilleur regard noir",
          "Je change de sujet et je parle de toi"
        ]
      },
      {
        question: "Le mot préférée de Marine est :",
        options: [
          "Et moi je suis Spider-Man.",
          "Bien sûr",
          "Je vais t'enculer"
        ]
      },
      {
        question: "J'ai un truc à te raconter, marine fera :",
        options: [
          "répond immédiatement.",
          "met son plaid.",
          "adore les Gossips",
          "les trois"
        ]
      },
      {
        question: "Face à l'injustice, tu préfères : manif, débat, ou regard noir ultra efficace ?",
        options: [
          "Manif, pancarte faite main",
          "Débat, mais qui dérape vite",
          "Le regard noir, ça règle 90% des cas"
        ]
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
        options: [
          "La stratège qui a déjà un plan B, C et D",
          "Celle qui sauve le chat avant tout le reste",
          "La leader"
        ]
      },
      {
        question: "Qui survivrait le plus longtemps entre Antoine et Marine ?",
        options: [
          "Marine, sans hésitation",
          "Antoine, juste pour râler plus longtemps",
          "Aucun des deux, trop occupés à se chamailler"
        ]
      },
      {
        question: "Si Daryl entre dans la pièce, Marine fait quoi ?",
        options: [
          "Elle reste très calme. Très. Calme.",
          "Elle regarde Antoine. Antoine regarde ailleurs.",
          "L'amour. L'amour est la seule réponse possible"
        ]
      },
      {
        question: "Si un Daryl arrive pendant un câlin, quelle est la priorité ?",
        options: [
          "Finir le câlin, Daryl attendra",
          "Coucou daryl",
          "On négocie. Tout se négocie."
        ]
      }
    ]
  },

  italie: {
    progressKey: "quizItalie",
    next: "section-quiz-ocean",
    result: "Marine est italienne à 50%. Les 50% restants sont probablement pareil. 🍝",
    questions: [
      {
        question: "La vraie carbonara contient-elle de la crème ?",
        options: [
          "Non. Jamais. C'est un crime.",
          "Un peu, pour la texture… (Marine, NON.)",
          "Crème ? Quelle crème ?"
        ]
      },
      {
        question: "Quel est le niveau acceptable de drama dans une famille italienne ?",
        options: [
          "Modéré. Juste assez pour un bon repas.",
          "Illimité. C'est une fonctionnalité, pas un bug.",
          "Drama ? On appelle ça de la passion."
        ]
      },
      {
        question: "Si quelqu'un casse les spaghetti avant cuisson, que faire ?",
        options: [
          "On range gentiment la casserole. Et la personne.",
          "Silence pesant de trois générations.",
          "On en reparle encore à Noël. Tous les Noëls."
        ]
      },
      {
        question: "Le pesto maison est-il une religion ou juste une sauce ?",
        options: [
          "Une religion, avec des rituels précis",
          "Les deux, et ça ne se discute pas",
          "Une sauce. Sacrée. Mais une sauce."
        ]
      }
    ]
  },

  ocean: {
    progressKey: "quizOcean",
    next: "section-quiz-soeur",
    result: "Océane energy detected. Amitié validée à 100%. 🌊",
    questions: [
      {
        question: "Océane validerait-elle Antoine ?",
        options: [
          "Oui, mais avec un débrief complet avant",
          "Oui, après l'avoir un peu testé quand même",
          "Oui, en mode « enfin, il était temps »"
        ]
      },
      {
        question: "Océane réagirait comment si Marine faisait n'importe quoi ?",
        options: [
          "Elle filme. Pour les preuves.",
          "Elle rigole d'abord, elle gère après",
          "Elle dit « évidemment » et elle continue son thé"
        ]
      },
      {
        question: "Quelle phrase Océane pourrait dire dans cette situation ?",
        options: [
          "Bon, raconte-moi TOUT depuis le début",
          "Je le savais avant toi, en fait",
          "T'façon je valide, next question"
        ]
      },
      {
        question: "Si Marine panique, Océane fait quoi ?",
        options: [
          "Elle panique deux fois plus fort, par solidarité",
          "Elle reste calme et prend les choses en main",
          "Elle envoie un mémo vocal de 14 minutes"
        ]
      }
    ]
  },

  soeur: {
    progressKey: "quizSoeur",
    next: "section-fin",
    result: "Sœur radar activé. Rien ne lui échappe. 👀",
    questions: [
      {
        question: "Marine parle de caca.",
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

/* Étapes "de base", toujours comptées dans la jauge, dans l'ordre du
   parcours. "fin" est toujours la dernière. */
const BASE_STEPS = [
  "password",      // 1. Mot de passe trouvé
  "impossible",     // 2. Question impossible validée
  "wheel",          // 3. Roue tournée
  "quizPolitique",  // 4. Quiz politique terminé
  "quizTWD",        // 5. Quiz Walking Dead terminé
  "quizItalie",     // 6. Test italien terminé
  "quizOcean",      // 7. Quiz Océane terminé
  "quizSoeur",      // 8. Quiz sœur terminé
  "fin"             // 9. Fin romantique
];

// Clé utilisée pour sauvegarder la progression dans localStorage.
const STORAGE_KEY = "marine4mois";


/* ====================================================================
   2. ÉTAT DE L'APPLICATION
==================================================================== */
const state = {
  unlocked: false,
  currentSection: "lock-screen",
  hintIndex: 0,
  path: null, // "simulator" | "quiz" | null tant que la roue n'a pas tourné
  progress: {}
};
BASE_STEPS.forEach((key) => { state.progress[key] = false; });
SIMULATOR_QUEST_KEYS.forEach((key) => { state.progress[key] = false; });

// État interne de chaque quiz : { index: numéro de question en cours }
const quizState = {};

let guideHideTimeout = null;
let marineBubbleTimeout = null;
let lastFleeMessageTime = 0;
let gaugeCompleteShown = false;
let spinCount = 0;
let simulatorSeen = false;
let wheelRotation = 0;
let kirikouUnlocked = false;


/* ====================================================================
   3. RÉFÉRENCES DOM
==================================================================== */
const lockForm = document.getElementById("lock-form");
const passwordInput = document.getElementById("password-input");
const lockFeedback = document.getElementById("lock-feedback");
const mainContent = document.getElementById("main-content");

const guideWrapper = document.getElementById("guide-wrapper");
const guideBubble = document.getElementById("guide-bubble");
const toggleGuideBtn = document.getElementById("toggle-guide-btn");
const resetBtn = document.getElementById("reset-btn");

const gaugeFill = document.getElementById("gauge-fill");
const gaugeLabel = document.getElementById("gauge-label");
const progressGauge = document.getElementById("progress-gauge");

const startBtn = document.getElementById("start-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const impossibleFeedback = document.getElementById("impossible-feedback");

const wheelEl = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const wheelResultEl = document.getElementById("wheel-result");
const wheelContinueBtn = document.getElementById("wheel-continue-btn");

const marineBubble = document.getElementById("marine-bubble");
const kirikouAvatar = document.getElementById("kirikou-avatar");
const kirikouRole = document.getElementById("kirikou-role");
const loveXpValue = document.getElementById("love-xp-value");
const loveXpFill = document.getElementById("love-xp-fill");
const kirikouUnlockEl = document.getElementById("kirikou-unlock");
const dialogueList = document.getElementById("dialogue-list");
const simulatorContinueBtn = document.getElementById("simulator-continue-btn");

const finSimulatorMention = document.getElementById("fin-simulator-mention");

const finalBtn = document.getElementById("final-btn");
const finalMessage = document.getElementById("final-message");

const heartsContainer = document.getElementById("hearts-container");


/* ====================================================================
   4. MINI ANTO-MAN — bulle de dialogue
   showGuideMessage(texte) : affiche un message dans la bulle pendant
   quelques secondes. Peut être appelée depuis n'importe où.
==================================================================== */
function showGuideMessage(text, duration = 4500) {
  guideBubble.textContent = text;
  guideBubble.classList.add("visible");

  clearTimeout(guideHideTimeout);
  guideHideTimeout = setTimeout(() => {
    guideBubble.classList.remove("visible");
  }, duration);
}

function toggleGuide() {
  const hidden = guideWrapper.classList.toggle("guide-hidden");
  toggleGuideBtn.textContent = hidden
    ? "Afficher Mini Anto-Man"
    : "Masquer Mini Anto-Man";
}

toggleGuideBtn.addEventListener("click", toggleGuide);


/* ====================================================================
   5. NAVIGATION ENTRE SECTIONS
==================================================================== */
function goToSection(sectionId) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));

  const target = document.getElementById(sectionId);
  if (!target) return;

  target.classList.add("active");
  state.currentSection = sectionId;

  // Si on entre dans une section quiz, on (re)lance le quiz à zéro.
  const quizKey = target.dataset.quiz;
  if (quizKey) {
    quizState[quizKey] = { index: 0 };
    renderQuiz(quizKey);
  }

  // La mention "au simulateur" dans le message final ne s'affiche que
  // si Marine est effectivement passée par le Simulator.
  if (sectionId === "section-fin" && finSimulatorMention) {
    finSimulatorMention.style.display = (state.path === "simulator") ? "" : "none";
  }

  // Focus sur le titre, pour les lecteurs d'écran et le clavier.
  const heading = target.querySelector("h1");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus();
  }

  saveProgress();
}


/* ====================================================================
   6. JAUGE DE PROGRESSION
   Le total dépend du chemin choisi par la roue : 9 étapes de base,
   +6 si Marine passe par le Simulator. Tant que la roue n'a pas
   tourné (path === null), on compte sur la base de 9.
==================================================================== */
function currentTotalSteps() {
  return BASE_STEPS.length + (state.path === "simulator" ? SIMULATOR_QUEST_KEYS.length : 0);
}

function updateProgress(stepKey) {
  if (state.progress[stepKey]) return; // déjà comptée
  state.progress[stepKey] = true;
  refreshGauge();
  saveProgress();
}

function refreshGauge() {
  const total = currentTotalSteps();

  let done = 0;
  BASE_STEPS.forEach((key) => { if (state.progress[key]) done++; });
  if (state.path === "simulator") {
    SIMULATOR_QUEST_KEYS.forEach((key) => { if (state.progress[key]) done++; });
  }

  const percent = Math.round((done / total) * 100);

  gaugeFill.style.height = percent + "%";
  gaugeLabel.textContent = percent + "%";
  progressGauge.setAttribute("aria-valuenow", String(percent));

  if (percent >= 100 && !gaugeCompleteShown) {
    gaugeCompleteShown = true;
    showFinalBanner();
  }
}

function showFinalBanner() {
  const banner = document.createElement("div");
  banner.className = "final-banner";
  banner.setAttribute("role", "status");
  banner.textContent = GAUGE_COMPLETE_MESSAGE;
  document.body.appendChild(banner);

  // Petit délai pour laisser le temps au navigateur d'appliquer
  // l'état initial avant de déclencher la transition CSS.
  requestAnimationFrame(() => banner.classList.add("visible"));

  setTimeout(() => {
    banner.classList.remove("visible");
    setTimeout(() => banner.remove(), 600);
  }, 4500);
}


/* ====================================================================
   7. ÉCRAN MOT DE PASSE
==================================================================== */
lockForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = passwordInput.value.trim().toLowerCase();

  if (value === PASSWORD) {
    lockFeedback.textContent = "Accès validé. Le conseil des amoureux approuve.";
    lockFeedback.classList.add("success");
    passwordInput.disabled = true;
    lockForm.querySelector("button").disabled = true;

    state.unlocked = true;
    updateProgress("password");
    showGuideMessage(GUIDE_MESSAGES.passwordSuccess);
    saveProgress();

    // Petite pause avant d'ouvrir le site, façon "accès en cours".
    setTimeout(() => {
      mainContent.classList.remove("hidden");
      goToSection("section-home");
    }, 1500);

  } else {
    const hint = PASSWORD_HINTS[Math.min(state.hintIndex, PASSWORD_HINTS.length - 1)];
    showGuideMessage(hint);

    lockFeedback.textContent = "Pas tout à fait... un indice vient d'apparaître 👀";
    lockFeedback.classList.remove("success");

    state.hintIndex++;
    passwordInput.value = "";
    passwordInput.focus();
    saveProgress();
  }
});


/* ====================================================================
   8. ACCUEIL → QUESTION IMPOSSIBLE
==================================================================== */
startBtn.addEventListener("click", () => {
  goToSection("section-impossible");
});


/* ====================================================================
   9. QUESTION IMPOSSIBLE — le bouton "Non" qui fuit
==================================================================== */
function fleeNoButton() {
  const margin = 16;
  const width = noBtn.offsetWidth || 100;
  const height = noBtn.offsetHeight || 50;

  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);

  const x = margin + Math.random() * (maxX - margin);
  const y = margin + Math.random() * (maxY - margin);

  noBtn.style.position = "fixed";
  noBtn.style.margin = "0";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  // On ne spamme pas la bulle si la souris repasse plusieurs fois
  // très vite sur le bouton.
  const now = Date.now();
  if (now - lastFleeMessageTime > 2000) {
    showGuideMessage(GUIDE_MESSAGES.noButtonFlee);
    lastFleeMessageTime = now;
  }
}

// Le bouton fuit qu'on essaie de le survoler, le toucher, le focus
// au clavier, ou de cliquer dessus : impossible de "réussir" un Non.
["mouseenter", "focus", "click"].forEach((evt) => {
  noBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    fleeNoButton();
  });
});

noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  fleeNoButton();
}, { passive: false });

noBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fleeNoButton();
  }
});

// Si la fenêtre est redimensionnée (ex: rotation du téléphone) alors
// que le bouton fuit déjà, on le garde dans les limites de l'écran.
window.addEventListener("resize", () => {
  if (noBtn.style.position !== "fixed") return;
  const margin = 16;
  const maxX = Math.max(margin, window.innerWidth - noBtn.offsetWidth - margin);
  const maxY = Math.max(margin, window.innerHeight - noBtn.offsetHeight - margin);
  const currentX = parseFloat(noBtn.style.left) || 0;
  const currentY = parseFloat(noBtn.style.top) || 0;
  noBtn.style.left = Math.min(currentX, maxX) + "px";
  noBtn.style.top = Math.min(currentY, maxY) + "px";
});

yesBtn.addEventListener("click", () => {
  impossibleFeedback.textContent = "Bon choix. Le destin, la République et moi-même validons.";
  updateProgress("impossible");
  showGuideMessage(GUIDE_MESSAGES.yesChoice);
  setTimeout(() => goToSection("section-wheel"), 1700);
});


/* ====================================================================
   10. ROUE DU DESTIN AMOUREUX
   Une roue à 6 secteurs (3 "simulator" / 3 "quiz" en alternance).
   Au clic, on choisit un secteur (au hasard, ou imposé par la
   "garantie" ci-dessous), on calcule la rotation nécessaire pour
   l'amener sous le pointeur, on ajoute plusieurs tours complets pour
   l'effet, puis on révèle le résultat.

   GARANTIE : si le 1er tirage tombe sur "quiz", relancer la roue
   (bouton "🎲 Relancer la roue") tombera forcément sur "simulator" la
   2e fois. Au-delà, les tirages redeviennent 100% aléatoires. Marine
   peut donc relancer autant qu'elle veut, mais voit le Simulator au
   plus tard au 2e essai si elle utilise cette option.
==================================================================== */
function pickWheelResult() {
  if (spinCount >= 2 && !simulatorSeen) {
    return "simulator";
  }
  const idx = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
  return WHEEL_SEGMENTS[idx];
}

function pickTargetIndex(result) {
  const matches = [];
  WHEEL_SEGMENTS.forEach((seg, i) => { if (seg === result) matches.push(i); });
  return matches[Math.floor(Math.random() * matches.length)];
}

function performSpin() {
  if (spinBtn.disabled) return; // un tour est déjà en cours

  spinBtn.disabled = true;
  wheelResultEl.textContent = "";
  wheelContinueBtn.classList.add("hidden");
  showGuideMessage(spinCount === 0 ? GUIDE_MESSAGES.wheelSpin : GUIDE_MESSAGES.wheelRespin);

  spinCount++;
  const result = pickWheelResult();
  if (result === "simulator") simulatorSeen = true;

  const targetIndex = pickTargetIndex(result);
  const segCount = WHEEL_SEGMENTS.length;
  const segAngle = 360 / segCount;

  // Le pointeur est fixe en haut (0°). Le secteur i couvre
  // [i*segAngle, (i+1)*segAngle[, son centre est à i*segAngle + segAngle/2.
  // Pour amener ce centre sous le pointeur, il faut tourner de
  // (360 - centre), plus un petit écart aléatoire dans le secteur,
  // plus plusieurs tours complets pour l'effet visuel.
  const segmentCenter = targetIndex * segAngle + segAngle / 2;
  const jitter = (Math.random() * segAngle * 0.6) - (segAngle * 0.3); // reste dans le secteur
  const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 à 7 tours

  wheelRotation += extraSpins * 360 + (360 - segmentCenter) + jitter;
  wheelEl.style.transform = "rotate(" + wheelRotation + "deg)";

  // La transition CSS dure 4s : on révèle le résultat juste après.
  setTimeout(() => {
    revealWheelResult(result);
  }, 4300);
}

spinBtn.addEventListener("click", performSpin);

function revealWheelResult(result) {
  state.path = result; // "simulator" ou "quiz"
  updateProgress("wheel");
  showGuideMessage(GUIDE_MESSAGES.wheelResult);

  const label = (result === "simulator") ? "Antoine & Marine Simulator" : "Quiz Direct";
  wheelResultEl.textContent = "🎉 La roue s'arrête sur : " + label + " !";
  wheelContinueBtn.classList.remove("hidden");

  // Le bouton de tirage devient un bouton de relance, toujours
  // disponible (cf. garantie ci-dessus).
  spinBtn.disabled = false;
  spinBtn.textContent = "🎲 Relancer la roue";
  spinBtn.classList.remove("btn-primary");
  spinBtn.classList.add("btn-secondary");

  saveProgress();
}

// Repositionne instantanément la roue sur son dernier résultat connu,
// sans animation (utilisé quand on recharge la page après un tirage).
function showWheelResultInstant() {
  spinBtn.disabled = false;
  spinBtn.textContent = "🎲 Relancer la roue";
  spinBtn.classList.remove("btn-primary");
  spinBtn.classList.add("btn-secondary");

  const segCount = WHEEL_SEGMENTS.length;
  const segAngle = 360 / segCount;
  const idx = WHEEL_SEGMENTS.indexOf(state.path);
  const segmentCenter = idx >= 0 ? (idx * segAngle + segAngle / 2) : 0;
  const rot = 360 - segmentCenter;

  wheelEl.style.transition = "none";
  wheelEl.style.transform = "rotate(" + rot + "deg)";
  wheelRotation = rot;

  // On réactive la transition juste après, au cas où elle relance.
  requestAnimationFrame(() => {
    wheelEl.style.transition = "";
  });

  const label = (state.path === "simulator") ? "Antoine & Marine Simulator" : "Quiz Direct";
  wheelResultEl.textContent = "🎉 La roue s'arrête sur : " + label + " !";
  wheelContinueBtn.classList.remove("hidden");
}

wheelContinueBtn.addEventListener("click", () => {
  if (state.path === "simulator") {
    showGuideMessage(GUIDE_MESSAGES.simulatorIntro);
    goToSection("section-simulator");
  } else {
    showGuideMessage(GUIDE_MESSAGES.quizExpress);
    goToSection("section-quiz-politique");
  }
});


/* ====================================================================
   11. ANTOINE & MARINE SIMULATOR
   Quêtes → Love XP → déblocage de Kirikou + badge. Cette section
   n'est visitée que si la roue est tombée sur "simulator".
==================================================================== */

// Petites paillettes qui s'envolent depuis un élément, pour
// "déclenche une animation" à chaque quête terminée.
function launchSparkles(targetEl) {
  const rect = targetEl.getBoundingClientRect();
  const emojis = ["💖", "✨", "⭐", "💫"];
  const count = 8;

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "sparkle";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = (rect.left + rect.width / 2) + "px";
    span.style.top = (rect.top + rect.height / 2) + "px";
    span.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    span.style.setProperty("--dy", (-60 - Math.random() * 100) + "px");
    span.style.animationDuration = (0.8 + Math.random() * 0.6) + "s";

    span.addEventListener("animationend", () => span.remove());
    document.body.appendChild(span);
  }
}

// Marine commente parfois, au hasard — le running gag du site.
function maybeMarineComment() {
  if (Math.random() > MARINE_COMMENT_CHANCE) return;

  const line = MARINE_LINES[Math.floor(Math.random() * MARINE_LINES.length)];
  marineBubble.textContent = line;
  marineBubble.classList.add("visible");

  clearTimeout(marineBubbleTimeout);
  marineBubbleTimeout = setTimeout(() => {
    marineBubble.classList.remove("visible");
  }, 4000);
}

// Met à jour le compteur et la barre Love XP en fonction des quêtes
// terminées. Retourne le nombre de quêtes faites.
function updateLoveXP() {
  const done = SIMULATOR_QUEST_KEYS.filter((key) => state.progress[key]).length;
  loveXpValue.textContent = String(done);
  const percent = Math.round((done / SIMULATOR_QUEST_KEYS.length) * 100);
  loveXpFill.style.width = percent + "%";
  return done;
}

// Marque visuellement une quête comme terminée (bouton désactivé,
// libellé changé, style "done").
function setQuestDone(key) {
  const item = document.querySelector('.quest-item[data-quest="' + key + '"]');
  if (!item) return;
  item.classList.add("done");
  const btn = item.querySelector(".quest-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "✓ Fait";
  }
}

function completeQuest(key) {
  if (state.progress[key]) return; // déjà faite

  const quest = SIMULATOR_QUESTS.find((q) => q.key === key);
  const item = document.querySelector('.quest-item[data-quest="' + key + '"]');

  setQuestDone(key);
  updateProgress(key); // remplit aussi la jauge globale
  const done = updateLoveXP();

  if (item) launchSparkles(item);
  if (quest) showGuideMessage(quest.guideMessage);
  maybeMarineComment();

  if (done === SIMULATOR_QUEST_KEYS.length) {
    setTimeout(unlockKirikou, 900);
  }
}

document.querySelectorAll(".quest-item").forEach((item) => {
  const key = item.dataset.quest;
  const btn = item.querySelector(".quest-btn");
  if (btn) {
    btn.addEventListener("click", () => completeQuest(key));
  }
});

// Construit la liste de dialogue (Kirikou / Marine / Mini Anto-Man),
// avec ou sans animation d'apparition ligne par ligne.
function buildDialogue(animated) {
  dialogueList.innerHTML = "";

  KIRIKOU_DIALOGUE.forEach((line, i) => {
    const render = () => {
      const li = document.createElement("li");
      li.className = "dialogue-line";
      const strong = document.createElement("strong");
      strong.textContent = line.who + " : ";
      li.appendChild(strong);
      li.appendChild(document.createTextNode(line.text));
      dialogueList.appendChild(li);

      if (animated && i === KIRIKOU_DIALOGUE.length - 1) {
        setTimeout(() => showGuideMessage(GUIDE_MESSAGES.kirikouReaction), 900);
      }
    };

    if (animated) {
      setTimeout(render, i * 1100);
    } else {
      render();
      // En restauration (sans animation), on retire l'animation
      // d'apparition pour que tout soit visible immédiatement.
      const last = dialogueList.lastElementChild;
      if (last) {
        last.style.animation = "none";
        last.style.opacity = "1";
        last.style.transform = "none";
      }
    }
  });
}

// Déclenché quand la 6ᵉ quête est terminée : révèle Kirikou, le petit
// dialogue, et le badge "Famille du chaos tendre".
function unlockKirikou() {
  if (kirikouUnlocked) return;
  kirikouUnlocked = true;

  kirikouAvatar.classList.remove("locked");
  kirikouAvatar.classList.add("unlocked");
  kirikouAvatar.textContent = "🌟";
  kirikouRole.textContent = "Petit mais vaillant";

  showGuideMessage(GUIDE_MESSAGES.allQuestsDone);

  kirikouUnlockEl.classList.remove("hidden");
  buildDialogue(true);

  simulatorContinueBtn.classList.remove("hidden");
  saveProgress();
}

// Remet l'écran du simulateur dans l'état correspondant à la
// progression sauvegardée (utilisé au rechargement de la page).
function restoreSimulatorUI() {
  SIMULATOR_QUEST_KEYS.forEach((key) => {
    if (state.progress[key]) setQuestDone(key);
  });
  updateLoveXP();

  if (kirikouUnlocked) {
    kirikouAvatar.classList.remove("locked");
    kirikouAvatar.classList.add("unlocked");
    kirikouAvatar.textContent = "🌟";
    kirikouRole.textContent = "Petit mais vaillant";

    buildDialogue(false);

    kirikouUnlockEl.classList.remove("hidden");
    simulatorContinueBtn.classList.remove("hidden");
  }
}

simulatorContinueBtn.addEventListener("click", () => {
  goToSection("section-quiz-politique");
});


/* ====================================================================
   12. MOTEUR DE QUIZ GÉNÉRIQUE
   Affiche la question quizState[key].index du quiz `key`, ou le
   résultat si toutes les questions sont passées.
==================================================================== */
function renderQuiz(key) {
  const quiz = QUIZZES[key];
  const container = document.getElementById("quiz-container-" + key);
  if (!quiz || !container) return;

  const index = quizState[key].index;

  if (index >= quiz.questions.length) {
    renderQuizResult(key, container, quiz);
    return;
  }

  const q = quiz.questions[index];
  container.innerHTML = "";

  const progress = document.createElement("p");
  progress.className = "quiz-progress";
  progress.textContent = "Question " + (index + 1) + " / " + quiz.questions.length;

  const question = document.createElement("h3");
  question.className = "quiz-question";
  question.textContent = q.question;
  question.setAttribute("tabindex", "-1");

  const optionsWrapper = document.createElement("div");
  optionsWrapper.className = "quiz-options";
  optionsWrapper.setAttribute("role", "group");
  optionsWrapper.setAttribute("aria-label", "Choix de réponse");

  q.options.forEach((optionText) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => {
      quizState[key].index++;
      renderQuiz(key);
    });
    optionsWrapper.appendChild(btn);
  });

  container.appendChild(progress);
  container.appendChild(question);
  container.appendChild(optionsWrapper);

  question.focus();
}

function renderQuizResult(key, container, quiz) {
  container.innerHTML = "";

  const resultText = document.createElement("p");
  resultText.className = "quiz-result-text";
  resultText.textContent = quiz.result;
  resultText.setAttribute("tabindex", "-1");

  const continueBtn = document.createElement("button");
  continueBtn.type = "button";
  continueBtn.className = "btn btn-primary";
  continueBtn.textContent = "Continuer";
  continueBtn.addEventListener("click", () => goToSection(quiz.next));

  container.appendChild(resultText);
  container.appendChild(continueBtn);

  updateProgress(quiz.progressKey);
  showGuideMessage(GUIDE_MESSAGES.quizDone);

  resultText.focus();
}


/* ====================================================================
   13. FIN ROMANTIQUE
==================================================================== */
finalBtn.addEventListener("click", () => {
  launchHearts();
  updateProgress("fin");
  finalMessage.textContent = "Moi aussi. Évidemment.";
  showGuideMessage(GUIDE_MESSAGES.theEnd);
  finalBtn.disabled = true;
});

function launchHearts() {
  const total = 28;
  for (let i = 0; i < total; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "❤️";
    heart.style.left = (Math.random() * 100) + "vw";
    heart.style.fontSize = (1 + Math.random() * 1.6) + "rem";
    heart.style.animationDuration = (3 + Math.random() * 3) + "s";
    heart.style.animationDelay = (Math.random() * 1.2) + "s";

    heart.addEventListener("animationend", () => heart.remove());
    heartsContainer.appendChild(heart);
  }
}


/* ====================================================================
   14. SAUVEGARDE / RÉINITIALISATION (localStorage)
   La progression est sauvegardée automatiquement : mot de passe,
   chemin choisi par la roue, quêtes, quiz, etc. Si Marine recharge la
   page, elle retombe sur la dernière section visitée, avec la jauge,
   la roue et le simulateur déjà dans le bon état. Le bouton
   "Recommencer" efface tout.
==================================================================== */
function saveProgress() {
  const data = {
    unlocked: state.unlocked,
    currentSection: state.currentSection,
    path: state.path,
    spinCount: spinCount,
    simulatorSeen: simulatorSeen,
    kirikouUnlocked: kirikouUnlocked,
    progress: state.progress
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage indisponible (navigation privée stricte, etc.) :
    // pas grave, l'expérience continue, juste sans sauvegarde.
  }
}

function loadProgress() {
  let saved;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return;
  }
  if (!saved) return;

  try {
    const data = JSON.parse(saved);

    if (data.progress && typeof data.progress === "object") {
      Object.keys(state.progress).forEach((key) => {
        if (typeof data.progress[key] === "boolean") {
          state.progress[key] = data.progress[key];
        }
      });
    }
    // Note : hintIndex n'est plus restauré — chaque chargement de page
    // tire une nouvelle énigme (voir PASSWORD_RIDDLES), donc on repart
    // d'indices frais (state.hintIndex reste à 0, sa valeur initiale).
    state.path = data.path || null;
    spinCount = data.spinCount || 0;
    simulatorSeen = !!data.simulatorSeen;
    kirikouUnlocked = !!data.kirikouUnlocked;

    if (data.unlocked) {
      state.unlocked = true;
      mainContent.classList.remove("hidden");

      const target = (data.currentSection && data.currentSection !== "lock-screen")
        ? data.currentSection
        : "section-home";

      // Restaure l'état visuel de la roue / du simulateur si besoin,
      // AVANT d'afficher la section (goToSection s'occupe du reste).
      if (target === "section-wheel" && state.progress.wheel) {
        showWheelResultInstant();
      }
      if (target === "section-simulator") {
        restoreSimulatorUI();
      }

      goToSection(target);
    }

    refreshGauge();
  } catch (e) {
    // Données corrompues : on ignore simplement et on repart de zéro.
  }
}

resetBtn.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Tout remettre à zéro ? Il faudra retrouver le mot de passe secret."
  );
  if (!confirmed) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // rien à faire
  }
  location.reload();
});


/* ====================================================================
   15. INITIALISATION
==================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
});
