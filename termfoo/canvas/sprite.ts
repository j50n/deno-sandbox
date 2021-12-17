import { Color } from "../image/pixels.ts";
import { Canvas } from "./canvas.ts";
import { Rect } from "./rect.ts";

export class Sprite {
  readonly renders: Canvas[] = new Array(6);

  constructor(canvas: Canvas, rect?: Rect) {
    const r = rect ||
      new Rect(0, 0, canvas.widthInPixels, canvas.heightInPixels);

    for (let index = 0; index < 6; index++) {
      const dx = index % 2;
      const dy = Math.floor(index / 2);

      const render = Canvas.initToPixelDimensions(
        r.width + dx,
        r.height + dy,
      );
      this.renders[index] = render;

      for (let y = 0; y < canvas.heightInPixels; y++) {
        for (let x = 0; x < canvas.widthInPixels; x++) {
          if (canvas.fg.getPixel(r.x + x, r.y + y) !== 0) {
            const fg = canvas.fg.getPixel(r.x + x, r.y + y);
            render.fg.setPixel(dx + x, y + dy, fg);
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
   * @param fg The foreground color applied to solid pixels.
   * @returns A canvas with an image created from the definition with the specified color.
   */
  static init(def: string[], fg: Color): Sprite {
    const canvas = Canvas.initToPixelDimensions(
      def.map((d) => d.length).reduce((a, b) => Math.max(a, b)),
      def.length,
    );

    const BLANK_PIXELS = new Set([".", " ", "-", "+"]);

    for (let y = 0; y < def.length; y++) {
      const dstr = def[y];

      let x = 0;
      for (const d of dstr) {
        if (!BLANK_PIXELS.has(d)) {
          canvas.fg.setPixel(x, y, fg);
        }
        x += 1;
      }
    }

    return new Sprite(canvas);
  }
}
