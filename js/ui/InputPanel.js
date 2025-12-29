/**
 * InputPanel - Mengelola input form untuk jawaban
 */

export const InputPanel = {
    currentInputs: {},
    onInputChange: null,

    /**
     * Render input form berdasarkan level configuration
     * @param {Object} level - Level configuration
     */
    render(level) {
        const container = document.getElementById('inputFields');
        if (!container) return;

        const inputs = level.inputs || [];
        this.currentInputs = {};

        let html = '';

        inputs.forEach((input, index) => {
            // Set default value
            let defaultValue = '';
            if (input.defaultValue !== undefined) {
                defaultValue = input.defaultValue;
                this.currentInputs[input.id] = input.defaultValue;
            }

            // Check if from given values
            const givenValue = level.given?.[input.id]?.value;
            if (givenValue !== undefined) {
                defaultValue = givenValue;
                this.currentInputs[input.id] = givenValue;
            }

            html += `
                <div class="mb-4 animate-slide-up" style="animation-delay: ${index * 0.1}s">
                    <label for="input-${input.id}" class="block text-sm font-medium text-slate-400 mb-2">
                        ${input.label}
                    </label>
                    <div class="relative">
                        <input 
                            type="number"
                            id="input-${input.id}"
                            name="${input.id}"
                            class="input-field pr-16"
                            placeholder="${input.placeholder || ''}"
                            ${input.min !== undefined ? `min="${input.min}"` : ''}
                            ${input.max !== undefined ? `max="${input.max}"` : ''}
                            ${input.disabled ? 'disabled' : ''}
                            ${defaultValue !== '' ? `value="${defaultValue}"` : ''}
                            step="any"
                        >
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                            ${input.unit}
                        </span>
                    </div>
                    <div id="error-${input.id}" class="text-red-400 text-sm mt-1 hidden"></div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Add event listeners
        inputs.forEach(input => {
            const element = document.getElementById(`input-${input.id}`);
            if (element) {
                element.addEventListener('input', (e) => this.handleInputChange(input.id, e.target.value));
                element.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('submitBtn')?.click();
                    }
                });
            }
        });
    },

    /**
     * Handle input change
     * @param {string} id - Input ID
     * @param {string} value - Input value
     */
    handleInputChange(id, value) {
        this.currentInputs[id] = value;
        this.clearError(id);

        if (this.onInputChange) {
            this.onInputChange(this.getInputs());
        }
    },

    /**
     * Get all input values
     * @returns {Object} Input values
     */
    getInputs() {
        const inputs = {};

        for (const [id, value] of Object.entries(this.currentInputs)) {
            // Don't convert empty strings to 0 - let physics handle defaults
            if (value === '' || value === undefined || value === null) {
                inputs[id] = '';
            } else {
                inputs[id] = parseFloat(value);
            }
        }

        return inputs;
    },

    /**
     * Show validation errors
     * @param {Array} errors - Array of error objects
     */
    showErrors(errors) {
        // Clear all errors first
        document.querySelectorAll('[id^="error-"]').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });

        document.querySelectorAll('[id^="input-"]').forEach(el => {
            el.classList.remove('error');
        });

        // Show new errors
        errors.forEach(error => {
            const errorEl = document.getElementById(`error-${error.field}`);
            const inputEl = document.getElementById(`input-${error.field}`);

            if (errorEl) {
                errorEl.textContent = error.message;
                errorEl.classList.remove('hidden');
            }

            if (inputEl) {
                inputEl.classList.add('error');
            }
        });
    },

    /**
     * Clear error for specific field
     * @param {string} field - Field ID
     */
    clearError(field) {
        const errorEl = document.getElementById(`error-${field}`);
        const inputEl = document.getElementById(`input-${field}`);

        if (errorEl) {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }

        if (inputEl) {
            inputEl.classList.remove('error');
        }
    },

    /**
     * Clear all inputs
     */
    clear() {
        this.currentInputs = {};
        document.querySelectorAll('.input-field').forEach(el => {
            if (!el.disabled) {
                el.value = '';
            }
        });
    },

    /**
     * Disable/enable submit button
     * @param {boolean} disabled - Disabled state
     */
    setSubmitDisabled(disabled) {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = disabled;
            if (disabled) {
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    },

    /**
     * Show loading state
     * @param {boolean} loading - Loading state
     */
    setLoading(loading) {
        const submitBtn = document.getElementById('submitBtn');
        if (!submitBtn) return;

        if (loading) {
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Menjalankan Simulasi...</span>
            `;
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = `
                <span>🚀</span>
                <span>Jalankan Simulasi</span>
            `;
            submitBtn.disabled = false;
        }
    }
};
