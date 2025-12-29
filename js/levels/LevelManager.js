import { Storage } from '../utils/storage.js';
import { GLB_LEVELS } from './glb-levels.js';
import { GLBB_LEVELS } from './glbb-levels.js';
import { PARABOLA_LEVELS } from './parabola-levels.js';

/**
 * LevelManager - Mengelola level dan progress
 * 
 * Level configs are imported from:
 * - glb-levels.js (Level 1-7)
 * - glbb-levels.js (Level 8-10)
 * - parabola-levels.js (Level 11-14)
 */

export const LevelManager = {
    // Merge all levels from separate files
    levels: [
        ...GLB_LEVELS,
        ...GLBB_LEVELS,
        ...PARABOLA_LEVELS
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
