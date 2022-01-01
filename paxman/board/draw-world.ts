import { ttyfu } from "../deps.ts";
import { DOT, POWER_DOT, WALL } from "../sprites/board.ts";
import { worldMap } from "./world.ts";

const rows = worldMap.length;
const columns = worldMap.map((row) => row.length).reduce(
  (a, b) => Math.max(a, b),
  0,
);

console.log(rows);
console.log(columns);

const canvas = ttyfu.Canvas.initToPixelDimensions(columns * 8, rows * 6);

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    if (worldMap[y][x] === "X") {
      WALL[0].writeSprite(canvas, x * 8, y * 6, 0xFF0000FF);
    } else if (worldMap[y][x] === ".") {
      DOT[0].writeSprite(canvas, x * 8 + 3, y * 6 + 2, 0xFFFFFFFF);
    } else if (worldMap[y][x] === "o") {
      POWER_DOT[0].writeSprite(canvas, x * 8 + 2, y * 6 + 1, 0xFFFFFFFF);
    }
  }
}

await canvas.print();
