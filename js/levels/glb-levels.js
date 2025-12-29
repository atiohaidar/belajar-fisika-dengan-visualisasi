/**
 * GLB Levels - Gerak Lurus Beraturan
 * Level 1-7: Mencari kecepatan, jarak, dan waktu
 */

export const GLB_LEVELS = [
    // Level 1: Mencari kecepatan (basic)
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
        solution: { velocity: 2 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
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

    // Level 2: Mencari kecepatan
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
        solution: { velocity: 5 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
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

    // Level 3: Mencari kecepatan
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
        solution: { velocity: 5 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
        hints: ['Rumus: v = s / t', 'Hitung: v = 20 / 4'],
        formulas: ['v = s / t'],
        explanation: ''
    },

    // Level 4: Mencari Jarak
    {
        id: 4,
        type: 'GLB',
        title: 'Hitung Jarak Tempuh',
        description: 'Sepeda motor melaju dengan kecepatan konstan 20 m/s selama 6 detik. Berapa jarak yang ditempuh sepeda motor tersebut?',
        given: {
            velocity: { value: 20, unit: 'm/s', label: 'Kecepatan' },
            time: { value: 6, unit: 's', label: 'Waktu tempuh' }
        },
        find: ['distance'],
        inputs: [
            {
                id: 'distance',
                label: 'Jarak (s)',
                unit: 'm',
                type: 'number',
                min: 0,
                max: 1000,
                placeholder: 'Masukkan jarak...'
            }
        ],
        solution: { distance: 120 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
        hints: [
            'Pada GLB, jarak tempuh bisa dihitung dengan rumus: s = v × t',
            'Kecepatan = 20 m/s, Waktu = 6 s',
            's = 20 × 6 = ?'
        ],
        formulas: ['s = v × t', 'v = s / t', 't = s / v'],
        explanation: `
            <p>Ketika <strong>kecepatan dan waktu diketahui</strong>, kita bisa menghitung jarak dengan mengalikan keduanya.</p>
            <p>Rumus: <strong>s = v × t</strong></p>
        `
    },

    // Level 5: Mencari Waktu
    {
        id: 5,
        type: 'GLB',
        title: 'Waktu Perjalanan',
        description: 'Kereta api bergerak dengan kecepatan konstan 25 m/s. Berapa waktu yang diperlukan untuk menempuh jarak 150 meter?',
        given: {
            velocity: { value: 25, unit: 'm/s', label: 'Kecepatan kereta' },
            distance: { value: 150, unit: 'm', label: 'Jarak yang ditempuh' }
        },
        find: ['time'],
        inputs: [
            {
                id: 'time',
                label: 'Waktu (t)',
                unit: 's',
                type: 'number',
                min: 0,
                max: 1000,
                placeholder: 'Masukkan waktu...'
            }
        ],
        solution: { time: 6 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
        hints: [
            'Untuk mencari waktu, gunakan rumus: t = s / v',
            'Jarak = 150 m, Kecepatan = 25 m/s',
            't = 150 / 25 = ?'
        ],
        formulas: ['t = s / v', 's = v × t', 'v = s / t'],
        explanation: `
            <p>Ketika <strong>jarak dan kecepatan diketahui</strong>, kita bisa menghitung waktu dengan membagi jarak dengan kecepatan.</p>
            <p>Rumus: <strong>t = s / v</strong></p>
        `
    },

    // Level 6: Soal Cerita - Konversi Satuan
    {
        id: 6,
        type: 'GLB',
        title: 'Pelari Marathon',
        description: 'Seorang pelari berlari dengan kecepatan 18 km/jam selama 10 menit. Berapa meter jarak yang ia tempuh? (Petunjuk: konversi dulu ke m/s!)',
        given: {
            velocity: { value: 5, unit: 'm/s', label: 'Kecepatan (18 km/jam = 5 m/s)' },
            time: { value: 600, unit: 's', label: 'Waktu (10 menit = 600 s)' }
        },
        find: ['distance'],
        inputs: [
            {
                id: 'distance',
                label: 'Jarak (s)',
                unit: 'm',
                type: 'number',
                min: 0,
                max: 10000,
                placeholder: 'Masukkan jarak dalam meter...'
            }
        ],
        solution: { distance: 3000 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
        hints: [
            'Pertama, konversi satuan ke SI (meter dan detik)',
            '18 km/jam = 18 × 1000 / 3600 = 5 m/s',
            '10 menit = 10 × 60 = 600 detik',
            's = v × t = 5 × 600 = ?'
        ],
        formulas: ['s = v × t', '1 km/jam = 1000/3600 m/s', '1 menit = 60 detik'],
        explanation: `
            <p>Soal ini mengajarkan pentingnya <strong>konversi satuan</strong> sebelum menghitung.</p>
            <p>Konversi: 18 km/jam = 5 m/s, 10 menit = 600 s</p>
        `
    },

    // Level 7: Soal Cerita - Perjalanan Kompleks
    {
        id: 7,
        type: 'GLB',
        title: 'Bus Antar Kota',
        description: 'Sebuah bus berangkat dari kota A menuju kota B yang berjarak 180 km. Jika bus bergerak dengan kecepatan rata-rata 60 km/jam, berapa jam waktu yang diperlukan?',
        given: {
            velocity: { value: 60, unit: 'km/jam', label: 'Kecepatan bus' },
            distance: { value: 180, unit: 'km', label: 'Jarak A ke B' }
        },
        find: ['time'],
        inputs: [
            {
                id: 'time',
                label: 'Waktu (t)',
                unit: 'jam',
                type: 'number',
                min: 0,
                max: 100,
                placeholder: 'Masukkan waktu dalam jam...'
            }
        ],
        solution: { time: 3 },
        tolerance: 0.1,
        visualization: { type: 'horizontal', entity: 'car', showGrid: true },
        hints: [
            'Ini adalah soal GLB klasik dengan satuan km dan jam',
            'Tidak perlu konversi karena satuan sudah konsisten',
            't = s / v = 180 km / 60 km/jam = ?'
        ],
        formulas: ['t = s / v'],
        explanation: `
            <p>Ketika satuan sudah konsisten (km dan km/jam), kita bisa langsung menghitung.</p>
            <p>t = 180 km / 60 km/jam = <strong>3 jam</strong></p>
        `
    }
];
