/** Default ScrollTrigger start for [data-reveal] blocks. */
export const DEFAULT_REVEAL_START = 'top 90%'

/**
 * Parses data-reveal-start: a viewport percentage from the top (60 gives
 * `top 60%`). Missing, blank, non-numeric or out-of-range (below 0, above
 * 100) values fall back to the default.
 */
export const parseRevealStart = (raw: string | undefined | null): string => {
  if (raw == null || raw.trim() === '') return DEFAULT_REVEAL_START
  const percent = Number(raw)
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) return DEFAULT_REVEAL_START
  return `top ${percent}%`
}
