/**
 * UIManager - Mengelola UI screens, modals, dan updates
 */

const UIManager = {
    // DOM Element references
    elements: {
        // Screens
        menuScreen: null,
        gameScreen: null,

        // Modals
        levelModal: null,
        hintModal: null,

        // Header elements
        levelIndicator: null,
        currentLevel: null,
        totalLevels: null,
        totalScore: null,

        // Progress indicators
        glbProgress: null,
        glbbProgress: null,
        parabolaProgress: null,

        // Panels
        simInfo: null,
        feedbackPanel: null,
        explanationPanel: null
    },

    /**
     * Initialize UI Manager - cache DOM elements
     */
    init() {
        // Screens
        this.elements.menuScreen = document.getElementById('menuScreen');
        this.elements.gameScreen = document.getElementById('gameScreen');

        // Modals
        this.elements.levelModal = document.getElementById('levelModal');
        this.elements.hintModal = document.getElementById('hintModal');

        // Header
        this.elements.levelIndicator = document.getElementById('levelIndicator');
        this.elements.currentLevel = document.getElementById('currentLevel');
        this.elements.totalLevels = document.getElementById('totalLevels');
        this.elements.totalScore = document.getElementById('totalScore');

        // Progress
        this.elements.glbProgress = document.getElementById('glbProgress');
        this.elements.glbbProgress = document.getElementById('glbbProgress');
        this.elements.parabolaProgress = document.getElementById('parabolaProgress');

        // Panels
        this.elements.simInfo = document.getElementById('simInfo');
        this.elements.feedbackPanel = document.getElementById('feedbackPanel');
        this.elements.explanationPanel = document.getElementById('explanationPanel');
    },

    // ==================== Screen Management ====================

    /**
     * Show menu screen
     */
    showMenuScreen() {
        this.elements.menuScreen?.classList.remove('hidden');
        this.elements.gameScreen?.classList.add('hidden');
        this.elements.levelIndicator?.classList.add('hidden');
    },

    /**
     * Show game screen
     */
    showGameScreen() {
        this.elements.menuScreen?.classList.add('hidden');
        this.elements.gameScreen?.classList.remove('hidden');
        this.elements.levelIndicator?.classList.remove('hidden');
    },

    // ==================== Modal Management ====================

    /**
     * Show level selection modal
     * @param {string} title - Modal title
     * @param {string} listHTML - HTML content for level list
     */
    showLevelModal(title, listHTML) {
        const modal = this.elements.levelModal;
        if (!modal) return;

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('levelList').innerHTML = listHTML;
        modal.classList.remove('hidden');
    },

    /**
     * Hide level selection modal
     */
    hideLevelModal() {
        this.elements.levelModal?.classList.add('hidden');
    },

    /**
     * Show hint modal
     * @param {string} contentHTML - Hint content HTML
     */
    showHintModal(contentHTML) {
        const modal = this.elements.hintModal;
        if (!modal) return;

        document.getElementById('hintContent').innerHTML = contentHTML;
        modal.classList.remove('hidden');
    },

    /**
     * Hide hint modal
     */
    hideHintModal() {
        this.elements.hintModal?.classList.add('hidden');
    },

    // ==================== Header Updates ====================

    /**
     * Update level indicator in header
     * @param {number} current - Current level number
     * @param {number} total - Total levels
     */
    updateLevelIndicator(current, total) {
        if (this.elements.currentLevel) {
            this.elements.currentLevel.textContent = current;
        }
        if (this.elements.totalLevels) {
            this.elements.totalLevels.textContent = total;
        }
    },

    /**
     * Update total score in header
     * @param {number} score - Total score
     */
    updateTotalScore(score) {
        if (this.elements.totalScore) {
            this.elements.totalScore.textContent = score;
        }
    },

    // ==================== Progress Updates ====================

    /**
     * Update progress UI on menu screen
     * @param {Object} progressData - { glb, glbb, parabola }
     */
    updateProgressUI(progressData) {
        const formatProgress = (completed, total) => `${completed}/${total} ⭐`;

        if (this.elements.glbProgress) {
            this.elements.glbProgress.textContent = formatProgress(progressData.glb.completed, progressData.glb.total);
        }
        if (this.elements.glbbProgress) {
            this.elements.glbbProgress.textContent = formatProgress(progressData.glbb.completed, progressData.glbb.total);
        }
        if (this.elements.parabolaProgress) {
            this.elements.parabolaProgress.textContent = formatProgress(progressData.parabola.completed, progressData.parabola.total);
        }
    },

    // ==================== Panel Management ====================

    /**
     * Show/hide simulation info panel
     * @param {boolean} show - Whether to show
     */
    toggleSimInfo(show) {
        if (this.elements.simInfo) {
            this.elements.simInfo.classList.toggle('hidden', !show);
        }
    },

    /**
     * Update simulation info display
     * @param {Object} data - { time, position, velocity }
     */
    updateSimulationInfo(data) {
        const timeEl = document.getElementById('simTime');
        const posEl = document.getElementById('simPosition');
        const velEl = document.getElementById('simVelocity');

        if (timeEl) timeEl.innerHTML = `${data.time} <span class="text-sm">s</span>`;
        if (posEl) posEl.innerHTML = `${data.position} <span class="text-sm">m</span>`;
        if (velEl) velEl.innerHTML = `${data.velocity} <span class="text-sm">m/s</span>`;
    },

    /**
     * Show/hide feedback panel
     * @param {boolean} show - Whether to show
     * @param {string} contentHTML - HTML content (optional)
     */
    toggleFeedbackPanel(show, contentHTML = null) {
        if (this.elements.feedbackPanel) {
            this.elements.feedbackPanel.classList.toggle('hidden', !show);
            if (contentHTML) {
                document.getElementById('feedbackContent').innerHTML = contentHTML;
            }
        }
    },

    /**
     * Show/hide explanation panel
     * @param {boolean} show - Whether to show
     * @param {string} contentHTML - HTML content (optional)
     */
    toggleExplanationPanel(show, contentHTML = null) {
        if (this.elements.explanationPanel) {
            this.elements.explanationPanel.classList.toggle('hidden', !show);
            if (contentHTML) {
                document.getElementById('explanationContent').innerHTML = contentHTML;
            }
        }
    }
};
