#!/usr/bin/env -S deno --unstable run

import { tty } from "../lib/deps.ts";
import { interceptSignals } from "../lib/signals.ts";

interceptSignals();
self.addEventListener("unload", (_e: Event) => tty.showCursorSync() );

tty.hideCursorSync();

