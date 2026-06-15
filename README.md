# 💌 4 mois avec Marine — mini-aventure interactive

Site 100% HTML/CSS/JS vanilla : énigme secrète **aléatoire sur le thème
de l'Attaque des Titans** 🗝️, Mini Anto-Man, question impossible,
**roue du destin amoureux** 🎡 (avec relance garantie), **Antoine &
Marine Simulator** 🎮 (quêtes, Love XP, déblocage de Kirikou), 5 quiz
absurdes, jauge de progression et fin pluie-de-cœurs ❤️.

Aucune dépendance externe, aucun framework, aucune image requise.

## 📁 Fichiers

```
index.html          → structure du site
style.css           → couleurs, mise en page, animations
script.js           → toute la logique (mot de passe, roue, simulateur, quiz, jauge...)
Cadeau Marine.html  → la même chose, mais tout fusionné dans UN seul fichier
README.md           → ce fichier
```

`Cadeau Marine.html` est 100% autonome (CSS + JS inclus) : tu peux
l'ouvrir directement en double-cliquant, l'envoyer par mail, etc. Les 3
fichiers séparés sont pratiques pour continuer à coder dans VS Code.

---

## 1. Ouvrir dans Visual Studio Code

*Fichier → Ouvrir le dossier...* et choisis le dossier contenant ces
fichiers. Tout est déjà prêt, pas d'installation supplémentaire.

## 2. Lancer avec Live Server

1. Onglet **Extensions** (`Ctrl+Shift+X`) → installe **"Live Server"**.
2. Ouvre `index.html`.
3. Clic droit → **"Open with Live Server"** (ou bouton "Go Live").

`Cadeau Marine.html` fonctionne aussi avec Live Server, ou même en
double-clic direct sans serveur.

---

## 3. Le parcours (vue d'ensemble)

1. 🗝️ **Mot de passe secret** — une énigme Attaque des Titans est tirée
   au hasard à CHAQUE chargement de page (Eren, Mikasa, Levi, Armin ou
   Erwin). Le prénom du personnage est la réponse, insensible à la
   casse. Indices progressifs en cas d'erreur.
2. 💌 Accueil
3. 💘 Question impossible — le bouton "Non" fuit, "Oui évidemment" continue
4. 🎡 **Roue du destin amoureux** — tirage au sort entre :
   - 🎮 **Antoine & Marine Simulator**
   - ❓ **Quiz Direct** (le simulateur est sauté)

   Après un 1er résultat, le bouton devient **"🎲 Relancer la roue"** :
   Marine peut retenter sa chance autant qu'elle veut. **Garantie** :
   si le 1er tirage n'est pas "Simulator", le 2ᵉ tirage tombera
   forcément sur "Simulator".
5. Si Simulator : 3 personnages (Antoine, Marine, Kirikou verrouillé),
   6 quêtes → Love XP → déblocage de Kirikou + badge "Famille du chaos
   tendre"
6. Les 5 quiz (politique, Walking Dead, Italie, **Océane**, sœur)
7. ❤️ Fin romantique — pluie de cœurs, jauge à 100%

---

## 4. Personnaliser

Tout est commenté. Les textes "fixes" (titres, sous-titres, paragraphes)
sont dans `index.html`. La logique et les contenus "dynamiques" sont en
haut de `script.js`, section **"1. CONFIGURATION"** :

- `PASSWORD_RIDDLES` → la liste des énigmes Attaque des Titans (une
  tirée au hasard à chaque chargement). Chaque entrée a un texte
  d'énigme, une réponse (`answer`), et 5 indices progressifs. Pour
  ajouter un personnage, ajoute un objet avec la même structure.
- `GUIDE_MESSAGES` → toutes les répliques de Mini Anto-Man
- `WHEEL_SEGMENTS` → l'ordre des 6 secteurs de la roue (3 "simulator" /
  3 "quiz" en alternance par défaut — garde un nombre pair de secteurs)
- `SIMULATOR_QUESTS` → les 6 quêtes (titre + réplique de Mini Anto-Man
  affichée quand la quête est terminée). Pour en ajouter/retirer une,
  ajoute aussi le `<li class="quest-item" data-quest="...">`
  correspondant dans `index.html` (même clé `key`)
- `MARINE_LINES` / `MARINE_COMMENT_CHANCE` → les répliques aléatoires de
  Marine ("Vive les gros nichons.") et leur probabilité d'apparition
  (40% par défaut, après chaque quête)
- `KIRIKOU_DIALOGUE` → le petit échange affiché au déblocage de Kirikou
- `QUIZZES` → les 5 quiz (questions, options, message de résultat)

⚠️ Si tu modifies `index.html` ou `script.js`, pense à régénérer
`Cadeau Marine.html` (ou à reporter le changement dans les deux), sinon
les deux versions divergent.

---

## 5. Jauge, sauvegarde et reset

La jauge **"Vive Marine"** compte 9 étapes de base (mot de passe,
question impossible, roue, 5 quiz, fin), +6 si la roue tombe sur le
Simulator (une par quête). Dans les deux cas, terminer le parcours
amène à 100% et affiche "VIVE MARINE, VIVE GROGNICHON, VIVE NOUS."

La progression (mot de passe validé, tirages de la roue, quêtes, quiz,
Kirikou...) est sauvegardée automatiquement via `localStorage` : un
rechargement de page reprend exactement où Marine s'est arrêtée — sauf
l'énigme du mot de passe, qui est retirée au hasard à chaque
chargement (donc différente si le mot de passe n'a pas encore été
trouvé et que la page est rechargée). Le bouton **"🔄 Recommencer"**
efface tout et repart du mot de passe.

Le bouton **"Masquer/Afficher Mini Anto-Man"** cache ou montre le petit
personnage guide à tout moment, sans perdre la progression.

---

Bonne fête des 4 mois à vous deux 💌
