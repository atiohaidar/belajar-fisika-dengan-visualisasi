import { PhysicsBase } from './PhysicsBase.js';
import { Helpers } from '../utils/helpers.js';

/**
 * GLBPhysics - Gerak Lurus Beraturan
 * Rumus dasar: v = s/t, s = v×t, t = s/v
 */

export class GLBPhysics extends PhysicsBase {
    /**
     * Hitung hasil berdasarkan input user
     * @param {Object} inputs - Input dari user (velocity)
     * @returns {Object} Hasil perhitungan
     */
    calculate(inputs) {
        // Ambil input dari user (bisa velocity, distance, atau time)
        const inputVelocity = parseFloat(inputs.velocity) || 0;
        const inputDistance = parseFloat(inputs.distance) || 0;
        const inputTime = parseFloat(inputs.time) || 0;

        // Ambil nilai yang diberikan dalam soal
        const givenDistance = this.given.distance?.value || 0;
        const givenTime = this.given.time?.value || 0;
        const givenVelocity = this.given.velocity?.value || 0;

        // Tentukan nilai yang digunakan untuk perhitungan
        let velocity, distance, time;
        let finalPosition, finalTime;

        // Tentukan tipe soal berdasarkan apa yang dicari
        const findType = this.find?.[0] || 'velocity';

        if (findType === 'velocity') {
            // Mencari kecepatan: diberikan jarak dan waktu
            velocity = inputVelocity;
            distance = givenDistance;
            time = givenTime;
            finalTime = time;
            finalPosition = velocity * time;
        } else if (findType === 'distance') {
            // Mencari jarak: diberikan kecepatan dan waktu
            velocity = givenVelocity;
            time = givenTime;
            distance = inputDistance;
            finalTime = time;
            finalPosition = velocity * time; // Posisi yang seharusnya
        } else if (findType === 'time') {
            // Mencari waktu: diberikan kecepatan dan jarak
            velocity = givenVelocity;
            distance = givenDistance;
            time = inputTime;
            finalTime = distance / velocity; // Waktu yang seharusnya
            finalPosition = distance;
        } else {
            // Default
            velocity = inputVelocity || givenVelocity;
            finalTime = givenTime || 5;
            finalPosition = velocity * finalTime;
        }

        return {
            velocity,
            inputDistance,
            inputTime,
            finalPosition: Helpers.roundTo(finalPosition, 2),
            finalTime: Helpers.roundTo(finalTime, 2),
            targetDistance: givenDistance,
            targetTime: givenTime,
            givenVelocity,
            findType,
            reachedTarget: findType === 'distance'
                ? Math.abs(inputDistance - finalPosition) < (finalPosition * this.tolerance || 0.5)
                : Math.abs(finalPosition - givenDistance) < (givenDistance * this.tolerance || 0.5),
            reachedInTime: findType === 'time'
                ? Math.abs(inputTime - finalTime) < (finalTime * this.tolerance || 0.5)
                : givenTime > 0 ? Math.abs(finalTime - givenTime) < 0.5 : true,
        };
    }

    /**
     * Dapatkan posisi pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Posisi {x, y}
     */
    getPositionAtTime(t, inputs) {
        // Gunakan velocity dari input atau dari given
        const velocity = parseFloat(inputs.velocity) || this.given.velocity?.value || 0;

        return {
            x: Helpers.roundTo(velocity * t, 2),  // s = v × t
            y: 0  // GLB adalah gerak horizontal
        };
    }

    /**
     * Dapatkan kecepatan pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Kecepatan {vx, vy, magnitude}
     */
    getVelocityAtTime(t, inputs) {
        // Gunakan velocity dari input atau dari given
        const velocity = parseFloat(inputs.velocity) || this.given.velocity?.value || 0;

        return {
            vx: Helpers.roundTo(velocity, 2),  // Kecepatan konstan
            vy: 0,
            magnitude: Helpers.roundTo(velocity, 2)
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
        // Gunakan velocity dari input atau dari given
        const velocity = parseFloat(inputs.velocity) || this.given.velocity?.value || 1;
        const userInputTime = parseFloat(inputs.time) || 0;

        // Determine find type
        const findType = this.find?.[0] || 'velocity';

        if (findType === 'time' && userInputTime > 0) {
            // For "find time" problems, use the USER's input time
            // This allows the user to see if their answer stops at the target or not
            return userInputTime;
        } else if (targetTime) {
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
        const steps = [];
        const findType = this.find?.[0] || 'velocity';

        // Ambil nilai dari given dan solution
        const givenDistance = this.given.distance?.value || 0;
        const givenTime = this.given.time?.value || 0;
        const givenVelocity = this.given.velocity?.value || 0;

        // Nilai dari solution
        const expectedVelocity = this.solution.velocity;
        const expectedDistance = this.solution.distance;
        const expectedTime = this.solution.time;

        // Input dari user
        const userVelocity = parseFloat(inputs.velocity) || 0;
        const userDistance = parseFloat(inputs.distance) || 0;
        const userTime = parseFloat(inputs.time) || 0;

        // Langkah 1: Identifikasi yang diketahui
        let knownItems = [];
        if (givenDistance) knownItems.push(`<li>Jarak (s) = ${givenDistance} m</li>`);
        if (givenTime) knownItems.push(`<li>Waktu (t) = ${givenTime} s</li>`);
        if (givenVelocity) knownItems.push(`<li>Kecepatan (v) = ${givenVelocity} m/s</li>`);

        steps.push({
            title: 'Langkah 1: Identifikasi yang Diketahui',
            content: `
                <ul class="list-disc list-inside space-y-1 text-slate-300">
                    ${knownItems.join('\n')}
                </ul>
            `,
            formula: null
        });

        // Langkah 2 & 3 & 4: Sesuai dengan tipe soal
        if (findType === 'velocity') {
            // Mencari kecepatan
            steps.push({
                title: 'Langkah 2: Rumus GLB',
                content: `<p class="text-slate-300 mb-2">Untuk mencari kecepatan, gunakan rumus:</p>`,
                formula: 'v = s / t'
            });

            steps.push({
                title: 'Langkah 3: Substitusi Nilai',
                content: `
                    <div class="bg-slate-800/50 p-3 rounded-lg">
                        <p class="text-slate-300">v = ${givenDistance} m / ${givenTime} s</p>
                    </div>
                `,
                formula: `v = ${givenDistance} / ${givenTime}`
            });

            steps.push({
                title: 'Langkah 4: Hasil',
                content: `
                    <div class="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                        <p class="text-blue-300 font-bold">v = ${expectedVelocity} m/s</p>
                    </div>
                `,
                formula: null
            });

            // Evaluasi
            const error = Helpers.calculateError(userVelocity, expectedVelocity);
            const isCorrect = error <= this.tolerance;
            steps.push({
                title: 'Langkah 5: Evaluasi Jawaban',
                content: `
                    <div class="${isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} p-3 rounded-lg border">
                        <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                            Jawaban kamu: ${userVelocity} m/s
                        </p>
                        <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                            ${isCorrect ? '✅ Benar!' : `❌ Selisih ${Helpers.roundTo(error * 100, 1)}% dari jawaban yang benar`}
                        </p>
                    </div>
                `,
                formula: null
            });

        } else if (findType === 'distance') {
            // Mencari jarak
            steps.push({
                title: 'Langkah 2: Rumus GLB',
                content: `<p class="text-slate-300 mb-2">Untuk mencari jarak, gunakan rumus:</p>`,
                formula: 's = v × t'
            });

            steps.push({
                title: 'Langkah 3: Substitusi Nilai',
                content: `
                    <div class="bg-slate-800/50 p-3 rounded-lg">
                        <p class="text-slate-300">s = ${givenVelocity} m/s × ${givenTime} s</p>
                    </div>
                `,
                formula: `s = ${givenVelocity} × ${givenTime}`
            });

            steps.push({
                title: 'Langkah 4: Hasil',
                content: `
                    <div class="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                        <p class="text-blue-300 font-bold">s = ${expectedDistance} m</p>
                    </div>
                `,
                formula: null
            });

            // Evaluasi
            const error = Helpers.calculateError(userDistance, expectedDistance);
            const isCorrect = error <= this.tolerance;
            steps.push({
                title: 'Langkah 5: Evaluasi Jawaban',
                content: `
                    <div class="${isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} p-3 rounded-lg border">
                        <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                            Jawaban kamu: ${userDistance} m
                        </p>
                        <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                            ${isCorrect ? '✅ Benar!' : `❌ Selisih ${Helpers.roundTo(error * 100, 1)}% dari jawaban yang benar`}
                        </p>
                    </div>
                `,
                formula: null
            });

        } else if (findType === 'time') {
            // Mencari waktu
            steps.push({
                title: 'Langkah 2: Rumus GLB',
                content: `<p class="text-slate-300 mb-2">Untuk mencari waktu, gunakan rumus:</p>`,
                formula: 't = s / v'
            });

            steps.push({
                title: 'Langkah 3: Substitusi Nilai',
                content: `
                    <div class="bg-slate-800/50 p-3 rounded-lg">
                        <p class="text-slate-300">t = ${givenDistance} m / ${givenVelocity} m/s</p>
                    </div>
                `,
                formula: `t = ${givenDistance} / ${givenVelocity}`
            });

            steps.push({
                title: 'Langkah 4: Hasil',
                content: `
                    <div class="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                        <p class="text-blue-300 font-bold">t = ${expectedTime} s</p>
                    </div>
                `,
                formula: null
            });

            // Evaluasi
            const error = Helpers.calculateError(userTime, expectedTime);
            const isCorrect = error <= this.tolerance;
            steps.push({
                title: 'Langkah 5: Evaluasi Jawaban',
                content: `
                    <div class="${isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} p-3 rounded-lg border">
                        <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                            Jawaban kamu: ${userTime} s
                        </p>
                        <p class="${isCorrect ? 'text-green-300' : 'text-red-300'}">
                            ${isCorrect ? '✅ Benar!' : `❌ Selisih ${Helpers.roundTo(error * 100, 1)}% dari jawaban yang benar`}
                        </p>
                    </div>
                `,
                formula: null
            });
        }

        return steps;
    }
}
