#!/usr/bin/env -S deno run --allow-run=tput

import { TextBuffer } from "../text-buffer.ts";
import { sleep } from "../deps/asynciter.ts";
import { HOME, SCREEN_0, SCREEN_1 } from "../ansi-esc/sgr.ts";

const buffer = new TextBuffer(Deno.stdout);
buffer.write(SCREEN_1);
await buffer.flush();
try {
  buffer.write(HOME);
  buffer.writeln("I am now on a new screen.");
  await buffer.flush();
  await sleep(1000);

  buffer.writeln("I will switch back to the previous screen when I am done.");
  await buffer.flush();
  await sleep(1000);

  console.log("The quick brown fox jumped over the lazy yellow dog.");
  await sleep(2000);
} finally {
  buffer.write(SCREEN_0);
  buffer.flushSync();
}
