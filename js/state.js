/* ====================================================================
   STATE.JS — État global de l'application
   --------------------------------------------------------------------
   Source de vérité unique. Toute modification passe par les fonctions
   exportées — jamais par accès direct à `state` depuis l'extérieur.
==================================================================== */

const SIMULATOR_QUEST_KEYS = SIMULATOR_QUESTS.map((q) => q.key);

// Clés de progression des quiz (dérivées de QUIZZES, dans l'ordre de définition)
const QUIZ_PROGRESS_KEYS = Object.values(QUIZZES).map((q) => q.progressKey);

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

    /** true quand le mini-jeu Simulateur est terminé (les 6 quêtes faites). */
    isSimulatorComplete: () => SIMULATOR_QUEST_KEYS.every((key) => _state.progress[key]),

    /** true quand le mini-jeu Quiz est terminé (les 5 quiz faits). */
    isQuizComplete: () => QUIZ_PROGRESS_KEYS.every((key) => _state.progress[key]),

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

    /**
     * Pourcentage de la jauge globale (0–100), pondéré selon GAUGE_WEIGHTS :
     *   password 10 % + impossible 10 % + simulateur 40 % + quiz 40 %.
     * Les parts simulateur et quiz se remplissent au prorata des quêtes /
     * quiz terminés, ce qui fait grimper la jauge au fil de chaque mini-jeu.
     * @returns {number} pourcentage arrondi
     */
    gaugePercent: () => {
        let percent = 0;

        if (_state.progress.password) percent += GAUGE_WEIGHTS.password;
        if (_state.progress.impossible) percent += GAUGE_WEIGHTS.impossible;

        const questsDone = SIMULATOR_QUEST_KEYS.filter((key) => _state.progress[key]).length;
        percent += GAUGE_WEIGHTS.simulator * (questsDone / SIMULATOR_QUEST_KEYS.length);

        const quizDone = QUIZ_PROGRESS_KEYS.filter((key) => _state.progress[key]).length;
        percent += GAUGE_WEIGHTS.quiz * (quizDone / QUIZ_PROGRESS_KEYS.length);

        return Math.round(percent);
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
