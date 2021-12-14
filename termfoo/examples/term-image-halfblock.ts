#!/usr/bin/env -S deno run --quiet --allow-read=./resources

import { bg, fg } from "../ansiesc/color-24-bit.ts";
import { RESET } from "../ansiesc/sgr.ts";
import { TextBuffer } from "../text-buffer.ts";
import { JpegPixelReader } from "../image/jpeg-reader.ts";
import { Image } from "../image/image.ts";
import { scale } from "../image/transforms/scale.ts";

/*
 * Image aspect ratio is 16:9. Height must be an even number.
 */
const width = 16 * 10;
const height = 9 * 10;

const jpeg = await JpegPixelReader.init("./resources/dragon.jpg");
const image = Image.init(width, height);

scale(jpeg, image, { x: 0, y: 0 }, { x: jpeg.width, y: jpeg.height });

const buff = new TextBuffer(Deno.stdout);
for (let y = 0; y < image.height; y += 2) {
  for (let x = 0; x < image.width; x++) {
    buff.write(fg(image.getPixel(x, y)));
    buff.write(bg(image.getPixel(x, y + 1)));
    buff.write("▀");
  }
  buff.writeln(RESET);
}

await buff.flush();

console.log();
console.log(
  "Half-char pixelated full-color images look really good in the terminal.",
);
console.log("Good for cut scenes.");
console.log();
