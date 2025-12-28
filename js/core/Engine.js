/**
 * Engine - Game engine utama
 * Mengelola game loop, state, dan koordinasi antar komponen
 */

class Engine {
    /**
     * Constructor
     * @param {Renderer} renderer - Renderer instance
     */
    constructor(renderer) {
        this.renderer = renderer;
        this.state = CONSTANTS.GAME_STATES.MENU;
        this.currentLevel = null;
        this.physics = null;
        this.userInputs = {};

        // Animation
        this.isAnimating = false;
        this.animationTime = 0;
        this.animationSpeed = 1;
        this.animationId = null;
        this.lastFrameTime = 0;

        // Results
        this.simulationResult = null;

        // Callbacks
        this.onStateChange = null;
        this.onSimulationComplete = null;
        this.onTimeUpdate = null;
    }

    /**
     * Set current level
     * @param {Object} level - Level configuration
     */
    setLevel(level) {
        this.currentLevel = level;
        this.state = CONSTANTS.GAME_STATES.PLAYING;
        this.simulationResult = null;
        this.renderer.clearTrail();

        // Create physics instance based on level type
        switch (level.type) {
            case CONSTANTS.LEVEL_TYPES.GLB:
                this.physics = new GLBPhysics(level);
                break;
            case CONSTANTS.LEVEL_TYPES.GLBB:
                this.physics = new GLBBPhysics(level);
                break;
            case CONSTANTS.LEVEL_TYPES.PARABOLA:
                this.physics = new ParabolaPhysics(level);
                break;
            default:
                console.error('Unknown level type:', level.type);
                this.physics = new GLBPhysics(level);
        }

        // Setup renderer bounds
        this.setupRendererBounds();

        // Initial draw
        this.draw();

        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }

    /**
     * Setup renderer bounds based on level
     */
    setupRendererBounds() {
        if (!this.currentLevel) return;

        const given = this.currentLevel.given || {};
        let worldWidth = 10;
        let worldHeight = 0;

        // Determine world size based on level
        if (given.distance) {
            worldWidth = given.distance.value * 1.5;
        }
        if (given.targetX) {
            worldWidth = given.targetX.value * 1.5;
        }

        // For parabola, need more height to show arc
        if (this.currentLevel.type === CONSTANTS.LEVEL_TYPES.PARABOLA) {
            // Height should be at least half the width to show parabolic arc properly
            worldHeight = Math.max(worldWidth * 0.5, 15);
        }

        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.renderer.setWorldBounds(worldWidth, worldHeight);
    }

    /**
     * Update user inputs
     * @param {Object} inputs - Input values
     */
    setUserInputs(inputs) {
        this.userInputs = inputs;

        // Redraw with preview if parabola
        if (this.currentLevel?.type === CONSTANTS.LEVEL_TYPES.PARABOLA && this.physics) {
            this.draw();
        }
    }

    /**
     * Validate and start simulation
     * @returns {Object} Validation result
     */
    startSimulation() {
        if (!this.physics || !this.currentLevel) {
            return { valid: false, errors: [{ message: 'Level tidak ditemukan' }] };
        }

        // Validate inputs
        const validation = this.physics.validateInputs(this.userInputs);
        if (!validation.valid) {
            return validation;
        }

        // Calculate results
        this.simulationResult = this.physics.calculate(this.userInputs);

        // Start animation
        this.state = CONSTANTS.GAME_STATES.SIMULATING;
        this.animationTime = 0;
        this.renderer.clearTrail();
        this.isAnimating = true;
        this.lastFrameTime = performance.now();

        // Add attempt
        Storage.addAttempt(this.currentLevel.id);

        if (this.onStateChange) {
            this.onStateChange(this.state);
        }

        this.animate();

        return { valid: true };
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isAnimating) return;

        const now = performance.now();
        const deltaTime = (now - this.lastFrameTime) / 1000;  // Convert to seconds
        this.lastFrameTime = now;

        // Update time
        this.animationTime += deltaTime * this.animationSpeed * CONSTANTS.ANIMATION.TIME_SCALE;

        // Get total time for animation
        const totalTime = this.physics.getTotalTime(this.userInputs);

        // Check if animation is complete
        if (this.animationTime >= totalTime) {
            this.animationTime = totalTime;
            this.completeSimulation();
            return;
        }

        // Get current position
        const position = this.physics.getPositionAtTime(this.animationTime, this.userInputs);

        // For parabola, check if hit ground
        if (this.currentLevel.type === CONSTANTS.LEVEL_TYPES.PARABOLA && position.y <= 0) {
            this.completeSimulation();
            return;
        }

        // Add to trail
        this.renderer.addTrailPoint(position.x, position.y);

        // Update time display
        if (this.onTimeUpdate) {
            const velocity = this.physics.getVelocityAtTime(this.animationTime, this.userInputs);
            this.onTimeUpdate({
                time: Helpers.roundTo(this.animationTime, 1),
                position: Helpers.roundTo(position.x, 2),
                velocity: Helpers.roundTo(velocity.magnitude, 2),
                y: Helpers.roundTo(position.y, 2)
            });
        }

        // Draw
        this.draw();

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Complete simulation and show results
     */
    completeSimulation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Set animation time to exact total time to ensure consistent final values
        const totalTime = this.physics.getTotalTime(this.userInputs);
        this.animationTime = totalTime;

        // Calculate final position and velocity using the SAME functions as animation
        // This ensures animation and results are perfectly synchronized
        const finalPosition = this.physics.getPositionAtTime(totalTime, this.userInputs);
        const finalVelocity = this.physics.getVelocityAtTime(totalTime, this.userInputs);

        // Check answer
        const answerResult = this.physics.checkAnswer(this.userInputs);

        // Update simulation result with synchronized values
        this.simulationResult = {
            ...this.simulationResult,
            ...answerResult,
            // Override with synchronized values from animation functions
            finalPosition: Helpers.roundTo(finalPosition.x, 2),
            finalTime: Helpers.roundTo(totalTime, 2),
            // For parabola, update range with the actual final x position
            range: Helpers.roundTo(finalPosition.x, 2),
            timeOfFlight: Helpers.roundTo(totalTime, 2),
        };

        // Update time display with exact final values
        if (this.onTimeUpdate) {
            this.onTimeUpdate({
                time: Helpers.roundTo(totalTime, 1),
                position: Helpers.roundTo(finalPosition.x, 2),
                velocity: Helpers.roundTo(finalVelocity.magnitude, 2),
                y: Helpers.roundTo(finalPosition.y, 2)
            });
        }

        // Update state
        this.state = CONSTANTS.GAME_STATES.RESULT;

        // Final draw
        this.draw();

        // Callback
        if (this.onSimulationComplete) {
            this.onSimulationComplete(this.simulationResult);
        }

        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }

    /**
     * Stop animation
     */
    stopSimulation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    /**
     * Reset to playing state
     */
    reset() {
        this.stopSimulation();
        this.animationTime = 0;
        this.simulationResult = null;
        this.renderer.clearTrail();
        this.state = CONSTANTS.GAME_STATES.PLAYING;

        this.draw();

        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }

    /**
     * Draw current frame
     */
    draw() {
        if (!this.currentLevel) return;

        const level = this.currentLevel;
        const given = level.given || {};

        // Clear and draw background
        this.renderer.clear();
        this.renderer.drawBackground();

        // Draw grid
        if (level.visualization?.showGrid !== false) {
            this.renderer.drawGrid(this.worldWidth, this.worldHeight);
        }

        // Draw axes
        this.renderer.drawAxes(this.worldWidth, this.worldHeight);

        // Draw ground
        this.renderer.drawGround(this.worldWidth);

        // Draw target
        const targetX = given.distance?.value || given.targetX?.value || 0;
        if (targetX > 0) {
            const targetY = given.targetY?.value || 0;
            this.renderer.drawTarget(targetX, 1, targetY);
        }

        // Draw based on level type
        if (level.type === CONSTANTS.LEVEL_TYPES.PARABOLA) {
            this.drawParabolaScene();
        } else {
            this.drawLinearScene();
        }
    }

    /**
     * Draw scene for linear motion (GLB/GLBB)
     */
    drawLinearScene() {
        // Draw trail
        this.renderer.drawTrail();

        // Get current position
        let x = 0;
        if (this.isAnimating || this.state === CONSTANTS.GAME_STATES.RESULT) {
            const position = this.physics.getPositionAtTime(this.animationTime, this.userInputs);
            x = position.x;
        }

        // Draw car
        this.renderer.drawCar(x, 0);
    }

    /**
     * Draw scene for parabola motion
     */
    drawParabolaScene() {
        const given = this.currentLevel.given || {};

        // Draw cannon
        const angle = parseFloat(this.userInputs.angle) || 45;
        this.renderer.drawCannon(0, given.initialHeight?.value || 0, angle);

        // Draw trajectory preview (before simulation)
        if (this.state === CONSTANTS.GAME_STATES.PLAYING && this.physics instanceof ParabolaPhysics) {
            const points = this.physics.getTrajectoryPoints(this.userInputs, 30);
            this.renderer.drawTrajectoryPreview(points);
        }

        // Draw trail
        this.renderer.drawTrail();

        // Draw ball during animation
        if (this.isAnimating || this.state === CONSTANTS.GAME_STATES.RESULT) {
            const position = this.physics.getPositionAtTime(this.animationTime, this.userInputs);
            if (position.y >= 0) {
                this.renderer.drawBall(position.x, position.y);
            }
        }
    }

    /**
     * Get current state
     * @returns {string} Current game state
     */
    getState() {
        return this.state;
    }

    /**
     * Get explanation steps
     * @returns {Array} Explanation steps
     */
    getExplanationSteps() {
        if (!this.physics) return [];
        return this.physics.getExplanationSteps(this.userInputs);
    }
}
