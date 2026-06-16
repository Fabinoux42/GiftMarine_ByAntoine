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

### Option 3 — Tout-en-un sans serveur

> Pour offrir le cadeau sans contrainte technique, utilise la version
> **`standalone/index.html`** (générée séparément, tout inline).
> Double-clic → ça marche directement.

---

## 🗺️ Parcours de l'expérience

```
🗝️  Mot de passe (énigme Attaque des Titans, aléatoire)
 ↓
💌  Accueil
 ↓
💘  Question impossible (bouton "Non" qui s'enfuit)
 ↓
🎡  Roue du destin amoureux
 ├── 🎮  Simulator (6 quêtes + déblocage Kirikou)
 │    └──→ 🌹 Quiz politique
 └──→ 🌹  Quiz politique (chemin direct)
           ↓
          🧟  Walking Dead
           ↓
          🍝  Test Italiano
           ↓
          🌊  Quiz Océane
           ↓
          👀  Quiz Sœur
           ↓
          ❤️  Fin romantique
```

---

## 📁 Structure du projet

```
index.html                  ← Point d'entrée (60 lignes)

css/
├── style.css               ← Composants & layout (variables uniquement, pas de couleurs)
└── themes/
    └── rose-violet.css     ← 🎨 Thème actif — changer ici pour recolorer tout le site

sections/                   ← Un fichier HTML par écran/groupe logique
├── lock.html               ← Mot de passe
├── home.html               ← Accueil
├── impossible.html         ← Question impossible
├── wheel.html              ← Roue du destin
├── simulator.html          ← Antoine & Marine Simulator
├── quizzes.html            ← Les 5 quiz (politique, TWD, italie, ocean, soeur)
└── ending.html             ← Fin romantique

shared/
├── chrome.html             ← Éléments persistants (jauge, guide, toolbar, hearts)
└── head.html               ← Fragment <head> (référence documentaire)

js/
├── config.js               ← ⭐ TOUT le contenu modifiable (énigmes, quiz, quêtes…)
├── storage.js              ← localStorage centralisé
├── state.js                ← État global
├── gauge.js                ← Jauge de progression
├── guide.js                ← Mini Anto-Man
├── navigation.js           ← goToSection()
├── password.js             ← Écran mot de passe
├── impossible.js           ← Bouton "Non" qui fuit
├── wheel.js                ← Roue du destin
├── simulator.js            ← Quêtes + Love XP + Kirikou
├── quiz.js                 ← Moteur de quiz générique
├── ending.js               ← Pluie de cœurs
└── app.js                  ← Bootstrap : charge les fragments, init les modules
```

---

## 🎨 Changer le thème

1. Copier `css/themes/rose-violet.css` → `css/themes/mon-theme.css`
2. Modifier les variables CSS (`--color-primary`, `--color-bg-start`, etc.)
3. Dans `index.html`, remplacer :
   ```html
   <link rel="stylesheet" href="css/themes/rose-violet.css">
   ```
   par :
   ```html
   <link rel="stylesheet" href="css/themes/mon-theme.css">
   ```

Tout le site se recolore instantanément — `css/style.css` ne contient aucune couleur en dur.

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
{
    key: "quest7", title
:
    "Ma quête", guideMessage
:
    "Réaction du guide."
}
// 2. Ajouter le <li data-quest="quest7"> dans sections/simulator.html
```

### Questions de quiz

```js
// QUIZZES.politique.questions (ou twd, italie, ocean, soeur)
{ question: "Ma question ?", options: ["A", "B", "C"] }
```

---

## 💾 Sauvegarde & réinitialisation

- Progression sauvegardée **automatiquement** (localStorage).
- Bouton **🔄 Recommencer** en haut à droite pour tout effacer.
- Navigation privée : fonctionne sans sauvegarde entre sessions.
