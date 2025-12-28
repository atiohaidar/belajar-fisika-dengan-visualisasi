/**
 * LevelManager - Mengelola level dan progress
 */

const LevelManager = {
    // All level configurations
    levels: [
        // ============ GLB Levels (1-3) ============
        {
            id: 1,
            type: 'GLB',
            title: 'Mobil Menuju Target',
            description: 'Sebuah mobil harus mencapai target dengan jarak tertentu dalam waktu yang ditentukan. Tentukan kecepatan yang tepat!',

            given: {
                distance: { value: 10, unit: 'm', label: 'Jarak target' },
                time: { value: 5, unit: 's', label: 'Waktu yang diinginkan' }
            },

            find: ['velocity'],

            inputs: [
                {
                    id: 'velocity',
                    label: 'Kecepatan (v)',
                    unit: 'm/s',
                    type: 'number',
                    min: 0,
                    max: 100,
                    placeholder: 'Masukkan kecepatan...'
                }
            ],

            solution: {
                velocity: 2  // v = s/t = 10/5 = 2 m/s
            },

            tolerance: 0.1,

            visualization: {
                type: 'horizontal',
                entity: 'car',
                showGrid: true
            },

            hints: [
                'Pada Gerak Lurus Beraturan (GLB), kecepatan selalu tetap.',
                'Rumus dasar GLB: v = s / t',
                'Dimana s = jarak (meter) dan t = waktu (detik)',
                'Substitusi nilai: v = 10 m / 5 s = ?'
            ],

            formulas: ['v = s / t', 's = v × t', 't = s / v'],

            explanation: `
                <p>Pada <strong>Gerak Lurus Beraturan (GLB)</strong>, benda bergerak dengan kecepatan konstan (tetap).</p>
                <p>Artinya, benda menempuh jarak yang sama setiap detiknya.</p>
                <p>Rumus yang menghubungkan kecepatan, jarak, dan waktu adalah:</p>
            `
        },
        {
            id: 2,
            type: 'GLB',
            title: 'Pengiriman Cepat',
            description: 'Kurir harus mengantarkan paket ke lokasi sejauh 15 meter dalam waktu tepat 3 detik. Berapa kecepatan yang dibutuhkan?',

            given: {
                distance: { value: 15, unit: 'm', label: 'Jarak pengiriman' },
                time: { value: 3, unit: 's', label: 'Waktu maksimal' }
            },

            find: ['velocity'],

            inputs: [
                {
                    id: 'velocity',
                    label: 'Kecepatan (v)',
                    unit: 'm/s',
                    type: 'number',
                    min: 0,
                    max: 100,
                    placeholder: 'Masukkan kecepatan...'
                }
            ],

            solution: {
                velocity: 5  // v = 15/3 = 5 m/s
            },

            tolerance: 0.1,

            visualization: {
                type: 'horizontal',
                entity: 'car',
                showGrid: true
            },

            hints: [
                'Gunakan rumus GLB: v = s / t',
                'Jarak = 15 meter, Waktu = 3 detik',
                'v = 15 / 3 = ?'
            ],

            formulas: ['v = s / t'],

            explanation: `
                <p>Soal ini mirip dengan level sebelumnya, hanya dengan angka yang berbeda.</p>
                <p>Latihan membuat perhitungan menjadi lebih mudah!</p>
            `
        },
        {
            id: 3,
            type: 'GLB',
            title: 'Balapan Waktu',
            description: 'Mobil melaju dengan kecepatan yang harus kamu tentukan agar sampai di garis finish (20 meter) tepat dalam 4 detik!',

            given: {
                distance: { value: 20, unit: 'm', label: 'Jarak finish' },
                time: { value: 4, unit: 's', label: 'Target waktu' }
            },

            find: ['velocity'],

            inputs: [
                {
                    id: 'velocity',
                    label: 'Kecepatan (v)',
                    unit: 'm/s',
                    type: 'number',
                    min: 0,
                    max: 100,
                    placeholder: 'Masukkan kecepatan...'
                }
            ],

            solution: {
                velocity: 5  // v = 20/4 = 5 m/s
            },

            tolerance: 0.1,

            visualization: {
                type: 'horizontal',
                entity: 'car',
                showGrid: true
            },

            hints: [
                'Rumus: v = s / t',
                'Hitung: v = 20 / 4'
            ],

            formulas: ['v = s / t'],

            explanation: ''
        },

        // ============ GLBB Levels (4-6) ============
        {
            id: 4,
            type: 'GLBB',
            title: 'Mobil Dipercepat',
            description: 'Mobil mulai dari diam dan harus mencapai jarak 20 meter dalam waktu 4 detik. Tentukan percepatan yang diperlukan!',

            given: {
                distance: { value: 20, unit: 'm', label: 'Jarak target' },
                time: { value: 4, unit: 's', label: 'Waktu' },
                initialVelocity: { value: 0, unit: 'm/s', label: 'Kecepatan awal' }
            },

            find: ['acceleration'],

            inputs: [
                {
                    id: 'initialVelocity',
                    label: 'Kecepatan Awal (v₀)',
                    unit: 'm/s',
                    type: 'number',
                    defaultValue: 0,
                    disabled: true
                },
                {
                    id: 'acceleration',
                    label: 'Percepatan (a)',
                    unit: 'm/s²',
                    type: 'number',
                    min: -50,
                    max: 50,
                    placeholder: 'Masukkan percepatan...'
                }
            ],

            solution: {
                acceleration: 2.5  // s = v₀t + ½at² => 20 = 0 + ½ × a × 16 => a = 40/16 = 2.5
            },

            tolerance: 0.1,

            visualization: {
                type: 'horizontal',
                entity: 'car',
                showGrid: true
            },

            hints: [
                'Pada GLBB, rumus jarak adalah: s = v₀t + ½at²',
                'Karena mobil mulai dari diam, v₀ = 0',
                'Maka: s = ½at²',
                'Substitusi: 20 = ½ × a × 4² = ½ × a × 16',
                'Selesaikan untuk mencari a'
            ],

            formulas: ['s = v₀t + ½at²', 'v = v₀ + at', 'v² = v₀² + 2as'],

            explanation: `
                <p><strong>Gerak Lurus Berubah Beraturan (GLBB)</strong> adalah gerak dengan percepatan konstan.</p>
                <p>Artinya, kecepatan berubah secara teratur setiap detiknya.</p>
            `
        },
        {
            id: 5,
            type: 'GLBB',
            title: 'Pengereman',
            description: 'Mobil dengan kecepatan awal 10 m/s harus berhenti tepat di garis 25 meter. Tentukan percepatan (perlambatan) yang dibutuhkan!',

            given: {
                distance: { value: 25, unit: 'm', label: 'Jarak pengereman' },
                initialVelocity: { value: 10, unit: 'm/s', label: 'Kecepatan awal' },
                finalVelocity: { value: 0, unit: 'm/s', label: 'Kecepatan akhir' }
            },

            find: ['acceleration'],

            inputs: [
                {
                    id: 'initialVelocity',
                    label: 'Kecepatan Awal (v₀)',
                    unit: 'm/s',
                    type: 'number',
                    defaultValue: 10,
                    disabled: true
                },
                {
                    id: 'acceleration',
                    label: 'Percepatan (a)',
                    unit: 'm/s²',
                    type: 'number',
                    min: -50,
                    max: 50,
                    placeholder: 'Masukkan percepatan (negatif untuk perlambatan)...'
                }
            ],

            solution: {
                acceleration: -2  // v² = v₀² + 2as => 0 = 100 + 2a(25) => a = -100/50 = -2
            },

            tolerance: 0.15,

            visualization: {
                type: 'horizontal',
                entity: 'car',
                showGrid: true
            },

            hints: [
                'Gunakan rumus: v² = v₀² + 2as',
                'Kecepatan akhir (v) = 0 karena mobil berhenti',
                'v₀ = 10 m/s, s = 25 m',
                '0 = 10² + 2 × a × 25',
                'Ingat: percepatan negatif = perlambatan'
            ],

            formulas: ['v² = v₀² + 2as', 's = v₀t + ½at²'],

            explanation: `
                <p>Ketika benda melambat, percepatannya bernilai negatif (arahnya berlawanan dengan gerak).</p>
                <p>Ini disebut juga <strong>perlambatan</strong> atau <strong>deselerasi</strong>.</p>
            `
        },
        {
            id: 6,
            type: 'GLBB',
            title: 'Akselerasi Optimal',
            description: 'Mobil mulai dengan kecepatan 5 m/s dan harus menempuh 30 meter dalam 4 detik. Berapa percepatan yang diperlukan?',

            given: {
                distance: { value: 30, unit: 'm', label: 'Jarak target' },
                time: { value: 4, unit: 's', label: 'Waktu' },
                initialVelocity: { value: 5, unit: 'm/s', label: 'Kecepatan awal' }
            },

            find: ['acceleration'],

            inputs: [
                {
                    id: 'initialVelocity',
                    label: 'Kecepatan Awal (v₀)',
                    unit: 'm/s',
                    type: 'number',
                    defaultValue: 5,
                    disabled: true
                },
                {
                    id: 'acceleration',
                    label: 'Percepatan (a)',
                    unit: 'm/s²',
                    type: 'number',
                    min: -50,
                    max: 50,
                    placeholder: 'Masukkan percepatan...'
                }
            ],

            solution: {
                acceleration: 1.25  // 30 = 5(4) + ½a(16) => 30 = 20 + 8a => a = 10/8 = 1.25
            },

            tolerance: 0.15,

            visualization: {
                type: 'horizontal',
                entity: 'car',
                showGrid: true
            },

            hints: [
                'Rumus: s = v₀t + ½at²',
                '30 = 5 × 4 + ½ × a × 4²',
                '30 = 20 + 8a',
                'Selesaikan untuk a'
            ],

            formulas: ['s = v₀t + ½at²'],

            explanation: ''
        },

        // ============ Parabola Levels (7-10) ============
        {
            id: 7,
            type: 'PARABOLA',
            title: 'Tembakan Pertama',
            description: 'Tembakkan bola ke target yang berjarak 20 meter! Tentukan kecepatan dan sudut yang tepat.',

            given: {
                targetX: { value: 20, unit: 'm', label: 'Jarak target' },
                gravity: { value: 10, unit: 'm/s²', label: 'Gravitasi' },
                initialHeight: { value: 0, unit: 'm', label: 'Ketinggian awal' }
            },

            find: ['velocity', 'angle'],

            inputs: [
                {
                    id: 'velocity',
                    label: 'Kecepatan Awal (v₀)',
                    unit: 'm/s',
                    type: 'number',
                    min: 0,
                    max: 100,
                    placeholder: 'Masukkan kecepatan...'
                },
                {
                    id: 'angle',
                    label: 'Sudut Tembak (θ)',
                    unit: '°',
                    type: 'number',
                    min: 0,
                    max: 90,
                    placeholder: 'Masukkan sudut (0-90)...'
                }
            ],

            solution: {
                velocity: 14.14,  // R = v₀²sin(2θ)/g => 20 = v₀²sin(90°)/10 => v₀² = 200 => v₀ ≈ 14.14
                angle: 45        // Sudut optimal untuk jangkauan maksimum
            },

            tolerance: 0.15,

            visualization: {
                type: 'parabola',
                entity: 'ball',
                showGrid: true,
                showTrajectory: true
            },

            hints: [
                'Jangkauan maksimum tercapai pada sudut 45°',
                'Rumus jangkauan: R = v₀²×sin(2θ) / g',
                'Dengan θ = 45°, sin(90°) = 1',
                'Maka: R = v₀² / g',
                '20 = v₀² / 10 => v₀² = 200 => v₀ = √200 ≈ 14.14 m/s'
            ],

            formulas: [
                'x = v₀ × cos(θ) × t',
                'y = v₀ × sin(θ) × t - ½gt²',
                'R = v₀² × sin(2θ) / g'
            ],

            explanation: `
                <p><strong>Gerak Parabola</strong> adalah kombinasi dari gerak horizontal (GLB) dan gerak vertikal (GLBB dengan gravitasi).</p>
                <p>Sudut 45° memberikan jangkauan maksimum jika ketinggian awal dan akhir sama.</p>
            `
        },
        {
            id: 8,
            type: 'PARABOLA',
            title: 'Target Jauh',
            description: 'Target berada pada jarak 40 meter. Tentukan kecepatan dan sudut yang tepat!',

            given: {
                targetX: { value: 40, unit: 'm', label: 'Jarak target' },
                gravity: { value: 10, unit: 'm/s²', label: 'Gravitasi' },
                initialHeight: { value: 0, unit: 'm', label: 'Ketinggian awal' }
            },

            find: ['velocity', 'angle'],

            inputs: [
                {
                    id: 'velocity',
                    label: 'Kecepatan Awal (v₀)',
                    unit: 'm/s',
                    type: 'number',
                    min: 0,
                    max: 100,
                    placeholder: 'Masukkan kecepatan...'
                },
                {
                    id: 'angle',
                    label: 'Sudut Tembak (θ)',
                    unit: '°',
                    type: 'number',
                    min: 0,
                    max: 90,
                    placeholder: 'Masukkan sudut...'
                }
            ],

            solution: {
                velocity: 20,
                angle: 45
            },

            tolerance: 0.15,

            visualization: {
                type: 'parabola',
                entity: 'ball',
                showGrid: true,
                showTrajectory: true
            },

            hints: [
                'Gunakan sudut 45° untuk jangkauan optimal',
                'R = v₀² / g (saat θ = 45°)',
                '40 = v₀² / 10',
                'v₀ = √400 = 20 m/s'
            ],

            formulas: ['R = v₀² × sin(2θ) / g'],

            explanation: ''
        },
        {
            id: 9,
            type: 'PARABOLA',
            title: 'Sudut Berbeda',
            description: 'Target di jarak 30 meter. Cobalah berbagai kombinasi sudut dan kecepatan!',

            given: {
                targetX: { value: 30, unit: 'm', label: 'Jarak target' },
                gravity: { value: 10, unit: 'm/s²', label: 'Gravitasi' },
                initialHeight: { value: 0, unit: 'm', label: 'Ketinggian awal' }
            },

            find: ['velocity', 'angle'],

            inputs: [
                {
                    id: 'velocity',
                    label: 'Kecepatan Awal (v₀)',
                    unit: 'm/s',
                    type: 'number',
                    min: 0,
                    max: 100,
                    placeholder: 'Masukkan kecepatan...'
                },
                {
                    id: 'angle',
                    label: 'Sudut Tembak (θ)',
                    unit: '°',
                    type: 'number',
                    min: 0,
                    max: 90,
                    placeholder: 'Masukkan sudut...'
                }
            ],

            solution: {
                velocity: 17.32,  // Dengan sudut 45°
                angle: 45
            },

            tolerance: 0.2,  // Lebih toleran karena banyak kombinasi valid

            visualization: {
                type: 'parabola',
                entity: 'ball',
                showGrid: true,
                showTrajectory: true
            },

            hints: [
                'Ada banyak kombinasi v₀ dan θ yang bisa mencapai target',
                'Sudut 45° adalah yang paling efisien',
                'Sudut 30° dan 60° menghasilkan jangkauan yang sama!'
            ],

            formulas: ['R = v₀² × sin(2θ) / g'],

            explanation: `
                <p>Tahukah kamu? Sudut <strong>30°</strong> dan <strong>60°</strong> menghasilkan jangkauan yang sama (sudut komplementer)!</p>
                <p>Ini karena sin(60°) = sin(120°) = sin(2×30°) = sin(2×60°)</p>
            `
        },
        {
            id: 10,
            type: 'PARABOLA',
            title: 'Tantangan Akhir',
            description: 'Level terakhir! Target berada sangat jauh di 50 meter. Tunjukkan kemampuanmu!',

            given: {
                targetX: { value: 50, unit: 'm', label: 'Jarak target' },
                gravity: { value: 10, unit: 'm/s²', label: 'Gravitasi' },
                initialHeight: { value: 0, unit: 'm', label: 'Ketinggian awal' }
            },

            find: ['velocity', 'angle'],

            inputs: [
                {
                    id: 'velocity',
                    label: 'Kecepatan Awal (v₀)',
                    unit: 'm/s',
                    type: 'number',
                    min: 0,
                    max: 100,
                    placeholder: 'Masukkan kecepatan...'
                },
                {
                    id: 'angle',
                    label: 'Sudut Tembak (θ)',
                    unit: '°',
                    type: 'number',
                    min: 0,
                    max: 90,
                    placeholder: 'Masukkan sudut...'
                }
            ],

            solution: {
                velocity: 22.36,  // √500 ≈ 22.36
                angle: 45
            },

            tolerance: 0.15,

            visualization: {
                type: 'parabola',
                entity: 'ball',
                showGrid: true,
                showTrajectory: true
            },

            hints: [
                'Ini level terakhir - kamu pasti bisa!',
                'R = v₀² / g (dengan θ = 45°)',
                '50 = v₀² / 10',
                'v₀ = √500 ≈ 22.36 m/s'
            ],

            formulas: ['R = v₀² × sin(2θ) / g'],

            explanation: `
                <p>🎉 Selamat! Kamu telah menyelesaikan semua level!</p>
                <p>Kamu sekarang memahami dasar-dasar:</p>
                <ul>
                    <li>Gerak Lurus Beraturan (GLB)</li>
                    <li>Gerak Lurus Berubah Beraturan (GLBB)</li>
                    <li>Gerak Parabola</li>
                </ul>
            `
        }
    ],

    /**
     * Get level by ID
     * @param {number} id - Level ID
     * @returns {Object|null} Level configuration
     */
    getLevel(id) {
        return this.levels.find(level => level.id === id) || null;
    },

    /**
     * Get all levels
     * @returns {Array} All levels
     */
    getAllLevels() {
        return this.levels;
    },

    /**
     * Get levels by type
     * @param {string} type - Level type (GLB, GLBB, PARABOLA)
     * @returns {Array} Filtered levels
     */
    getLevelsByType(type) {
        return this.levels.filter(level => level.type === type);
    },

    /**
     * Get next level
     * @param {number} currentId - Current level ID
     * @returns {Object|null} Next level or null
     */
    getNextLevel(currentId) {
        const currentIndex = this.levels.findIndex(level => level.id === currentId);
        if (currentIndex >= 0 && currentIndex < this.levels.length - 1) {
            return this.levels[currentIndex + 1];
        }
        return null;
    },

    /**
     * Get level with progress info
     * @param {number} id - Level ID
     * @returns {Object} Level with progress
     */
    getLevelWithProgress(id) {
        const level = this.getLevel(id);
        if (!level) return null;

        const isCompleted = Storage.isLevelCompleted(id);
        const isUnlocked = Storage.isLevelUnlocked(id);
        const scoreData = Storage.getLevelScore(id);

        return {
            ...level,
            isCompleted,
            isUnlocked,
            score: scoreData?.score || 0,
            stars: scoreData?.stars || 0
        };
    },

    /**
     * Get all levels with progress
     * @returns {Array} Levels with progress info
     */
    getAllLevelsWithProgress() {
        return this.levels.map(level => this.getLevelWithProgress(level.id));
    },

    /**
     * Get total level count
     * @returns {number} Total levels
     */
    getTotalLevels() {
        return this.levels.length;
    },

    /**
     * Get last unlocked level
     * @returns {Object} Last unlocked level
     */
    getLastUnlockedLevel() {
        const progress = Storage.getProgress();
        const lastId = Math.min(progress.currentLevel, this.levels.length);
        return this.getLevel(lastId);
    }
};
