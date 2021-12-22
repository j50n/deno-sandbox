import { Canvas } from "../canvas/canvas.ts";
import { drawLine } from "../drawing/line.ts";

Deno.test("demonstrate drawing some lines", async () => {
  const canvas = Canvas.initToPixelDimensions(140, 100);

  for (let y = 2; y <= 98; y += 96 / 8) {
    drawLine(canvas.fg, { x: 2, y: 2 }, { x: 138, y }, 0xFFFFFF00);
  }

  for (let x = 2; x <= 138; x += 136 / 8) {
    drawLine(canvas.fg, { x: 2, y: 2 }, { x, y: 98 }, 0xFFFFFF00);
  }

  console.log();
  await canvas.print({ home: false });
  console.log();
  console.log(
    `Squot pixels are not square. They are about 1.3 times as high as wide.
The exact aspect ratio will vary a bit by terminal and font.`,
  );
});
