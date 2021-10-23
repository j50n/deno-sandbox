#!/usr/bin/env -S deno run --quiet --allow-read 

import { bg, fg } from "../ansiesc/color-24-bit.ts";
import { RESET } from "../ansiesc/sgr.ts";
import { ImageScaler } from "../images/image-scaler.ts";
import { jpeg } from "../images/pixel-source.ts";
import { TextBuffer } from "../text-buffer.ts";

const image = await jpeg("./resources/mountain.jpeg");
const scaler = new ImageScaler(image, 64, 48, {x: 0, y: 0}, {x: image.width, y: image.height});

const buff = new TextBuffer(Deno.stdout);
for(let y =0; y< scaler.height; y+=2){
    for(let x=0; x< scaler.width; x++){
        buff.write(fg(scaler.getPixel(x,y)));
        buff.write(bg(scaler.getPixel(x,y+1)));
        buff.write("▀");
    }
    buff.writeln(RESET);
}
buff.flushSync();
