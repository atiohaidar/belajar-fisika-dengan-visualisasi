import { CONSTANTS } from '../utils/constants.js';

/**
 * Environment - Drawing background, grid, axes, ground, targets
 * Requires: Renderer instance passed as 'renderer' parameter
 */

export const Environment = {
    /**
     * Draw background gradient
     * @param {Renderer} renderer - Renderer instance
     */
    drawBackground(renderer) {
        const ctx = renderer.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, renderer.height);
        gradient.addColorStop(0, CONSTANTS.CANVAS.SKY_GRADIENT[0]);
        gradient.addColorStop(1, CONSTANTS.CANVAS.SKY_GRADIENT[1]);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, renderer.width, renderer.height);
    },

    /**
     * Draw grid
     * @param {Renderer} renderer - Renderer instance
     * @param {number} worldWidth - World width in meters
     * @param {number} worldHeight - World height in meters
     * @param {number} gridSize - Grid spacing in meters
     */
    drawGrid(renderer, worldWidth, worldHeight, gridSize = 1) {
        const ctx = renderer.ctx;
        ctx.strokeStyle = CONSTANTS.CANVAS.GRID_COLOR;
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= worldWidth; x += gridSize) {
            const { px: startX } = renderer.worldToPixel(x, 0);
            const { py: startY } = renderer.worldToPixel(0, 0);
            const { py: endY } = renderer.worldToPixel(0, worldHeight);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX, endY);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= worldHeight; y += gridSize) {
            const { px: startX, py: startY } = renderer.worldToPixel(0, y);
            const { px: endX } = renderer.worldToPixel(worldWidth, y);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, startY);
            ctx.stroke();
        }
    },

    /**
     * Draw X and Y axes
     * @param {Renderer} renderer - Renderer instance
     * @param {number} worldWidth - Width in meters
     * @param {number} worldHeight - Height in meters
     */
    drawAxes(renderer, worldWidth, worldHeight) {
        const ctx = renderer.ctx;
        ctx.strokeStyle = CONSTANTS.CANVAS.AXIS_COLOR;
        ctx.lineWidth = 2;

        // X axis
        const { px: x0, py: y0 } = renderer.worldToPixel(0, 0);
        const { px: xEnd } = renderer.worldToPixel(worldWidth, 0);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(xEnd, y0);
        ctx.stroke();

        // Y axis (if has height)
        if (worldHeight > 0) {
            const { py: yEnd } = renderer.worldToPixel(0, worldHeight);
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x0, yEnd);
            ctx.stroke();
        }

        // Labels and tick marks
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;

        const step = this.calculateAxisStep(worldWidth);
        for (let x = 0; x <= worldWidth; x += step) {
            const { px, py } = renderer.worldToPixel(x, 0);

            // Tick mark
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + 8);
            ctx.stroke();

            // Label with background
            const label = `${Math.round(x)}m`;
            const textWidth = ctx.measureText(label).width;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(px - textWidth / 2 - 4, py + 10, textWidth + 8, 20);

            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, px, py + 25);
        }
    },

    /**
     * Calculate nice step for axis labels
     * @param {number} range - Value range
     * @returns {number} Step size
     */
    calculateAxisStep(range) {
        const idealSteps = 5;
        const rawStep = range / idealSteps;

        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const normalized = rawStep / magnitude;

        let step;
        if (normalized < 1.5) step = 1;
        else if (normalized < 3) step = 2;
        else if (normalized < 7) step = 5;
        else step = 10;

        return step * magnitude;
    },

    /**
     * Draw ground
     * @param {Renderer} renderer - Renderer instance
     * @param {number} worldWidth - World width
     */
    drawGround(renderer, worldWidth) {
        const ctx = renderer.ctx;
        const { px: x0, py: y0 } = renderer.worldToPixel(0, 0);
        const { px: xEnd } = renderer.worldToPixel(worldWidth, 0);

        // Ground line
        ctx.strokeStyle = CONSTANTS.COLORS.TARGET;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x0 - 10, y0);
        ctx.lineTo(xEnd + 10, y0);
        ctx.stroke();

        // Ground fill
        ctx.fillStyle = CONSTANTS.CANVAS.GROUND_COLOR;
        ctx.fillRect(x0 - 10, y0, xEnd - x0 + 20, 30);
    },

    /**
     * Draw target
     * @param {Renderer} renderer - Renderer instance
     * @param {number} x - Position X in meters
     * @param {number} width - Target width in meters
     * @param {number} height - Target height in meters
     */
    drawTarget(renderer, x, width = 1, height = 0) {
        const ctx = renderer.ctx;
        const { px, py } = renderer.worldToPixel(x, height);
        const targetWidth = width * renderer.scale;

        // Target zone (green transparent)
        ctx.fillStyle = CONSTANTS.COLORS.TARGET_ZONE;
        ctx.fillRect(px - targetWidth / 2, py - 100, targetWidth, 100);

        // Target line
        ctx.strokeStyle = CONSTANTS.COLORS.TARGET;
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - 100);
        ctx.stroke();
        ctx.setLineDash([]);

        // Flag
        ctx.fillStyle = CONSTANTS.COLORS.TARGET;
        ctx.beginPath();
        ctx.moveTo(px, py - 80);
        ctx.lineTo(px + 20, py - 70);
        ctx.lineTo(px, py - 60);
        ctx.closePath();
        ctx.fill();

        // Target emoji
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎯', px, py - 90);

        // Distance label
        const label = `Target: ${x}m`;
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.fillRect(px - textWidth / 2 - 6, py - 115, textWidth + 12, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText(label, px, py - 100);
    },

    /**
     * Draw user answer marker
     * @param {Renderer} renderer - Renderer instance
     * @param {number} x - Position X in meters
     * @param {string} label - Label text
     */
    drawUserAnswerMarker(renderer, x, label = 'Jawaban Kamu') {
        const ctx = renderer.ctx;
        const { px, py } = renderer.worldToPixel(x, 0);

        // Vertical line (dashed, blue)
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - 70);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow marker
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(px, py - 50);
        ctx.lineTo(px - 8, py - 60);
        ctx.lineTo(px + 8, py - 60);
        ctx.closePath();
        ctx.fill();

        // Label with background
        const fullLabel = `${label}: ${x}m`;
        ctx.font = 'bold 11px system-ui, sans-serif';
        const textWidth = ctx.measureText(fullLabel).width;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
        ctx.fillRect(px - textWidth / 2 - 4, py - 85, textWidth + 8, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(fullLabel, px, py - 71);
    }
};
