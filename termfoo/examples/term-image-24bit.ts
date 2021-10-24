#!/usr/bin/env -S deno run --quiet --allow-read 

import { bg, fg } from "../ansiesc/color-24-bit.ts";
import { RESET } from "../ansiesc/sgr.ts";
import { ImageScaler } from "../images/image-scaler.ts";
import { jpeg } from "../images/pixel-source.ts";
import { TextBuffer } from "../text-buffer.ts";

/*
 * Image aspect ratio is 16:9. Height must be an even number.
 */
const width = 16 * 10;
const height = 9 * 10;

const image = await jpeg("./resources/dragon.jpg");
const scaler = new ImageScaler(image, width, height, { x: 0, y: 0 }, {
  x: image.width,
  y: image.height,
});

const buff = new TextBuffer(Deno.stdout);
for (let y = 0; y < scaler.height; y += 2) {
  for (let x = 0; x < scaler.width; x++) {
    buff.write(fg(scaler.getPixel(x, y)));
    buff.write(bg(scaler.getPixel(x, y + 1)));
    buff.write("▀");
  }
  buff.writeln(RESET);
}

await buff.flush();
