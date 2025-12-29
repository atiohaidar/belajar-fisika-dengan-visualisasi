/**
 * Parabola Levels - Gerak Parabola
 * Level 11-14: Mencari kecepatan dan sudut tembak
 */

export const PARABOLA_LEVELS = [
    // Level 11: Target 20m
    {
        id: 11,
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
        solution: { velocity: 14.14, angle: 45 },
        tolerance: 0.15,
        visualization: { type: 'parabola', entity: 'ball', showGrid: true, showTrajectory: true },
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

    // Level 12: Target 40m
    {
        id: 12,
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
        solution: { velocity: 20, angle: 45 },
        tolerance: 0.15,
        visualization: { type: 'parabola', entity: 'ball', showGrid: true, showTrajectory: true },
        hints: [
            'Gunakan sudut 45° untuk jangkauan optimal',
            'R = v₀² / g (saat θ = 45°)',
            '40 = v₀² / 10',
            'v₀ = √400 = 20 m/s'
        ],
        formulas: ['R = v₀² × sin(2θ) / g'],
        explanation: ''
    },

    // Level 13: Target 30m (multiple solutions)
    {
        id: 13,
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
        solution: { velocity: 17.32, angle: 45 },
        tolerance: 0.2,
        visualization: { type: 'parabola', entity: 'ball', showGrid: true, showTrajectory: true },
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

    // Level 14: Target 50m (final challenge)
    {
        id: 14,
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
        solution: { velocity: 22.36, angle: 45 },
        tolerance: 0.15,
        visualization: { type: 'parabola', entity: 'ball', showGrid: true, showTrajectory: true },
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
    },
    // Level 15: Target di Atas Tebing
    {
        id: 15,
        type: 'PARABOLA',
        title: 'Target di Atas Tebing',
        description: 'Tantangan Baru! Target berada di atas tebing setinggi 10 meter pada jarak 30 meter. Perhitungkan ketinggian target!',
        given: {
            targetX: { value: 30, unit: 'm', label: 'Jarak target' },
            targetY: { value: 10, unit: 'm', label: 'Tinggi target' },
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
        solution: { velocity: 20.71, angle: 60 },
        tolerance: 0.15,
        visualization: { type: 'parabola', entity: 'ball', showGrid: true, showTrajectory: true },
        hints: [
            'Target memiliki ketinggian (y = 10m). Bola harus mendarat di sana!',
            'Gunakan persamaan parabola: y = x·tan(θ) - (g·x²) / (2·v₀²·cos²(θ))',
            'Substitusi x=30 dan y=10. Coba dengan θ=60°',
            'Jika θ=60°, hitung v₀ yang dibutuhkan.'
        ],
        formulas: [
            'y = x·tan(θ) - (g·x²) / (2·v₀²·cos²(θ))'
        ],
        explanation: `
            <p><strong>Gerak Parabola pada Bidang Miring/Bertingkat</strong></p>
            <p>Ketika target tidak berada di ketinggian yang sama, kita tidak bisa menggunakan rumus praktis R = v₀²·sin(2θ)/g.</p>
            <p>Kita harus kembali ke persamaan posisi gerak parabola dasar untuk x dan y.</p>
        `
    }
];
