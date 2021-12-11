import {
  alpha,
  blue,
  Color,
  color,
  green,
  PixelReader,
  PixelWriter,
  Point,
  red,
} from "../pixels.ts";

/**
 * Scale down an image. This is intended to be used to scale high resolution pictures
 * to fit into a terminal window.
 *
 * UpperLeft and lowerRight refer to pixels as 2D rectangles rather than as points.
 * Therefore, to sample the whole picture, you need to use (0,width)-(0,height), not
 * (0,width-1)-(0,height-1) for the bounding rectangle.
 *
 * @param reader A pixel reader.
 * @param writer A pixel writer.
 * @param upperLeft The upper left corner of the sampling rectangle.
 * @param lowerRight The lower right corner of the sampling rectangle, inclusive.
 */
export function scale(
  reader: PixelReader,
  writer: PixelWriter,
  upperLeft: Point,
  lowerRight: Point,
): void {
  const xSamples = getSamples(
    writer.width,
    upperLeft.x,
    lowerRight.x,
  );

  const ySamples = getSamples(
    writer.height,
    upperLeft.y,
    lowerRight.y,
  );

  for (let y = 0; y < writer.height; y++) {
    const ySample = ySamples[y];
    for (let x = 0; x < writer.width; x++) {
      const xSample = xSamples[x];

      let [t, r, g, b] = [0.0, 0.0, 0.0, 0.0];
      let w = 0.0;

      for (const ys of ySample) {
        for (const xs of xSample) {
          const pixel: Color = reader.getPixel(xs.ord, ys.ord);
          const weight = xs.weight * ys.weight;

          t += alpha(pixel) / 255.0 * weight;
          r += red(pixel) / 255.0 * weight;
          g += green(pixel) / 255.0 * weight;
          b += blue(pixel) / 255.0 * weight;
          w += weight;
        }
      }

      const avg = (v: number) => {
        return Math.min(255, Math.floor(256.0 * v / w));
      };

      writer.setPixel(x, y, color(avg(t), avg(r), avg(g), avg(b)));
    }
  }
}

/**
 * A sample.
 */
type Sample = {
  /** The X or Y pixel location. */
  ord: number;
  /** The sample weight. This is usually 1, except around the edges of pixels. */
  weight: number;
};

/**
 * Calculates the sample sizes and weights, in generic fashion.
 * @param len `width` for x-axis, `height` for y-axis.
 * @param lowerBound The lower-bound.
 * @param upperBound The upper-bound.
 * @returns The samples definition.
 */
function getSamples(
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
