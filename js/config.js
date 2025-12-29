/**
 * Game Configuration
 * Centralized settings for the Game Fisika application
 */

export const GameConfig = {
    // Game Settings
    game: {
        name: 'Fisika Game',
        version: '1.0.0',
        defaultTolerance: 0.1
    },

    // Animation Settings
    animation: {
        timeScale: 1,
        trailLength: 100,
        fps: 60
    },

    // Scoring System
    scoring: {
        baseScore: 100,
        perfectBonus: 50,
        hintPenalty: 10,
        minScore: 10
    },

    // Topic Definitions
    topics: {
        glb: {
            id: 'glb',
            name: 'GLB',
            fullName: 'Gerak Lurus Beraturan',
            icon: '🚗',
            color: 'blue',
            formula: 'v = s / t',
            levelRange: { start: 1, end: 7 }
        },
        glbb: {
            id: 'glbb',
            name: 'GLBB',
            fullName: 'Gerak Lurus Berubah Beraturan',
            icon: '🚀',
            color: 'purple',
            formula: 's = v₀t + ½at²',
            levelRange: { start: 8, end: 10 }
        },
        parabola: {
            id: 'parabola',
            name: 'Parabola',
            fullName: 'Gerak Parabola',
            icon: '🎯',
            color: 'teal',
            formula: 'x = v₀·cos(θ)·t',
            levelRange: { start: 11, end: 14 }
        }
    },

    // Get topic by type
    getTopicByType(type) {
        const typeMap = {
            'GLB': this.topics.glb,
            'GLBB': this.topics.glbb,
            'PARABOLA': this.topics.parabola
        };
        return typeMap[type] || null;
    },

    // Get all topics as array
    getAllTopics() {
        return Object.values(this.topics);
    }
};
