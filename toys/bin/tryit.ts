#!/usr/bin/env -S deno --unstable run

import {
  clearScreen,
  clearScreenSync,
  goHome,
  goHomeSync,
  goTo,
  hideCursorSync,
  showCursorSync,
  write,
} from "../lib/deps.ts";
import { intercept } from "../lib/signals.ts";
import { colorBg, colorFg, Intensity } from "../lib/term.ts";
import { sleep } from "../lib/util.ts";

intercept();
self.addEventListener("unload", (_e: Event) => {
  showCursorSync();
  clearScreenSync();
  goHomeSync();
});

hideCursorSync();

await clearScreen();

let [x, y, dx, dy] = [1, 1, 1, 1];

let count = 0;

while (true) {
  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);

  if (x <= 1) dx = 1;
  if (y <= 1) dy = 1;
  if (x >= columns) dx = -1;
  if (y >= rows) dy = -1;

  await goTo(x, y, Deno.stdout);
  await write(".", Deno.stdout);

  x = x + dx;
  y = y + dy;

  await goTo(x, y, Deno.stdout);

  await colorFg(count % 8, Intensity.Bright);
  await colorBg((count + 4) % 8);
  await write("@", Deno.stdout);

  await goHome();
  //await tty.clearLine();

  await write(`${x}:${y}     `, Deno.stdout);

  await sleep(20);

  count += 1;
}
