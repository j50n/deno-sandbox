import { Pixel, PixelSource } from "./pixel-source.ts";

type Point = { x: number; y: number };

type Sample = { ord: number; weight: number };

export class ImageScaler implements PixelSource {
  protected buffer: Uint8Array;

  constructor(
    protected readonly source: PixelSource,
    readonly width: number,
    readonly height: number,
    protected upperLeft: Point,
    protected lowerRight: Point,
  ) {
    this.buffer = new Uint8Array(width * height * 3);

    const xSamples = this.getSamples(
      width,
      this.upperLeft.x,
      this.lowerRight.x,
    );
    const ySamples = this.getSamples(
      height,
      this.upperLeft.y,
      this.lowerRight.y,
    );

    for (let y = 0; y < height; y++) {
      const ySample = ySamples[y];
      for (let x = 0; x < width; x++) {
        const xSample = xSamples[x];

        let [r, g, b] = [0.0, 0.0, 0.0];
        let w = 0.0;

        for (const ys of ySample) {
          for (const xs of xSample) {
            const pixel = source.getPixel(xs.ord, ys.ord);
            const weight = xs.weight * ys.weight;

            r += pixel.r / 255.0 * weight;
            g += pixel.g / 255.0 * weight;
            b += pixel.b / 255.0 * weight;
            w += weight;
          }
        }

        const avg = (v: number) => {
          return Math.min(255, Math.floor(256.0 * v / w));
        };

        this.setPixel({ x, y }, { r: avg(r), g: avg(g), b: avg(b) });
      }
    }
  }

  /**
   * @param len `width` for x-axis, `height` for y-axis.
   * @param lowerBound The lower-bound.
   * @param upperBound The upper-bound.
   * @returns
   */
  protected getSamples(
    len: number,
    lowerBound: number,
    upperBound: number,
  ): Sample[][] {
    const samples: Sample[][] = Array(len);

    const delta = (upperBound - lowerBound) / len;
    for (let a = 0; a < len; a++) {
      const lower = lowerBound + a * delta;
      const upper = lower + delta;

      const sd1 = [lower];
      for (let i = Math.ceil(lower); i <= Math.floor(upper); i++) {
        sd1.push(i);
      }

      const sd2 = sd1.slice(1);
      sd2.push(upper);

      const subsamples: Sample[] = [];
      for (let i = 0; i < sd1.length; i++) {
        subsamples.push({ ord: Math.floor(sd1[i]), weight: sd2[i] - sd1[i] });
      }

      samples[a] = subsamples.filter((s) => s.weight > 0.0001);
    }

    return samples;
  }

  protected setPixel(pt: Point, px: Pixel): void {
    const addr = 3 * (pt.x + pt.y * this.width);
    this.buffer[addr] = px.r;
    this.buffer[addr + 1] = px.g;
    this.buffer[addr + 2] = px.b;
  }

  getPixel(x: number, y: number): Pixel {
    const addr = 3 * (x + y * this.width);
    return {
      r: this.buffer[addr],
      g: this.buffer[addr + 1],
      b: this.buffer[addr + 2],
    };
  }
}
