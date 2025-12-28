/**
 * ParabolaPhysics - Gerak Parabola (Gerak Peluru)
 * Rumus dasar:
 *   x = v₀ × cos(θ) × t
 *   y = v₀ × sin(θ) × t - ½gt²
 *   Jarak maksimum: R = v₀² × sin(2θ) / g
 *   Tinggi maksimum: H = v₀² × sin²(θ) / (2g)
 */

class ParabolaPhysics extends PhysicsBase {
    /**
     * Hitung hasil berdasarkan input user
     * @param {Object} inputs - Input dari user (velocity, angle)
     * @returns {Object} Hasil perhitungan
     */
    calculate(inputs) {
        const v0 = parseFloat(inputs.velocity) || 0;  // Kecepatan awal
        const angleDeg = parseFloat(inputs.angle) || 45;  // Sudut dalam derajat
        const angleRad = Helpers.degreesToRadians(angleDeg);

        const g = this.given.gravity?.value || CONSTANTS.PHYSICS.GRAVITY;
        const targetX = this.given.targetX?.value || 0;
        const targetY = this.given.targetY?.value || 0;
        const initialHeight = this.given.initialHeight?.value || 0;

        // Komponen kecepatan
        const vx = v0 * Math.cos(angleRad);
        const vy = v0 * Math.sin(angleRad);

        // Waktu untuk mencapai tanah (y = 0)
        // y = y₀ + v₀y × t - ½gt² = 0
        // Menggunakan rumus kuadrat
        let timeOfFlight;
        if (g !== 0) {
            const discriminant = (vy * vy) + (2 * g * initialHeight);
            timeOfFlight = (vy + Math.sqrt(Math.max(0, discriminant))) / g;
        } else {
            timeOfFlight = 5;
        }

        // Jangkauan maksimum
        const range = vx * timeOfFlight;

        // Tinggi maksimum
        const timeToMaxHeight = vy / g;
        const maxHeight = initialHeight + (vy * timeToMaxHeight) - (0.5 * g * timeToMaxHeight * timeToMaxHeight);

        // Cek apakah kena target
        const hitX = range;
        const distanceToTarget = Math.abs(hitX - targetX);
        const tolerance = targetX * this.tolerance || 1;

        return {
            velocity: v0,
            angle: angleDeg,
            angleRad,
            vx,
            vy,
            gravity: g,
            timeOfFlight: Helpers.roundTo(timeOfFlight, 2),
            range: Helpers.roundTo(range, 2),
            maxHeight: Helpers.roundTo(maxHeight, 2),
            timeToMaxHeight: Helpers.roundTo(timeToMaxHeight, 2),
            targetX,
            targetY,
            hitX: Helpers.roundTo(hitX, 2),
            distanceToTarget: Helpers.roundTo(distanceToTarget, 2),
            reachedTarget: distanceToTarget <= tolerance,
        };
    }

    /**
     * Dapatkan posisi pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Posisi {x, y}
     */
    getPositionAtTime(t, inputs) {
        const v0 = parseFloat(inputs.velocity) || 0;
        const angleDeg = parseFloat(inputs.angle) || 45;
        const angleRad = Helpers.degreesToRadians(angleDeg);

        const g = this.given.gravity?.value || CONSTANTS.PHYSICS.GRAVITY;
        const initialHeight = this.given.initialHeight?.value || 0;

        // x = v₀ × cos(θ) × t
        const x = v0 * Math.cos(angleRad) * t;

        // y = y₀ + v₀ × sin(θ) × t - ½gt²
        const y = initialHeight + (v0 * Math.sin(angleRad) * t) - (0.5 * g * t * t);

        return {
            x: x,
            y: Math.max(0, y)  // Tidak boleh di bawah tanah
        };
    }

    /**
     * Dapatkan kecepatan pada waktu t
     * @param {number} t - Waktu dalam detik
     * @param {Object} inputs - Input dari user
     * @returns {Object} Kecepatan {vx, vy, magnitude}
     */
    getVelocityAtTime(t, inputs) {
        const v0 = parseFloat(inputs.velocity) || 0;
        const angleDeg = parseFloat(inputs.angle) || 45;
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
        const v0 = parseFloat(inputs.velocity) || 0;
        const angleDeg = parseFloat(inputs.angle) || 45;
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
                    <p class="text-blue-300">vₓ = v₀ × cos(${angleDeg}°) = ${Helpers.roundTo(result.vx, 2)} m/s</p>
                    <p class="text-blue-300">vᵧ = v₀ × sin(${angleDeg}°) = ${Helpers.roundTo(result.vy, 2)} m/s</p>
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
                    <p class="text-slate-300">Waktu di udara: <span class="text-blue-300 font-bold">${result.timeOfFlight} s</span></p>
                    <p class="text-slate-300">Jangkauan: <span class="text-green-300 font-bold">${result.range} m</span></p>
                    <p class="text-slate-300">Tinggi maksimum: <span class="text-purple-300 font-bold">${result.maxHeight} m</span></p>
                </div>
            `,
            formula: null
        });

        // Langkah 5: Evaluasi
        steps.push({
            title: 'Langkah 5: Evaluasi',
            content: `
                <div class="${result.reachedTarget ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} p-3 rounded-lg border">
                    <p class="${result.reachedTarget ? 'text-green-300' : 'text-red-300'}">
                        Posisi jatuh: ${result.hitX} m
                    </p>
                    <p class="${result.reachedTarget ? 'text-green-300' : 'text-red-300'}">
                        Target: ${targetX} m
                    </p>
                    <p class="${result.reachedTarget ? 'text-green-300' : 'text-red-300'} font-bold mt-2">
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
