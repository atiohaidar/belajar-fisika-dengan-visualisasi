import { UIManager } from '../ui/UIManager.js';
import { LevelManager } from ('../levels/LevelManager.js');

/**
 * EventManager - Centralized event binding
 * Handles user interactions and delegates to appropriate handlers
 */

export const EventManager = {
    // Reference to app instance
    app: null,

    /**
     * Initialize Event Manager
     * @param {Object} app - App instance reference
     */
    init(app) {
        this.app = app;
        this.bindMenuEvents();
        this.bindGameEvents();
        this.bindModalEvents();
        this.bindKeyboardEvents();
    },

    /**
     * Bind menu screen events
     */
    bindMenuEvents() {
        // Topic selection cards
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', () => {
                const topic = card.dataset.topic;
                if (topic && this.app) {
                    this.app.showLevelSelect(topic);
                }
            });
        });

        // Continue button
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (this.app) {
                    const lastLevel = LevelManager.getLastUnlockedLevel();
                    if (lastLevel) {
                        this.app.startLevel(lastLevel.id);
                    }
                }
            });
        }

        // Menu button
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                if (this.app) {
                    this.app.showMenu();
                }
            });
        }
    },

    /**
     * Bind game screen events
     */
    bindGameEvents() {
        // Answer form submission
        const answerForm = document.getElementById('answerForm');
        if (answerForm) {
            answerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.app) {
                    this.app.submitAnswer();
                }
            });
        }

        // Hint button
        const hintBtn = document.getElementById('hintBtn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                if (this.app) {
                    this.app.showHints();
                }
            });
        }
    },

    /**
     * Bind modal events
     */
    bindModalEvents() {
        // Close level modal
        const closeLevelModal = document.getElementById('closeLevelModal');
        if (closeLevelModal) {
            closeLevelModal.addEventListener('click', () => {
                UIManager.hideLevelModal();
            });
        }

        // Close hint modal
        const closeHintModal = document.getElementById('closeHintModal');
        if (closeHintModal) {
            closeHintModal.addEventListener('click', () => {
                UIManager.hideHintModal();
            });
        }

        // Close modals on backdrop click
        const levelModal = document.getElementById('levelModal');
        if (levelModal) {
            levelModal.addEventListener('click', (e) => {
                if (e.target === levelModal) {
                    UIManager.hideLevelModal();
                }
            });
        }

        const hintModal = document.getElementById('hintModal');
        if (hintModal) {
            hintModal.addEventListener('click', (e) => {
                if (e.target === hintModal) {
                    UIManager.hideHintModal();
                }
            });
        }
    },

    /**
     * Bind keyboard events
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // ESC to close modals
            if (e.key === 'Escape') {
                UIManager.hideLevelModal();
                UIManager.hideHintModal();
            }

            // Enter to submit (if input focused)
            if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
                const form = document.getElementById('answerForm');
                if (form && this.app) {
                    e.preventDefault();
                    this.app.submitAnswer();
                }
            }
        });
    },

    /**
     * Bind level card click events (called dynamically after level list render)
     */
    bindLevelCardEvents() {
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', () => {
                const levelId = parseInt(card.dataset.levelId);
                if (levelId && this.app) {
                    UIManager.hideLevelModal();
                    this.app.startLevel(levelId);
                }
            });
        });
    },

    /**
     * Bind next level button (called dynamically after feedback render)
     * @param {Function} callback - Next level callback
     */
    bindNextLevelButton(callback) {
        const nextBtn = document.getElementById('nextLevelBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', callback);
        }
    },

    /**
     * Bind retry button (called dynamically after feedback render)
     * @param {Function} callback - Retry callback
     */
    bindRetryButton(callback) {
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', callback);
        }
    }
};
