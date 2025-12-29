import { CONSTANTS } from '../utils/constants.js';
import { Helpers } from '../utils/helpers.js';

/**
 * Sprites - Drawing entities (car, ball, cannon)
 * Requires: Renderer instance passed as 'renderer' parameter
 */

export const Sprites = {
    /**
     * Draw car (for GLB and GLBB)
     * @param {Renderer} renderer - Renderer instance
     * @param {number} x - Position X in meters
     * @param {number} y - Position Y in meters
     */
    drawCar(renderer, x, y = 0) {
        const { px, py } = renderer.worldToPixel(x, y);
        const ctx = renderer.ctx;

        const carWidth = 40;
        const carHeight = 20;

        // Body
        ctx.fillStyle = CONSTANTS.COLORS.CAR;
        ctx.beginPath();
        ctx.roundRect(px - carWidth / 2, py - carHeight - 10, carWidth, carHeight, 5);
        ctx.fill();

        // Roof
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.roundRect(px - 15, py - carHeight - 20, 25, 12, [5, 5, 0, 0]);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(px - 12, py - 8, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 12, py - 8, 8, 0, Math.PI * 2);
        ctx.fill();

        // Rims
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(px - 12, py - 8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 12, py - 8, 4, 0, Math.PI * 2);
        ctx.fill();
    },

    /**
     * Draw ball/projectile (for parabola)
     * @param {Renderer} renderer - Renderer instance
     * @param {number} x - Position X in meters
     * @param {number} y - Position Y in meters
     */
    drawBall(renderer, x, y) {
        const { px, py } = renderer.worldToPixel(x, y);
        const ctx = renderer.ctx;

        // Glow effect
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, 20);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, Math.PI * 2);
        ctx.fill();

        // Ball
        ctx.fillStyle = CONSTANTS.COLORS.BALL;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(px - 3, py - 3, 4, 0, Math.PI * 2);
        ctx.fill();
    },

    /**
     * Draw cannon/launcher (for parabola)
     * @param {Renderer} renderer - Renderer instance
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} angle - Angle in degrees
     */
    drawCannon(renderer, x, y, angle) {
        const { px, py } = renderer.worldToPixel(x, y);
        const ctx = renderer.ctx;
        const angleRad = Helpers.degreesToRadians(angle);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-angleRad);  // Negative because canvas Y is inverted

        // Barrel
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, -8, 50, 16);

        // Barrel tip
        ctx.fillStyle = '#64748b';
        ctx.fillRect(45, -10, 10, 20);

        ctx.restore();

        // Base
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, Math.PI * 2);
        ctx.fill();

        // Angle indicator
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${angle}°`, px, py + 40);
    }
};
