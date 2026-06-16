/* ====================================================================
   STATE.JS — État global de l'application
   --------------------------------------------------------------------
   Source de vérité unique. Toute modification passe par les fonctions
   exportées — jamais par accès direct à `state` depuis l'extérieur.
==================================================================== */

const SIMULATOR_QUEST_KEYS = SIMULATOR_QUESTS.map((q) => q.key);

/* ------------------------------------------------------------------
   État interne — ne pas accéder directement depuis d'autres modules
------------------------------------------------------------------ */
const _state = {
    unlocked: false,
    currentSection: "lock-screen",
    hintIndex: 0,
    path: null,   // "simulator" | "quiz" | null
    progress: {}
};

// Initialisation à false de toutes les clés de progression
BASE_STEPS.forEach((key) => {
    _state.progress[key] = false;
});
SIMULATOR_QUEST_KEYS.forEach((key) => {
    _state.progress[key] = false;
});

// Variables de session (non persistées entre rechargements mais
// re-calculées depuis localStorage si besoin)
let _spinCount = 0;
let _simulatorSeen = false;
let _kirikouUnlocked = false;

/* ------------------------------------------------------------------
   API publique
------------------------------------------------------------------ */
const State = {

    /* Getters */
    isUnlocked: () => _state.unlocked,
    getCurrentSection: () => _state.currentSection,
    getPath: () => _state.path,
    getHintIndex: () => _state.hintIndex,
    getProgress: () => _state.progress,
    getSpinCount: () => _spinCount,
    isSimulatorSeen: () => _simulatorSeen,
    isKirikouUnlocked: () => _kirikouUnlocked,

    /** Retourne true si une étape de progression est complétée. */
    isDone: (key) => !!_state.progress[key],

    /* Setters */
    setUnlocked: (v) => {
        _state.unlocked = v;
    },
    setCurrentSection: (v) => {
        _state.currentSection = v;
    },
    setPath: (v) => {
        _state.path = v;
    },
    incrementHint: () => {
        _state.hintIndex++;
    },
    incrementSpinCount: () => {
        _spinCount++;
    },
    setSimulatorSeen: (v) => {
        _simulatorSeen = v;
    },
    setKirikouUnlocked: (v) => {
        _kirikouUnlocked = v;
    },

    /**
     * Marque une étape comme complétée.
     * @returns {boolean} true si l'étape vient d'être marquée (pas déjà faite).
     */
    markDone: (key) => {
        if (_state.progress[key]) return false;
        _state.progress[key] = true;
        return true;
    },

    /** Calcule le nombre total d'étapes selon le chemin choisi. */
    totalSteps: () => {
        return BASE_STEPS.length + (_state.path === "simulator" ? SIMULATOR_QUEST_KEYS.length : 0);
    },

    /** Calcule le nombre d'étapes complétées selon le chemin choisi. */
    completedSteps: () => {
        let done = 0;
        BASE_STEPS.forEach((key) => {
            if (_state.progress[key]) done++;
        });
        if (_state.path === "simulator") {
            SIMULATOR_QUEST_KEYS.forEach((key) => {
                if (_state.progress[key]) done++;
            });
        }
        return done;
    },

    /* ------------------------------------------------------------------
       Persistance
    ------------------------------------------------------------------ */

    /** Construit l'objet à sauvegarder et le passe au Storage. */
    save: () => {
        Storage.save({
            unlocked: _state.unlocked,
            currentSection: _state.currentSection,
            path: _state.path,
            spinCount: _spinCount,
            simulatorSeen: _simulatorSeen,
            kirikouUnlocked: _kirikouUnlocked,
            progress: _state.progress
        });
    },

    /**
     * Charge les données sauvegardées et restaure l'état interne.
     * @returns {Object|null} Les données brutes chargées, ou null.
     */
    load: () => {
        const data = Storage.load();
        if (!data) return null;

        // Restaure la progression (uniquement les clés connues)
        if (data.progress && typeof data.progress === "object") {
            Object.keys(_state.progress).forEach((key) => {
                if (typeof data.progress[key] === "boolean") {
                    _state.progress[key] = data.progress[key];
                }
            });
        }

        _state.path = data.path || null;
        _spinCount = data.spinCount || 0;
        _simulatorSeen = !!data.simulatorSeen;
        _kirikouUnlocked = !!data.kirikouUnlocked;

        if (data.unlocked) {
            _state.unlocked = true;
            _state.currentSection = data.currentSection || "section-home";
        }

        return data;
    },

    /** Efface le stockage et recharge la page. */
    reset: () => {
        Storage.clear();
        location.reload();
    }

};
