import { worldMap } from "./world.ts";

class Square {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}
}

class Playable extends Square {
  readonly next4Player: (Playable | null)[] = [];
  readonly next4Ghost: (Playable | null)[] = [];

  constructor(
    x: number,
    y: number,
  ) {
    super(x, y);
  }
}

class Nonplayable extends Square {
  constructor(
    x: number,
    y: number,
  ) {
    super(x, y);
  }
}

class Board {
  public readonly width: number;
  public readonly height: number;

  public readonly board: Square[][];

  constructor(public readonly worldMap: string[][]) {
    this.height = worldMap.length;
    this.width = worldMap.map((row) => row.length).reduce(
      (a, b) => Math.max(a, b),
      0,
    );

    this.board = new Array(this.height);
    this.initBoard();
    this.initPlayGraph();
  }

  private initBoard(): void {
    for (let y = 0; y < this.height; y++) {
      this.board[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        if (worldMap[y][x] === ".") {
          this.board[y][x] = new Playable(x, y);
        } else if (worldMap[y][x] === "+") {
          this.board[y][x] = new Playable(x, y);
        } else if (worldMap[y][x] === "o") {
          this.board[y][x] = new Playable(x, y);
        } else if (worldMap[y][x] === "X") {
          this.board[y][x] = new Nonplayable(x, y);
        } else if (worldMap[y][x] === " ") {
          this.board[y][x] = new Nonplayable(x, y);
        } else {
          this.board[y][x] = new Nonplayable(x, y);
        }
      }
    }
  }

  private initPlayGraph(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const current = this.board[y][x];
        if (current instanceof Playable) {
          const cond = (sq: Square) => {
            if (sq instanceof Playable) {
              current.next4Ghost.push(sq);
              current.next4Player.push(sq);
            }
          };

          cond(this.board[y - 1][x]);
          cond(this.board[y + 1][x]);
          cond(this.board[y][x - 1]);
          cond(this.board[y][x + 1]);

          if (current.next4Player.length === 4) {
            console.dir(current);
          }
        }
      }
    }
  }
}

const board = new Board(worldMap);

console.log(board.width);
console.log(board.height);

// console.dir(board, {depth: 7});
