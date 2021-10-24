import { HOME, RESET, TextBuffer } from "../deps/termfoo.ts";
import { DIRT, FOREST, WATER } from "../terrain/terrain.ts";
import { TerrainDef } from "../terrain/terrain-def.ts";
import { World } from "../world/world.ts";
import { readKeypress } from "../deps/keypress.ts";
import { hideCursor, showCursor } from "../deps/tty.ts";
import { Queue } from "../deps/queue.ts";

const world = new World(1024, 1024, DIRT);

function walk(
  world: World,
  x: number,
  y: number,
  steps: number,
  terrain: TerrainDef,
): void {
  let cx = x;
  let cy = y;

  for (let i = 0; i < steps; i++) {
    world.setLoc(cx, cy, terrain);

    switch (Math.floor(Math.random() * 8)) {
      case 0:
        cy += 1;
        break;
      case 1:
        cy -= 1;
        break;
      case 2:
      case 3:
      case 4:
        cx += 1;
        break;
      default:
        cx -= 1;
    }
  }
}

walk(world, 32, 16, 100000, WATER);
for (let i = 0; i < 4; i++) {
  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      if (world.getLoc(x, y) === DIRT) {
        if (world.neighbors(x, y).filter((n) => n === WATER).length >= 7) {
          world.setLoc(x, y, WATER);
        }
      }
    }
  }
}

walk(world, 32, 16, 10000, FOREST);

async function show(x: number, y: number): Promise<void> {
  const { columns: tw, rows: th } = Deno.consoleSize(Deno.stdout.rid);

  const buff = new TextBuffer(Deno.stdout);

  buff.write(HOME);
  for (let yp = y; yp < th + y; yp++) {
    let lastFg = null;
    let lastBg = null;
    for (let xp = x; xp < tw + x; xp++) {
      const loc = world.getLoc(xp, yp);

      const fg = loc.fg.fg;
      const bg = loc.bg.bg;

      if (lastFg !== fg) {
        buff.writeBytes(loc.fg.fg);
        lastFg = fg;
      }
      if (lastBg !== bg) {
        buff.writeBytes(loc.bg.bg);
        lastBg = bg;
      }
      buff.writeBytes(loc.chBytes);
    }
    if (yp < th + y - 1) {
      buff.writeln(RESET);
    }
    // await buff.flush();
  }
  await buff.flush();
}

await hideCursor();
show(0, 0);

const upperLeft = { x: 0, y: 0 };

const queue = new Queue();

for await (const key of readKeypress()) {
  switch (key.key) {
    case "up":
      upperLeft.y -= 1;
      break;
    case "down":
      upperLeft.y += 1;
      break;
    case "left":
      upperLeft.x -= 2;
      break;
    case "right":
      upperLeft.x += 2;
      break;
    case "c":
      if (key.ctrlKey) {
        await showCursor();
        Deno.exit(0);
      }
  }

  queue.push(async () => {
    await show(upperLeft.x, upperLeft.y);
  });
}
