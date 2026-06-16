/* ====================================================================
   IMPOSSIBLE.JS — La question impossible (bouton "Non" qui fuit)
==================================================================== */

const Impossible = (() => {

    let lastFleeMessageTime = 0;
    let noBtn = null;

    function _flee() {
        const margin = 16;
        const width = noBtn.offsetWidth || 100;
        const height = noBtn.offsetHeight || 50;
        const maxX = Math.max(margin, window.innerWidth - width - margin);
        const maxY = Math.max(margin, window.innerHeight - height - margin);

        noBtn.style.position = "fixed";
        noBtn.style.margin = "0";
        noBtn.style.left = (margin + Math.random() * (maxX - margin)) + "px";
        noBtn.style.top = (margin + Math.random() * (maxY - margin)) + "px";

        const now = Date.now();
        if (now - lastFleeMessageTime > 2000) {
            Guide.showMessage(GUIDE_MESSAGES.noButtonFlee);
            lastFleeMessageTime = now;
        }
    }

    function _clampOnResize() {
        if (!noBtn || noBtn.style.position !== "fixed") return;
        const margin = 16;
        const maxX = Math.max(margin, window.innerWidth - noBtn.offsetWidth - margin);
        const maxY = Math.max(margin, window.innerHeight - noBtn.offsetHeight - margin);
        noBtn.style.left = Math.min(parseFloat(noBtn.style.left) || 0, maxX) + "px";
        noBtn.style.top = Math.min(parseFloat(noBtn.style.top) || 0, maxY) + "px";
    }

    function init() {
        const startBtn = document.getElementById("start-btn");
        const yesBtn = document.getElementById("yes-btn");
        const impossibleFeedback = document.getElementById("impossible-feedback");
        noBtn = document.getElementById("no-btn");

        startBtn.addEventListener("click", () => Navigation.goToSection("section-impossible"));

        ["mouseenter", "focus", "click"].forEach((evt) => {
            noBtn.addEventListener(evt, (e) => {
                e.preventDefault();
                _flee();
            });
        });
        noBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            _flee();
        }, {passive: false});
        noBtn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                _flee();
            }
        });

        window.addEventListener("resize", _clampOnResize);

        yesBtn.addEventListener("click", () => {
            impossibleFeedback.textContent = "Bon choix. Le destin, la République et moi-même validons.";
            Gauge.updateStep("impossible");
            Guide.showMessage(GUIDE_MESSAGES.yesChoice);
            setTimeout(() => Navigation.goToSection("section-wheel"), 1700);
        });
    }

    return {init};

})();
