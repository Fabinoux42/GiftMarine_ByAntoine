/* ====================================================================
   PASSWORD.JS — Écran de mot de passe (énigme aléatoire)
==================================================================== */

const Password = (() => {

    const currentRiddle = PASSWORD_RIDDLES[Math.floor(Math.random() * PASSWORD_RIDDLES.length)];
    const _answer = currentRiddle.answer;
    const _hints = currentRiddle.hints;

    function _unlock(passwordInput, lockForm, lockFeedback) {
        lockFeedback.textContent = "Accès validé. Le conseil des amoureux approuve.";
        lockFeedback.classList.add("success");
        passwordInput.disabled = true;
        lockForm.querySelector("button").disabled = true;

        State.setUnlocked(true);
        Gauge.updateStep("password");
        Guide.showMessage(GUIDE_MESSAGES.passwordSuccess);
        State.save();

        setTimeout(() => {
            document.getElementById("main-content").classList.remove("hidden");
            Navigation.goToSection("section-home");
        }, 1500);
    }

    function _showHint(passwordInput, lockFeedback) {
        const idx = State.getHintIndex();
        const hint = _hints[Math.min(idx, _hints.length - 1)];
        Guide.showMessage(hint);

        lockFeedback.textContent = "Pas tout à fait... un indice vient d'apparaître 👀";
        lockFeedback.classList.remove("success");

        State.incrementHint();
        passwordInput.value = "";
        passwordInput.focus();
        State.save();
    }

    function init() {
        const lockForm = document.getElementById("lock-form");
        const passwordInput = document.getElementById("password-input");
        const lockFeedback = document.getElementById("lock-feedback");
        const riddleTextEl = document.getElementById("riddle-text");

        if (riddleTextEl) riddleTextEl.textContent = currentRiddle.riddle;

        lockForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const value = passwordInput.value.trim().toLowerCase();
            if (value === _answer) {
                _unlock(passwordInput, lockForm, lockFeedback);
            } else {
                _showHint(passwordInput, lockFeedback);
            }
        });
    }

    return {init};

})();
