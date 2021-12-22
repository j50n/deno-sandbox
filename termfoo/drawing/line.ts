import { Color, PixelWriter, Point } from "../image/pixels.ts";

/**
 * Draw a line segment from point 1 to point 2.
 *
 * Note that this does not clip, so portions of the line segment that are outside
 * the viewable area will consume compute resources.
 *
 * @param writer The writer.
 * @param p1 Point 1.
 * @param p2 Point 2.
 * @param color The line color.
 */
export function drawLine(
  writer: PixelWriter,
  p1: Point,
  p2: Point,
  color: Color = 0xFFFFFFFF,
): void {
  const x1 = Math.floor(p1.x) + 0.5;
  const x2 = Math.floor(p2.x) + 0.5;

  const y1 = Math.floor(p1.y) + 0.5;
  const y2 = Math.floor(p2.y) + 0.5;

  const Δy = y2 - y1;
  const Δx = x2 - x1;

  if (x1 === x2 && y1 === y2) {
    writer.setPixel(x1, y1, color);
  } else if (Δx >= Δy) {
    const m = Δy / Δx;
    const b = y1 - m * x1;

    const start = Math.min(x1, x2);
    const end = Math.max(x1, x2);

    for (let x = start; x <= end; x++) {
      writer.setPixel(x, m * x + b, color);
    }
  } else {
    const m = Δx / Δy;
    const b = x1 - m * y1;

    const start = Math.min(y1, y2);
    const end = Math.max(y1, y2);

    for (let y = start; y <= end; y++) {
      writer.setPixel(m * y + b, y, color);
    }
  }
}
