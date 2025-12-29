import { PhysicsBase } from './PhysicsBase.js';
import { Helpers } from '../utils/helpers.js';

/**
 * GLBBPhysics - Gerak Lurus Berubah Beraturan
 * Rumus dasar: 
 *   s = v₀t + ½at²
 *   v = v₀ + at
 *   v² = v₀² + 2as
 */

export class GLBBPhysics extends PhysicsBase {
    /**
     * Hitung hasil berdasarkan input user
     * @param {Object} inputs - Input dari user (initialVelocity, acceleration)
     * @returns {Object} Hasil perhitungan
     */
    calculate(inputs) {
        const v0 = parseFloat(inputs.initialVelocity) || 0;  // Kecepatan awal
        const a = parseFloat(inputs.acceleration) || 0;       // Percepatan

        const targetDistance = this.given.distance?.value || 0;
        const targetTime = this.given.time?.value || 0;

        let finalPosition, finalTime, finalVelocity;

        if (targetTime > 0) {
            // s = v₀t + ½at²
            finalPosition = (v0 * targetTime) + (0.5 * a * targetTime * targetTime);
            finalTime = targetTime;
            // v = v₀ + at
            finalVelocity = v0 + (a * targetTime);
        } else if (targetDistance > 0) {
            // Hitung waktu dengan rumus kuadrat
            // s = v₀t + ½at²  =>  ½at² + v₀t - s = 0
            if (a !== 0) {
                const discriminant = (v0 * v0) + (2 * a * targetDistance);
                if (discriminant >= 0) {
                    // Gunakan rumus ABC
                    finalTime = (-v0 + Math.sqrt(discriminant)) / a;
                    if (finalTime < 0) {
                        finalTime = (-v0 - Math.sqrt(discriminant)) / a;
                    }
                } else {
                    finalTime = 5; // Default jika tidak ada solusi real
                }
            } else if (v0 !== 0) {
                finalTime = targetDistance / v0;
            } else {
                finalTime = 5;
            }

            finalPosition = (v0 * finalTime) + (0.5 * a * finalTime * finalTime);
            finalVelocity = v0 + (a * finalTime);
        } else {
            finalTime = 5;
            finalPosition = (v0 * finalTime) + (0.5 * a * finalTime * finalTime);
            finalVelocity = v0 + (a * finalTime);
        }

        return {
            initialVelocity: v0,
            acceleration: a,
            finalPosition: Helpers.roundTo(finalPosition, 2),
            finalTime: Helpers.roundTo(finalTime, 2),
            finalVelocity: Helpers.roundTo(finalVelocity, 2),
            targetDistance,
            targetTime,
            reachedTarget: Math.abs(finalPosition - targetDistance) < (targetDistance * this.tolerance || 0.5),
        };
    }

    /**
     * Dapatkan posisi pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Posisi {x, y}
     */
    getPositionAtTime(t, inputs) {
        const v0 = parseFloat(inputs.initialVelocity) || 0;
        const a = parseFloat(inputs.acceleration) || 0;

        // s = v₀t + ½at²
        const x = (v0 * t) + (0.5 * a * t * t);

        return {
            x: Helpers.roundTo(x, 2),
            y: 0  // GLBB horizontal
        };
    }

    /**
     * Dapatkan kecepatan pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Kecepatan {vx, vy, magnitude}
     */
    getVelocityAtTime(t, inputs) {
        const v0 = parseFloat(inputs.initialVelocity) || 0;
        const a = parseFloat(inputs.acceleration) || 0;

        // v = v₀ + at
        const vx = v0 + (a * t);

        return {
            vx: Helpers.roundTo(vx, 2),
            vy: 0,
            magnitude: Helpers.roundTo(Math.abs(vx), 2)
        };
    }

    /**
     * Hitung waktu total simulasi
     * @param {Object} inputs - Input dari user
     * @returns {number} Waktu total dalam detik
     */
    getTotalTime(inputs) {
        const targetTime = this.given.time?.value;

        if (targetTime) {
            // Gunakan waktu target yang tepat tanpa buffer
            return targetTime;
        }

        // Hitung berdasarkan kapan sampai target
        const result = this.calculate(inputs);
        return Math.max(result.finalTime, 3);
    }

    /**
     * Generate penjelasan langkah-langkah perhitungan
     * @param {Object} inputs - Input dari user
     * @returns {Array} Array langkah-langkah penjelasan
     */
    getExplanationSteps(inputs) {
        const v0 = parseFloat(inputs.initialVelocity) || 0;
        const a = parseFloat(inputs.acceleration) || 0;
        const targetDistance = this.given.distance?.value || 0;
        const targetTime = this.given.time?.value || 0;

        const steps = [];

        // Langkah 1: Identifikasi
        steps.push({
            title: 'Langkah 1: Identifikasi yang Diketahui',
            content: `
                <ul class="list-disc list-inside space-y-1 text-slate-300">
                    ${targetDistance ? `<li>Jarak target (s) = ${targetDistance} m</li>` : ''}
                    ${targetTime ? `<li>Waktu (t) = ${targetTime} s</li>` : ''}
                    ${this.given.initialVelocity ? `<li>Kecepatan awal (v₀) = ${this.given.initialVelocity.value} m/s</li>` : ''}
                    ${this.given.acceleration ? `<li>Percepatan (a) = ${this.given.acceleration.value} m/s²</li>` : ''}
                </ul>
            `,
            formula: null
        });

        // Langkah 2: Rumus GLBB
        steps.push({
            title: 'Langkah 2: Rumus GLBB',
            content: `
                <p class="text-slate-300 mb-2">Pada Gerak Lurus Berubah Beraturan, kecepatan berubah secara konstan karena ada percepatan.</p>
                <div class="space-y-2">
                    <div class="formula">s = v₀t + ½at²</div>
                    <div class="formula">v = v₀ + at</div>
                </div>
            `,
            formula: null
        });

        // Langkah 3: Perhitungan
        const result = this.calculate(inputs);

        steps.push({
            title: 'Langkah 3: Hasil Perhitungan',
            content: `
                <div class="bg-slate-800/50 p-3 rounded-lg space-y-2">
                    <p class="text-slate-300">Dengan v₀ = ${v0} m/s dan a = ${a} m/s²:</p>
                    <p class="text-blue-300">s = (${v0} × ${targetTime || result.finalTime}) + ½ × ${a} × ${targetTime || result.finalTime}²</p>
                    <p class="text-blue-300 font-bold">s = ${Helpers.roundTo(result.finalPosition, 2)} m</p>
                </div>
            `,
            formula: null
        });

        // Langkah 4: Evaluasi
        const reachedTarget = Math.abs(result.finalPosition - targetDistance) < (targetDistance * 0.1);

        steps.push({
            title: 'Langkah 4: Evaluasi',
            content: `
                <div class="${reachedTarget ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} p-3 rounded-lg border">
                    <p class="${reachedTarget ? 'text-green-300' : 'text-red-300'}">
                        Posisi akhir: ${Helpers.roundTo(result.finalPosition, 2)} m
                    </p>
                    <p class="${reachedTarget ? 'text-green-300' : 'text-red-300'}">
                        Target: ${targetDistance} m
                    </p>
                    <p class="${reachedTarget ? 'text-green-300' : 'text-red-300'} font-bold mt-2">
                        ${reachedTarget
                    ? '✅ Tepat sasaran!'
                    : `❌ Selisih ${Helpers.roundTo(Math.abs(result.finalPosition - targetDistance), 2)} m dari target`
                }
                    </p>
                </div>
            `,
            formula: null
        });

        return steps;
    }
}
