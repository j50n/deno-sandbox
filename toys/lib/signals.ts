/**
 * Intercept OS signals and make them a normal exit.
 *
 * This ensures that unload events are called reliably on most signals
 * that terminate the process. SIGKILL cannot be intercepted.
 */
export function intercept(): void {
  Deno.addSignalListener("SIGINT", () => Deno.exit(130));
  Deno.addSignalListener("SIGTERM", () => Deno.exit(133));
  Deno.addSignalListener("SIGQUIT", () => Deno.exit(134));
  Deno.addSignalListener("SIGHUP", () => Deno.exit(135));
}
