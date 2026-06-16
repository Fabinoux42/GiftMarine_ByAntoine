/* ====================================================================
   SOUND.JS — Gestion centralisée des sons de l'application
   --------------------------------------------------------------------
   Pour l'instant un seul son : la musique de Kirikou, jouée au moment
   où il est débloqué dans le simulateur (js/simulator.js) et stoppée
   dès qu'on quitte la section (js/navigation.js).

   Chemin du fichier → js/config.js : KIRIKOU_SOUND
==================================================================== */

const Sound = (() => {

    let kirikou = null;

    /** Crée l'élément audio (sans le jouer). Appelé une fois au démarrage. */
    function init() {
        kirikou = new Audio(KIRIKOU_SOUND);
        kirikou.preload = "auto";
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

    return {init, playKirikou, stopKirikou};

})();
