/* ====================================================================
   QUIZ.JS — Moteur de quiz générique
   --------------------------------------------------------------------
   startQuiz(key)  — initialise et affiche le 1er question du quiz
   Chaque quiz est défini dans config.js → QUIZZES.
   Toutes les réponses sont valides (c'est pour le fun !).
==================================================================== */

const Quiz = (() => {

    // État interne : { [quizKey]: { index: number } }
    const _quizState = {};

    /* ------------------------------------------------------------------
       Rendu
    ------------------------------------------------------------------ */

    /** Affiche la question courante ou le résultat si quiz terminé. */
    function _render(key) {
        const quiz = QUIZZES[key];
        const container = document.getElementById("quiz-container-" + key);
        if (!quiz || !container) return;

        const index = _quizState[key].index;

        if (index >= quiz.questions.length) {
            _renderResult(key, container, quiz);
            return;
        }

        const q = quiz.questions[index];
        container.innerHTML = "";

        // Indicateur de progression
        const progress = document.createElement("p");
        progress.className = "quiz-progress";
        progress.textContent = `Question ${index + 1} / ${quiz.questions.length}`;

        // Question
        const question = document.createElement("h3");
        question.className = "quiz-question";
        question.textContent = q.question;
        question.setAttribute("tabindex", "-1");

        // Options de réponse
        const optionsWrapper = document.createElement("div");
        optionsWrapper.className = "quiz-options";
        optionsWrapper.setAttribute("role", "group");
        optionsWrapper.setAttribute("aria-label", "Choix de réponse");

        q.options.forEach((optionText) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quiz-option-btn";
            btn.textContent = optionText;
            btn.addEventListener("click", () => {
                _quizState[key].index++;
                _render(key);
            });
            optionsWrapper.appendChild(btn);
        });

        container.appendChild(progress);
        container.appendChild(question);
        container.appendChild(optionsWrapper);
        question.focus();
    }

    /** Affiche le résultat final du quiz avec le bouton "Continuer". */
    function _renderResult(key, container, quiz) {
        container.innerHTML = "";

        const resultText = document.createElement("p");
        resultText.className = "quiz-result-text";
        resultText.textContent = quiz.result;
        resultText.setAttribute("tabindex", "-1");

        const continueBtn = document.createElement("button");
        continueBtn.type = "button";
        continueBtn.className = "btn btn-primary";
        continueBtn.textContent = "Continuer";
        continueBtn.addEventListener("click", () => Navigation.goToSection(quiz.next));

        container.appendChild(resultText);
        container.appendChild(continueBtn);

        Gauge.updateStep(quiz.progressKey);
        Guide.showMessage(GUIDE_MESSAGES.quizDone);
        resultText.focus();
    }

    /* ------------------------------------------------------------------
       API publique
    ------------------------------------------------------------------ */

    /**
     * Initialise l'état du quiz et affiche la 1ère question.
     * Appelé automatiquement par Navigation.goToSection() si data-quiz est présent.
     * @param {string} key - Clé du quiz dans QUIZZES
     */
    function startQuiz(key) {
        _quizState[key] = {index: 0};
        _render(key);
    }

    return {startQuiz};

})();
