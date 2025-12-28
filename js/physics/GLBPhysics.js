/**
 * GLBPhysics - Gerak Lurus Beraturan
 * Rumus dasar: v = s/t, s = v×t, t = s/v
 */

class GLBPhysics extends PhysicsBase {
    /**
     * Hitung hasil berdasarkan input user
     * @param {Object} inputs - Input dari user (velocity)
     * @returns {Object} Hasil perhitungan
     */
    calculate(inputs) {
        const velocity = parseFloat(inputs.velocity) || 0;
        const targetDistance = this.given.distance?.value || 0;
        const targetTime = this.given.time?.value || 0;

        // Hitung posisi akhir berdasarkan input
        let finalPosition, finalTime;

        if (targetTime > 0) {
            // Jika waktu diberikan, hitung posisi akhir
            finalPosition = velocity * targetTime;
            finalTime = targetTime;
        } else if (targetDistance > 0 && velocity > 0) {
            // Jika jarak diberikan, hitung waktu
            finalTime = targetDistance / velocity;
            finalPosition = targetDistance;
        } else {
            // Default
            finalTime = 5;
            finalPosition = velocity * finalTime;
        }

        return {
            velocity,
            finalPosition,
            finalTime,
            targetDistance,
            targetTime,
            reachedTarget: Math.abs(finalPosition - targetDistance) < (targetDistance * this.tolerance),
            reachedInTime: targetTime > 0 ? Math.abs(finalTime - targetTime) < 0.5 : true,
        };
    }

    /**
     * Dapatkan posisi pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Posisi {x, y}
     */
    getPositionAtTime(t, inputs) {
        const velocity = parseFloat(inputs.velocity) || 0;

        return {
            x: velocity * t,  // s = v × t
            y: 0              // GLB adalah gerak horizontal
        };
    }

    /**
     * Dapatkan kecepatan pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Kecepatan {vx, vy, magnitude}
     */
    getVelocityAtTime(t, inputs) {
        const velocity = parseFloat(inputs.velocity) || 0;

        return {
            vx: velocity,  // Kecepatan konstan
            vy: 0,
            magnitude: velocity
        };
    }

    /**
     * Hitung waktu total simulasi
     * @param {Object} inputs - Input dari user
     * @returns {number} Waktu total dalam detik
     */
    getTotalTime(inputs) {
        const targetTime = this.given.time?.value;
        const targetDistance = this.given.distance?.value;
        const velocity = parseFloat(inputs.velocity) || 1;

        if (targetTime) {
            // Gunakan waktu target yang tepat tanpa buffer
            return targetTime;
        } else if (targetDistance && velocity > 0) {
            // Hitung waktu untuk mencapai target
            return targetDistance / velocity;
        }

        return 5; // Default
    }

    /**
     * Generate penjelasan langkah-langkah perhitungan
     * @param {Object} inputs - Input dari user
     * @returns {Array} Array langkah-langkah penjelasan
     */
    getExplanationSteps(inputs) {
        const velocity = parseFloat(inputs.velocity) || 0;
        const targetDistance = this.given.distance?.value || 0;
        const targetTime = this.given.time?.value || 0;
        const expectedVelocity = this.solution.velocity;

        const steps = [];

        // Langkah 1: Identifikasi yang diketahui
        steps.push({
            title: 'Langkah 1: Identifikasi yang Diketahui',
            content: `
                <ul class="list-disc list-inside space-y-1 text-slate-300">
                    <li>Jarak target (s) = ${targetDistance} m</li>
                    <li>Waktu yang diinginkan (t) = ${targetTime} s</li>
                </ul>
            `,
            formula: null
        });

        // Langkah 2: Rumus yang digunakan
        steps.push({
            title: 'Langkah 2: Rumus GLB',
            content: `
                <p class="text-slate-300 mb-2">Pada Gerak Lurus Beraturan, kecepatan tetap konstan.</p>
            `,
            formula: 'v = s / t'
        });

        // Langkah 3: Substitusi nilai
        steps.push({
            title: 'Langkah 3: Substitusi Nilai',
            content: `
                <div class="bg-slate-800/50 p-3 rounded-lg">
                    <p class="text-slate-300">v = ${targetDistance} m / ${targetTime} s</p>
                </div>
            `,
            formula: `v = ${targetDistance} / ${targetTime}`
        });

        // Langkah 4: Hasil perhitungan
        steps.push({
            title: 'Langkah 4: Hasil',
            content: `
                <div class="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                    <p class="text-blue-300 font-bold">v = ${expectedVelocity} m/s</p>
                </div>
                <p class="text-slate-400 mt-2 text-sm">
                    Jadi, kecepatan yang diperlukan agar mobil sampai di target tepat waktu adalah 
                    <strong class="text-white">${expectedVelocity} m/s</strong>.
                </p>
            `,
            formula: null
        });

        // Langkah 5: Evaluasi jawaban user
        const userVelocity = velocity;
        const error = Helpers.calculateError(userVelocity, expectedVelocity);
        const isCorrect = error <= this.tolerance;

        steps.push({
            title: 'Langkah 5: Evaluasi Jawaban Kamu',
            content: `
                <div class="${isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} p-3 rounded-lg border">
                    <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                        Jawaban kamu: ${userVelocity} m/s
                    </p>
                    <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                        ${isCorrect
                    ? '✅ Benar!'
                    : `❌ Selisih ${Helpers.roundTo(error * 100, 1)}% dari jawaban yang benar`
                }
                    </p>
                </div>
            `,
            formula: null
        });

        return steps;
    }
}
