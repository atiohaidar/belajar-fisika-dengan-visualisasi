/**
 * FeedbackPanel - Menampilkan hasil dan feedback
 */

const FeedbackPanel = {
    /**
     * Show feedback panel with results
     * @param {Object} result - Simulation result
     * @param {Object} level - Level configuration
     */
    show(result, level) {
        const panel = document.getElementById('feedbackPanel');
        const content = document.getElementById('feedbackContent');

        if (!panel || !content) return;

        // Determine feedback type
        let feedbackClass, icon, title, message;

        if (result.allCorrect || result.rating === 'perfect') {
            feedbackClass = 'feedback-success';
            icon = '🎉';
            title = 'Sempurna!';
            message = 'Jawabanmu tepat sekali! Kamu benar-benar memahami konsep ini.';
        } else if (result.rating === 'close') {
            feedbackClass = 'feedback-success';
            icon = '👍';
            title = 'Hampir Tepat!';
            message = 'Jawabanmu sudah sangat dekat dengan yang benar!';
        } else if (result.rating === 'partial') {
            feedbackClass = 'feedback-partial';
            icon = '💪';
            title = 'Cukup Baik!';
            message = 'Masih ada sedikit selisih, tapi kamu di jalur yang benar!';
        } else {
            feedbackClass = 'feedback-error';
            icon = '🤔';
            title = 'Coba Lagi!';
            message = 'Jangan menyerah! Cek kembali perhitunganmu.';
        }

        content.innerHTML = `
            <div class="${feedbackClass} rounded-xl p-6 animate-slide-up">
                <div class="flex items-start gap-4">
                    <span class="text-4xl">${icon}</span>
                    <div class="flex-1">
                        <h3 class="text-xl font-bold mb-2">${title}</h3>
                        <p class="text-slate-300 mb-4">${message}</p>
                        
                        <!-- Score -->
                        <div class="flex items-center gap-4 mb-4">
                            <div class="flex gap-1">
                                ${this.renderStars(result.stars)}
                            </div>
                            <span class="text-2xl font-bold text-yellow-400">+${result.score} poin</span>
                        </div>
                        
                        <!-- Result Details -->
                        ${this.renderResultDetails(result, level)}
                        
                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-3 mt-6">
                            <button id="retryBtn" class="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors flex items-center gap-2">
                                <span>🔄</span> Coba Lagi
                            </button>
                            <button id="showExplanationBtn" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors flex items-center gap-2">
                                <span>📖</span> Lihat Penjelasan
                            </button>
                            ${result.allCorrect || result.stars >= 1 ? `
                                <button id="nextLevelBtn" class="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-medium transition-colors flex items-center gap-2">
                                    <span>➡️</span> Level Berikutnya
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        panel.classList.remove('hidden');

        // Add event listeners
        this.attachEventListeners();
    },

    /**
     * Render star rating
     * @param {number} stars - Number of stars (0-3)
     * @returns {string} HTML string
     */
    renderStars(stars) {
        let html = '';
        for (let i = 0; i < 3; i++) {
            if (i < stars) {
                html += '<span class="text-2xl text-yellow-400">⭐</span>';
            } else {
                html += '<span class="text-2xl text-slate-600">☆</span>';
            }
        }
        return html;
    },

    /**
     * Render result details
     * @param {Object} result - Simulation result
     * @param {Object} level - Level configuration
     * @returns {string} HTML string
     */
    renderResultDetails(result, level) {
        let html = '<div class="bg-slate-800/50 rounded-lg p-4 space-y-2">';

        // Show per-input results if available
        if (result.results) {
            for (const [key, data] of Object.entries(result.results)) {
                const input = level.inputs?.find(i => i.id === key);
                const label = input?.label || key;
                const unit = input?.unit || '';

                html += `
                    <div class="flex items-center justify-between">
                        <span class="text-slate-400">${label}:</span>
                        <div class="flex items-center gap-2">
                            <span class="${data.isCorrect ? 'text-green-400' : 'text-red-400'} font-medium">
                                ${Helpers.roundTo(data.userValue, 2)} ${unit}
                            </span>
                            ${!data.isCorrect ? `
                                <span class="text-slate-500">→</span>
                                <span class="text-blue-400">${Helpers.roundTo(data.expectedValue, 2)} ${unit}</span>
                            ` : ''}
                            <span>${data.isCorrect ? '✅' : '❌'}</span>
                        </div>
                    </div>
                `;
            }
        }

        // Show simulation results
        if (level.type === CONSTANTS.LEVEL_TYPES.GLB || level.type === CONSTANTS.LEVEL_TYPES.GLBB) {
            html += `
                <hr class="border-slate-700 my-2">
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Posisi Akhir:</span>
                    <span class="text-white font-medium">${Helpers.roundTo(result.finalPosition, 2)} m</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Target:</span>
                    <span class="text-white font-medium">${result.targetDistance} m</span>
                </div>
            `;
        } else if (level.type === CONSTANTS.LEVEL_TYPES.PARABOLA) {
            html += `
                <hr class="border-slate-700 my-2">
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Jangkauan:</span>
                    <span class="text-white font-medium">${result.range} m</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Tinggi Maksimum:</span>
                    <span class="text-white font-medium">${result.maxHeight} m</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Waktu di Udara:</span>
                    <span class="text-white font-medium">${result.timeOfFlight} s</span>
                </div>
            `;
        }

        html += '</div>';
        return html;
    },

    /**
     * Attach event listeners to buttons
     */
    attachEventListeners() {
        const retryBtn = document.getElementById('retryBtn');
        const showExplanationBtn = document.getElementById('showExplanationBtn');
        const nextLevelBtn = document.getElementById('nextLevelBtn');

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                if (window.game) {
                    window.game.reset();
                }
            });
        }

        if (showExplanationBtn) {
            showExplanationBtn.addEventListener('click', () => {
                if (window.game) {
                    this.showExplanation(window.game.getExplanationSteps());
                }
            });
        }

        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                if (window.app) {
                    window.app.nextLevel();
                }
            });
        }
    },

    /**
     * Show explanation panel
     * @param {Array} steps - Explanation steps
     */
    showExplanation(steps) {
        const panel = document.getElementById('explanationPanel');
        const content = document.getElementById('explanationContent');

        if (!panel || !content) return;

        let html = '';

        steps.forEach((step, index) => {
            html += `
                <div class="explanation-step animate-slide-up" style="animation-delay: ${index * 0.1}s">
                    <h4 class="font-semibold text-white mb-2">
                        <span class="explanation-step-number">${index + 1}</span>
                        ${step.title}
                    </h4>
                    <div class="text-slate-300">
                        ${step.content}
                    </div>
                    ${step.formula ? `
                        <div class="formula mt-3">${step.formula}</div>
                    ` : ''}
                </div>
            `;
        });

        content.innerHTML = html;
        panel.classList.remove('hidden');

        // Scroll to explanation
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /**
     * Hide feedback panel
     */
    hide() {
        const panel = document.getElementById('feedbackPanel');
        const explanationPanel = document.getElementById('explanationPanel');

        if (panel) panel.classList.add('hidden');
        if (explanationPanel) explanationPanel.classList.add('hidden');
    }
};
