import { Helpers } from '../utils/helpers.js';

/**
 * PhysicsBase - Base class untuk semua modul fisika
 * Menyediakan interface standar untuk perhitungan fisika
 */

export class PhysicsBase {
    /**
     * Constructor
     * @param {Object} levelConfig - Konfigurasi level
     */
    constructor(levelConfig) {
        this.config = levelConfig;
        this.given = levelConfig.given || {};
        this.solution = levelConfig.solution || {};
        this.tolerance = levelConfig.tolerance || 0.1;
    }

    /**
     * Hitung hasil berdasarkan input user
     * Override di subclass
     * @param {Object} inputs - Input dari user
     * @returns {Object} Hasil perhitungan
     */
    calculate(inputs) {
        throw new Error('Method calculate() harus di-override di subclass');
    }

    /**
     * Dapatkan posisi pada waktu t
     * Override di subclass
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Posisi {x, y}
     */
    getPositionAtTime(t, inputs) {
        throw new Error('Method getPositionAtTime() harus di-override di subclass');
    }

    /**
     * Dapatkan kecepatan pada waktu t
     * Override di subclass
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Kecepatan {vx, vy}
     */
    getVelocityAtTime(t, inputs) {
        throw new Error('Method getVelocityAtTime() harus di-override di subclass');
    }

    /**
     * Hitung waktu total simulasi
     * @param {Object} inputs - Input dari user
     * @returns {number} Waktu total dalam detik
     */
    getTotalTime(inputs) {
        // Default: gunakan waktu yang diberikan atau hitung dari jarak
        if (this.given.time) {
            return this.given.time.value;
        }
        return 5; // Default 5 detik
    }

    /**
     * Validasi input user
     * @param {Object} inputs - Input dari user
     * @returns {Object} {valid: boolean, errors: Array}
     */
    validateInputs(inputs) {
        const errors = [];
        const requiredInputs = this.config.inputs || [];

        for (const input of requiredInputs) {
            const value = inputs[input.id];

            // Cek apakah ada
            if (value === undefined || value === null || value === '') {
                errors.push({
                    field: input.id,
                    message: `${input.label} harus diisi`
                });
                continue;
            }

            // Cek apakah angka valid
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                errors.push({
                    field: input.id,
                    message: `${input.label} harus berupa angka`
                });
                continue;
            }

            // Cek batas min/max
            if (input.min !== undefined && numValue < input.min) {
                errors.push({
                    field: input.id,
                    message: `${input.label} minimal ${input.min} ${input.unit}`
                });
            }

            if (input.max !== undefined && numValue > input.max) {
                errors.push({
                    field: input.id,
                    message: `${input.label} maksimal ${input.max} ${input.unit}`
                });
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Cek apakah jawaban benar
     * @param {Object} inputs - Input dari user
     * @returns {Object} Hasil pengecekan
     */
    checkAnswer(inputs) {
        const results = {};
        let allCorrect = true;
        let totalError = 0;
        let errorCount = 0;

        for (const [key, expectedValue] of Object.entries(this.solution)) {
            const userValue = parseFloat(inputs[key]);
            const error = Helpers.calculateError(userValue, expectedValue);
            const isCorrect = error <= this.tolerance;

            results[key] = {
                userValue,
                expectedValue,
                error,
                isCorrect,
                percentError: Helpers.roundTo(error * 100, 1)
            };

            if (!isCorrect) allCorrect = false;
            totalError += error;
            errorCount++;
        }

        const averageError = errorCount > 0 ? totalError / errorCount : 0;
        const scoreData = Helpers.calculateScore(averageError);

        return {
            results,
            allCorrect,
            averageError,
            ...scoreData
        };
    }

    /**
     * Generate penjelasan langkah-langkah perhitungan
     * Override di subclass
     * @param {Object} inputs - Input dari user
     * @returns {Array} Array langkah-langkah penjelasan
     */
    getExplanationSteps(inputs) {
        return [];
    }

    /**
     * Get formula yang relevan
     * @returns {Array} Array rumus
     */
    getFormulas() {
        return this.config.formulas || [];
    }

    /**
     * Get petunjuk/hints
     * @returns {Array} Array petunjuk
     */
    getHints() {
        return this.config.hints || [];
    }
}
