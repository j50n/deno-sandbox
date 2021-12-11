import { Color, PixelReader, PixelWriter } from "./pixels.ts";

export class Image implements PixelReader, PixelWriter {
  readonly image: Uint32Array;

  constructor(public width: number, public height: number) {
    this.image = new Uint32Array(width * height);
  }

  private validPixel(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getPixel(x: number, y: number): Color {
    if (this.validPixel(x, y)) {
      return this.image[x + y * this.width];
    } else {
      return 0;
    }
  }

  setPixel(x: number, y: number, color: Color): void {
    if (this.validPixel(x, y)) {
      this.image[x + y * this.width] = color;
    }
  }
}
