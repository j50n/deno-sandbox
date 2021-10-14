#!/usr/bin/env -S deno run --unstable --allow-run=figlet,toilet

import { clearScreen, goHome, hideCursor, readKeypress } from "../lib/deps.ts";
import { reset } from "../lib/term.ts";
import { figlet } from "../lib/punchin/figlet.ts";
import { format, parseInterval } from "../lib/punchin/interval.ts";
import { setup } from "../lib/punchin/setup.ts";
import { sleep } from "../lib/util.ts";

setup();

let totalTimeSoFar = 0;
let lastTimeIChecked = new Date().getTime();
let timeWorkedDisplay = "";
let onBreak = false;

if (Deno.args.length > 0) {
  totalTimeSoFar = parseInterval(Deno.args[0]);
}

async function refreshDisplay(): Promise<void> {
  try {
    await clearScreen();
    await goHome();
    await hideCursor();

    if (onBreak) {
      console.log(await figlet("On a Break", "bigmono12", true));
    } else {
      console.log(await figlet(timeWorkedDisplay, "bigmono12", true));
      if (totalTimeSoFar / (60 * 60 * 1000) >= 8) {
        console.log(await figlet("ACHIEVEMENT UNLOCKED", "smmono9", true));
      }
    }
  } finally {
    await reset();
  }
}

(async () => {
  while (true) {
    const now = new Date().getTime();
    if (!onBreak) {
      totalTimeSoFar += now - lastTimeIChecked;
    }
    lastTimeIChecked = now;

    const interval = format(totalTimeSoFar / 1000);
    if (interval !== timeWorkedDisplay) {
      timeWorkedDisplay = interval;
      await refreshDisplay();
    }
    await sleep(1000);
  }
})().catch((e) => {
  console.error(e);
  Deno.exit(2);
});

(async () => {
  for await (const keypress of readKeypress()) {
    if (keypress.ctrlKey && keypress.key === "c") {
      Deno.exit(0);
    }

    if (keypress.key === "space") {
      onBreak = !onBreak;
      await refreshDisplay();
    }
  }
})().catch((e) => {
  console.error(e);
  Deno.exit(2);
});
