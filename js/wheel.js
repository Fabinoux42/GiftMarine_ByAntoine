/* ====================================================================
   WHEEL.JS — Roue du destin amoureux (hub des mini-jeux)
   --------------------------------------------------------------------
   La roue est un HUB : on y revient entre les mini-jeux.
   Deux mini-jeux obligatoires : "simulator" (40 %) et "quiz" (40 %).

   Parcours :
     roue → (spin) → mini-jeu → bouton « Retour à la roue » → roue → …
     quand les DEUX mini-jeux sont terminés → la roue propose la fin.

   - _pickResult()  : tire un mini-jeu (le restant s'il n'en reste qu'un)
   - onEnterHub()   : (ré)affiche l'état correct à l'entrée sur la roue
==================================================================== */

const Wheel = (() => {

    let wheelEl, spinBtn, wheelResultEl, wheelContinueBtn,
        spinArea, hubDone, hubToEndingBtn, statusEl;
    let wheelRotation = 0;

    const LABELS = {simulator: "Antoine & Marine Simulator", quiz: "Quiz"};

    /* ------------------------------------------------------------------
       Helpers d'état
    ------------------------------------------------------------------ */

    /** Mini-jeux pas encore terminés, parmi "simulator" et "quiz". */
    function _remainingGames() {
        const remaining = [];
        if (!State.isSimulatorComplete()) remaining.push("simulator");
        if (!State.isQuizComplete()) remaining.push("quiz");
        return remaining;
    }

    /** Section du premier quiz non terminé (pour reprendre la chaîne). */
    function _firstIncompleteQuizSection() {
        const keys = Object.keys(QUIZZES);
        for (const key of keys) {
            if (!State.isDone(QUIZZES[key].progressKey)) return "section-quiz-" + key;
        }
        return "section-quiz-" + keys[0];
    }

    /* ------------------------------------------------------------------
       Tirage
    ------------------------------------------------------------------ */

    /** Tire le mini-jeu : le restant s'il n'en reste qu'un, sinon au hasard. */
    function _pickResult() {
        const remaining = _remainingGames();
        if (remaining.length === 1) return remaining[0];
        return WHEEL_SEGMENTS[Math.floor(Math.random() * WHEEL_SEGMENTS.length)];
    }

    function _pickTargetIndex(result) {
        const matches = WHEEL_SEGMENTS
            .map((seg, i) => (seg === result ? i : -1))
            .filter((i) => i !== -1);
        return matches[Math.floor(Math.random() * matches.length)];
    }

    /* ------------------------------------------------------------------
       Spin
    ------------------------------------------------------------------ */

    function _performSpin() {
        if (spinBtn.disabled) return;
        spinBtn.disabled = true;
        wheelResultEl.textContent = "";
        wheelContinueBtn.classList.add("hidden");
        Guide.showMessage(State.getSpinCount() === 0 ? GUIDE_MESSAGES.wheelSpin : GUIDE_MESSAGES.wheelRespin);

        State.incrementSpinCount();
        const result = _pickResult();
        if (result === "simulator") State.setSimulatorSeen(true);

        const segAngle = 360 / WHEEL_SEGMENTS.length;
        const targetIndex = _pickTargetIndex(result);
        const center = targetIndex * segAngle + segAngle / 2;
        const jitter = (Math.random() * segAngle * 0.6) - (segAngle * 0.3);
        const extraSpins = 5 + Math.floor(Math.random() * 3);

        wheelRotation += extraSpins * 360 + (360 - center) + jitter;
        wheelEl.style.transform = "rotate(" + wheelRotation + "deg)";
        setTimeout(() => _revealResult(result), 4300);
    }

    function _revealResult(result) {
        State.setPath(result);
        State.markDone("wheel"); // simple marqueur "roue lancée"
        State.save();
        Guide.showMessage(GUIDE_MESSAGES.wheelResult);
        wheelResultEl.textContent = "🎉 La roue s'arrête sur : " + LABELS[result] + " !";
        wheelContinueBtn.classList.remove("hidden");
        spinBtn.disabled = false;
        spinBtn.textContent = "🎲 Relancer la roue";
        spinBtn.classList.replace("btn-primary", "btn-secondary");
    }

    /* ------------------------------------------------------------------
       Hub — état à l'entrée sur la roue
    ------------------------------------------------------------------ */

    /** Réinitialise la zone de spin pour un nouveau tirage. */
    function _resetSpinArea(remaining) {
        wheelContinueBtn.classList.add("hidden");
        wheelResultEl.textContent = "";
        spinBtn.disabled = false;
        spinBtn.textContent = "🎲 Faire tourner la roue";
        spinBtn.classList.replace("btn-secondary", "btn-primary");

        // S'il ne reste qu'un mini-jeu, on l'annonce.
        if (remaining.length === 1) {
            statusEl.textContent = "Encore un mini-jeu : " + LABELS[remaining[0]] + " !";
        } else {
            statusEl.textContent = "";
        }
    }

    /**
     * (Ré)affiche l'état correct du hub :
     *  - les deux mini-jeux faits → panneau « fin »
     *  - sinon → zone de spin prête pour le(s) mini-jeu(x) restant(s)
     * Appelé par Navigation.goToSection() à chaque entrée sur la roue.
     */
    function onEnterHub() {
        const remaining = _remainingGames();

        if (remaining.length === 0) {
            spinArea.classList.add("hidden");
            hubDone.classList.remove("hidden");
            return;
        }

        hubDone.classList.add("hidden");
        spinArea.classList.remove("hidden");
        _resetSpinArea(remaining);
    }

    /* ------------------------------------------------------------------
       Init
    ------------------------------------------------------------------ */

    function init() {
        wheelEl = document.getElementById("wheel");
        spinBtn = document.getElementById("spin-btn");
        wheelResultEl = document.getElementById("wheel-result");
        wheelContinueBtn = document.getElementById("wheel-continue-btn");
        spinArea = document.getElementById("wheel-spin-area");
        hubDone = document.getElementById("wheel-hub-done");
        hubToEndingBtn = document.getElementById("wheel-to-ending-btn");
        statusEl = document.getElementById("wheel-status");

        spinBtn.addEventListener("click", _performSpin);

        // « Continuer » → on lance le mini-jeu tiré par la roue.
        wheelContinueBtn.addEventListener("click", () => {
            if (State.getPath() === "simulator") {
                Guide.showMessage(GUIDE_MESSAGES.simulatorIntro);
                Navigation.goToSection("section-simulator");
            } else {
                Guide.showMessage(GUIDE_MESSAGES.quizExpress);
                Navigation.goToSection(_firstIncompleteQuizSection());
            }
        });

        // Panneau « tout terminé » → écran de fin.
        hubToEndingBtn.addEventListener("click", () => {
            Navigation.goToSection("section-fin");
        });
    }

    return {init, onEnterHub};

})();
