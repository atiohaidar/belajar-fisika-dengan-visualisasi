import { Sprites } from './Sprites.js';
import { Environment } from './Environment.js';
import { TrailManager } from './TrailManager.js';
import { CONSTANTS } from '../utils/constants.js';

/**
 * Renderer - Core canvas management
 * Delegates drawing to: Sprites, Environment, TrailManager
 */

export class Renderer {
    /**
     * Constructor
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.scale = 1;  // Pixel per meter
        this.offsetX = 0;
        this.offsetY = 0;

        // Trail for trajectory
        this.trail = [];
        this.maxTrailLength = CONSTANTS.ANIMATION.TRAIL_LENGTH;

        // World dimensions
        this.worldWidth = 0;
        this.worldHeight = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resize canvas to container
     */
    resize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        const computedStyle = window.getComputedStyle(this.canvas);
        const canvasHeight = parseInt(computedStyle.height) || 400;

        this.width = rect.width;
        this.height = canvasHeight;

        // Set canvas buffer size (for high DPI)
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;

        // Scale context for high DPI
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }

    /**
     * Set scale and offset for meter to pixel conversion
     * @param {number} worldWidth - World width in meters
     * @param {number} worldHeight - World height in meters
     */
    setWorldBounds(worldWidth, worldHeight) {
        if (this.width === 0 || this.height === 0) {
            this.resize();
        }

        const padding = CONSTANTS.CANVAS.PADDING;
        const bottomPadding = 120;
        const availableWidth = this.width - (padding * 2);
        const availableHeight = this.height - padding - bottomPadding;

        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        if (worldHeight > 0) {
            const scaleX = availableWidth / worldWidth;
            const scaleY = availableHeight / worldHeight;
            this.scale = Math.min(scaleX, scaleY);
        } else {
            this.scale = availableWidth / worldWidth;
        }

        this.offsetX = padding;
        this.offsetY = this.height - bottomPadding;
    }

    /**
     * Convert world coordinates to pixel
     * @param {number} x - X coordinate in meters
     * @param {number} y - Y coordinate in meters
     * @returns {Object} {px, py} - Pixel coordinates
     */
    worldToPixel(x, y) {
        return {
            px: this.offsetX + (x * this.scale),
            py: this.offsetY - (y * this.scale)
        };
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // ==================== Delegated Methods ====================
    // These delegate to specialized modules for backward compatibility

    drawBackground() {
        Environment.drawBackground(this);
    }

    drawGrid(worldWidth, worldHeight, gridSize = 1) {
        Environment.drawGrid(this, worldWidth, worldHeight, gridSize);
    }

    drawAxes(worldWidth, worldHeight) {
        Environment.drawAxes(this, worldWidth, worldHeight);
    }

    drawGround(worldWidth) {
        Environment.drawGround(this, worldWidth);
    }

    drawTarget(x, width = 1, height = 0) {
        Environment.drawTarget(this, x, width, height);
    }

    drawUserAnswerMarker(x, label = 'Jawaban Kamu') {
        Environment.drawUserAnswerMarker(this, x, label);
    }

    drawCar(x, y = 0) {
        Sprites.drawCar(this, x, y);
    }

    drawBall(x, y) {
        Sprites.drawBall(this, x, y);
    }

    drawCannon(x, y, angle) {
        Sprites.drawCannon(this, x, y, angle);
    }

    addTrailPoint(x, y) {
        TrailManager.addPoint(this, x, y);
    }

    clearTrail() {
        TrailManager.clear(this);
    }

    drawTrail() {
        TrailManager.draw(this);
    }

    drawTrajectoryPreview(points) {
        TrailManager.drawPreview(this, points);
    }

    /**
     * Draw text
     * @param {string} text - Text to display
     * @param {number} x - X position in pixels
     * @param {number} y - Y position in pixels
     * @param {string} align - Text alignment
     */
    drawText(text, x, y, align = 'left') {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px system-ui, sans-serif';
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
}
