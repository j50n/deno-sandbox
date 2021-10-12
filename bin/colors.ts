#!/usr/bin/env -S deno --unstable run

import { write } from "../lib/deps.ts";
import { colorBg8, colorFg8, reset } from "../lib/term.ts";

//signals.intercept();
self.addEventListener("unload", (_e: Event) => {
  //tty.showCursorSync();
  //tty.clearScreenSync();
  //tty.goHomeSync();
  //tty.restoreSync();
});

//tty.hideCursorSync();

//await tty.clearScreen();

for (let r = 0; r < 6; r++) {
  for (let g = 0; g < 6; g++) {
    for (let b = 0; b < 6; b++) {
      const text = ` ${r}${g}${b} `;
      await colorBg8({ r, g, b });
      await write(text, Deno.stdout);
    }
    await reset();
    console.log("");
  }
}

await colorBg8({ r: 3, g: 5, b: 3 });
await colorFg8({ r: 0, g: 5, b: 0 });
await write("⛰ ⛰ ⛰ 🌲 🌲 🌳🌳🌳 👨👨 🐉🐉🐉 🧍🚶🏃🤺", Deno.stdout);
await reset();
console.log("");
