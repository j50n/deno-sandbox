import { Canvas } from "../canvas.ts";
import { Sprite } from "../sprite.ts";

export const ALIEN1 = new Sprite(Canvas.from([
  "....##....",
  "...####...",
  "..#.##.#.#",
  "##########",
  "#.######..",
  "..#.#.#...",
]));

export const ALIEN2 = new Sprite(Canvas.from([
  "....##....",
  "...####...",
  "#.#.##.#..",
  "##########",
  "..######.#",
  "...#.#.#..",
]));
