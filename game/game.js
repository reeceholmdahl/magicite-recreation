import * as ENGINE from '../engine/engine.js';
import { PlayerMovement } from './functions.js';

// Called first, initializes the renderer
ENGINE.Renderer.init();

/**
 * Placholder for loading game assets, none currently
 */

const dev_scene = new ENGINE.Scene((resources, container) => {

    const colors = {
        PLAYER: 0xf4f5f7,
        FLOOR: 0x963c2b,
        BACKGROUND: 0x2a2a2e,
        TERRAIN: 0xb04632,
        DEBUG: 0x00ff00,
    };

    // Scene options
    dev_scene.options = {
        backgroundColor: colors.BACKGROUND,
        debug: true,
    };

    // Build player
    const playerSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    playerSprite.anchor.set(0.5);
    playerSprite.width = 56;
    playerSprite.height = 56;
    playerSprite.texture = PIXI.Texture.WHITE;
    playerSprite.tint = colors.PLAYER;
    const player = new ENGINE.DynamicBody({x: 0, y: 300}, 64, 64, playerSprite).setParent(container);
    player.ay = 4000; // TODO implement gravity elsewhere

    // Build floor
    const floor = new ENGINE.StandardBody({x: -1000, y: 630}, 4000, 300, {color: colors.FLOOR}).setParent(container);

    // Build terrain
    const terrain1 = new ENGINE.StandardBody({x: 320, y: 510}, 480, 120, {color: colors.TERRAIN}).setParent(container);
    const terrain2 = new ENGINE.StandardBody({x: 1120, y: 390}, 360, 240, {color: colors.TERRAIN}).setParent(container);
    const terrain3 = new ENGINE.StandardBody({x: 1800, y: 270}, 320, 360, {color: colors.TERRAIN}).setParent(container);
    const terrain4 = new ENGINE.StandardBody({x: 2480, y: 150}, 240, 60, {color: colors.TERRAIN}).setParent(container);

    const PHYS_DT = 1 / 30;

    // Player movement class
    const movement = new PlayerMovement(player);

    // Player movement ticker function
    const movementHandler = new ENGINE.TickerFunction(() => {
        movement.useHorizontalMovementAccelerative();
        // movement.useSingleJump();
        movement.useMultipleJumps();
        movement.applyMovement();
    }, this, 1);

    const physics = new ENGINE.TickerFunction(() => {

        // console.log(player.vx);

        ENGINE.Physics.step(PHYS_DT);

        ENGINE.Physics.updateSprites();

        ENGINE.Camera.x = player.lerpBody.left - 640;
        ENGINE.Camera.y = player.lerpBody.bottom  - 360;
        if (ENGINE.Camera.y + 640 > 640) {
            ENGINE.Camera.y = 0;
        }

    }, this, 0);

    dev_scene.functions.push(movementHandler, physics);
});

const MENU_SCENE = new ENGINE.Scene((resources, container) => {

    const testButtonSprite = new PIXI.Sprite()
});

// Loads the default scene
ENGINE.Renderer.scene = dev_scene;