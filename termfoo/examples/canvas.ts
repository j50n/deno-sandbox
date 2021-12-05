import { sleep } from "../../util.ts";
import { Canvas, HIDE_CURSOR, SHOW_CURSOR } from "../mod.ts";
import { ALIEN_A, ALIEN_B, ALIEN_C } from "../../invaders/sprites/aliens.ts";

console.log(HIDE_CURSOR);

const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
let canvas = Canvas.initToCharDimensions(columns, rows);
let oldCanvas: Canvas = canvas.clone();
canvas.print();

try {
  for (let round = 0; round < 300; round++) {
    const t1 = new Date().getTime();
    oldCanvas = canvas.clone();
    canvas = Canvas.initToCharDimensions(columns, rows);

    if (round % 2 === 0) {
      canvas.writeSprite(round + 20, round, ALIEN_A[0]);
    } else {
      canvas.writeSprite(round + 20, round, ALIEN_A[1]);
    }

    if (round % 2 === 0) {
      canvas.writeSprite(round + 20, 150 - round, ALIEN_B[0]);
    } else {
      canvas.writeSprite(round + 20, 150 - round, ALIEN_B[1]);
    }

    if (round % 2 === 0) {
      canvas.writeSprite(round + 40, 50, ALIEN_C[0]);
    } else {
      canvas.writeSprite(round + 40, 50, ALIEN_C[1]);
    }

    await canvas.printDiff(oldCanvas);
    const t2 = new Date().getTime();

    //console.log(t2 - t);

    await sleep(100 - (t2 - t1));
  }
} finally {
  console.log(SHOW_CURSOR);
}

// for (const render of ALIEN1.renders) {
//   await render.print();
//   console.log();
// }

// for (const render of ALIEN2.renders) {
//   await render.print();
//   console.log();
// }

// for (const row of ALIEN1.renders[3].squotRows()) {
//   console.dir(row);
// }
