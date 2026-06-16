/* ====================================================================
   THEME.JS — Thème visuel contextuel
   --------------------------------------------------------------------
   Le thème est piloté par l'attribut `data-theme` sur <body>.
   Chaque thème est un fichier CSS dédié sous css/themes/ qui surcharge
   les variables de couleur via le sélecteur `body[data-theme="…"]`.

   Thèmes :
     (aucun / "base") → css/themes/rose-violet.css   (mot de passe, accueil, roue, fin)
     "simulator"      → css/themes/simulator.css      (mini-jeu Simulateur)
     "quiz"           → css/themes/quiz.css           (mini-jeu Quiz)
     "kawaii"         → css/themes/kawaii.css         (mini-jeu Pendu, vire au glauque)
     "africa"         → css/themes/africa.css         (Simulateur, une fois Kirikou débloqué)

   → Appelé par js/navigation.js à chaque changement de section,
     et par js/simulator.js au déblocage de Kirikou (bascule live).
==================================================================== */

const Theme = (() => {

    /**
     * Détermine le thème à appliquer pour une section donnée.
     * @param {string} sectionId
     * @returns {string} "simulator" | "quiz" | "africa" | "base"
     */
    function _resolve(sectionId) {
        if (sectionId === "section-simulator") {
            // Kirikou débloqué → thème Afrique, sinon thème Simulateur.
            return State.isKirikouUnlocked() ? "africa" : "simulator";
        }
        if (sectionId === "section-hangman") {
            // Pendu : thème kawaï (qui vire au glauque selon data-dread).
            return "kawaii";
        }
        if (typeof sectionId === "string" && sectionId.indexOf("section-quiz-") === 0) {
            return "quiz";
        }
        return "base";
    }

    /**
     * Applique le thème correspondant à la section (ou à la section courante).
     * @param {string} [sectionId]
     */
    function apply(sectionId) {
        const id = sectionId || State.getCurrentSection();
        document.body.dataset.theme = _resolve(id);
    }

    return {apply};

})();
