#!/usr/bin/env -S deno run --allow-read 

import { bg, color } from "../ansiesc/color-8-bit.ts";
import { RESET } from "../ansiesc/sgr.ts";
import { sleep } from "../deps/asynciter.ts";
import { Image8BitColorMapper } from "../images/image-8bit-color-mapper.ts";
import { ImageScaler } from "../images/image-scaler.ts";
import { jpeg } from "../images/pixel-source.ts";
import { TextBuffer } from "../text-buffer.ts";

const image = await jpeg("./resources/mountain.jpeg");
const scaler = new ImageScaler(image, 128, 48, {x: 0, y: 0}, {x: image.width, y: image.height});
const mapper = new Image8BitColorMapper(scaler);

const buff = new TextBuffer(Deno.stdout);
for(let y =0; y< mapper.height; y++){
    for(let x=0; x< mapper.width; x++){
        const {r,g,b} = mapper.getPixel(x,y);
        buff.write(bg(color(r, g, b)));
        buff.write(" ");
    }
    buff.writeln(RESET);
}
buff.flushSync();
