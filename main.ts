controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    hearts_current = randint(1, hearts_total);
});

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    fade_end = null;
    custom.RandomizeDungeonColors();
    maze = custom.GenerateMaze(8, 8);
    room_id = randint(0, maze.width * maze.height - 1);
    custom.SetMazeRoom(maze, room_id);
    zelda.setPosition(16 * 5 + (zelda.width / 2), 16 * 4 + (zelda.height / 2))
    controller.moveSprite(zelda, 50, 50);
    color.clearFadeEffect();
});

let fade_end: number = null;
let fade_x: number = 0;
let fade_y: number = 0;

let room_id = 0;

let emeralds: number = 0;
let emeralds_hud = sprites.create(assets.image`EmeraldHud`, SpriteKind.Player);

let hearts_total: number = 28;
let hearts_current: number = 3;
let hearts_hud = sprites.create(assets.image`HeartsHud`, SpriteKind.Player);

let zelda = sprites.create(assets.image`ZeldaDown1`, SpriteKind.Player);

//Position Emerald & Heart HUD
emeralds_hud.setPosition(screen.width - emeralds_hud.width / 2, 8 + (emeralds_hud.height / 2));
hearts_hud.setPosition(hearts_hud.width / 2, 8 + (hearts_hud.height / 2));

//Generate maze & initialize
let maze = custom.GenerateMaze(8, 8);
room_id = randint(0, maze.width * maze.height - 1);
custom.SetMazeRoom(maze, room_id);
zelda.setPosition(16 * 5 + (zelda.width / 2), 16 * 4 + (zelda.height / 2));
controller.moveSprite(zelda, 50, 50);
color.clearFadeEffect();

//Initialize 4 walking animations for Zelda
let walking: animation.Animation = null;

walking = animation.createAnimation(0, 175);
walking.addAnimationFrame(assets.image`ZeldaLeft1`);
walking.addAnimationFrame(assets.image`ZeldaLeft2`);
animation.attachAnimation(zelda, walking);

walking = animation.createAnimation(1, 175);
walking.addAnimationFrame(assets.image`ZeldaRight1`);
walking.addAnimationFrame(assets.image`ZeldaRight2`);
animation.attachAnimation(zelda, walking);

walking = animation.createAnimation(2, 175);
walking.addAnimationFrame(assets.image`ZeldaUp1`);
walking.addAnimationFrame(assets.image`ZeldaUp2`);
walking.addAnimationFrame(assets.image`ZeldaUp3`);
walking.addAnimationFrame(assets.image`ZeldaUp2`);
animation.attachAnimation(zelda, walking);

walking = animation.createAnimation(3, 175);
walking.addAnimationFrame(assets.image`ZeldaDown1`);
walking.addAnimationFrame(assets.image`ZeldaDown2`);
walking.addAnimationFrame(assets.image`ZeldaDown3`);
walking.addAnimationFrame(assets.image`ZeldaDown2`);
animation.attachAnimation(zelda, walking);

game.onUpdate(function () {
    if (controller.left.isPressed()) {
        animation.setAction(zelda, 0);
    }
    else if (controller.right.isPressed()) {
        animation.setAction(zelda, 1);
    }
    else if (controller.up.isPressed()) {
        animation.setAction(zelda, 2);
    }
    else if (controller.down.isPressed()) {
        animation.setAction(zelda, 3);
    }
    else {
        animation.stopAnimation(animation.AnimationTypes.All, zelda)
    }
});

game.onUpdate(function () {
    //Process Entering Doors
    if (fade_end == null) {
        if (zelda.x < 12) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellLeft(room_id);
            fade_x = 144;
            fade_y = zelda.y;
        } else if (zelda.x > 148) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellRight(room_id);
            fade_x = 16;
            fade_y = zelda.y;
        } else if (zelda.y < 28) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellUp(room_id);
            fade_x = zelda.x;
            fade_y = 112;
        } else if (zelda.y > 116) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellDown(room_id);
            fade_x = zelda.x
            fade_y = 32;
        }
        if (fade_end != null) {
            color.FadeToBlack.startScreenEffect(100);
            controller.moveSprite(zelda, 0, 0);
        }
    }
    //end fade if appropriate
    else if (fade_end != null && fade_end < game.runtime()) {
        custom.SetMazeRoom(maze, room_id)
        zelda.x = fade_x;
        zelda.y = fade_y
        color.clearFadeEffect();
        fade_end = null;
        controller.moveSprite(zelda, 50, 50)
    }
});

game.onUpdate(function () {
    //Render number of emeralds into emeralds_hud
    emeralds_hud.image.fillRect(10, 0, emeralds_hud.width - 10, emeralds_hud.height, 0);
    emeralds_hud.image.print(custom.FormatInteger(room_id, 5), 11, 0, 5, image.font8);

    //Render health in half-heart units into hearts_hud
    hearts_hud.image.fill(0);
    let hearts = 0;
    for (hearts = 0; hearts + 2 <= hearts_current; hearts += 2) {
        hearts_hud.image.drawImage(assets.image`HeartFull`, hearts / 2 * 8, 0);
    }
    if (hearts_current % 2 == 1) {
        hearts_hud.image.drawImage(assets.image`HeartHalf`, hearts / 2 * 8, 0);
        hearts += 2;
    }
    for (; hearts < hearts_total; hearts += 2) {
        hearts_hud.image.drawImage(assets.image`HeartEmpty`, hearts / 2 * 8, 0);
    }

    //Pulse "Heart" and "Emerald" colors
    let angle = (game.runtime() % 2000) / 2000.0 * 360.0;
    let offset = Math.round(15 * Math.cos(Math.PI * angle / 180));

    color.setColor(4, color.hsv((250 + offset) % 256, 255, 255));
    color.setColor(5, color.hsv((99 + offset) % 256, 255, 200));
})

game.onUpdateInterval(100, function () {
    // Nudge Link to align on the grid when moving in a cardinal direction
    const pressed_updown = controller.up.isPressed() || controller.down.isPressed()
    const pressed_leftright = controller.right.isPressed() || controller.left.isPressed()
    if (pressed_updown && !(pressed_leftright)) {
        const zelda_alignment = (zelda.x - 8) % 16
        if (zelda_alignment > 0 && zelda_alignment < 8) {
            zelda.x += -1
        } else if (zelda_alignment >= 8) {
            zelda.x += 1
        }
        zelda.x = Math.round(zelda.x)
    } else if (pressed_leftright && !(pressed_updown)) {
        const zelda_alignment = (zelda.y - 8) % 16
        if (zelda_alignment > 0 && zelda_alignment < 8) {
            zelda.y += -1
        } else if (zelda_alignment >= 8) {
            zelda.y += 1
        }
        zelda.y = Math.round(zelda.y)
    }
})
