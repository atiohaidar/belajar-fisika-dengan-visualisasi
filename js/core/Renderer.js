/**
 * Renderer - Menggambar visualisasi game ke canvas
 */

class Renderer {
    /**
     * Constructor
     * @param {HTMLCanvasElement} canvas - Element canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.scale = 1;  // Pixel per meter
        this.offsetX = 0;
        this.offsetY = 0;

        // Trail untuk trajectory
        this.trail = [];
        this.maxTrailLength = CONSTANTS.ANIMATION.TRAIL_LENGTH;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resize canvas sesuai container
     */
    resize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Get the actual height from CSS or computed style
        const computedStyle = window.getComputedStyle(this.canvas);
        const canvasHeight = parseInt(computedStyle.height) || 400;

        this.width = rect.width;
        this.height = canvasHeight;

        // Set canvas buffer size (for high DPI)
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;

        // Scale context for high DPI
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.scale(dpr, dpr);
    }

    /**
     * Set skala dan offset untuk konversi meter ke pixel
     * @param {number} worldWidth - Lebar dunia dalam meter
     * @param {number} worldHeight - Tinggi dunia dalam meter
     */
    setWorldBounds(worldWidth, worldHeight) {
        // Ensure we have valid dimensions
        if (this.width === 0 || this.height === 0) {
            this.resize();
        }

        const padding = CONSTANTS.CANVAS.PADDING;
        const bottomPadding = 120; // Extra space for simulation info overlay
        const availableWidth = this.width - (padding * 2);
        const availableHeight = this.height - padding - bottomPadding;

        // Store world dimensions
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        if (worldHeight > 0) {
            // For parabola: use proper scale for both X and Y
            const scaleX = availableWidth / worldWidth;
            const scaleY = availableHeight / worldHeight;
            this.scale = Math.min(scaleX, scaleY);
        } else {
            // For linear motion (GLB/GLBB): only use X scale
            this.scale = availableWidth / worldWidth;
        }

        // Offset agar centered - with space at bottom for overlay
        this.offsetX = padding;
        this.offsetY = this.height - bottomPadding;  // Y dibalik (0 di bawah)
    }

    /**
     * Konversi koordinat dunia ke pixel
     * @param {number} x - Koordinat X dalam meter
     * @param {number} y - Koordinat Y dalam meter
     * @returns {Object} {px, py} - Koordinat pixel
     */
    worldToPixel(x, y) {
        return {
            px: this.offsetX + (x * this.scale),
            py: this.offsetY - (y * this.scale)  // Y dibalik
        };
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Gambar background dengan gradien
     */
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, CONSTANTS.CANVAS.SKY_GRADIENT[0]);
        gradient.addColorStop(1, CONSTANTS.CANVAS.SKY_GRADIENT[1]);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Gambar grid
     * @param {number} worldWidth - Lebar dunia dalam meter
     * @param {number} worldHeight - Tinggi dunia dalam meter
     * @param {number} gridSize - Jarak antar garis grid dalam meter
     */
    drawGrid(worldWidth, worldHeight, gridSize = 1) {
        this.ctx.strokeStyle = CONSTANTS.CANVAS.GRID_COLOR;
        this.ctx.lineWidth = 1;

        // Garis vertikal
        for (let x = 0; x <= worldWidth; x += gridSize) {
            const { px: startX } = this.worldToPixel(x, 0);
            const { py: startY } = this.worldToPixel(0, 0);
            const { py: endY } = this.worldToPixel(0, worldHeight);

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(startX, endY);
            this.ctx.stroke();
        }

        // Garis horizontal
        for (let y = 0; y <= worldHeight; y += gridSize) {
            const { px: startX, py: startY } = this.worldToPixel(0, y);
            const { px: endX } = this.worldToPixel(worldWidth, y);

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, startY);
            this.ctx.stroke();
        }
    }

    /**
     * Gambar sumbu X dan Y
     * @param {number} worldWidth - Lebar dalam meter
     * @param {number} worldHeight - Tinggi dalam meter
     */
    drawAxes(worldWidth, worldHeight) {
        this.ctx.strokeStyle = CONSTANTS.CANVAS.AXIS_COLOR;
        this.ctx.lineWidth = 2;

        // Sumbu X
        const { px: x0, py: y0 } = this.worldToPixel(0, 0);
        const { px: xEnd } = this.worldToPixel(worldWidth, 0);

        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(xEnd, y0);
        this.ctx.stroke();

        // Sumbu Y (jika ada ketinggian)
        if (worldHeight > 0) {
            const { py: yEnd } = this.worldToPixel(0, worldHeight);

            this.ctx.beginPath();
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x0, yEnd);
            this.ctx.stroke();
        }

        // Label dan tick marks sumbu X
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 1;

        const step = this.calculateAxisStep(worldWidth);
        for (let x = 0; x <= worldWidth; x += step) {
            const { px, py } = this.worldToPixel(x, 0);

            // Tick mark
            this.ctx.beginPath();
            this.ctx.moveTo(px, py);
            this.ctx.lineTo(px, py + 8);
            this.ctx.stroke();

            // Label dengan background
            const label = `${Math.round(x)}m`;
            const textWidth = this.ctx.measureText(label).width;

            // Background untuk label
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            this.ctx.fillRect(px - textWidth / 2 - 4, py + 10, textWidth + 8, 20);

            // Text label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(label, px, py + 25);
        }
    }

    /**
     * Hitung step yang bagus untuk label sumbu
     * @param {number} range - Range nilai
     * @returns {number} Step size
     */
    calculateAxisStep(range) {
        const idealSteps = 5;
        const rawStep = range / idealSteps;

        // Bulatkan ke angka yang bagus (1, 2, 5, 10, 20, 50, dst)
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const normalized = rawStep / magnitude;

        let step;
        if (normalized < 1.5) step = 1;
        else if (normalized < 3) step = 2;
        else if (normalized < 7) step = 5;
        else step = 10;

        return step * magnitude;
    }

    /**
     * Gambar tanah/ground
     * @param {number} worldWidth - Lebar dunia
     */
    drawGround(worldWidth) {
        const { px: x0, py: y0 } = this.worldToPixel(0, 0);
        const { px: xEnd } = this.worldToPixel(worldWidth, 0);

        // Ground line
        this.ctx.strokeStyle = CONSTANTS.COLORS.TARGET;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x0 - 10, y0);
        this.ctx.lineTo(xEnd + 10, y0);
        this.ctx.stroke();

        // Ground fill
        this.ctx.fillStyle = CONSTANTS.CANVAS.GROUND_COLOR;
        this.ctx.fillRect(x0 - 10, y0, xEnd - x0 + 20, 30);
    }

    /**
     * Gambar target
     * @param {number} x - Posisi X dalam meter
     * @param {number} width - Lebar target dalam meter
     * @param {number} height - Tinggi target dalam meter (optional)
     */
    drawTarget(x, width = 1, height = 0) {
        const { px, py } = this.worldToPixel(x, height);
        const targetWidth = width * this.scale;

        // Zone target (area hijau transparan)
        this.ctx.fillStyle = CONSTANTS.COLORS.TARGET_ZONE;
        this.ctx.fillRect(px - targetWidth / 2, py - 100, targetWidth, 100);

        // Garis target
        this.ctx.strokeStyle = CONSTANTS.COLORS.TARGET;
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(px, py - 100);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Flag/penanda
        this.ctx.fillStyle = CONSTANTS.COLORS.TARGET;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py - 80);
        this.ctx.lineTo(px + 20, py - 70);
        this.ctx.lineTo(px, py - 60);
        this.ctx.closePath();
        this.ctx.fill();

        // Target emoji
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎯', px, py - 90);

        // Distance label with background
        const label = `Target: ${x}m`;
        const textWidth = this.ctx.measureText(label).width;
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        this.ctx.fillRect(px - textWidth / 2 - 6, py - 115, textWidth + 12, 20);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px system-ui, sans-serif';
        this.ctx.fillText(label, px, py - 100);
    }

    /**
     * Gambar mobil (untuk GLB dan GLBB)
     * @param {number} x - Posisi X dalam meter
     * @param {number} y - Posisi Y dalam meter
     */
    drawCar(x, y = 0) {
        const { px, py } = this.worldToPixel(x, y);

        const carWidth = 40;
        const carHeight = 20;

        // Body mobil
        this.ctx.fillStyle = CONSTANTS.COLORS.CAR;
        this.ctx.beginPath();
        this.ctx.roundRect(px - carWidth / 2, py - carHeight - 10, carWidth, carHeight, 5);
        this.ctx.fill();

        // Atap
        this.ctx.fillStyle = '#2563eb';
        this.ctx.beginPath();
        this.ctx.roundRect(px - 15, py - carHeight - 20, 25, 12, [5, 5, 0, 0]);
        this.ctx.fill();

        // Roda
        this.ctx.fillStyle = '#1e293b';
        this.ctx.beginPath();
        this.ctx.arc(px - 12, py - 8, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(px + 12, py - 8, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Velg
        this.ctx.fillStyle = '#64748b';
        this.ctx.beginPath();
        this.ctx.arc(px - 12, py - 8, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(px + 12, py - 8, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Gambar bola/peluru (untuk parabola)
     * @param {number} x - Posisi X dalam meter
     * @param {number} y - Posisi Y dalam meter
     */
    drawBall(x, y) {
        const { px, py } = this.worldToPixel(x, y);

        // Glow effect
        const gradient = this.ctx.createRadialGradient(px, py, 0, px, py, 20);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 20, 0, Math.PI * 2);
        this.ctx.fill();

        // Ball
        this.ctx.fillStyle = CONSTANTS.COLORS.BALL;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(px - 3, py - 3, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Tambah titik ke trail
     * @param {number} x - Posisi X dalam meter
     * @param {number} y - Posisi Y dalam meter
     */
    addTrailPoint(x, y) {
        this.trail.push({ x, y, time: Date.now() });

        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    /**
     * Clear trail
     */
    clearTrail() {
        this.trail = [];
    }

    /**
     * Gambar trail/jejak
     */
    drawTrail() {
        if (this.trail.length < 2) return;

        this.ctx.strokeStyle = CONSTANTS.COLORS.TRAJECTORY;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();

        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const { px, py } = this.worldToPixel(point.x, point.y);

            // Fade effect
            const alpha = (i / this.trail.length) * 0.8;
            this.ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }

        this.ctx.stroke();

        // Dots for each point
        for (let i = 0; i < this.trail.length; i += 5) {
            const point = this.trail[i];
            const { px, py } = this.worldToPixel(point.x, point.y);
            const alpha = (i / this.trail.length) * 0.5;

            this.ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Gambar prediksi trajectory (sebelum simulasi)
     * @param {Array} points - Array of {x, y} points
     */
    drawTrajectoryPreview(points) {
        if (points.length < 2) return;

        this.ctx.strokeStyle = CONSTANTS.COLORS.TRAJECTORY_PREDICT;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);

        this.ctx.beginPath();

        for (let i = 0; i < points.length; i++) {
            const { px, py } = this.worldToPixel(points[i].x, points[i].y);

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }

        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    /**
     * Gambar cannon/pelontar (untuk parabola)
     * @param {number} x - Posisi X
     * @param {number} y - Posisi Y
     * @param {number} angle - Sudut dalam derajat
     */
    drawCannon(x, y, angle) {
        const { px, py } = this.worldToPixel(x, y);
        const angleRad = Helpers.degreesToRadians(angle);

        this.ctx.save();
        this.ctx.translate(px, py);
        this.ctx.rotate(-angleRad);  // Negatif karena canvas Y terbalik

        // Barrel
        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(0, -8, 50, 16);

        // Barrel tip
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillRect(45, -10, 10, 20);

        this.ctx.restore();

        // Base
        this.ctx.fillStyle = '#334155';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 20, 0, Math.PI * 2);
        this.ctx.fill();

        // Angle indicator
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '12px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${angle}°`, px, py + 40);
    }

    /**
     * Gambar info text
     * @param {string} text - Text yang akan ditampilkan
     * @param {number} x - Posisi X pixel
     * @param {number} y - Posisi Y pixel
     * @param {string} align - Text alignment
     */
    drawText(text, x, y, align = 'left') {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px system-ui, sans-serif';
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
}
