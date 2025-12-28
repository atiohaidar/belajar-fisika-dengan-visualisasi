/**
 * Main Application - Entry point dan koordinasi semua komponen
 */

class App {
    constructor() {
        // Core components
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.engine = new Engine(this.renderer);

        // State
        this.currentLevel = null;
        this.selectedTopic = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        // Setup engine callbacks
        this.engine.onStateChange = (state) => this.handleStateChange(state);
        this.engine.onSimulationComplete = (result) => this.handleSimulationComplete(result);
        this.engine.onTimeUpdate = (data) => this.updateSimulationInfo(data);

        // Setup input change callback
        InputPanel.onInputChange = (inputs) => this.engine.setUserInputs(inputs);

        // Bind event listeners
        this.bindEvents();

        // Load progress and update UI
        this.updateProgressUI();

        // Check if should resume
        const progress = Storage.getProgress();
        if (progress.currentLevel > 1) {
            document.getElementById('continueBtn').classList.remove('hidden');
        }

        console.log('🎮 Fisika Game initialized!');
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Topic cards
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', () => {
                const topic = card.dataset.topic;
                this.showLevelSelect(topic);
            });
        });

        // Continue button
        document.getElementById('continueBtn')?.addEventListener('click', () => {
            const level = LevelManager.getLastUnlockedLevel();
            if (level) {
                this.startLevel(level.id);
            }
        });

        // Menu button
        document.getElementById('menuBtn')?.addEventListener('click', () => {
            this.showMenu();
        });

        // Answer form
        document.getElementById('answerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitAnswer();
        });

        // Hint button
        document.getElementById('hintBtn')?.addEventListener('click', () => {
            this.showHints();
        });

        // Close modals
        document.getElementById('closeLevelModal')?.addEventListener('click', () => {
            this.hideLevelSelect();
        });

        document.getElementById('closeHintModal')?.addEventListener('click', () => {
            this.hideHints();
        });

        // Click outside modal to close
        document.getElementById('levelModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'levelModal') {
                this.hideLevelSelect();
            }
        });

        document.getElementById('hintModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'hintModal') {
                this.hideHints();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideLevelSelect();
                this.hideHints();
            }
        });
    }

    /**
     * Show level selection modal
     * @param {string} topic - Topic type (glb, glbb, parabola)
     */
    showLevelSelect(topic) {
        this.selectedTopic = topic.toUpperCase();

        const modal = document.getElementById('levelModal');
        const title = document.getElementById('modalTitle');
        const list = document.getElementById('levelList');

        if (!modal || !list) return;

        // Set title
        const titles = {
            GLB: 'Gerak Lurus Beraturan (GLB)',
            GLBB: 'Gerak Lurus Berubah Beraturan (GLBB)',
            PARABOLA: 'Gerak Parabola'
        };
        title.textContent = titles[this.selectedTopic] || 'Pilih Level';

        // Get levels for this topic
        const levels = LevelManager.getAllLevelsWithProgress()
            .filter(l => l.type === this.selectedTopic);

        // Render level cards
        list.innerHTML = levels.map(level => this.renderLevelCard(level)).join('');

        // Add click listeners
        list.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', () => {
                const levelId = parseInt(card.dataset.levelId);
                if (!card.classList.contains('locked')) {
                    this.hideLevelSelect();
                    this.startLevel(levelId);
                }
            });
        });

        modal.classList.remove('hidden');
    }

    /**
     * Render a level card
     * @param {Object} level - Level with progress
     * @returns {string} HTML string
     */
    renderLevelCard(level) {
        const stateClass = level.isCompleted ? 'completed' : (level.isUnlocked ? '' : 'locked');
        const stars = level.stars || 0;

        return `
            <div class="level-card ${stateClass}" data-level-id="${level.id}">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${level.isUnlocked ? 'from-blue-500 to-blue-600' : 'from-slate-600 to-slate-700'} flex items-center justify-center text-xl font-bold">
                    ${level.isUnlocked ? level.id : '🔒'}
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-white">${level.title}</h4>
                    <p class="text-sm text-slate-400 line-clamp-1">${level.description}</p>
                </div>
                <div class="text-right">
                    <div class="flex gap-0.5 mb-1 justify-end">
                        ${[1, 2, 3].map(i => `
                            <span class="text-sm ${i <= stars ? 'text-yellow-400' : 'text-slate-600'}">
                                ${i <= stars ? '⭐' : '☆'}
                            </span>
                        `).join('')}
                    </div>
                    ${level.isCompleted ? `
                        <span class="text-xs text-green-400">${level.score} poin</span>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Hide level selection modal
     */
    hideLevelSelect() {
        document.getElementById('levelModal')?.classList.add('hidden');
    }

    /**
     * Start a level
     * @param {number} levelId - Level ID
     */
    startLevel(levelId) {
        const level = LevelManager.getLevelWithProgress(levelId);
        if (!level) {
            console.error('Level not found:', levelId);
            return;
        }

        if (!level.isUnlocked) {
            alert('Level ini masih terkunci! Selesaikan level sebelumnya terlebih dahulu.');
            return;
        }

        this.currentLevel = level;

        // Update UI
        document.getElementById('menuScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        document.getElementById('levelIndicator').classList.remove('hidden');

        // Update header
        document.getElementById('currentLevel').textContent = level.id;
        document.getElementById('totalLevels').textContent = LevelManager.getTotalLevels();

        // Render panels
        QuestionPanel.render(level);
        QuestionPanel.renderFormulas(level);
        InputPanel.render(level);
        FeedbackPanel.hide();

        // Hide simulation info initially
        document.getElementById('simInfo')?.classList.add('hidden');

        // Start engine with level
        this.engine.setLevel(level);

        // Set initial inputs
        this.engine.setUserInputs(InputPanel.getInputs());
    }

    /**
     * Submit answer and start simulation
     */
    submitAnswer() {
        const inputs = InputPanel.getInputs();
        const validation = this.engine.startSimulation();

        if (!validation.valid) {
            InputPanel.showErrors(validation.errors);
            return;
        }

        // Show simulation info
        document.getElementById('simInfo')?.classList.remove('hidden');

        // Disable submit during simulation
        InputPanel.setLoading(true);
    }

    /**
     * Handle state change from engine
     * @param {string} state - New state
     */
    handleStateChange(state) {
        if (state === CONSTANTS.GAME_STATES.RESULT) {
            InputPanel.setLoading(false);
        }
    }

    /**
     * Handle simulation complete
     * @param {Object} result - Simulation result
     */
    handleSimulationComplete(result) {
        // Save progress if successful
        if (result.stars >= 1) {
            const progress = Storage.completeLevel(
                this.currentLevel.id,
                result.score,
                result.stars
            );

            // Update total score in header
            document.getElementById('totalScore').textContent = progress.totalScore;

            // Update progress UI
            this.updateProgressUI();
        }

        // Show feedback
        FeedbackPanel.show(result, this.currentLevel);
    }

    /**
     * Update simulation info display
     * @param {Object} data - Time, position, velocity data
     */
    updateSimulationInfo(data) {
        document.getElementById('simTime').innerHTML = `${data.time} <span class="text-sm">s</span>`;
        document.getElementById('simPosition').innerHTML = `${data.position} <span class="text-sm">m</span>`;
        document.getElementById('simVelocity').innerHTML = `${data.velocity} <span class="text-sm">m/s</span>`;
    }

    /**
     * Go to next level
     */
    nextLevel() {
        if (!this.currentLevel) return;

        const nextLevel = LevelManager.getNextLevel(this.currentLevel.id);

        if (nextLevel) {
            this.startLevel(nextLevel.id);
        } else {
            // All levels completed!
            alert('🎉 Selamat! Kamu telah menyelesaikan semua level!');
            this.showMenu();
        }
    }

    /**
     * Reset current level
     */
    reset() {
        if (!this.currentLevel) return;

        this.engine.reset();
        FeedbackPanel.hide();
        InputPanel.setLoading(false);
        document.getElementById('simInfo')?.classList.add('hidden');
    }

    /**
     * Show menu screen
     */
    showMenu() {
        this.engine.stopSimulation();

        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('menuScreen').classList.remove('hidden');
        document.getElementById('levelIndicator').classList.add('hidden');

        this.updateProgressUI();
    }

    /**
     * Update progress UI on menu screen
     */
    updateProgressUI() {
        const progress = Storage.getProgress();

        // Update topic progress
        document.getElementById('glbProgress').textContent = `${progress.glbCompleted}/3 ⭐`;
        document.getElementById('glbbProgress').textContent = `${progress.glbbCompleted}/3 ⭐`;
        document.getElementById('parabolaProgress').textContent = `${progress.parabolaCompleted}/4 ⭐`;

        // Update total score
        document.getElementById('totalScore').textContent = progress.totalScore;

        // Show/hide continue button
        const continueBtn = document.getElementById('continueBtn');
        if (progress.currentLevel > 1 && progress.currentLevel <= LevelManager.getTotalLevels()) {
            continueBtn?.classList.remove('hidden');
        } else if (progress.currentLevel > LevelManager.getTotalLevels()) {
            // All completed
            if (continueBtn) {
                continueBtn.textContent = '🏆 Semua Level Selesai!';
                continueBtn.disabled = true;
                continueBtn.classList.add('opacity-50');
            }
        }
    }

    /**
     * Show hints modal
     */
    showHints() {
        if (!this.currentLevel) return;

        const modal = document.getElementById('hintModal');
        const content = document.getElementById('hintContent');

        if (!modal || !content) return;

        const hints = this.currentLevel.hints || [];

        content.innerHTML = `
            <div class="space-y-3">
                ${hints.map((hint, i) => `
                    <div class="hint-item animate-slide-up" style="animation-delay: ${i * 0.1}s">
                        <span class="text-blue-400 font-medium">Petunjuk ${i + 1}:</span>
                        <p class="text-slate-300 mt-1">${hint}</p>
                    </div>
                `).join('')}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    /**
     * Hide hints modal
     */
    hideHints() {
        document.getElementById('hintModal')?.classList.add('hidden');
    }
}

// Initialize app when DOM is ready
let app;
let game;

document.addEventListener('DOMContentLoaded', () => {
    app = new App();
    game = app.engine;

    // Expose to window for debugging
    window.app = app;
    window.game = game;
});
