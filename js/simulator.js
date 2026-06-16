/* ====================================================================
   SIMULATOR.JS — Antoine & Marine Simulator
==================================================================== */

const Simulator = (() => {

    const QUEST_KEYS = SIMULATOR_QUESTS.map((q) => q.key);
    let marineBubble, loveXpValue, loveXpFill, kirikouAvatar,
        kirikouRole, kirikouUnlockEl, dialogueList, simulatorContinueBtn;
    let marineBubbleTimeout = null;

    function _launchSparkles(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const emojis = ["💖", "✨", "⭐", "💫"];
        for (let i = 0; i < 8; i++) {
            const span = document.createElement("span");
            span.className = "sparkle";
            span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            span.style.left = (rect.left + rect.width / 2) + "px";
            span.style.top = (rect.top + rect.height / 2) + "px";
            span.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
            span.style.setProperty("--dy", (-60 - Math.random() * 100) + "px");
            span.style.animationDuration = (0.8 + Math.random() * 0.6) + "s";
            span.addEventListener("animationend", () => span.remove());
            document.body.appendChild(span);
        }
    }

    function _maybeMarineComment() {
        if (Math.random() > MARINE_COMMENT_CHANCE) return;
        const line = MARINE_LINES[Math.floor(Math.random() * MARINE_LINES.length)];
        marineBubble.textContent = line;
        marineBubble.classList.add("visible");
        clearTimeout(marineBubbleTimeout);
        marineBubbleTimeout = setTimeout(() => marineBubble.classList.remove("visible"), 4000);
    }

    function _refreshLoveXP() {
        const done = QUEST_KEYS.filter((key) => State.isDone(key)).length;
        const percent = Math.round((done / QUEST_KEYS.length) * 100);
        loveXpValue.textContent = String(done);
        loveXpFill.style.width = percent + "%";
        return done;
    }

    function _setQuestDone(key) {
        const item = document.querySelector(`.quest-item[data-quest="${key}"]`);
        if (!item) return;
        item.classList.add("done");
        const btn = item.querySelector(".quest-btn");
        if (btn) {
            btn.disabled = true;
            btn.textContent = "✓ Fait";
        }
    }

    function _completeQuest(key) {
        if (State.isDone(key)) return;
        const quest = SIMULATOR_QUESTS.find((q) => q.key === key);
        const item = document.querySelector(`.quest-item[data-quest="${key}"]`);
        _setQuestDone(key);
        Gauge.updateStep(key);
        const done = _refreshLoveXP();
        if (item) _launchSparkles(item);
        if (quest) Guide.showMessage(quest.guideMessage);
        _maybeMarineComment();
        if (done === QUEST_KEYS.length) setTimeout(_unlockKirikou, 900);
    }

    function _buildDialogue(animated) {
        dialogueList.innerHTML = "";
        KIRIKOU_DIALOGUE.forEach((line, i) => {
            const render = () => {
                const li = document.createElement("li");
                li.className = "dialogue-line";
                const strong = document.createElement("strong");
                strong.textContent = line.who + " : ";
                li.appendChild(strong);
                li.appendChild(document.createTextNode(line.text));
                dialogueList.appendChild(li);
                if (animated && i === KIRIKOU_DIALOGUE.length - 1) {
                    setTimeout(() => Guide.showMessage(GUIDE_MESSAGES.kirikouReaction), 900);
                }
            };
            if (animated) {
                setTimeout(render, i * 1100);
            } else {
                render();
                const last = dialogueList.lastElementChild;
                if (last) {
                    last.style.animation = "none";
                    last.style.opacity = "1";
                    last.style.transform = "none";
                }
            }
        });
    }

    function _unlockKirikou() {
        if (State.isKirikouUnlocked()) return;
        State.setKirikouUnlocked(true);
        kirikouAvatar.classList.replace("locked", "unlocked");
        kirikouAvatar.textContent = "🌟";
        kirikouRole.textContent = "Petit mais vaillant";
        Guide.showMessage(GUIDE_MESSAGES.allQuestsDone);
        kirikouUnlockEl.classList.remove("hidden");
        _buildDialogue(true);
        simulatorContinueBtn.classList.remove("hidden");
        State.save();
    }

    function restore() {
        QUEST_KEYS.forEach((key) => {
            if (State.isDone(key)) _setQuestDone(key);
        });
        _refreshLoveXP();
        if (State.isKirikouUnlocked()) {
            kirikouAvatar.classList.replace("locked", "unlocked");
            kirikouAvatar.textContent = "🌟";
            kirikouRole.textContent = "Petit mais vaillant";
            _buildDialogue(false);
            kirikouUnlockEl.classList.remove("hidden");
            simulatorContinueBtn.classList.remove("hidden");
        }
    }

    function init() {
        marineBubble = document.getElementById("marine-bubble");
        kirikouAvatar = document.getElementById("kirikou-avatar");
        kirikouRole = document.getElementById("kirikou-role");
        loveXpValue = document.getElementById("love-xp-value");
        loveXpFill = document.getElementById("love-xp-fill");
        kirikouUnlockEl = document.getElementById("kirikou-unlock");
        dialogueList = document.getElementById("dialogue-list");
        simulatorContinueBtn = document.getElementById("simulator-continue-btn");

        document.querySelectorAll(".quest-item").forEach((item) => {
            const key = item.dataset.quest;
            const btn = item.querySelector(".quest-btn");
            if (btn) btn.addEventListener("click", () => _completeQuest(key));
        });

        simulatorContinueBtn.addEventListener("click", () => {
            Navigation.goToSection("section-quiz-politique");
        });
    }

    return {init, restore};

})();
