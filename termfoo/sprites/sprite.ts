import { rem } from "../../util.ts";
import { Canvas } from "../canvas/canvas.ts";
import { CLEAR } from "../canvas/color.ts";
import { makeDivisibleBy3, makeEven } from "../canvas/util.ts";
import { Color } from "../image/pixels.ts";
import { SquotImage } from "../squots/squot-image.ts";

export class Sprite {
  readonly renders: SquotImage[] = new Array(6);

  constructor(
    protected readonly image: SquotImage,
    public readonly widthInPixels: number,
    public readonly heightInPixels: number,
  ) {
    for (let index = 0; index < 6; index++) {
      const dx = index % 2;
      const dy = Math.floor(index / 2);

      const render = SquotImage.init(
        makeEven(widthInPixels + dx),
        makeDivisibleBy3(heightInPixels + dy),
      );

      this.renders[index] = render;

      for (let y = 0; y < heightInPixels; y++) {
        for (let x = 0; x < widthInPixels; x++) {
          if (image.getPixel(x, y) !== CLEAR) {
            render.setPixel(dx + x, y + dy, 0xFFFFFFFF);
          }
        }
      }
    }
  }

  /**
   * Treat each line in the def as a row of pixels, and each character as a pixel in the row.
   *
   * Characters ".", " " (space), "-", and "+" are treated as a blank pixel. Everything else is
   * treated as a solid pixel.
   *
   * @param def Pixel definition.
   * @returns A canvas with an image created from the definition with the specified color.
   */
  static init(def: string[]): Sprite {
    const defPixelWidth = def.map((d) => d.length).reduce((a, b) =>
      Math.max(a, b)
    );
    const defPixelHeight = def.length;

    const image = SquotImage.init(
      makeEven(defPixelWidth),
      makeDivisibleBy3(defPixelHeight),
    );

    const BLANK_PIXELS = new Set([".", " ", "-", "+"]);

    for (let y = 0; y < def.length; y++) {
      const dstr = def[y];

      let x = 0;
      for (const d of dstr) {
        if (!BLANK_PIXELS.has(d)) {
          image.setPixel(x, y, 0xFFFFFFFF);
        }
        x += 1;
      }
    }

    return new Sprite(image, defPixelWidth, defPixelHeight);
  }

  /**
   * Write the pixels of the sprite.
   * @param x Upper left X. May go out of bounds.
   * @param y Upper left Y. May go out of bounds.
   * @param sprite The sprite to write.
   */
  writeSprite(canvas: Canvas, x: number, y: number, fg: Color): void {
    const spriteImage = this.renders[rem(x, 2) + 2 * rem(y, 3)];

    let ny = 3 * Math.floor(y / 3);
    for (const squots of spriteImage.squotRows()) {
      if (ny >= 0 && ny < canvas.heightInPixels) {
        let nx = 2 * Math.floor(x / 2);
        const loc = canvas.fg.location(nx, ny);
        if (loc !== null) {
          let addr = loc.addr;
          for (let i = 0; i < squots.length; i++) {
            if (nx >= 0 && nx < canvas.widthInPixels) {
              const sq = squots[i];
              if (sq !== 0) {
                canvas.fg.pixels[addr] |= sq;
                canvas.fg.colors[addr] = fg;
              }
            }
            nx += 2;
            addr += 1;
          }
        }
      }
      ny += 3;
    }
  }
}
