/* ====================================================================
   GUIDE.JS — Mini Anto-Man (bulle de dialogue + toggle)
==================================================================== */

const Guide = (() => {

    let bubble, wrapper, toggleBtn;
    let hideTimeout = null;

    function showMessage(text, duration = 4500) {
        if (!bubble) return;
        bubble.textContent = text;
        bubble.classList.add("visible");
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => bubble.classList.remove("visible"), duration);
    }

    function toggle() {
        const isHidden = wrapper.classList.toggle("guide-hidden");
        toggleBtn.textContent = isHidden ? "Afficher Mini Anto-Man" : "Masquer Mini Anto-Man";
    }

    function init() {
        wrapper = document.getElementById("guide-wrapper");
        bubble = document.getElementById("guide-bubble");
        toggleBtn = document.getElementById("toggle-guide-btn");
        toggleBtn.addEventListener("click", toggle);
    }

    return {showMessage, toggle, init};

})();
