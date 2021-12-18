#!/usr/bin/env -S deno run --unstable --reload --allow-net=github.com,raw.githubusercontent.com

import { sleep } from "../util.ts";
import { ALIEN_A, ALIEN_B, ALIEN_C } from "./sprites/aliens.ts";
import { termfoo } from "./deps.ts";
import { TextBuffer } from "../termfoo/mod.ts";

const FRAME_MS = 1000 / 60;

//console.log(termfoo.HIDE_CURSOR);

abstract class Alien {
  counter = 0;

  constructor(
    public pos: { x: number; y: number },
    public anim: termfoo.Sprite[],
  ) {
  }

  get width(): number {
    return this.anim[0].renders[0].width;
  }

  move(x: number, y: number): void {
    this.pos = { x, y };
    this.counter += 1;
  }

  draw(canvas: termfoo.Canvas): void {
    this.anim[this.counter % this.anim.length].writeSprite(
      canvas,
      this.pos.x,
      this.pos.y,
      this.color,
    );
  }

  abstract get color(): number;
}

class WhiteAlien extends Alien {
  get color(): number {
    return 0xFFFFFFFF;
  }
}

class BlueAlien extends Alien {
  get color(): number {
    return 0xFF2222FF;
  }
}

class GreenAlien extends Alien {
  get color(): number {
    return 0xFF22FF22;
  }
}

class RedAlien extends Alien {
  get color(): number {
    return 0xFFFF2222;
  }
}

class SinAlien extends Alien {
  get color(): number {
    const wave = Math.sin((1 / 2) * new Date().getTime() * Math.PI / 360);
    const normWave = (wave + 1) / 2;
    const bright = Math.floor(127.99 * normWave) + 128;

    return 0xFF000000 | (bright << 16) | (bright << 8) | bright;
  }
}

const aliens: Alien[] = [];

const YOFF = 20;

for (let i = 0; i < 11; i++) {
  aliens.push(new WhiteAlien({ x: i * 20, y: 0 + YOFF }, ALIEN_B));
  aliens.push(new RedAlien({ x: i * 20, y: 12 + YOFF }, ALIEN_C));
  aliens.push(new GreenAlien({ x: i * 20, y: 24 + YOFF }, ALIEN_C));
  aliens.push(new BlueAlien({ x: i * 20, y: 36 + YOFF }, ALIEN_A));
  aliens.push(new SinAlien({ x: i * 20, y: 48 + YOFF }, ALIEN_A));
}

const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);

const template = await (async () => {
  const temp = termfoo.Canvas.initToCharDimensions(columns, rows);

  const background = await termfoo.JpegPixelReader.initUrl(
    "https://github.com/j50n/deno-sandbox/raw/main/termfoo/examples/resources/spaceinvadersback.jpg",
  );

  termfoo.scale(background, temp.bg, { x: 0, y: 0 }, {
    x: background.width,
    y: background.height,
  });

  return temp;
})();

let oldCanvas = template.clone();
await oldCanvas.print();

let lastFrameTime = new Date().getTime();
let frameCount = 0;
let direction = 2;

function sortAliens(): void {
  aliens.sort((a, b) =>
    1000 * (b.pos.y - a.pos.y) + direction * (b.pos.x - a.pos.x)
  );
}

function atEdge(canvas: termfoo.Canvas): boolean {
  for (const alien of aliens) {
    if (direction > 0) {
      if (alien.pos.x + alien.width >= canvas.widthInPixels) {
        return true;
      }
    } else {
      if (alien.pos.x <= 0) {
        return true;
      }
    }
  }
  return false;
}

sortAliens();
try {
  while (true) {
    const elapsedMs = new Date().getTime() - lastFrameTime;
    const waitMs = FRAME_MS - elapsedMs;
    if (waitMs > 0) {
      await sleep(waitMs);
      lastFrameTime += FRAME_MS;
    } else {
      lastFrameTime = new Date().getTime();
    }

    const t1 = new Date().getTime();

    const canvas = template.clone();

    const index = frameCount % aliens.length;
    if (index === 0) {
      if (atEdge(canvas)) {
        direction = -direction;
        sortAliens();
      }
    }

    const thisAlien = aliens[index];
    thisAlien.move(thisAlien.pos.x + direction, thisAlien.pos.y);

    for (const alien of aliens) {
      alien.draw(canvas);
    }

    const b = new TextBuffer(Deno.stdout);
    b.write(termfoo.HIDE_CURSOR);
    await b.flush();

    await canvas.printDiff(oldCanvas, (buff) => {
      buff.write(termfoo.SHOW_CURSOR);
      const t2 = new Date().getTime();
      buff.write(`${t2 - t1}ms  `);
    });

    oldCanvas = canvas;
    frameCount += 1;
  }
} finally {
  console.log(termfoo.SHOW_CURSOR);
}
