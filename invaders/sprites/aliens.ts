import { BLUE, GREEN, RED } from "../../termfoo/mod.ts";
import { termfoo } from "../deps.ts";

export const ALIEN_A = [
  new termfoo.Sprite(termfoo.Canvas.from([
    "....####....",
    ".##########.",
    "############",
    "###..##..###",
    "############",
    "...##..##...",
    "..##.##.##..",
    "##........##",
  ], GREEN)),

  new termfoo.Sprite(termfoo.Canvas.from([
    "....####....",
    ".##########.",
    "############",
    "###..##..###",
    "############",
    "..###..###..",
    ".##..##..##.",
    "..##....##..",
  ], GREEN)),
];

export const ALIEN_B = [
  new termfoo.Sprite(termfoo.Canvas.from([
    "...##...",
    "..####..",
    ".######.",
    "##.##.##",
    "########",
    ".#.##.#.",
    "#......#",
    ".#....#.",
  ], BLUE)),

  new termfoo.Sprite(termfoo.Canvas.from([
    "...##...",
    "..####..",
    ".######.",
    "##.##.##",
    "########",
    "..#..#..",
    ".#.##.#.",
    "#.#..#.#",
  ], BLUE)),
];

export const ALIEN_C = [
  new termfoo.Sprite(termfoo.Canvas.from([
    "..#.....#..",
    "...#...#...",
    "..#######..",
    ".##.###.##.",
    "###########",
    "#.#######.#",
    "#.#.....#.#",
    "...##.##...",
  ], RED)),

  new termfoo.Sprite(termfoo.Canvas.from([
    "..#.....#..",
    "#..#...#..#",
    "#.#######.#",
    "###.###.###",
    "###########",
    ".#########.",
    "..#.....#..",
    ".#.......#.",
  ], RED)),
];
