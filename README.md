# 🎁 Cadeau Marine — 4 mois ensemble

Un site interactif fait avec amour. Aucune dépendance externe, aucun build.

---

## 🚀 Lancement

Le projet utilise `fetch()` pour charger les fragments HTML, ce qui nécessite un **serveur local** (les navigateurs
bloquent les requêtes `file://`).

### Option 1 — VS Code (recommandée)

1. Installer l'extension **Live Server**
2. Clic droit sur `index.html` → **Open with Live Server**

### Option 2 — Terminal

```bash
# Python (disponible sur macOS/Linux par défaut)
python3 -m http.server 8080
# puis ouvrir http://localhost:8080

# Node.js
npx serve .
```

---

## 🔊 Fichier son (à déposer)

La musique de Kirikou n'est **pas incluse** dans le projet (fichier lourd).
Dépose ton mp3 ici :

```
sounds/KirikouSong.mp3
```

Le chemin est configurable dans `js/config.js` → `KIRIKOU_SOUND`.
Le son se joue automatiquement au déblocage de Kirikou dans le simulateur,
et s'arrête dès qu'on quitte la section.

---

## 🗺️ Parcours de l'expérience

La roue est désormais un **hub** : on y revient entre les mini-jeux.
Les **deux mini-jeux sont obligatoires** ; une fois les deux terminés,
la roue propose l'écran de fin.

```
🗝️  Mot de passe (énigme Attaque des Titans, aléatoire)      → jauge +10 %
 ↓
💌  Accueil
 ↓
💘  Question impossible (bouton "Non" qui s'enfuit)            → jauge +10 %
 ↓
🎡  Roue du destin amoureux (HUB)
 │
 ├── 🎮  Antoine & Marine Simulator                           → jauge +40 %
 │        6 quêtes + déblocage Kirikou (musique + thème Afrique)
 │        ↳ « Retour à la roue »
 │
 └── 🌹  Quiz (chaîne de 5 : politique → TWD → italie → océan → sœur)
          → jauge +40 % (réparti sur les 5 quiz)
          ↳ « Retour à la roue » sur chaque quiz
 ↓
🎡  Roue : les 2 mini-jeux faits → « Voir la fin »
 ↓
❤️  Fin romantique (jauge à 100 %)
```

---

## 📊 Jauge de progression (pondérée)

Répartition des 100 % (définie dans `js/config.js` → `GAUGE_WEIGHTS`,
calculée dans `js/state.js` → `State.gaugePercent()`) :

| Étape                | Poids | Remplissage                            |
|----------------------|-------|----------------------------------------|
| Mot de passe trouvé  | 10 %  | d'un coup                              |
| Clic sur « Oui »     | 10 %  | d'un coup                              |
| Simulateur           | 40 %  | progressif — 40 % × (quêtes faites / 6)|
| Quiz                 | 40 %  | progressif — 40 % × (quiz faits / 5)   |

La jauge grimpe donc **au fil de chaque mini-jeu**, pas seulement à la fin.
100 % → bannière de fin + écran romantique.

---

## 📁 Structure du projet

```
index.html                  ← Point d'entrée

css/
├── style.css               ← Composants & layout (variables uniquement, AUCUNE couleur en dur)
└── themes/                 ← 🎨 Un fichier CSS par thème (voir « Thèmes »)
    ├── rose-violet.css     ← Thème de BASE (:root) — mot de passe, accueil, roue, fin
    ├── simulator.css       ← Thème du mini-jeu Simulateur
    ├── quiz.css            ← Thème du mini-jeu Quiz
    └── africa.css          ← Thème Afrique (Simulateur, une fois Kirikou débloqué)

sections/                   ← Un fichier HTML par écran/groupe logique
├── lock.html               ← Mot de passe
├── home.html               ← Accueil
├── impossible.html         ← Question impossible
├── wheel.html              ← Roue du destin (hub : zone de spin + panneau « terminé »)
├── simulator.html          ← Antoine & Marine Simulator (+ bouton « Retour à la roue »)
├── quizzes.html            ← Les 5 quiz (+ bouton « Retour à la roue » sur chacun)
└── ending.html             ← Fin romantique

shared/
├── chrome.html             ← Éléments persistants (jauge, guide, toolbar, hearts)
└── head.html               ← Fragment <head> (référence documentaire)

js/
├── config.js               ← ⭐ TOUT le contenu modifiable (énigmes, quiz, quêtes, poids jauge…)
├── storage.js              ← localStorage centralisé
├── state.js                ← État global + calcul de la jauge pondérée
├── sound.js                ← 🔊 Sons (musique de Kirikou)
├── gauge.js                ← Jauge de progression
├── guide.js                ← Mini Anto-Man
├── navigation.js           ← goToSection() — applique aussi thème + son + hub roue
├── theme.js                ← 🎨 Thème contextuel (data-theme sur <body>)
├── password.js             ← Écran mot de passe
├── impossible.js           ← Bouton "Non" qui fuit
├── wheel.js                ← Roue du destin (hub des mini-jeux)
├── simulator.js            ← Quêtes + Love XP + Kirikou
├── quiz.js                 ← Moteur de quiz (questions libres OU à bonne réponse)
├── ending.js               ← Pluie de cœurs
└── app.js                  ← Bootstrap : charge les fragments, init les modules
```

---

## 🎨 Thèmes contextuels

Le thème change **automatiquement selon la section**, piloté par l'attribut
`data-theme` sur `<body>` (`js/theme.js`). Chaque thème est un fichier CSS
dédié sous `css/themes/` qui surcharge les variables de couleur.

| Section / état                     | `data-theme` | Fichier              |
|------------------------------------|--------------|----------------------|
| Mot de passe, accueil, roue, fin   | *(base)*     | `rose-violet.css`    |
| Mini-jeu Simulateur                | `simulator`  | `simulator.css`      |
| Mini-jeu Quiz                      | `quiz`       | `quiz.css`           |
| Simulateur **après** Kirikou       | `africa`     | `africa.css`         |

`css/style.css` ne contient **aucune couleur en dur** : tout passe par les
variables CSS, donc ajouter/modifier un thème ne touche jamais au layout.

### Créer un nouveau thème

1. Copier `css/themes/rose-violet.css` → `css/themes/mon-theme.css`
   et remplacer le sélecteur `:root` par `body[data-theme="mon-theme"]`.
2. Ajuster les variables (`--color-primary`, `--color-bg-start`, etc.).
3. Lier le fichier dans `index.html` (après les autres thèmes).
4. Mapper la section vers le thème dans `js/theme.js` → `_resolve()`.

---

## ✏️ Modifier le contenu

**Tout se passe dans `js/config.js`.**

### Énigmes du mot de passe

```js
// PASSWORD_RIDDLES — tableau d'objets { riddle, answer, hints }
// L'énigme est tirée au sort à chaque chargement.
```

### Messages du guide (Mini Anto-Man)

```js
const GUIDE_MESSAGES = { passwordSuccess: "…", noButtonFlee: "…", … };
```

### Quêtes du simulateur

```js
// 1. Ajouter dans SIMULATOR_QUESTS
{ key: "quest7", title: "Ma quête", guideMessage: "Réaction du guide." }
// 2. Ajouter le <li data-quest="quest7"> dans sections/simulator.html
```

### Questions de quiz — deux formats

**Format libre** (toutes les réponses passent à la suite) :

```js
{ question: "Ma question ?", options: ["A", "B", "C"] }
```

**Format « à bonne réponse »** (il faut trouver la bonne) — ajouter trois champs :

```js
{
  question: "Ma question ?",
  options: ["A", "B", "C"],
  correct: 1,                       // index de la bonne réponse (0 = 1ʳᵉ option)
  positiveFeedback: "Bravo !",      // ce que dit Mini Anto-Man si c'est juste
  negativeFeedbacks: [              // répliques en cas d'erreur (1ʳᵉ, 2ᵉ, …)
    "Raté, réessaie.",
    "Toujours pas…"
  ]
}
```

Comportement d'une question « à bonne réponse » :
- **bonne réponse** → le bouton devient vert, Mini Anto-Man dit le `positiveFeedback`,
  puis on passe à la question suivante ;
- **mauvaise réponse** → le bouton devient rouge et se désactive, Mini Anto-Man dit
  le `negativeFeedbacks` correspondant au numéro d'erreur, et on reste sur la question
  pour réessayer avec une autre option.

---

## 💾 Sauvegarde & réinitialisation

- Progression sauvegardée **automatiquement** (localStorage).
- Bouton **🔄 Recommencer** en haut à droite pour tout effacer.
- Navigation privée : fonctionne sans sauvegarde entre sessions.
