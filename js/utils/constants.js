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
        GRID_COLOR: 'rgba(100, 116, 139, 0.2)',
        AXIS_COLOR: 'rgba(100, 116, 139, 0.5)',
        TEXT_COLOR: '#94a3b8',
        GROUND_COLOR: '#1e293b',
        SKY_GRADIENT: ['#0f172a', '#1e3a5f'],
    },

    // Warna Entitas
    COLORS: {
        CAR: '#3b82f6',        // Biru untuk mobil
        BALL: '#f59e0b',       // Kuning untuk bola
        TARGET: '#10b981',     // Hijau untuk target
        TARGET_ZONE: 'rgba(16, 185, 129, 0.2)',
        TRAJECTORY: '#60a5fa', // Biru muda untuk lintasan
        TRAJECTORY_PREDICT: 'rgba(96, 165, 250, 0.3)',
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
