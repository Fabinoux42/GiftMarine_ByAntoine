/* ====================================================================
   APP.JS — Bootstrap : chargement des fragments HTML + initialisation
   --------------------------------------------------------------------
   Ordre de chargement (voir index.html) :
     config.js → storage.js → state.js → gauge.js → guide.js →
     navigation.js → password.js → impossible.js → wheel.js →
     simulator.js → quiz.js → ending.js → app.js

   Étapes au DOMContentLoaded :
     1. Injection des fragments HTML (shared/chrome + sections/*)
     2. Initialisation des modules (init())
     3. Restauration de la progression sauvegardée
==================================================================== */

/* ------------------------------------------------------------------
   1. CHARGEMENT DES FRAGMENTS HTML
   Chaque <div data-include="chemin.html"> est remplacé par le contenu
   du fichier. Nécessite un serveur local (Live Server, npx serve…).
------------------------------------------------------------------ */
function loadIncludes() {
    const placeholders = Array.from(document.querySelectorAll("[data-include]"));

    const fetches = placeholders.map((el) => {
        const path = el.dataset.include;
        return fetch(path)
            .then((res) => {
                if (!res.ok) throw new Error(`Fragment introuvable : ${path} (${res.status})`);
                return res.text();
            })
            .then((html) => {
                el.insertAdjacentHTML("beforebegin", html);
                el.remove();
            })
            .catch((err) => {
                console.error("[app.js]", err.message);
                el.innerHTML = `<p style="color:red;padding:1rem;font-family:sans-serif">
          ⚠️ Fragment non chargé : <code>${path}</code><br>
          💡 Ouvre le projet avec un serveur local (ex&nbsp;: Live Server dans VS Code).
        </p>`;
            });
    });

    return Promise.all(fetches);
}

/* ------------------------------------------------------------------
   2. INITIALISATION PRINCIPALE
   Appelée après injection de tous les fragments DOM.
------------------------------------------------------------------ */
function initApp() {

    // Initialisation des modules dans l'ordre des dépendances
    Sound.init();       // crée l'élément audio (Kirikou)
    Gauge.init();       // dépend : State
    Guide.init();       // dépend : DOM chrome
    Password.init();    // dépend : DOM lock-screen
    Impossible.init();  // dépend : DOM section-impossible
    Wheel.init();       // dépend : DOM section-wheel
    Simulator.init();   // dépend : DOM section-simulator
    Ending.init();      // dépend : DOM section-fin

    // Thème de base au démarrage (écran mot de passe)
    Theme.apply("lock-screen");

    // Boutons « Retour à la roue » des mini-jeux (simulateur + quiz)
    document.querySelectorAll("[data-back-to-wheel]").forEach((btn) => {
        btn.addEventListener("click", () => Navigation.goToSection("section-wheel"));
    });

    // Bouton "Recommencer"
    document.getElementById("reset-btn").addEventListener("click", () => {
        const confirmed = window.confirm(
            "Tout remettre à zéro ? Il faudra retrouver le mot de passe secret."
        );
        if (confirmed) State.reset();
    });

    // Restauration de la progression depuis localStorage
    const data = State.load();
    if (!data || !data.unlocked) return;

    document.getElementById("main-content").classList.remove("hidden");

    const target = (data.currentSection && data.currentSection !== "lock-screen")
        ? data.currentSection
        : "section-home";

    // Le simulateur restaure ses quêtes / Kirikou ; la roue (hub) gère
    // elle-même son affichage via Wheel.onEnterHub() dans goToSection().
    if (target === "section-simulator") Simulator.restore();

    Navigation.goToSection(target);
    Gauge.refresh();
}

/* ------------------------------------------------------------------
   3. POINT D'ENTRÉE
------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    loadIncludes().then(initApp);
});
