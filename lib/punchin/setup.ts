import { showCursorSync } from "../deps.ts";
import { intercept } from "../signals.ts";
import { resetSync } from "../term.ts";

export function setup(): void {
  intercept();
  self.addEventListener("unload", (_e: Event) => {
    showCursorSync();
    //clearScreenSync();
    //goHomeSync();
    resetSync();
  });
}
