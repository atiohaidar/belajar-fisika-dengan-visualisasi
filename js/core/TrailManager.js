/**
 * TrailManager - Managing trajectory trail/path
 * Requires: Renderer instance
 */

const TrailManager = {
    /**
     * Add point to trail
     * @param {Renderer} renderer - Renderer instance
     * @param {number} x - Position X in meters
     * @param {number} y - Position Y in meters
     */
    addPoint(renderer, x, y) {
        renderer.trail.push({ x, y, time: Date.now() });

        if (renderer.trail.length > renderer.maxTrailLength) {
            renderer.trail.shift();
        }
    },

    /**
     * Clear trail
     * @param {Renderer} renderer - Renderer instance
     */
    clear(renderer) {
        renderer.trail = [];
    },

    /**
     * Draw trail/path
     * @param {Renderer} renderer - Renderer instance
     */
    draw(renderer) {
        if (renderer.trail.length < 2) return;

        const ctx = renderer.ctx;
        ctx.strokeStyle = CONSTANTS.COLORS.TRAJECTORY;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();

        for (let i = 0; i < renderer.trail.length; i++) {
            const point = renderer.trail[i];
            const { px, py } = renderer.worldToPixel(point.x, point.y);

            // Fade effect
            const alpha = (i / renderer.trail.length) * 0.8;
            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.stroke();

        // Dots for each point
        for (let i = 0; i < renderer.trail.length; i += 5) {
            const point = renderer.trail[i];
            const { px, py } = renderer.worldToPixel(point.x, point.y);
            const alpha = (i / renderer.trail.length) * 0.5;

            ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    /**
     * Draw trajectory preview (before simulation)
     * @param {Renderer} renderer - Renderer instance
     * @param {Array} points - Array of {x, y} points
     */
    drawPreview(renderer, points) {
        if (points.length < 2) return;

        const ctx = renderer.ctx;
        ctx.strokeStyle = CONSTANTS.COLORS.TRAJECTORY_PREDICT;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);

        ctx.beginPath();

        for (let i = 0; i < points.length; i++) {
            const { px, py } = renderer.worldToPixel(points[i].x, points[i].y);

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.stroke();
        ctx.setLineDash([]);
    }
};
