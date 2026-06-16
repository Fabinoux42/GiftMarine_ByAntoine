/* ====================================================================
   HANGMAN.JS — Le Pendu Kawaï (mini-jeu du hub)
   --------------------------------------------------------------------
   Un pendu d'ambiance KAWAÏ qui vire au GLAUQUE à chaque erreur :
   js/hangman.js pose body[data-dread="0".."6"] et css/themes/kawaii.css
   fait glisser tout l'écran du pastel mignon (0) vers le glauque (6).

   RÈGLES :
   - Il faut deviner TOUS les mots de HANGMAN_WORDS pour terminer.
   - Les HANGMAN_MAX_WRONG vies sont PARTAGÉES sur toute la partie :
     en passant au mot suivant, les vies perdues le restent (le dessin
     du pendu garde ses parties), seul le clavier se réinitialise.
   - 0 vie = mort : pendu « mort », son de mort, message de fin, bouton
     « Recommencer » qui remet À ZÉRO tous les mots et les 6 vies.
   - Tous les mots trouvés → mini-jeu terminé (20 % de jauge).
   - Le bouton « Retour à la roue » (HTML) reste TOUJOURS visible.

   Données → js/config.js : HANGMAN_WORDS / HANGMAN_MAX_WRONG
==================================================================== */

const Hangman = (() => {

    let svgEl, wordEl, keyboardEl, hintEl, livesEl, resultEl, replayBtn, iconEl, progressEl;
    let parts = [];

    // État de la partie (non persisté : repart à neuf à chaque entrée)
    let sequence = [];        // mots mélangés à deviner (toute la partie)
    let wordIndex = 0;        // mot courant dans la séquence
    let target = "";          // mot courant, normalisé (A–Z + espaces)
    let hint = "";
    let guessed = null;       // Set des lettres jouées POUR LE MOT COURANT
    let wrong = 0;            // erreurs cumulées sur TOUTE la partie (0..MAX)
    let over = false;         // partie entière terminée (gagnée ou perdue)

    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    /** Majuscules + suppression des accents (on devine en A–Z). */
    function _norm(s) {
        return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function _shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /* ------------------------------------------------------------------
       Rendu
    ------------------------------------------------------------------ */

    function _setDread(level) {
        document.body.dataset.dread = String(level);
    }

    function _isDead() {
        return over && wrong >= HANGMAN_MAX_WRONG;
    }

    function _updateIcon() {
        let icon;
        if (_isDead()) icon = "💀";
        else if (over) icon = "💖";          // tous les mots trouvés
        else if (wrong <= 1) icon = "🎀";
        else if (wrong <= 3) icon = "😟";
        else icon = "😨";
        iconEl.textContent = icon;
    }

    function _renderLives() {
        const left = HANGMAN_MAX_WRONG - wrong;
        livesEl.textContent = "💗".repeat(Math.max(0, left)) + "🖤".repeat(wrong);
    }

    function _renderProgress() {
        const total = sequence.length;
        if (over && !_isDead()) {
            progressEl.textContent = total + " / " + total + " — terminé !";
        } else {
            progressEl.textContent = "Mot " + (wordIndex + 1) + " / " + total;
        }
    }

    function _renderWord() {
        wordEl.innerHTML = "";
        for (const ch of target) {
            const slot = document.createElement("span");
            if (ch === " ") {
                slot.className = "hm-slot space";
            } else {
                slot.className = "hm-slot";
                slot.textContent = guessed.has(ch) ? ch : "";
            }
            wordEl.appendChild(slot);
        }
    }

    /** Révèle les parties du corps selon le nombre d'erreurs cumulées. */
    function _renderFigure() {
        parts.forEach((part) => {
            const stage = Number(part.dataset.stage);
            part.classList.toggle("revealed", stage <= wrong);
        });
        svgEl.classList.toggle("is-dead", _isDead());
    }

    function _buildKeyboard() {
        keyboardEl.innerHTML = "";
        ALPHABET.forEach((letter) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "hm-key";
            btn.textContent = letter;
            btn.dataset.letter = letter;
            btn.addEventListener("click", () => _guess(letter));
            keyboardEl.appendChild(btn);
        });
    }

    function _resetKeyboard() {
        keyboardEl.querySelectorAll(".hm-key").forEach((btn) => {
            btn.disabled = false;
            btn.classList.remove("good", "bad");
        });
    }

    function _disableKeyboard() {
        keyboardEl.querySelectorAll(".hm-key").forEach((btn) => (btn.disabled = true));
    }

    /* ------------------------------------------------------------------
       Logique de jeu
    ------------------------------------------------------------------ */

    function _isWordSolved() {
        for (const ch of target) {
            if (ch === " ") continue;
            if (!guessed.has(ch)) return false;
        }
        return true;
    }

    function _guess(letter) {
        if (over || guessed.has(letter)) return;
        guessed.add(letter);

        const btn = keyboardEl.querySelector('.hm-key[data-letter="' + letter + '"]');
        const isInWord = target.indexOf(letter) !== -1;

        if (isInWord) {
            if (btn) {
                btn.classList.add("good");
                btn.disabled = true;
            }
            _renderWord();
            if (_isWordSolved()) {
                _onWordSolved();
            } else {
                Guide.showMessage(GUIDE_MESSAGES.hangmanGood);
            }
        } else {
            wrong++;
            if (btn) {
                btn.classList.add("bad");
                btn.disabled = true;
            }
            _setDread(wrong);
            _renderLives();
            _renderFigure();
            _updateIcon();
            if (wrong >= HANGMAN_MAX_WRONG) {
                _death();
            } else {
                Guide.showMessage(GUIDE_MESSAGES.hangmanBad);
            }
        }
    }

    /** Mot courant résolu → mot suivant, ou victoire si c'était le dernier. */
    function _onWordSolved() {
        if (wordIndex >= sequence.length - 1) {
            _winAll();
        } else {
            wordIndex++;
            Guide.showMessage(GUIDE_MESSAGES.hangmanNext);
            _loadWord(wordIndex); // le clavier se réinitialise, les vies restent
        }
    }

    function _winAll() {
        over = true;
        _disableKeyboard();
        _renderProgress();
        _updateIcon();
        Gauge.updateStep("hangman"); // 20 % — seulement quand TOUT est trouvé
        Guide.showMessage(GUIDE_MESSAGES.hangmanWin);
        resultEl.textContent = "💖 Bravo ! Tu as deviné tous les mots.";
        replayBtn.classList.add("hidden"); // gagné : retour à la roue
    }

    function _death() {
        over = true;
        _disableKeyboard();
        _setDread(HANGMAN_MAX_WRONG); // glauque total
        _renderFigure();              // pendu complet + visage « mort »
        _updateIcon();
        Sound.playPenduMort();        // 🔊 son de mort

        // On révèle le mot sur lequel on est mort
        guessed = new Set(target.replace(/ /g, "").split(""));
        _renderWord();
        Guide.showMessage(GUIDE_MESSAGES.hangmanLose);
        resultEl.textContent = "💀 Perdu… Le mot était « " + target.trim()
            + " ». Tout est à refaire !";
        replayBtn.classList.remove("hidden"); // recommence TOUTE la partie
    }

    /* ------------------------------------------------------------------
       Chargement d'un mot / démarrage d'une partie
    ------------------------------------------------------------------ */

    /** Charge le mot d'indice i ; le clavier repart à neuf, PAS les vies. */
    function _loadWord(i) {
        const pick = sequence[i];
        target = _norm(pick.word);
        hint = pick.hint || "";
        guessed = new Set();

        hintEl.textContent = hint ? "Indice : " + hint : "";
        _resetKeyboard();
        _renderWord();
        _renderProgress();
        _renderLives();
        _renderFigure();
        _updateIcon();
    }

    /** Démarre une partie COMPLÈTE depuis zéro (tous les mots, 6 vies). */
    function _startGame() {
        sequence = _shuffle(HANGMAN_WORDS);
        wordIndex = 0;
        wrong = 0;
        over = false;

        _setDread(0);
        resultEl.textContent = "";
        replayBtn.classList.add("hidden");
        svgEl.classList.remove("is-dead");

        _loadWord(0);
    }

    /** Appelé par Navigation.goToSection à chaque entrée sur la section. */
    function onEnter() {
        _startGame();
        Guide.showMessage(GUIDE_MESSAGES.hangmanIntro);
    }

    /* ------------------------------------------------------------------
       Init
    ------------------------------------------------------------------ */

    function init() {
        svgEl = document.getElementById("hangman-svg");
        wordEl = document.getElementById("hangman-word");
        keyboardEl = document.getElementById("hangman-keyboard");
        hintEl = document.getElementById("hangman-hint");
        livesEl = document.getElementById("hangman-lives");
        resultEl = document.getElementById("hangman-result");
        replayBtn = document.getElementById("hangman-replay");
        iconEl = document.getElementById("hangman-icon");
        progressEl = document.getElementById("hangman-progress");
        parts = Array.from(svgEl.querySelectorAll(".hm-part"));

        _buildKeyboard();

        // « Recommencer » : repart de zéro (tous les mots + 6 vies).
        replayBtn.addEventListener("click", onEnter);

        // Confort : jouer aussi au clavier physique quand on est sur
        // l'écran du pendu et que la partie n'est pas terminée.
        document.addEventListener("keydown", (e) => {
            const section = document.getElementById("section-hangman");
            if (!section || !section.classList.contains("active")) return;
            if (over) return;
            const letter = e.key.toUpperCase();
            if (letter.length === 1 && letter >= "A" && letter <= "Z") {
                _guess(letter);
            }
        });
    }

    return {init, onEnter};

})();
