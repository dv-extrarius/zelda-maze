controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    //console.logValue("room", room_id)
    //console.log(console.inspect(maze.walls, 1024))
    //console.logValue("y", zelda.y)
    custom.RandomizeDungeonColors();
})
let zelda_alignment = 0
let pressed_leftright = false
let pressed_updown = false
let room_id = 0
let temp_diff = 0
let fade_end: number = null
let fade_x: number = 0
let fade_y: number = 0
let zelda = sprites.create(img`
    . . . . . . 5 . 5 . . . . . . .
    . . . . . f 5 5 5 f f . . . . .
    . . . . f 1 5 2 5 1 6 f . . . .
    . . . f 1 6 6 6 6 6 1 6 f . . .
    . . . f 6 6 f f f f 6 1 f . . .
    . . . f 6 f f d d f f 6 f . . .
    . . f 6 f d f d d f d f 6 f . .
    . . f 6 f d 3 d d 3 d f 6 f . .
    . . f 6 6 f d d d d f 6 6 f . .
    . f 6 6 f 3 f f f f 3 f 6 6 f .
    . . f f d 3 5 3 3 5 3 d f f . .
    . . f d d f 3 5 5 3 f d d f . .
    . . . f f 3 3 3 3 3 3 f f . . .
    . . . f 3 3 5 3 3 5 3 3 f . . .
    . . . f f f f f f f f f f . . .
    . . . . . f f . . f f . . . . .
`, SpriteKind.Player)
let emeralds_hud = sprites.create(assets.image`Emerald_Hud`, SpriteKind.Player)

zelda.setPosition(screen.width / 2, screen.height / 2)
emeralds_hud.setPosition(screen.width - emeralds_hud.width / 2, 8 + (emeralds_hud.height / 2));
controller.moveSprite(zelda, 50, 50)
let maze = custom.GenerateMaze(8, 8)
room_id = randint(0, maze.width * maze.height - 1)
custom.SetMazeRoom(maze, room_id)

game.onUpdate(function () {
    if (fade_end == null) {
        if (zelda.x < 12) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellLeft(room_id);
            fade_x = 148
            fade_y = zelda.y
        } else if (zelda.x > 148) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellRight(room_id);
            fade_x = 16
            fade_y = zelda.y
        } else if (zelda.y < 28) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellUp(room_id);
            fade_x = zelda.x
            fade_y = 112
        } else if (zelda.y > 116) {
            fade_end = game.runtime() + 125;
            room_id = maze.CellDown(room_id);
            fade_x = zelda.x
            fade_y = 28
        }
        if (fade_end != null) {
            color.FadeToBlack.startScreenEffect(100);
            controller.moveSprite(zelda, 0, 0)
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
    emeralds_hud.image.fillRect(10, 0, emeralds_hud.width - 10, emeralds_hud.height, 0);
    emeralds_hud.image.print(custom.FormatInteger(room_id, 5), 11, 0, 5, image.font8);
})
game.onUpdateInterval(100, function () {
    // Nudge Link to align on the grid when moving in a cardinal direction
    pressed_updown = controller.up.isPressed() || controller.down.isPressed()
    pressed_leftright = controller.right.isPressed() || controller.left.isPressed()
    if (pressed_updown && !(pressed_leftright)) {
        zelda_alignment = (zelda.x - 8) % 16
        if (zelda_alignment > 0 && zelda_alignment < 8) {
            zelda.x += -1
        } else if (zelda_alignment >= 8) {
            zelda.x += 1
        }
        zelda.x = Math.round(zelda.x)
    } else if (pressed_leftright && !(pressed_updown)) {
        zelda_alignment = (zelda.y - 8) % 16
        if (zelda_alignment > 0 && zelda_alignment < 8) {
            zelda.y += -1
        } else if (zelda_alignment >= 8) {
            zelda.y += 1
        }
        zelda.y = Math.round(zelda.y)
    }
})
