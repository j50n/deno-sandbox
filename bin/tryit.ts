#!/usr/bin/env -S deno --unstable run

import { signals, tty, util, term } from "../lib/deps.ts";

signals.intercept();
self.addEventListener("unload", (_e: Event) => {
  tty.showCursorSync();
  tty.clearScreenSync();
  tty.goHomeSync();
});

tty.hideCursorSync();

await tty.clearScreen();

let [x, y, dx, dy] = [1, 1, 1, 1];

let count = 0;

while (true) {
  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);

  if (x <= 1) dx = 1;
  if (y <= 1) dy = 1;
  if (x >= columns) dx = -1;
  if (y >= rows) dy = -1;

  await tty.goTo(x, y, Deno.stdout);
  await tty.write(".", Deno.stdout);

  x = x + dx;
  y = y + dy;

  await tty.goTo(x, y, Deno.stdout);

  await term.colorFg(count % 8, term.Intensity.Bright);
  await term.colorBg( (count + 4) % 8);
  await tty.write("@", Deno.stdout);

  await tty.goHome();
  //await tty.clearLine();

  await tty.write(`${x}:${y}     `, Deno.stdout);

  await util.sleep(20);

  count += 1;
}
