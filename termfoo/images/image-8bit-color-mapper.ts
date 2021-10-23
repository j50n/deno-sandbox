import { Pixel, PixelSource } from "./pixel-source.ts";

export class Image8BitColorMapper implements PixelSource {
  constructor(protected readonly source: PixelSource) {
  }

  get width(): number {
    return this.source.width;
  }

  get height(): number {
    return this.source.height;
  }

  getPixel(x: number, y: number): Pixel {
    const { r, g, b } = this.source.getPixel(x, y);

    const remap = (v: number) => {
      return Math.min(5, Math.floor((v / 255.0) * 6));
    };

    return { r: remap(r), g: remap(g), b: remap(b) };
  }
}
