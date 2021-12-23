import { termfoo } from "../deps.ts";
import {
  GHOST_DOWN,
  GHOST_LEFT,
  GHOST_POWER,
  GHOST_RIGHT,
  GHOST_UP,
} from "../sprites/ghosts.ts";

Deno.test({ name: "show ghosts" }, async () => {
  const canvas = termfoo.Canvas.initToCharDimensions(27, 12);

  GHOST_RIGHT[0].writeSprite(canvas, 1, 1, 0xFFFF0000);
  GHOST_DOWN[0].writeSprite(canvas, 16, 1, 0xFFFFB8FF);
  GHOST_LEFT[0].writeSprite(canvas, 16, 16, 0xFF00FFFF);
  GHOST_UP[0].writeSprite(canvas, 1, 16, 0xFFFFB852);

  GHOST_POWER[0].writeSprite(canvas, 34, 1, 0xFF0000FF);
  GHOST_POWER[0].writeSprite(canvas, 34, 16, 0xFFBBBBFF);

  console.log();
  await canvas.print({ home: false });
  console.log();
});
