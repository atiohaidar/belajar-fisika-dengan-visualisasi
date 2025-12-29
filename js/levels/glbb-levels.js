/**
 * GLBB Levels - Gerak Lurus Berubah Beraturan
 * Level 8-10: Mencari percepatan
 */

const GLBB_LEVELS = [
    // Level 8: Mobil dari diam
    {
        id: 8,
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
        solution: { acceleration: 2.5 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
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

    // Level 9: Pengereman (perlambatan)
    {
        id: 9,
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
        solution: { acceleration: -2 },
        tolerance: 0.15,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
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

    // Level 10: Akselerasi dengan kecepatan awal
    {
        id: 10,
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
        solution: { acceleration: 1.25 },
        tolerance: 0.15,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
        hints: [
            'Rumus: s = v₀t + ½at²',
            '30 = 5 × 4 + ½ × a × 4²',
            '30 = 20 + 8a',
            'Selesaikan untuk a'
        ],
        formulas: ['s = v₀t + ½at²'],
        explanation: ''
    }
];
