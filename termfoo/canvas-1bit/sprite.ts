import { Canvas } from "./canvas.ts";
import { Rect } from "./rect.ts";
import { makeDivisibleBy3, makeEven } from "./util.ts";

export class Sprite {
  readonly renders: Canvas[] = new Array(6);

  constructor(canvas: Canvas, rect?: Rect) {
    const r = rect || new Rect(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < 6; index++) {
      const dx = index % 2;
      const dy = Math.floor(index / 2);

      const render = Canvas.init(
        makeEven(r.width + dx),
        makeDivisibleBy3(r.height + dy),
      );
      this.renders[index] = render;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (canvas.getPixel(r.x + x, r.y + y) !== 0) {
            const fg = canvas.getPixelFgColor(r.x + x, r.y + y);
            render.setPixel(dx + x, y + dy, fg);
          }
        }
      }
    }
  }
}
