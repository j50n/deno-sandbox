#!/usr/bin/env -S deno run --unstable --quiet 
import { sleep } from "../util.ts";
import { ALIEN_A, ALIEN_B, ALIEN_C } from "./sprites/aliens.ts";
import { termfoo } from "./deps.ts";

const FRAME_MS = 1000 / 60;

console.log(termfoo.HIDE_CURSOR);

class Alien {
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

  erase(canvas: termfoo.Canvas): void {
    canvas.clearSprite(
      this.pos.x,
      this.pos.y,
      this.anim[this.counter % this.anim.length],
    );
  }

  draw(canvas: termfoo.Canvas): void {
    canvas.writeSprite(
      this.pos.x,
      this.pos.y,
      this.anim[this.counter % this.anim.length],
    );
  }
}

// const a = new Alien({x: 0, y: 0}, ALIEN_A);
// const a = new Alien({x: 0, y: 0}, ALIEN_A);

const aliens: Alien[] = [];

for (let i = 0; i < 11; i++) {
  aliens.push(new Alien({ x: i * 20, y: 0 }, ALIEN_B));
  aliens.push(new Alien({ x: i * 20, y: 12 }, ALIEN_C));
  aliens.push(new Alien({ x: i * 20, y: 24 }, ALIEN_C));
  aliens.push(new Alien({ x: i * 20, y: 36 }, ALIEN_A));
  aliens.push(new Alien({ x: i * 20, y: 48 }, ALIEN_A));
}

const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
//let canvas = termfoo.Canvas.init(columns * 2, rows * 3);
let oldCanvas = termfoo.Canvas.init(columns * 2, rows * 3);
oldCanvas.print();

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
      if (alien.pos.x + alien.width >= canvas.width) {
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
    }
    lastFrameTime += FRAME_MS;

    // const t1 = new Date().getTime();

    const canvas = termfoo.Canvas.init(columns * 2, rows * 3);

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

    await canvas.printDiff(oldCanvas);
    // await canvas.print();

    // const t2 = new Date().getTime();
    // console.log(t2 - t1);

    oldCanvas = canvas;
    frameCount += 1;
  }
} finally {
  console.log(termfoo.SHOW_CURSOR);
}

// for (let round = 0; round < 300; round++) {
//   const t1 = new Date().getTime();
//   oldCanvas = canvas.clone();
//   canvas = termfoo.Canvas.init(columns * 2, rows * 3);

//   if (round % 2 === 0) {
//     canvas.writeSprite(round + 20, round, ALIEN_A[0]);
//   } else {
//     canvas.writeSprite(round + 20, round, ALIEN_A[1]);
//   }

//   if (round % 2 === 0) {
//     canvas.writeSprite(round + 20, 150 - round, ALIEN_B[0]);
//   } else {
//     canvas.writeSprite(round + 20, 150 - round, ALIEN_B[1]);
//   }

//   if (round % 2 === 0) {
//     canvas.writeSprite(round + 40, 50, ALIEN_C[0]);
//   } else {
//     canvas.writeSprite(round + 40, 50, ALIEN_C[1]);
//   }

//   await canvas.printDiff(oldCanvas);
//   const t2 = new Date().getTime();

//   //console.log(t2 - t);

//   await sleep(100 - (t2 - t1));
// }
