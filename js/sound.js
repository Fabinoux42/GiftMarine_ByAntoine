/* ====================================================================
   SOUND.JS — Gestion centralisée des sons de l'application
   --------------------------------------------------------------------
   Deux sons :
     - la musique de Kirikou (simulateur) → KIRIKOU_SOUND
     - le son de mort du Pendu kawaï       → PENDU_MORT_SOUND

   Chemins → js/config.js
==================================================================== */

const Sound = (() => {

    let kirikou = null;
    let penduMort = null;

    /** Crée les éléments audio (sans les jouer). Appelé une fois au démarrage. */
    function init() {
        kirikou = new Audio(KIRIKOU_SOUND);
        kirikou.preload = "auto";
        penduMort = new Audio(PENDU_MORT_SOUND);
        penduMort.preload = "auto";
    }

    /**
     * Joue la musique de Kirikou depuis le début.
     * La lecture peut être refusée par le navigateur si elle n'est pas
     * déclenchée par une interaction — ici elle l'est (déblocage Kirikou),
     * mais on protège quand même contre l'éventuel rejet de la promesse.
     */
    function playKirikou() {
        if (!kirikou) return;
        try {
            kirikou.currentTime = 0;
            const played = kirikou.play();
            if (played && typeof played.catch === "function") {
                played.catch(() => { /* lecture refusée : on ignore */ });
            }
        } catch (_) {
            // Audio indisponible : l'expérience continue sans son.
        }
    }

    /** Arrête la musique de Kirikou et la remet à zéro. */
    function stopKirikou() {
        if (!kirikou) return;
        try {
            kirikou.pause();
            kirikou.currentTime = 0;
        } catch (_) {
            // rien à faire
        }
    }

    /** Joue le son de mort du Pendu kawaï (depuis le début). */
    function playPenduMort() {
        if (!penduMort) return;
        try {
            penduMort.currentTime = 0;
            const played = penduMort.play();
            if (played && typeof played.catch === "function") {
                played.catch(() => { /* lecture refusée : on ignore */ });
            }
        } catch (_) {
            // Audio indisponible : l'expérience continue sans son.
        }
    }

    return {init, playKirikou, stopKirikou, playPenduMort};

})();
