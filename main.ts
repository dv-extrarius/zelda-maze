controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    //console.logValue("room", room_id)
    //console.log(console.inspect(maze.walls, 1024))
    console.logValue("y", zelda.y)
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
    . . . . . f f 4 4 f f . . . . .
    . . . . f 5 4 5 5 4 5 f . . . .
    . . . f e 4 5 5 5 5 4 e f . . .
    . . f b 3 e 4 4 4 4 e 3 b f . .
    . . f 3 3 3 3 3 3 3 3 3 3 f . .
    . f 3 3 e b 3 e e 3 b e 3 3 f .
    . f 3 3 f f e e e e f f 3 3 f .
    . f b b f b f e e f b f b b f .
    . f b b e 1 f 4 4 f 1 e b b f .
    f f b b f 4 4 4 4 4 4 f b b f f
    f b b f f f e e e e f f f b b f
    . f e e f b d d d d b f e e f .
    . . e 4 c d d d d d d c 4 e . .
    . . e f b d b d b d b b f e . .
    . . . f f 1 d 1 d 1 d f f . . .
    . . . . . f f b b f f . . . . .
`, SpriteKind.Player)
let room_id_image = sprites.create(img`
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
`, SpriteKind.Player)

zelda.setPosition(screen.width / 2, screen.height / 2)
room_id_image.setPosition(room_id_image.image.width / 2, 8 + (room_id_image.image.height / 2));
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
        if(fade_end != null)
        {
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
    room_id_image.image.fill(0)
    room_id_image.image.print((room_id > 9 ? "" + room_id : "0" + room_id), 0, 0, 1, image.font8);
    console.log(room_id_image.image.width)
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
