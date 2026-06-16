/* ====================================================================
   ENDING.JS — Fin romantique (pluie de cœurs + message final)
   --------------------------------------------------------------------
   Au clic sur « Merciii pour tout » :
     - pluie de cœurs (deux fois plus longue qu'avant) ;
     - message « Moi aussi. Évidemment. » ;
     - bannière finale ENDING_FINAL_MESSAGE (auparavant affichée à la fin
       du quiz quand la jauge atteignait 100 %) ;
     - image finale cliquable qui relance toute l'expérience
       (équivalent du bouton « 🔄 Recommencer »).
==================================================================== */

const Ending = (() => {

    /**
     * Pluie de cœurs. La durée d'animation est doublée par rapport à
     * avant (6–12 s au lieu de 3–6 s) → les cœurs défilent deux fois
     * plus longtemps à l'écran.
     */
    function _launchHearts(heartsContainer) {
        for (let i = 0; i < 120; i++) {
            const heart = document.createElement("span");
            heart.className = "floating-heart";
            heart.textContent = "❤️";
            heart.style.left = (Math.random() * 100) + "vw";
            heart.style.fontSize = (1 + Math.random() * 1.6) + "rem";
            heart.style.animationDuration = (6 + Math.random() * 6) + "s";
            heart.style.animationDelay = (Math.random() * 0.4) + "s";
            heart.addEventListener("animationend", () => heart.remove());
            heartsContainer.appendChild(heart);
        }
    }

    /** Bannière finale glissée en haut de l'écran. */
    function _showFinalBanner() {
        const banner = document.createElement("div");
        banner.className = "final-banner";
        banner.setAttribute("role", "status");
        banner.textContent = ENDING_FINAL_MESSAGE;
        document.body.appendChild(banner);
        requestAnimationFrame(() => banner.classList.add("visible"));
        /*setTimeout(() => {
            banner.classList.remove("visible");
            setTimeout(() => banner.remove(), 600);
        }, 4500);*/
    }

    function init() {
        const finalBtn = document.getElementById("final-btn");
        const finalMessage = document.getElementById("final-message");
        const heartsContainer = document.getElementById("hearts-container");
        const finalReveal = document.getElementById("final-reveal");
        const finalImage = document.getElementById("final-image");

        finalBtn.addEventListener("click", () => {
            _launchHearts(heartsContainer);
            Gauge.updateStep("fin");
            finalMessage.textContent = "Moi aussi. Évidemment.";
            _showFinalBanner();
            finalReveal.classList.remove("hidden");
            Guide.showMessage(GUIDE_MESSAGES.theEnd);
            finalBtn.disabled = true;
        });

        // Cliquer l'image finale = recommencer toute l'expérience
        // (exactement comme le bouton « 🔄 Recommencer »).
        finalImage.addEventListener("click", () => State.reset());
    }

    return {init};

})();
