/* ====================================================================
   GAUGE.JS — Jauge de progression verticale
==================================================================== */

const Gauge = (() => {

    let fill, label, progressGauge;

    function refresh() {
        if (!fill) return;
        const percent = State.gaugePercent();
        fill.style.height = percent + "%";
        label.textContent = percent + "%";
        progressGauge.setAttribute("aria-valuenow", String(percent));
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
