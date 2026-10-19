/**
 * Ambient types for the CDN globals the site bundle relies on. These libraries
 * are loaded via <script> CDN tags in Webflow BEFORE this bundle runs, so they
 * exist as globals at runtime (not npm imports). Keep in sync with what the utils
 * actually use — see the `type-sync` skill.
 */

// Minimal GSAP surface used by src/site/utils. Widen as more of the API is used.
declare const gsap: {
  from(targets: unknown, vars: Record<string, unknown>): unknown
  to(targets: unknown, vars: Record<string, unknown>): unknown
  set(targets: unknown, vars: Record<string, unknown>): unknown
  fromTo(targets: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>): unknown
}
declare const ScrollTrigger: { refresh(): void }

// Webflow's push queue (fires after Webflow.js init + DOMContentLoaded).
type WebflowQueue = Array<() => void>
interface Window {
  Webflow?: WebflowQueue
}
