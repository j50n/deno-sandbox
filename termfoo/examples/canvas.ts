import { sleep } from "../../util.ts";
import { HOME } from "../ansiesc/sgr.ts";
import { Canvas } from "../canvas-1bit/canvas.ts";
import { ALIEN1, ALIEN2 } from "../canvas-1bit/sprites/alien.ts";
import { TextBuffer } from "../text-buffer.ts";

for (let round = 0; round < 120; round++) {
  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);

  const canvas = Canvas.init(columns * 2, rows * 2);

  // canvas.setPixel(0, 0);
  // canvas.setPixel(79, 23);

  // for (let x = 0; x < rows * 2; x++) {
  //   canvas.setPixel(x, x);
  //   canvas.setPixel((rows * 2 - 1) - x, x);
  // }

  //await canvas.print();

  if (round % 2 === 0) {
    canvas.writeSprite(round + 300, round, ALIEN1);
    //await ALIEN1.print();
  } else {
    canvas.writeSprite(round + 300, round, ALIEN2);
    //await ALIEN2.print();
  }

  const buff = new TextBuffer(Deno.stdout);
  buff.write(HOME);
  await buff.flush();

  await canvas.print();

  await sleep(50);
}

for (const render of ALIEN1.renders) {
  await render.print();
  console.log();
}

for (const render of ALIEN2.renders) {
  await render.print();
  console.log();
}

for (const row of ALIEN1.renders[3].nibbleRows()) {
  console.dir(row);
}
