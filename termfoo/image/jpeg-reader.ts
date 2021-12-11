import { decode, Image } from "../deps/jpegts.ts";
import { Color, color, PixelReader } from "./pixels.ts";

export class JpegPixelReader implements PixelReader {
  /** Image width. */
  public get width(): number {
    return this.image.width;
  }

  /** Image height. */
  public get height(): number {
    return this.image.height;
  }

  /** Get the color value at pixel X,Y. If you are out of bounds, color 0, fully transparent. */
  public getPixel(x: number, y: number): Color {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
    } else {
      const pixel = this.image.getPixel(x, y);
      return color(pixel.a, pixel.r, pixel.g, pixel.b);
    }
  }

  /**
   * Read a JPEG image file into a pixel source.
   * @param imageFile The image file.
   * @returns A {@link PixelSource} of the image.
   */
  public static async init(imageFile: string): Promise<JpegPixelReader> {
    const raw = await Deno.readFile(imageFile);
    return new JpegPixelReader(decode(raw));
  }

  /**
   * Read a JPEG image file into a pixel source.
   * @param imageFile The image file.
   * @returns A {@link PixelSource} of the image.
   */
  public static async initUrl(imageFile: string): Promise<JpegPixelReader> {
    const response = await fetch(imageFile);
    const data = await response.arrayBuffer();
    return new JpegPixelReader(decode(new Uint8Array(data)));
  }

  constructor(protected image: Image) {
  }
}
