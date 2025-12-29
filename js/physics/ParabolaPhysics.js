import { PhysicsBase } from './PhysicsBase.js';
import { Helpers } from '../utils/helpers.js';
import { CONSTANTS } from '../utils/constants.js';

/**
 * ParabolaPhysics - Gerak Parabola (Gerak Peluru)
 * Rumus dasar:
 *   x = v₀ × cos(θ) × t
 *   y = v₀ × sin(θ) × t - ½gt²
 *   Jarak maksimum: R = v₀² × sin(2θ) / g
 *   Tinggi maksimum: H = v₀² × sin²(θ) / (2g)
 */

export class ParabolaPhysics extends PhysicsBase {
    /**
     * Hitung hasil berdasarkan input user
     * @param {Object} inputs - Input dari user (velocity, angle)
     * @returns {Object} Hasil perhitungan
     */
    calculate(inputs) {
        // Parse inputs dengan fallback yang tepat
        const parsedV = parseFloat(inputs.velocity);
        const parsedAngle = parseFloat(inputs.angle);

        const v0 = isNaN(parsedV) ? 0 : parsedV;
        const angleDeg = isNaN(parsedAngle) ? 45 : parsedAngle;
        const angleRad = Helpers.degreesToRadians(angleDeg);

        const g = this.given.gravity?.value || CONSTANTS.PHYSICS.GRAVITY;
        const targetX = this.given.targetX?.value || 0;
        const targetY = this.given.targetY?.value || 0;
        const initialHeight = this.given.initialHeight?.value || 0;

        // Komponen kecepatan
        // Komponen kecepatan
        const vx = v0 * Math.cos(angleRad);
        const vy = v0 * Math.sin(angleRad);

        // Hitung waktu untuk mencapai ketinggian target (y = targetY)
        // y = y₀ + v₀y × t - ½gt² = targetY
        // ½gt² - v₀y × t + (targetY - y₀) = 0
        // a = 0.5 * g
        // b = -vy
        // c = targetY - initialHeight

        let timeOfFlight;
        let flightTimeY0; // Waktu sampai tanah dasar (y=0)

        if (g !== 0) {
            // Waktu sampai y=0 (untuk visualisasi dasar)
            const discY0 = (vy * vy) + (2 * g * initialHeight);
            flightTimeY0 = (vy + Math.sqrt(Math.max(0, discY0))) / g;

            // Waktu sampai y=targetY
            const a = 0.5 * g;
            const b = -vy;
            const c = targetY - initialHeight;
            const discriminant = (b * b) - (4 * a * c);

            if (discriminant >= 0) {
                // Ambil waktu yang lebih besar (saat turun/mendarat)
                // Rumus ABC: t = (-b ± √D) / 2a
                // Karena b = -vy, maka -b = vy
                timeOfFlight = (vy + Math.sqrt(discriminant)) / (2 * a);
            } else {
                // Tidak pernah mencapai ketinggian target
                timeOfFlight = 0;
            }
        } else {
            timeOfFlight = 5;
            flightTimeY0 = 5;
        }

        // Jangkauan pada ketinggian target
        const rangeAtTargetY = vx * timeOfFlight;

        // Jangkauan di tanah (y=0)
        const rangeY0 = vx * flightTimeY0;

        // Tinggi maksimum
        const timeToMaxHeight = vy / g;
        const maxHeight = initialHeight + (vy * timeToMaxHeight) - (0.5 * g * timeToMaxHeight * timeToMaxHeight);

        // Hitung error jarak
        // Kita bandingkan posisi x bola saat berada di ketinggian targetY dengan targetX
        const hitX = rangeAtTargetY;
        const distanceToTarget = Math.abs(hitX - targetX);
        const tolerance = targetX * this.tolerance || 1;

        // Jika discriminant < 0, berarti bola tidak pernah sampai ketinggian target -> fail
        const reachedTarget = (g !== 0 && ((vy * vy) - (2 * g * (targetY - initialHeight))) >= 0)
            ? distanceToTarget <= tolerance
            : false;

        return {
            velocity: v0,
            angle: angleDeg,
            angleRad,
            vx: Helpers.roundTo(vx, 2),
            vy: Helpers.roundTo(vy, 2),
            gravity: g,
            timeOfFlight: Helpers.roundTo(timeOfFlight, 2),
            flightTimeY0: Helpers.roundTo(flightTimeY0, 2),
            range: Helpers.roundTo(rangeAtTargetY, 2), // Range relevan adalah di ketinggian target
            rangeY0: Helpers.roundTo(rangeY0, 2),
            maxHeight: Helpers.roundTo(maxHeight, 2),
            timeToMaxHeight: Helpers.roundTo(timeToMaxHeight, 2),
            targetX,
            targetY,
            hitX: Helpers.roundTo(hitX, 2),
            distanceToTarget: Helpers.roundTo(distanceToTarget, 2),
            reachedTarget: reachedTarget,
        };
    }

    /**
     * Cek apakah jawaban benar untuk parabola (berdasarkan posisi jatuh)
     * @param {Object} inputs - Input dari user
     * @returns {Object} Hasil pengecekan
     */
    checkAnswer(inputs) {
        // Hitung hasil berdasarkan input user
        const result = this.calculate(inputs);

        // Pengecekan berdasarkan apakah mengenai target (bukan mencocokkan angka input)
        const isCorrect = result.reachedTarget;

        // Error dihitung dari jarak ke target (dalam persen terhadap jarak target)
        const targetX = this.given.targetX?.value || 1;
        const error = result.distanceToTarget / targetX;

        // Score calculation
        const scoreData = Helpers.calculateScore(error);

        // Format results agar sesuai format yang diharapkan FeedbackPanel
        const results = {};
        const solution = this.solution;

        // Helper function untuk result object
        const createResult = (key, val) => ({
            userValue: val,
            // Jika benar, kita anggap expected valuenya "sesuai input user" agar UI menunjukkan benar
            // Jika salah, kita tunjukkan kunci jawaban (one possible solution)
            expectedValue: isCorrect ? val : solution[key],
            error: isCorrect ? 0 : 1,
            isCorrect: isCorrect,
            percentError: isCorrect ? 0 : 100
        });

        if (inputs.velocity !== undefined) {
            results.velocity = createResult('velocity', parseFloat(inputs.velocity));
        }

        if (inputs.angle !== undefined) {
            results.angle = createResult('angle', parseFloat(inputs.angle));
        }

        return {
            results,
            allCorrect: isCorrect,
            averageError: error,
            ...scoreData
        };
    }

    /**
     * Dapatkan posisi pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Posisi {x, y}
     */
    getPositionAtTime(t, inputs) {
        // Parse inputs with proper fallbacks for empty/NaN values
        const parsedV = parseFloat(inputs.velocity);
        const parsedAngle = parseFloat(inputs.angle);

        const v0 = isNaN(parsedV) ? 0 : parsedV;
        const angleDeg = isNaN(parsedAngle) ? 45 : parsedAngle;
        const angleRad = Helpers.degreesToRadians(angleDeg);

        const g = this.given.gravity?.value || CONSTANTS.PHYSICS.GRAVITY;
        const initialHeight = this.given.initialHeight?.value || 0;

        // Kita gunakan hasil kalkulasi lengkap dari method calculate
        // Ini lebih efisien dan konsisten daripada menghitung ulang
        // Namun kita perlu mock inputs object
        const calcResult = this.calculate(inputs);

        // Tentukan batas waktu simulasi visual
        // Jika kena target, berhenti di target (timeOfFlight)
        // Jika meleset, jatuh sampai tanah (flightTimeY0)
        let maxTime = calcResult.flightTimeY0;

        if (calcResult.reachedTarget) {
            maxTime = calcResult.timeOfFlight;
        }

        // Batasi waktu
        const simulationTime = Math.min(t, maxTime);

        // x = v₀ × cos(θ) × t
        const x = v0 * Math.cos(angleRad) * simulationTime;

        // y = y₀ + v₀ × sin(θ) × t - ½gt²
        const y = initialHeight + (v0 * Math.sin(angleRad) * simulationTime) - (0.5 * g * simulationTime * simulationTime);

        return {
            x: Helpers.roundTo(x, 2),
            y: Helpers.roundTo(Math.max(0, y), 2)
        };
    }

    /**
     * Dapatkan kecepatan pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Kecepatan {vx, vy, magnitude}
     */
    getVelocityAtTime(t, inputs) {
        const parsedV = parseFloat(inputs.velocity);
        const parsedAngle = parseFloat(inputs.angle);

        const v0 = isNaN(parsedV) ? 0 : parsedV;
        const angleDeg = isNaN(parsedAngle) ? 45 : parsedAngle;
        const angleRad = Helpers.degreesToRadians(angleDeg);

        const g = this.given.gravity?.value || CONSTANTS.PHYSICS.GRAVITY;

        // vx = v₀ × cos(θ) (konstan)
        const vx = v0 * Math.cos(angleRad);

        // vy = v₀ × sin(θ) - gt
        const vy = (v0 * Math.sin(angleRad)) - (g * t);

        // Magnitude
        const magnitude = Math.sqrt(vx * vx + vy * vy);

        return {
            vx: Helpers.roundTo(vx, 2),
            vy: Helpers.roundTo(vy, 2),
            magnitude: Helpers.roundTo(magnitude, 2)
        };
    }

    /**
     * Hitung waktu total simulasi
     * @param {Object} inputs - Input dari user
     * @returns {number} Waktu total dalam detik
     */
    getTotalTime(inputs) {
        const result = this.calculate(inputs);
        return Math.max(result.timeOfFlight * 1.1, 2);
    }

    /**
     * Generate trajectory points untuk visualisasi
     * @param {Object} inputs - Input dari user
     * @param {number} steps - Jumlah titik
     * @returns {Array} Array of {x, y} points
     */
    getTrajectoryPoints(inputs, steps = 50) {
        const result = this.calculate(inputs);
        const totalTime = result.timeOfFlight;
        const points = [];

        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * totalTime;
            const pos = this.getPositionAtTime(t, inputs);

            // Stop jika sudah menyentuh tanah
            if (pos.y < 0 && i > 0) break;

            points.push({
                t,
                x: pos.x,
                y: pos.y
            });
        }

        return points;
    }

    /**
     * Generate penjelasan langkah-langkah perhitungan
     * @param {Object} inputs - Input dari user
     * @returns {Array} Array langkah-langkah penjelasan
     */
    getExplanationSteps(inputs) {
        const parsedV = parseFloat(inputs.velocity);
        const parsedAngle = parseFloat(inputs.angle);

        const v0 = isNaN(parsedV) ? 0 : parsedV;
        const angleDeg = isNaN(parsedAngle) ? 45 : parsedAngle;
        const g = this.given.gravity?.value || CONSTANTS.PHYSICS.GRAVITY;
        const targetX = this.given.targetX?.value || 0;

        const result = this.calculate(inputs);
        const steps = [];

        // Langkah 1: Identifikasi
        steps.push({
            title: 'Langkah 1: Identifikasi yang Diketahui',
            content: `
                <ul class="list-disc list-inside space-y-1 text-slate-300">
                    <li>Jarak target (x) = ${targetX} m</li>
                    <li>Gravitasi (g) = ${g} m/s²</li>
                    <li>Kecepatan awal yang kamu input (v₀) = ${v0} m/s</li>
                    <li>Sudut yang kamu input (θ) = ${angleDeg}°</li>
                </ul>
            `,
            formula: null
        });

        // Langkah 2: Komponen kecepatan
        steps.push({
            title: 'Langkah 2: Uraikan Kecepatan',
            content: `
                <p class="text-slate-300 mb-2">Kecepatan awal diuraikan menjadi komponen horizontal dan vertikal:</p>
                <div class="bg-slate-800/50 p-3 rounded-lg space-y-2">
                    <p class="text-pink-300">vₓ = v₀ × cos(${angleDeg}°) = ${Helpers.roundTo(result.vx, 2)} m/s</p>
                    <p class="text-pink-300">vᵧ = v₀ × sin(${angleDeg}°) = ${Helpers.roundTo(result.vy, 2)} m/s</p>
                </div>
            `,
            formula: null
        });

        // Langkah 3: Rumus gerak parabola
        steps.push({
            title: 'Langkah 3: Rumus Gerak Parabola',
            content: `
                <div class="space-y-2">
                    <div class="formula">x = v₀ × cos(θ) × t</div>
                    <div class="formula">y = v₀ × sin(θ) × t - ½gt²</div>
                </div>
                <p class="text-slate-400 mt-2 text-sm">
                    Komponen horizontal (x) bergerak dengan kecepatan konstan.<br>
                    Komponen vertikal (y) dipengaruhi gravitasi.
                </p>
            `,
            formula: null
        });

        // Langkah 4: Hasil
        steps.push({
            title: 'Langkah 4: Hasil Perhitungan',
            content: `
                <div class="bg-slate-800/50 p-3 rounded-lg space-y-2">
                    <p class="text-slate-300">Waktu di udara: <span class="text-pink-300 font-bold">${result.timeOfFlight} s</span></p>
                    <p class="text-slate-300">Jangkauan: <span class="text-yellow-300 font-bold">${result.range} m</span></p>
                    <p class="text-slate-300">Tinggi maksimum: <span class="text-purple-300 font-bold">${result.maxHeight} m</span></p>
                </div>
            `,
            formula: null
        });

        // Langkah 5: Evaluasi
        steps.push({
            title: 'Langkah 5: Evaluasi',
            content: `
                <div class="${result.reachedTarget ? 'bg-yellow-900/30 border-yellow-500/30' : 'bg-red-900/30 border-red-500/30'} p-3 rounded-lg border">
                    <p class="${result.reachedTarget ? 'text-yellow-300' : 'text-red-300'}">
                        Posisi jatuh: ${result.hitX} m
                    </p>
                    <p class="${result.reachedTarget ? 'text-yellow-300' : 'text-red-300'}">
                        Target: ${targetX} m
                    </p>
                    <p class="${result.reachedTarget ? 'text-yellow-300' : 'text-red-300'} font-bold mt-2">
                        ${result.reachedTarget
                    ? '✅ Tepat sasaran!'
                    : `❌ ${result.hitX < targetX ? 'Terlalu pendek' : 'Terlalu jauh'} ${result.distanceToTarget} m`
                }
                    </p>
                </div>
            `,
            formula: null
        });

        return steps;
    }
}
