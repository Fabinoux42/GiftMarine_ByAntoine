/* ====================================================================
   GAUGE.JS — Jauge de progression verticale
==================================================================== */

const Gauge = (() => {

    let fill, label, progressGauge;
    let completeShown = false;

    function _showFinalBanner() {
        const banner = document.createElement("div");
        banner.className = "final-banner";
        banner.setAttribute("role", "status");
        banner.textContent = GAUGE_COMPLETE_MESSAGE;
        document.body.appendChild(banner);
        requestAnimationFrame(() => banner.classList.add("visible"));
        setTimeout(() => {
            banner.classList.remove("visible");
            setTimeout(() => banner.remove(), 600);
        }, 4500);
    }

    function refresh() {
        if (!fill) return;
        const percent = State.gaugePercent();
        fill.style.height = percent + "%";
        label.textContent = percent + "%";
        progressGauge.setAttribute("aria-valuenow", String(percent));
        if (percent >= 100 && !completeShown) {
            completeShown = true;
            _showFinalBanner();
        }
    }

    function updateStep(key) {
        const isNew = State.markDone(key);
        refresh();
        if (isNew) State.save();
    }

    function init() {
        fill = document.getElementById("gauge-fill");
        label = document.getElementById("gauge-label");
        progressGauge = document.getElementById("progress-gauge");
    }

    return {refresh, updateStep, init};

})();
