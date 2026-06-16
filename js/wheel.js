/* ====================================================================
   WHEEL.JS — Roue du destin amoureux
==================================================================== */

const Wheel = (() => {

    let wheelEl, spinBtn, wheelResultEl, wheelContinueBtn;
    let wheelRotation = 0;

    function _pickResult() {
        if (State.getSpinCount() >= 2 && !State.isSimulatorSeen()) return "simulator";
        return WHEEL_SEGMENTS[Math.floor(Math.random() * WHEEL_SEGMENTS.length)];
    }

    function _pickTargetIndex(result) {
        const matches = WHEEL_SEGMENTS
            .map((seg, i) => (seg === result ? i : -1))
            .filter((i) => i !== -1);
        return matches[Math.floor(Math.random() * matches.length)];
    }

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
        Gauge.updateStep("wheel");
        Guide.showMessage(GUIDE_MESSAGES.wheelResult);
        const label = (result === "simulator") ? "Antoine & Marine Simulator" : "Quiz Direct";
        wheelResultEl.textContent = "🎉 La roue s'arrête sur : " + label + " !";
        wheelContinueBtn.classList.remove("hidden");
        spinBtn.disabled = false;
        spinBtn.textContent = "🎲 Relancer la roue";
        spinBtn.classList.replace("btn-primary", "btn-secondary");
        State.save();
    }

    function restoreInstant() {
        const segAngle = 360 / WHEEL_SEGMENTS.length;
        const idx = WHEEL_SEGMENTS.indexOf(State.getPath());
        const center = idx >= 0 ? (idx * segAngle + segAngle / 2) : 0;
        const rot = 360 - center;

        wheelEl.style.transition = "none";
        wheelEl.style.transform = "rotate(" + rot + "deg)";
        wheelRotation = rot;
        requestAnimationFrame(() => {
            wheelEl.style.transition = "";
        });

        const label = (State.getPath() === "simulator") ? "Antoine & Marine Simulator" : "Quiz Direct";
        wheelResultEl.textContent = "🎉 La roue s'arrête sur : " + label + " !";
        wheelContinueBtn.classList.remove("hidden");
        spinBtn.disabled = false;
        spinBtn.textContent = "🎲 Relancer la roue";
        spinBtn.classList.replace("btn-primary", "btn-secondary");
    }

    function init() {
        wheelEl = document.getElementById("wheel");
        spinBtn = document.getElementById("spin-btn");
        wheelResultEl = document.getElementById("wheel-result");
        wheelContinueBtn = document.getElementById("wheel-continue-btn");

        spinBtn.addEventListener("click", _performSpin);

        wheelContinueBtn.addEventListener("click", () => {
            if (State.getPath() === "simulator") {
                Guide.showMessage(GUIDE_MESSAGES.simulatorIntro);
                Navigation.goToSection("section-simulator");
            } else {
                Guide.showMessage(GUIDE_MESSAGES.quizExpress);
                Navigation.goToSection("section-quiz-politique");
            }
        });
    }

    return {init, restoreInstant};

})();
