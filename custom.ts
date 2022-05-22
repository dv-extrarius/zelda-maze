
/**
* Use this file to define custom functions and blocks.
* Read more at https://arcade.makecode.com/blocks/custom
*/

/**
 * Custom blocks
 */
//% weight=100 color=#009900 icon="⚙"
namespace custom {
    enum WallType
    {
        Up = 1,
        Down = 2,
        Left = 4,
        Right = 8
    }
    const FourRegularWalls = WallType.Up | WallType.Down | WallType.Left | WallType.Right
    const OppositeWall = {
        [WallType.Up]: WallType.Down,
        [WallType.Down]: WallType.Up,
        [WallType.Left]: WallType.Right,
        [WallType.Right]: WallType.Left
    };
    //////////////////////////////////////////////////////

    export function ShuffleList<T>(list: Array<T>): Array<T> {
        const len: number = list.length;
        let ii: number = 0;
        let jj: number = 0;
        let temp: T;
        for (ii = 0; ii < len - 1; ii += 1) {
            jj = randint(ii, len - 1);
            temp = list[ii];
            list[ii] = list[jj];
            list[jj] = temp;
        }
        return list;
    }
    class CellNeighbor {
        id: number;
        wall: WallType;
        constructor(id: number, wall: WallType) {
            this.id = id;
            this.wall = wall;
        }
    }
    //////////////////////////////////////////////////////
    export class MazeType
    {
        width: number;
        height: number;
        walls: Array<number>;
        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.walls = [];
            for (let ii = 0; ii < height; ++ii) {
                for (let jj = 0; jj < width; ++jj) {
                    this.walls.push(FourRegularWalls);
                }
            }

            let ii: number = 0;
            let jj: number = 0;

            let stack: Array<number> = [];
            let visited: Array<boolean> = [];

            //Initialize all cells unvisited
            for (let ii = 0; ii < height; ++ii) {
                for (let jj = 0; jj < width; ++jj) {
                    visited.push(false);
                }
            }
            //Start with a random cell
            ii = randint(0, height * width - 1);
            visited[ii] = true;
            stack.push(ii);

            //While there are cells to expand from
            while (stack.length > 0) {
                //Pick a random visited cell
                ii = randint(0, stack.length - 1);
                let cellid = stack.removeAt(ii);
                //See if we can walk from there
                let neighbors: Array<CellNeighbor> = this.ShuffledCellNeighbors(cellid);
                //Check for unvisited neighbors
                for (let nn of neighbors) {
                    //If the neighbor hasn't been visited yet
                    if (!visited[nn.id]) {
                        //Remove wall from selected cell
                        this.walls[cellid] = this.walls[cellid] & (~nn.wall);
                        //Remember we can walk it more
                        stack.push(cellid);
                        //Remove opposite wall from neighboring cell
                        this.walls[nn.id] = this.walls[nn.id] & (~OppositeWall[nn.wall]);
                        //Mark that the neighbor has been walked to already
                        visited[nn.id] = true;
                        //Remeber we can walk from the neighbor
                        stack.push(nn.id);
                        break;
                    }
                }
            }

        }
        CellUp(id: number): number {
            let x: number = id % this.height;
            let y: number = (id - x) / this.height;
            if (y > 0) {
                return id - this.width;
            }
            else {
                return id - this.width + this.width * this.height;
            }
        }
        CellDown(id: number): number {
            let x: number = id % this.height;
            let y: number = (id - x) / this.height;
            if (y < this.height - 1) {
                return id + this.width;
            }
            else {
                return id + this.width - this.width * this.height;
            }
        }
        CellLeft(id: number): number {
            let x: number = id % this.height;
            let y: number = (id - x) / this.height;
            if (x > 0) {
                return id - 1;
            }
            else {
                return id - 1 + this.width;
            }
        }
        CellRight(id: number): number {
            let x: number = id % this.height;
            let y: number = (id - x) / this.height;
            if (x < this.width - 1) {
                return id + 1;
            }
            else {
                return id + 1 - this.width;
            }
        }
        ShuffledCellNeighbors(id: number): Array<CellNeighbor> {
            return ShuffleList([
                new CellNeighbor(this.CellLeft(id), WallType.Left),
                new CellNeighbor(this.CellRight(id), WallType.Right),
                new CellNeighbor(this.CellUp(id), WallType.Up),
                new CellNeighbor(this.CellDown(id), WallType.Down)
            ]);
        }
    }
    /**
    * Generate random maze
    * @param width the horizontal size of the maze
    * @param height the vertical size of the maze
    */
    //% block
    export function GenerateMaze(width: number, height: number): MazeType
    {
        return new MazeType(width, height);
    }
    /**
     * Set up tilemap
     */
    //% block
    export function SetMazeRoom(maze: MazeType, room: number)
    {
        let loc: tiles.Location;
        tiles.setCurrentTilemap(tilemap`DungeonRoom`);
        scene.centerCameraAt(screen.width / 2, screen.height / 2 + 8)
        
        if ((maze.walls[room] & WallType.Left) != 0) {
            loc = tiles.getTileLocation(0, 4);
            tiles.setTileAt(loc, assets.tile`DungeonLeft`);
            tiles.setWallAt(loc, true);
        }
        if ((maze.walls[room] & WallType.Right) != 0) {
            loc = tiles.getTileLocation(9, 4);
            tiles.setTileAt(loc, assets.tile`DungeonRight`);
            tiles.setWallAt(loc, true);
        }
        if ((maze.walls[room] & WallType.Up) != 0) {
            loc = tiles.getTileLocation(5, 1);
            tiles.setTileAt(loc, assets.tile`DungeonTop`);
            tiles.setWallAt(loc, true);
        }
        if ((maze.walls[room] & WallType.Down) != 0) {
            loc = tiles.getTileLocation(5, 7);
            tiles.setTileAt(loc, assets.tile`DungeonBottom`);
            tiles.setWallAt(loc, true);
        }
    }
    /**
     * Randomize Dungeon Colors
     */
    //% block
    export function RandomizeDungeonColors(): void
    {
        let hue = randint(0, 255);
        color.setColor(1, color.hsv(hue, 250, 255));
        color.setColor(2, color.hsv(hue, 235, 192));
        color.setColor(3, color.hsv(hue, 220, 128));
    }
    /**
     * Format number with given integer digits
     */
    //% block
    export function FormatInteger(value: number, digits: number): string
    {
        let s: string = "" + (value | 0);
        while(s.length < digits){
            s = "0" + s;
        }
        return s;
    }
}
