import { Canvas } from "../../termfoo/mod.ts";
import { DOT, POWER_DOT, WALL } from "../sprites/board.ts";
import { world } from "./world.ts";

const rows = world.length;
const columns = world.map((row) => row.length).reduce(
  (a, b) => Math.max(a, b),
  0,
);

console.log(rows);
console.log(columns);

const canvas = Canvas.initToPixelDimensions(columns * 8, rows * 6);

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    if (world[y][x] === "X") {
      WALL[0].writeSprite(canvas, x * 8, y * 6, 0xFF0000FF);
    } else if (world[y][x] === ".") {
      DOT[0].writeSprite(canvas, x * 8 + 3, y * 6 + 2, 0xFFFFFFFF);
    } else if (world[y][x] === "o") {
      POWER_DOT[0].writeSprite(canvas, x * 8 + 2, y * 6 + 1, 0xFFFFFFFF);
    }
  }
}

await canvas.print();
