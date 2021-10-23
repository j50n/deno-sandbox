import { decode } from "../deps/jpegts.ts";

/** A pixel of image data. */
export type Pixel = {
  /** Red component; 0 - 255. */
  r: number;
  /** Green component; 0 - 255. */
  g: number;
  /** Blue component; 0 - 255. */
  b: number;
};

/**
 * An abstract source of RGB pixels from any rectangular image.
 */
export type PixelSource = {
  /** Width in pixels. */
  readonly width: number;
  /** Height in pixels. */
  readonly height: number;
  /**
   * Get a pixel.
   * @param x Between 0 and `width`-1.
   * @param y Between 0 and `height`-1.
   * @returns The RGB value of the pixel.
   */
  getPixel(x: number, y: number): Pixel;
};

/**
 * Read a JPEG image file into a pixel source.
 * @param imageFile The image file.
 * @returns A {@link PixelSource} of the image.
 */
export async function jpeg(imageFile: string): Promise<PixelSource> {
  const raw = await Deno.readFile(imageFile);
  return decode(raw);
}
