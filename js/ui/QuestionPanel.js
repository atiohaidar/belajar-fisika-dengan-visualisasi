/**
 * QuestionPanel - Menampilkan soal dan rumus
 */

export const QuestionPanel = {
    /**
     * Render panel soal
     * @param {Object} level - Level configuration
     */
    render(level) {
        const container = document.getElementById('questionContent');
        if (!container) return;

        const given = level.given || {};

        let html = `
            <p class="text-slate-300 mb-4">${level.description}</p>
            
            <div class="space-y-2 mb-4">
                <h4 class="text-sm font-semibold text-slate-400 uppercase tracking-wide">Diketahui:</h4>
        `;

        // Render given values
        for (const [key, data] of Object.entries(given)) {
            html += `
                <div class="given-value">
                    <span class="given-label">${data.label}</span>
                    <span class="given-number">${data.value} ${data.unit}</span>
                </div>
            `;
        }

        html += `
            </div>
            
            <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                <h4 class="text-sm font-semibold text-blue-400 mb-1">🎯 Yang Dicari:</h4>
                <p class="text-white font-medium">${this.formatFindLabels(level)}</p>
            </div>
        `;

        container.innerHTML = html;
    },

    /**
     * Format labels untuk yang dicari
     * @param {Object} level - Level configuration
     * @returns {string} Formatted labels
     */
    formatFindLabels(level) {
        const findLabels = {
            velocity: 'Kecepatan (v)',
            acceleration: 'Percepatan (a)',
            angle: 'Sudut (θ)',
            time: 'Waktu (t)',
            distance: 'Jarak (s)'
        };

        return (level.find || [])
            .map(f => findLabels[f] || f)
            .join(', ');
    },

    /**
     * Render panel rumus
     * @param {Object} level - Level configuration
     */
    renderFormulas(level) {
        const container = document.getElementById('formulaContent');
        if (!container) return;

        const formulas = level.formulas || [];

        let html = '';

        formulas.forEach((formula, index) => {
            html += `
                <div class="formula animate-slide-up" style="animation-delay: ${index * 0.1}s">
                    ${formula}
                </div>
            `;
        });

        // Add explanation if exists
        if (level.explanation) {
            html += `
                <div class="mt-4 text-sm text-slate-400">
                    ${level.explanation}
                </div>
            `;
        }

        container.innerHTML = html;
    }
};
