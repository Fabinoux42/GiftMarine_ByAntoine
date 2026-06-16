/* ====================================================================
   ENDING.JS — Fin romantique (pluie de cœurs + message final)
==================================================================== */

const Ending = (() => {

    function _launchHearts(heartsContainer) {
        for (let i = 0; i < 28; i++) {
            const heart = document.createElement("span");
            heart.className = "floating-heart";
            heart.textContent = "❤️";
            heart.style.left = (Math.random() * 100) + "vw";
            heart.style.fontSize = (1 + Math.random() * 1.6) + "rem";
            heart.style.animationDuration = (3 + Math.random() * 3) + "s";
            heart.style.animationDelay = (Math.random() * 1.2) + "s";
            heart.addEventListener("animationend", () => heart.remove());
            heartsContainer.appendChild(heart);
        }
    }

    function init() {
        const finalBtn = document.getElementById("final-btn");
        const finalMessage = document.getElementById("final-message");
        const heartsContainer = document.getElementById("hearts-container");

        finalBtn.addEventListener("click", () => {
            _launchHearts(heartsContainer);
            Gauge.updateStep("fin");
            finalMessage.textContent = "Moi aussi. Évidemment.";
            Guide.showMessage(GUIDE_MESSAGES.theEnd);
            finalBtn.disabled = true;
        });
    }

    return {init};

})();
