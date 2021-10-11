#!/usr/bin/env -S deno --unstable run

import { signals, tty, util, term } from "../lib/deps.ts";

//signals.intercept();
self.addEventListener("unload", (_e: Event) => {
  //tty.showCursorSync();
  //tty.clearScreenSync();
  //tty.goHomeSync();
  //tty.restoreSync();
});

//tty.hideCursorSync();

//await tty.clearScreen();

for(let r=0; r<6; r++) {
  for(let g=0; g< 6; g++){
    for(let b=0; b<6; b ++){
      const text = ` ${r}${g}${b} `;
      await term.colorBg8({r,g,b});
      await tty.write(text, Deno.stdout);
    }
    await term.reset();
    console.log("");
  }
}

await term.colorBg8({r:0, g: 1,b:0});
await tty.write("⛰ ⛰ ⛰ ⛰ ⛰ ⛰ ⛰ ⛰ ⛰ ⛰ ⛰ ", Deno.stdout);
await term.reset();
console.log("");
