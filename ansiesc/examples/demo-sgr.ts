#!/usr/bin/env -S deno run
import {
  BLINK,
  BOLD,
  FAINT,
  INVERT,
  ITALIC,
  RAPIDBLINK,
  RESET,
  TextBuffer,
  UNDERLINE,
} from "../mod.ts";

const buff = new TextBuffer(Deno.stdout);

buff.writeln("This is normal text.");
buff.writeln(`${BOLD}This is BOLD.${RESET}`);
buff.writeln(`${FAINT}This is FAINT.${RESET}`);
buff.writeln(`${ITALIC}This is ITALIC.${RESET}`);
buff.writeln(`${UNDERLINE}This is UNDERLINE.${RESET}`);
buff.writeln(`${BLINK}This is slow BLINK.${RESET}`);
buff.writeln(`${RAPIDBLINK}This is RAPIDBLINK.${RESET}`);
buff.writeln(`${INVERT}This is INVERT.${RESET}`);

await buff.flush();
