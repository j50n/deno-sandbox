/**
 * Intercept OS signals and make them a normal exit.
 * 
 * This ensures that unload events are called reliably on most signals
 * that terminate the process.
 */
export function interceptSignals(): void {
    Deno.signal("SIGINT").then(() => {
        Deno.exit(130);
    });
    
    Deno.signal("SIGTERM").then(() => {
        Deno.exit(133);
    });
    
    Deno.signal("SIGQUIT").then(() => {
        Deno.exit(134);
    });
    
    Deno.signal("SIGHUP").then(() => {
        Deno.exit(135);
    });
}