// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile10 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile9 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile15 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile13 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile11 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "DungeonRoom":
            case "level1":return tiles.createTilemap(hex`0a0008000000000000000000000001020202020b02020203040d0d0d0d0d0d0d0d05040d0d0d0d0d0d0d0d05090d0d0d0d0d0d0d0d0a040d0d0d0d0d0d0d0d05040d0d0d0d0d0d0d0d0506070707070c07070708`, img`
2 2 2 2 2 2 2 2 2 2 
2 2 2 2 2 . 2 2 2 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
. . . . . . . . . . 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 2 2 2 2 . 2 2 2 2 
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile3,myTiles.tile5,myTiles.tile4,myTiles.tile6,myTiles.tile7,myTiles.tile8,myTiles.tile10,myTiles.tile9,myTiles.tile11,myTiles.tile13,myTiles.tile15,myTiles.tile16], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "DungeonLeft":
            case "tile4":return tile4;
            case "DungeonBottomLeft":
            case "tile7":return tile7;
            case "DungeonBottom":
            case "tile8":return tile8;
            case "DungeonBottomRight":
            case "tile10":return tile10;
            case "DungeonBlock":
            case "tile2":return tile2;
            case "DungeonTopLeft":
            case "tile1":return tile1;
            case "DungeonTop":
            case "tile3":return tile3;
            case "DungeonTopRight":
            case "tile5":return tile5;
            case "DungeonRight":
            case "tile6":return tile6;
            case "DungeonFloor":
            case "tile16":return tile16;
            case "DungeonDoorLeft":
            case "tile9":return tile9;
            case "DungeonDoorBottom":
            case "tile15":return tile15;
            case "DungeonDoorTop":
            case "tile13":return tile13;
            case "DungeonDoorRight":
            case "tile11":return tile11;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
