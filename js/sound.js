/* ====================================================================
   SOUND.JS — Gestion centralisée des sons de l'application
   --------------------------------------------------------------------
   Sons fichiers :
     - la musique de Kirikou (simulateur) → KIRIKOU_SOUND
     - le son de mort du Pendu kawaï       → PENDU_MORT_SOUND
   Son synthétisé (aucun fichier) :
     - un petit « tic » de clic, généré à la volée via l'API Web Audio.

   Chemins → js/config.js
==================================================================== */

const Sound = (() => {

    let kirikou = null;
    let penduMort = null;
    let audioCtx = null; // contexte Web Audio (créé au 1er clic)

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

    /**
     * Petit « tic » de clic, entièrement synthétisé (aucun fichier).
     * Un oscillateur très court (~50 ms) qui descend en fréquence avec
     * une enveloppe rapide → un clic discret et sec.
     * Le contexte Web Audio est créé/réveillé au 1er clic (geste
     * utilisateur), ce qui respecte les politiques d'autoplay.
     */
    function playClick() {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;

            if (!audioCtx) audioCtx = new AC();
            if (audioCtx.state === "suspended") audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            // 1. Onde sinusoïdale pour un son pur, fini le côté "laser agressif"
            osc.type = "sine";

            // 2. Fréquences plus basses (on commence à 400Hz pour finir à 80Hz en un éclair)
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.015);

            // 3. Enveloppe ultra-courte : le son claque et s'éteint en 20ms
            gain.gain.setValueAtTime(0.4, now); // Volume initial un peu plus haut car le sinus est plus doux
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            osc.connect(gain).connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.025); // On coupe l'oscillateur juste après
        } catch (_) {
            // En cas de souci audio, on continue sans le tic.
        }
    }

    return {init, playKirikou, stopKirikou, playPenduMort, playClick};

})();
