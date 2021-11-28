import { readKeypress } from "https://deno.land/x/keypress@0.0.7/mod.ts";

let last = new Date();
for await (const keypress of readKeypress()) {
    //console.log(new Date());
    //console.log(keypress);
    const t = new Date();
    console.log(t.getTime() - last.getTime());
    last = t;

    if (keypress.ctrlKey && keypress.key === 'c') {
        Deno.exit(0);
    }
}