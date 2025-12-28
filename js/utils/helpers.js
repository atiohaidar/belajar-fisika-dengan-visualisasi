/**
 * Helper Functions
 * Fungsi-fungsi bantu yang digunakan di seluruh game
 */

const Helpers = {
    /**
     * Konversi derajat ke radian
     * @param {number} degrees - Sudut dalam derajat
     * @returns {number} Sudut dalam radian
     */
    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Konversi radian ke derajat
     * @param {number} radians - Sudut dalam radian
     * @returns {number} Sudut dalam derajat
     */
    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    },

    /**
     * Bulatkan angka ke desimal tertentu
     * Juga menangani floating-point precision error
     * @param {number} value - Nilai yang akan dibulatkan
     * @param {number} decimals - Jumlah desimal
     * @returns {number} Nilai yang sudah dibulatkan
     */
    roundTo(value, decimals = 2) {
        const factor = Math.pow(10, decimals);
        let result = Math.round(value * factor) / factor;

        // Fix floating-point precision: jika sangat dekat dengan bilangan bulat, bulatkan
        const rounded = Math.round(result);
        if (Math.abs(result - rounded) < 0.005) {
            result = rounded;
        }

        return result;
    },

    /**
     * Clamp nilai antara min dan max
     * @param {number} value - Nilai
     * @param {number} min - Nilai minimum
     * @param {number} max - Nilai maksimum
     * @returns {number} Nilai yang di-clamp
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     * @param {number} a - Nilai awal
     * @param {number} b - Nilai akhir
     * @param {number} t - Faktor interpolasi (0-1)
     * @returns {number} Nilai hasil interpolasi
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    /**
     * Mapping nilai dari satu range ke range lain
     * @param {number} value - Nilai input
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number} Nilai yang di-map
     */
    map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    /**
     * Format angka dengan satuan
     * @param {number} value - Nilai
     * @param {string} unit - Satuan
     * @param {number} decimals - Jumlah desimal
     * @returns {string} String terformat
     */
    formatWithUnit(value, unit, decimals = 2) {
        return `${this.roundTo(value, decimals)} ${unit}`;
    },

    /**
     * Format waktu dalam detik ke mm:ss
     * @param {number} seconds - Waktu dalam detik
     * @returns {string} String waktu terformat
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Hitung persentase error
     * @param {number} actual - Nilai aktual
     * @param {number} expected - Nilai yang diharapkan
     * @returns {number} Persentase error (0-1)
     */
    calculateError(actual, expected) {
        if (expected === 0) return actual === 0 ? 0 : 1;
        return Math.abs(actual - expected) / Math.abs(expected);
    },

    /**
     * Cek apakah nilai dalam toleransi
     * @param {number} actual - Nilai aktual
     * @param {number} expected - Nilai yang diharapkan
     * @param {number} tolerance - Toleransi (0-1)
     * @returns {boolean} True jika dalam toleransi
     */
    isWithinTolerance(actual, expected, tolerance) {
        return this.calculateError(actual, expected) <= tolerance;
    },

    /**
     * Generate ID unik
     * @returns {string} ID unik
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Debounce function
     * @param {Function} func - Fungsi yang akan di-debounce
     * @param {number} wait - Waktu tunggu dalam ms
     * @returns {Function} Fungsi yang sudah di-debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func - Fungsi yang akan di-throttle
     * @param {number} limit - Batas waktu dalam ms
     * @returns {Function} Fungsi yang sudah di-throttle
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Deep clone object
     * @param {Object} obj - Object yang akan di-clone
     * @returns {Object} Clone dari object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Format rumus dengan nilai
     * @param {string} formula - Template rumus (e.g., "v = s / t")
     * @param {Object} values - Object dengan nilai-nilai
     * @returns {string} Rumus dengan nilai
     */
    formatFormula(formula, values) {
        let result = formula;
        for (const [key, value] of Object.entries(values)) {
            result = result.replace(new RegExp(key, 'g'), value);
        }
        return result;
    },

    /**
     * Hitung skor berdasarkan error
     * @param {number} error - Persentase error (0-1)
     * @returns {Object} Skor dan rating
     */
    calculateScore(error) {
        const { SCORING } = CONSTANTS;

        if (error <= SCORING.TOLERANCE_PERFECT) {
            return { score: SCORING.PERFECT, rating: 'perfect', stars: 3 };
        } else if (error <= SCORING.TOLERANCE_CLOSE) {
            return { score: SCORING.CLOSE, rating: 'close', stars: 2 };
        } else if (error <= SCORING.TOLERANCE_PARTIAL) {
            return { score: SCORING.PARTIAL, rating: 'partial', stars: 1 };
        } else {
            return { score: SCORING.ATTEMPT, rating: 'attempt', stars: 0 };
        }
    },

    /**
     * Buat elemen HTML dari template string
     * @param {string} html - String HTML
     * @returns {Element} Elemen DOM
     */
    createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    },

    /**
     * Tunggu dalam ms (untuk async/await)
     * @param {number} ms - Waktu tunggu dalam milisecond
     * @returns {Promise} Promise yang resolve setelah waktu tertentu
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};
