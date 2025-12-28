/**
 * Storage Manager
 * Mengelola penyimpanan progress dan pengaturan ke localStorage
 */

const Storage = {
    /**
     * Simpan data ke localStorage
     * @param {string} key - Nama key
     * @param {any} data - Data yang akan disimpan
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },

    /**
     * Ambil data dari localStorage
     * @param {string} key - Nama key
     * @param {any} defaultValue - Nilai default jika tidak ditemukan
     * @returns {any} Data yang tersimpan atau default value
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return defaultValue;
        }
    },

    /**
     * Hapus data dari localStorage
     * @param {string} key - Nama key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    },

    /**
     * Hapus semua data game
     */
    clearAll() {
        const { STORAGE } = CONSTANTS;
        this.remove(STORAGE.PROGRESS_KEY);
        this.remove(STORAGE.SETTINGS_KEY);
        this.remove(STORAGE.SCORES_KEY);
    },

    // ============ Progress Management ============

    /**
     * Inisialisasi progress default
     * @returns {Object} Default progress object
     */
    getDefaultProgress() {
        return {
            currentLevel: 1,
            completedLevels: [],
            levelScores: {},
            totalScore: 0,
            glbCompleted: 0,
            glbbCompleted: 0,
            parabolaCompleted: 0,
            lastPlayed: null,
            attempts: {},
        };
    },

    /**
     * Ambil progress
     * @returns {Object} Progress object
     */
    getProgress() {
        const { STORAGE } = CONSTANTS;
        return this.load(STORAGE.PROGRESS_KEY, this.getDefaultProgress());
    },

    /**
     * Simpan progress
     * @param {Object} progress - Progress object
     */
    saveProgress(progress) {
        const { STORAGE } = CONSTANTS;
        progress.lastPlayed = new Date().toISOString();
        this.save(STORAGE.PROGRESS_KEY, progress);
    },

    /**
     * Update level yang selesai
     * @param {number} levelId - ID level
     * @param {number} score - Skor yang didapat
     * @param {number} stars - Jumlah bintang
     */
    completeLevel(levelId, score, stars) {
        const progress = this.getProgress();

        // Tambah ke completed jika belum ada
        if (!progress.completedLevels.includes(levelId)) {
            progress.completedLevels.push(levelId);
        }

        // Update skor jika lebih tinggi
        const previousScore = progress.levelScores[levelId]?.score || 0;
        if (score > previousScore) {
            progress.levelScores[levelId] = { score, stars, completedAt: new Date().toISOString() };
        }

        // Hitung ulang total score
        progress.totalScore = Object.values(progress.levelScores)
            .reduce((sum, data) => sum + data.score, 0);

        // Update progress per topic
        this.updateTopicProgress(progress);

        // Update current level
        if (levelId >= progress.currentLevel) {
            progress.currentLevel = levelId + 1;
        }

        this.saveProgress(progress);
        return progress;
    },

    /**
     * Update progress per topik
     * @param {Object} progress - Progress object
     */
    updateTopicProgress(progress) {
        const completed = progress.completedLevels;

        // GLB: Level 1-3
        progress.glbCompleted = completed.filter(id => id >= 1 && id <= 3).length;

        // GLBB: Level 4-6
        progress.glbbCompleted = completed.filter(id => id >= 4 && id <= 6).length;

        // Parabola: Level 7-10
        progress.parabolaCompleted = completed.filter(id => id >= 7 && id <= 10).length;
    },

    /**
     * Tambah percobaan untuk level
     * @param {number} levelId - ID level
     */
    addAttempt(levelId) {
        const progress = this.getProgress();

        if (!progress.attempts[levelId]) {
            progress.attempts[levelId] = 0;
        }
        progress.attempts[levelId]++;

        this.saveProgress(progress);
    },

    /**
     * Cek apakah level sudah selesai
     * @param {number} levelId - ID level
     * @returns {boolean} True jika sudah selesai
     */
    isLevelCompleted(levelId) {
        const progress = this.getProgress();
        return progress.completedLevels.includes(levelId);
    },

    /**
     * Cek apakah level terbuka (unlocked)
     * @param {number} levelId - ID level
     * @returns {boolean} True jika terbuka
     */
    isLevelUnlocked(levelId) {
        const progress = this.getProgress();
        // Level 1 selalu terbuka, level lain terbuka jika sebelumnya selesai
        return levelId === 1 || progress.completedLevels.includes(levelId - 1);
    },

    /**
     * Ambil skor untuk level tertentu
     * @param {number} levelId - ID level
     * @returns {Object|null} Data skor atau null
     */
    getLevelScore(levelId) {
        const progress = this.getProgress();
        return progress.levelScores[levelId] || null;
    },

    /**
     * Reset semua progress
     */
    resetProgress() {
        const { STORAGE } = CONSTANTS;
        this.save(STORAGE.PROGRESS_KEY, this.getDefaultProgress());
    },

    // ============ Settings Management ============

    /**
     * Ambil settings
     * @returns {Object} Settings object
     */
    getSettings() {
        const { STORAGE } = CONSTANTS;
        return this.load(STORAGE.SETTINGS_KEY, {
            showHints: true,
            showFormulas: true,
            animationSpeed: 1,
            theme: 'dark',
        });
    },

    /**
     * Simpan settings
     * @param {Object} settings - Settings object
     */
    saveSettings(settings) {
        const { STORAGE } = CONSTANTS;
        this.save(STORAGE.SETTINGS_KEY, settings);
    },
};
