/* ====================================================================
   QUIZ.JS — Moteur de quiz générique
   --------------------------------------------------------------------
   startQuiz(key) — initialise et affiche la 1ʳᵉ question du quiz.
   Chaque quiz est défini dans config.js → QUIZZES.

   Deux types de questions (voir config.js) :
     • sans champ `correct` → toutes les réponses sont valides,
       n'importe quel clic passe à la suite ;
     • avec `correct` / `positiveFeedback` / `negativeFeedbacks` →
       il faut trouver la bonne réponse. Bonne → Mini Anto-Man félicite
       puis question suivante ; mauvaise → le bouton devient rouge,
       Mini Anto-Man réplique, et on reste pour réessayer.
==================================================================== */

const Quiz = (() => {

    // État interne : { [quizKey]: { index, wrong } }
    //   index = question courante ; wrong = nb d'erreurs sur cette question
    const _quizState = {};

    /* ------------------------------------------------------------------
       Rendu d'une question
    ------------------------------------------------------------------ */

    /** Avance à la question suivante (remet le compteur d'erreurs à zéro). */
    function _goNext(key) {
        _quizState[key].index++;
        _quizState[key].wrong = 0;
        _render(key);
    }

    /** Gère un clic sur une option d'une question « à bonne réponse ». */
    function _handleGatedAnswer(key, question, optionIndex, btn, optionsWrapper) {
        if (btn.disabled) return;
        const st = _quizState[key];

        if (optionIndex === question.correct) {
            // Bonne réponse : on verrouille, on félicite, puis on enchaîne.
            Array.from(optionsWrapper.children).forEach((b) => (b.disabled = true));
            btn.classList.add("correct");
            if (question.positiveFeedback) Guide.showMessage(question.positiveFeedback);
            setTimeout(() => _goNext(key), 1150);
        } else {
            // Mauvaise réponse : bouton rouge, réplique, on reste sur la question.
            btn.classList.add("wrong");
            btn.disabled = true;
            const feedbacks = question.negativeFeedbacks || [];
            if (feedbacks.length) {
                Guide.showMessage(feedbacks[Math.min(st.wrong, feedbacks.length - 1)]);
            }
            st.wrong++;
        }
    }

    /** Affiche la question courante, ou le résultat si le quiz est terminé. */
    function _render(key) {
        const quiz = QUIZZES[key];
        const container = document.getElementById("quiz-container-" + key);
        if (!quiz || !container) return;

        const index = _quizState[key].index;
        if (index >= quiz.questions.length) {
            _renderResult(key, container, quiz);
            return;
        }

        const question = quiz.questions[index];
        const isGated = Number.isInteger(question.correct);
        container.innerHTML = "";

        // Indicateur de progression
        const progress = document.createElement("p");
        progress.className = "quiz-progress";
        progress.textContent = `Question ${index + 1} / ${quiz.questions.length}`;

        // Énoncé
        const heading = document.createElement("h3");
        heading.className = "quiz-question";
        heading.textContent = question.question;
        heading.setAttribute("tabindex", "-1");

        // Options de réponse
        const optionsWrapper = document.createElement("div");
        optionsWrapper.className = "quiz-options";
        optionsWrapper.setAttribute("role", "group");
        optionsWrapper.setAttribute("aria-label", "Choix de réponse");

        question.options.forEach((optionText, optionIndex) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quiz-option-btn";
            btn.textContent = optionText;
            btn.addEventListener("click", () => {
                if (isGated) {
                    _handleGatedAnswer(key, question, optionIndex, btn, optionsWrapper);
                } else {
                    _goNext(key);
                }
            });
            optionsWrapper.appendChild(btn);
        });

        container.appendChild(progress);
        container.appendChild(heading);
        container.appendChild(optionsWrapper);
        heading.focus();
    }

    /** Affiche le résultat final du quiz avec le bouton « Continuer ». */
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

        // Quiz Océane terminé → on masque le h3 d'avertissement.
        if (key === "ocean") {
            const warning = document.getElementById("quiz-warning");
            if (warning) warning.style.display = "none";
        }

        Gauge.updateStep(quiz.progressKey);
        Guide.showMessage(GUIDE_MESSAGES.quizDone);
        resultText.focus();
    }

    /* ------------------------------------------------------------------
       API publique
    ------------------------------------------------------------------ */

    /**
     * Initialise l'état du quiz et affiche la 1ʳᵉ question.
     * Appelé automatiquement par Navigation.goToSection() si data-quiz est présent.
     * @param {string} key - Clé du quiz dans QUIZZES
     */
    function startQuiz(key) {
        // Le quiz Océane masque son avertissement une fois terminé ; on le
        // ré-affiche si on rejoue depuis le début.
        if (key === "ocean") {
            const warning = document.getElementById("quiz-warning");
            if (warning) warning.style.display = "";
        }
        _quizState[key] = {index: 0, wrong: 0};
        _render(key);
    }

    return {startQuiz};

})();
