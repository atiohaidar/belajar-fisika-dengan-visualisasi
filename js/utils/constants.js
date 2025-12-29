/**
 * Konstanta Fisika dan Game
 * Semua nilai konstanta yang digunakan dalam game
 */

export const CONSTANTS = {
    // Konstanta Fisika
    PHYSICS: {
        GRAVITY: 10,           // Percepatan gravitasi (m/s²) - disederhanakan dari 9.8
        GRAVITY_EARTH: 9.8,    // Gravitasi bumi sebenarnya (m/s²)
        GRAVITY_MOON: 1.62,    // Gravitasi bulan (m/s²)
    },

    // Pengaturan Canvas
    CANVAS: {
        PADDING: 60,           // Padding dalam pixel
        GRID_COLOR: 'rgba(56, 189, 248, 0.2)', // Cyan grid (Modern)
        AXIS_COLOR: 'rgba(148, 163, 184, 0.5)', // Slate axis
        TEXT_COLOR: '#f1f5f9', // Slate 100 for better contrast
        GROUND_COLOR: '#020617', // Slate 950 (Deep dark ground)
        SKY_GRADIENT: ['#0f172a', '#1e1b4b'], // Slate 900 to Indigo 950 (Deep Space)
    },

    // Warna Entitas
    COLORS: {
        CAR: '#ec4899',        // Pink 500 (Neon Pink) - Lebih menonjol dari biru standar
        BALL: '#22d3ee',       // Cyan 400 (Electric Blue) - Kontras tinggi dengan background gelap
        TARGET: '#facc15',     // Yellow 400 (Gold/Warning) - Lebih jelas sebagai target
        TARGET_ZONE: 'rgba(250, 204, 21, 0.2)', // Matching Yellow glow
        TRAJECTORY: '#a78bfa', // Violet 400 (Soft Purple) - Elegan untuk lintasan
        TRAJECTORY_PREDICT: 'rgba(167, 139, 250, 0.3)',
    },

    // Pengaturan Animasi
    ANIMATION: {
        FPS: 60,
        TIME_SCALE: 1,         // Skala waktu (1 = realtime)
        TRAIL_LENGTH: 50,      // Panjang jejak lintasan
    },

    // Pengaturan Scoring
    SCORING: {
        PERFECT: 100,          // Skor sempurna
        CLOSE: 75,             // Skor hampir benar
        PARTIAL: 50,           // Skor sebagian benar
        ATTEMPT: 25,           // Skor mencoba

        // Toleransi untuk penilaian
        TOLERANCE_PERFECT: 0.01,  // 1% error untuk sempurna
        TOLERANCE_CLOSE: 0.05,    // 5% error untuk hampir benar
        TOLERANCE_PARTIAL: 0.1,   // 10% error untuk sebagian benar
    },

    // Storage Keys
    STORAGE: {
        PROGRESS_KEY: 'fisika_game_progress',
        SETTINGS_KEY: 'fisika_game_settings',
        SCORES_KEY: 'fisika_game_scores',
    },

    // Level Types
    LEVEL_TYPES: {
        GLB: 'GLB',
        GLBB: 'GLBB',
        PARABOLA: 'PARABOLA',
    },

    // Game States
    GAME_STATES: {
        MENU: 'MENU',
        PLAYING: 'PLAYING',
        SIMULATING: 'SIMULATING',
        RESULT: 'RESULT',
        PAUSED: 'PAUSED',
    },
};

// Freeze untuk mencegah modifikasi
Object.freeze(CONSTANTS);
Object.freeze(CONSTANTS.PHYSICS);
Object.freeze(CONSTANTS.CANVAS);
Object.freeze(CONSTANTS.COLORS);
Object.freeze(CONSTANTS.ANIMATION);
Object.freeze(CONSTANTS.SCORING);
Object.freeze(CONSTANTS.STORAGE);
Object.freeze(CONSTANTS.LEVEL_TYPES);
Object.freeze(CONSTANTS.GAME_STATES);
