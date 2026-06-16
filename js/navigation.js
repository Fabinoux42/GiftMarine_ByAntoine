/* ====================================================================
   NAVIGATION.JS — Navigation entre les sections / écrans
   --------------------------------------------------------------------
   goToSection(sectionId)  — affiche l'écran ciblé, masque les autres
==================================================================== */

const Navigation = (() => {

    /**
     * Affiche la section `sectionId` et masque toutes les autres.
     * Gère aussi :
     *  - l'initialisation du quiz si la section en contient un
     *  - la mention "au simulateur" dans l'écran de fin
     *  - le focus sur le h1 pour l'accessibilité
     * @param {string} sectionId
     */
    function goToSection(sectionId) {
        document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));

        const target = document.getElementById(sectionId);
        if (!target) return;

        target.classList.add("active");
        State.setCurrentSection(sectionId);

        // Thème contextuel (simulateur / quiz / afrique / base)
        Theme.apply(sectionId);

        // La musique de Kirikou ne joue que dans le simulateur :
        //  - on entre sur le simulateur ET Kirikou est déjà débloqué → on
        //    (re)lance la musique (elle ne repartait pas quand on revenait) ;
        //  - on passe à une autre section → on la coupe.
        if (sectionId !== "section-simulator") {
            Sound.stopKirikou();
        } else if (State.isKirikouUnlocked()) {
            Sound.playKirikou();
        }

        // La roue est un hub : (ré)afficher l'état adéquat en y entrant.
        if (sectionId === "section-wheel") {
            Wheel.onEnterHub();
        }

        // Lance le quiz si la section en contient un
        const quizKey = target.dataset.quiz;
        if (quizKey) {
            Quiz.startQuiz(quizKey);
        }

        // Affiche la mention "au simulateur" en page de fin
        // (le simulateur est désormais un mini-jeu obligatoire).
        if (sectionId === "section-fin") {
            const mention = document.getElementById("fin-simulator-mention");
            if (mention) {
                mention.style.display = State.isSimulatorComplete() ? "" : "none";
            }
        }

        // Focus accessibilité sur le titre de la section
        const heading = target.querySelector("h1");
        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus();
        }

        State.save();
    }

    return {goToSection};

})();
