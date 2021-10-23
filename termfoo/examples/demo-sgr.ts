#!/usr/bin/env -S deno run
import {
  altFont,
  BLINK,
  BOLD,
  CONCEAL,
  DEFAULT_FONT,
  FAINT,
  FRAKTUR,
  INVERT,
  ITALIC,
  RAPID_BLINK,
  RESET,
  STRIKE,
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
buff.writeln(`${RAPID_BLINK}This is RAPIDBLINK.${RESET}`);
buff.writeln(`${INVERT}This is INVERT.${RESET}`);
buff.writeln(`This is CONCEAL -> [[${CONCEAL}I am INVISIBLE!${RESET}]]`);
buff.writeln(`${STRIKE}This is STRIKE.${RESET}`);
buff.writeln(`${DEFAULT_FONT}This is DEFAULT_FONT.${RESET}`);

buff.writeln(`${altFont(1)}This is altFont(1).`);
buff.writeln("...");
buff.writeln(`${altFont(9)}This is altFont(9).`);

buff.writeln(`${FRAKTUR}This is FRAKTUR.${RESET}`);

await buff.flush();
