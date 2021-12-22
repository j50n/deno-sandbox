#!/usr/bin/env -S deno run --quiet --allow-read=./resources

import { bg } from "../ansi-esc/color-24-bit.ts";
import { RESET } from "../ansi-esc/sgr.ts";
import { Image } from "../image/image.ts";
import { JpegPixelReader } from "../image/jpeg-reader.ts";
import { scale } from "../image/transforms/scale.ts";
import { TextBuffer } from "../text-buffer.ts";

// const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);

const buff = new TextBuffer(Deno.stdout);

const reader = await JpegPixelReader.init("./resources/dragon.jpg");
const image = Image.init(160, 45);

scale(reader, image, { x: 0, y: 0 }, { x: reader.width, y: reader.height });

for (let y = 0; y < image.height; y++) {
  for (let x = 0; x < image.width; x++) {
    buff.write(bg(image.getPixel(x, y)));
    buff.write(" ");
  }
  buff.write(RESET);
  buff.write("\n");
}

await buff.flush();

console.log();
console.log(
  "Full-char pixelated images still look okay, and they work well as a background with squot sprites.",
);
console.log();
