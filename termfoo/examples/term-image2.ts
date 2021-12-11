import { bg } from "../ansiesc/color-24-bit.ts";
import { RESET } from "../ansiesc/sgr.ts";
import { Image } from "../image/image.ts";
import { JpegPixelReader } from "../image/jpeg-reader.ts";
import { blue, green, red } from "../image/pixels.ts";
import { scale } from "../image/transforms/scale.ts";
import { TextBuffer } from "../text-buffer.ts";

const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);

const buff = new TextBuffer(Deno.stdout);

const reader = await JpegPixelReader.init("./resources/dragon.jpg");
const image = new Image(columns, rows);

scale(reader, image, { x: 0, y: 0 }, { x: reader.width, y: reader.height });

for (let y = 0; y < image.height; y++) {
  for (let x = 0; x < image.width; x++) {
    const p = image.getPixel(x, y);
    buff.write(bg({ r: red(p), g: green(p), b: blue(p) }));
    buff.write(" ");
  }
  buff.write(RESET);
  buff.write("\n");
}

buff.flush();
