import { TextBuffer } from "../text-buffer.ts";
import { sleep } from "../../lib/util.ts";
import { SCREEN_0, SCREEN_1 } from "../sgr.ts";

const buffer = new TextBuffer(Deno.stdout);
buffer.write(SCREEN_1);
await buffer.flush();

buffer.writeln("This is line one.");
buffer.writeln("This is line 2.");
await buffer.flush();

console.log("The quick brown fox jumped over the lazy yellow dog.");

await sleep(3000);
buffer.writeln("This is line one.");
buffer.writeln("This is line 2.");
await buffer.flush();

await sleep(3000);

//buffer.write(altScreen(false));
buffer.write(SCREEN_0);
buffer.flushSync();
