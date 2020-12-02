import { Physbody } from '../engine/engine.js';
import { getKeysDown, getKeysPressed, isKeyDown, isKeyPressed } from '../engine/keyboard-input.js';

export class PlayerMovement {

    /**
     * 
     * @param {Physbody} dynamicBody 
     */
    constructor(dynamicBody, options) {

        // The physbody to manipulate with movement methods
        this.physbody = dynamicBody;

        // Velocity properties
        this.vx = 0;
        this.vy = 0;

        // Acceleration properties
        this.ax = 0;
        this.ay = 0;

        // Movement options
        this.options = Object.assign({}, PlayerMovement.DEFAULT_OPTIONS, options);

        // Logic properties for movement methods
        this.lastUp = false;
        this.amountJumped = 0;
    }

    get left() {
        const activeKeys = getKeysDown();
        return activeKeys.a || activeKeys.ArrowLeft || false;
    }

    get leftPressed() {
        const pressedKeys = getKeysPressed();
        return pressedKeys.a || pressedKeys.ArrowLeft;
    }

    get right() {
        const activeKeys = getKeysDown();
        return activeKeys.d || activeKeys.ArrowRight || false;
    }

    get rightPressed() {
        const pressedKeys = getKeysPressed();
        return pressedKeys.d || pressedKeys.ArrowRight;
    }

    get up() {
        const activeKeys = getKeysDown();
        return activeKeys.w || activeKeys.ArrowUp || activeKeys[' '] || false;
    }

    get upPressed() {
        const pressedKeys = getKeysPressed();
        return pressedKeys.w || pressedKeys.ArrowUp || pressedKeys[' '];
    }

    get down() {
        const activeKeys = getKeysDown();
        return activeKeys.s || activeKeys.ArrowDown || false;
    }

    get downPressed() {
        const pressedKeys = getKeysPressed();
        return pressedKeys.s || pressedKeys.ArrowDown;
    }

    useHorizontalMovementVelocity() {

        let vx = 0;

        // Horizontal movement
        if (this.left && !this.right) {
            vx = -this.options.moveVelocity;
        } else if (this.right && !this.left) {
            vx = this.options.moveVelocity;
        }

        this.vx = vx;
    }

    useHorizontalMovementAccelerative() {

        let vx = this.physbody.vx;

        if (this.leftPressed || this.rightPressed) {
            vx = 0;
        }

        if (this.left && !this.right) {
            vx -= this.options.moveVelocity / this.options.moveVelocityIncreaseRatio;
            if (vx < -this.options.moveVelocity) vx = -this.options.moveVelocity;
        } else if (this.right && !this.left) {
            vx += this.options.moveVelocity / this.options.moveVelocityIncreaseRatio;
            if (vx > this.options.moveVelocity) vx = this.options.moveVelocity;
        } else {
            vx = 0;
        }

        this.vx = vx;
    }

    useVerticalMovementVelocity() {

        let vy = 0;

        // Vertical movement
        if (this.up && !this.down) {
            vy = -this.options.moveVelocity;
        } else if (this.down && !this.up) {
            vy = this.options.moveVelocity;
        }

        this.vy = vy;
    }

    useSingleJump() {

        let vy = this.physbody.vy;

        // Single jump logic
        if (this.upPressed && this.physbody.grounded) {
            vy = -this.options.jumpImpulseVelocity;
            this.amountJumped++;
        }

        this.vy = vy;
    }

    useMultipleJumps() {

        let vy = this.physbody.vy;

        // Multiple jump logic
        if (this.upPressed && this.amountJumped < this.options.jumpAmount) {
            if (this.physbody.grounded) {
                this.amountJumped = 0;
                vy = -this.options.jumpImpulseVelocity;
            } else {
                vy = -this.options.jumpImpulseVelocity * this.options.additionalJumpVelocityMultiplier;
            }
            this.amountJumped++;
        } else if (this.physbody.grounded) {
            this.amountJumped = 1;
        }

        this.vy = vy;
    }

    applyMovement() {

        this.physbody.vx = this.vx;
        this.physbody.vy = this.vy;

        this.physbody.ax = this.ax;
        // this.physbody.ay = this.ay;
    }
}

// Define constant property representing default options pertaining to player movement configurations
Object.defineProperty(PlayerMovement, 'DEFAULT_OPTIONS', {
    value: {
        moveVelocity: 400,
        moveVelocityIncreaseRatio: 10,
        jumpImpulseVelocity: 1200,
        additionalJumpVelocityMultiplier: 1.05,
        jumpAmount: 2,
    },
    writable: false,
    enumerable: false,
    configurable: false,
});