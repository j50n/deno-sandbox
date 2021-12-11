import { uint32Array } from "../canvas/util.ts";
import { Color, PixelReader, PixelWriter } from "./pixels.ts";

export class Image implements PixelReader, PixelWriter {
  protected constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly image: Uint32Array,
  ) {
  }

  static init(width: number, height: number, color = 0xFF000000): Image {
    return new Image(width, height, uint32Array(width * height, color));
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

  clone(): Image {
    return new Image(this.width, this.height, this.image.slice(0));
  }
}
