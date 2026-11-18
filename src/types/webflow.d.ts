/**
 * Webflow boot-queue global. Populated by Webflow's own runtime — the bundle
 * pushes its init into `window.Webflow` and Webflow invokes it after DOMContentLoaded.
 */
interface WebflowQueue extends Array<() => void> {
  push: (callback: () => void) => number;
  /** Webflow's own modules, e.g. `require('lightbox')?.ready()` to rebuild lightbox groups. */
  require?: (module: string) => { ready?: () => void } | undefined;
}

interface Window {
  Webflow?: WebflowQueue;
}
