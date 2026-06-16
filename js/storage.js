/* ====================================================================
   STORAGE.JS — Couche d'accès au localStorage
   --------------------------------------------------------------------
   Toutes les lectures/écritures de localStorage passent par ici.
   Si localStorage est indisponible (navigation privée stricte, etc.),
   les fonctions échouent silencieusement — l'expérience continue.
==================================================================== */

const Storage = (() => {

    /**
     * Sauvegarde l'état complet de l'application.
     * @param {Object} data - Objet sérialisable représentant l'état.
     */
    function save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (_) {
            // localStorage indisponible : pas grave, on continue sans sauvegarde.
        }
    }

    /**
     * Charge et parse l'état sauvegardé.
     * @returns {Object|null} L'état parsé, ou null si rien n'est sauvegardé.
     */
    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (_) {
            return null;
        }
    }

    /**
     * Efface toutes les données sauvegardées.
     */
    function clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (_) {
            // rien à faire
        }
    }

    return {save, load, clear};

})();
