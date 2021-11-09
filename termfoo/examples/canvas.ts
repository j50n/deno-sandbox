import { sleep } from "../../util.ts";
import { HIDE_CURSOR, SHOW_CURSOR } from "../ansiesc/private.ts";
import { HOME } from "../ansiesc/sgr.ts";
import { Canvas } from "../canvas-1bit/canvas.ts";
import { ALIEN1, ALIEN2 } from "../canvas-1bit/sprites/alien.ts";
import { ALIEN_A } from "../invaders/sprites/aliens.ts";
import { TextBuffer } from "../text-buffer.ts";

console.log(HIDE_CURSOR);
try {
  for (let round = 0; round < 120; round++) {
    const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
    //console.log(`${columns} ${rows}`);
    //await sleep(2000);

    const canvas = Canvas.init(columns * 2, rows * 3);

    // canvas.setPixel(0, 0);
    // canvas.setPixel(79, 23);

    // for (let x = 0; x < rows * 2; x++) {
    //   canvas.setPixel(x, x);
    //   canvas.setPixel((rows * 2 - 1) - x, x);
    // }

    //await canvas.print();

    if (round % 2 === 0) {
      canvas.writeSprite(round + 20, round, ALIEN_A[0]);
      //await ALIEN1.print();
    } else {
      canvas.writeSprite(round + 20, round, ALIEN_A[1]);
      //await ALIEN2.print();
    }

    const buff = new TextBuffer(Deno.stdout);
    buff.write(HOME);
    await buff.flush();

    await canvas.print();

    await sleep(1000 / 5);
  }
} finally {
  console.log(SHOW_CURSOR);
}

for (const render of ALIEN1.renders) {
  await render.print();
  console.log();
}

for (const render of ALIEN2.renders) {
  await render.print();
  console.log();
}

for (const row of ALIEN1.renders[3].squotRows()) {
  console.dir(row);
}
