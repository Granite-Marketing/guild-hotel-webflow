const { setTimeout } = require('node:timers/promises')
const { appendFileSync, mkdirSync } = require('node:fs')
const { dirname } = require('node:path')

const ALLOWED_HOSTS = ['api.figma.com']

// A Retry-After longer than this means the quota window is locked (Figma has
// returned waits of several days). Never sleep through it: stop and report.
const MAX_RETRY_AFTER_SECONDS = 60

class FigmaClient {
  // opts.ledgerPath: append one JSON line per request (time, endpoint, status, bytes)
  // opts.sleep: injectable wait (ms) for tests; defaults to timers/promises setTimeout
  // opts.maxRetryAfterSeconds: abort threshold for Retry-After (default 60)
  constructor (token, opts = {}) {
    this.token = token || process.env.FIGMA_API_TOKEN
    if (!this.token) {
      throw new Error(
        'FIGMA_API_TOKEN is required. Generate one at https://www.figma.com/developers/api#access-tokens'
      )
    }
    this.baseUrl = 'https://api.figma.com/v1'
    this.maxRetries = 5
    this.maxRetryAfterSeconds = opts.maxRetryAfterSeconds ?? MAX_RETRY_AFTER_SECONDS
    this.sleep = opts.sleep || (ms => setTimeout(ms))
    this.ledgerPath = opts.ledgerPath || null
    this.calls = []
    this._lastTierInfo = null
  }

  setLedgerPath (ledgerPath) {
    this.ledgerPath = ledgerPath || null
  }

  _record (url, status, bytes) {
    const { pathname, search } = new URL(url)
    const entry = { at: new Date().toISOString(), endpoint: `${pathname}${search}`, status, bytes }
    this.calls.push(entry)
    if (this.ledgerPath) {
      mkdirSync(dirname(this.ledgerPath), { recursive: true })
      appendFileSync(this.ledgerPath, JSON.stringify(entry) + '\n')
    }
    return entry
  }

  _logTierHeaders (res) {
    const planTier = res.headers.get('x-figma-plan-tier')
    const limitType = res.headers.get('x-figma-rate-limit-type')
    if (!planTier && !limitType) return
    const info = `plan tier: ${planTier || 'n/a'}, rate limit type: ${limitType || 'n/a'}`
    if (info === this._lastTierInfo && res.status !== 429) return
    this._lastTierInfo = info
    console.error(`[figma] ${info}`)
  }

  // opts.raw: resolve with the response body text instead of parsed JSON
  async _request (path, requestOpts = {}) {
    const { raw, ...opts } = requestOpts
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`
    // Guard: only send token to Figma API domains
    const host = new URL(url).hostname
    if (!ALLOWED_HOSTS.includes(host)) {
      throw new Error(`Refusing to send auth token to non-Figma URL: ${url}`)
    }
    let lastError

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      let res
      try {
        res = await fetch(url, {
          ...opts,
          headers: {
            'X-Figma-Token': this.token,
            ...opts.headers
          }
        })
      } catch (err) {
        this._record(url, 'network-error', 0)
        throw err
      }

      this._logTierHeaders(res)
      const body = await res.text()
      this._record(url, res.status, Buffer.byteLength(body))

      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('retry-after'))
        if (Number.isFinite(retryAfter) && retryAfter > this.maxRetryAfterSeconds) {
          const hours = (retryAfter / 3600).toFixed(1)
          throw new Error(
            `Figma rate limit: retry-after is ${retryAfter}s (about ${hours} hours). ` +
            'Stopping instead of waiting. Do not retry; the quota window is locked.'
          )
        }
        if (attempt < this.maxRetries) {
          const delay = Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : Math.pow(2, attempt) * 1000 + Math.random() * 1000
          console.error(`[figma] rate limited, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${this.maxRetries})`)
          await this.sleep(delay)
          continue
        }
      }

      if (res.status === 401) {
        throw new Error(
          'Figma token expired or invalid. Generate a new one at https://www.figma.com/developers/api#access-tokens'
        )
      }

      if (!res.ok) {
        lastError = new Error(`Figma API ${res.status}: ${body.slice(0, 500)}`)
        if (attempt < this.maxRetries && res.status >= 500) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000
          console.error(`[figma] server error, retrying in ${Math.round(delay)}ms`)
          await this.sleep(delay)
          continue
        }
        throw lastError
      }

      return raw ? body : JSON.parse(body)
    }

    throw lastError || new Error('Max retries exceeded')
  }

  // Full file JSON. No depth by default, so the whole tree comes back.
  // opts.raw returns the verbatim body text (for caching to disk).
  async getFile (fileKey, opts = {}) {
    const params = new URLSearchParams()
    if (opts.depth) params.set('depth', String(opts.depth))
    if (opts.ids?.length) params.set('ids', opts.ids.join(','))
    if (opts.geometry) params.set('geometry', opts.geometry)
    const qs = params.toString()
    return this._request(`/files/${fileKey}${qs ? `?${qs}` : ''}`, { raw: opts.raw })
  }

  // Cheap change check: name, version, lastModified and the top-level pages only.
  async getFileMeta (fileKey) {
    return this.getFile(fileKey, { depth: 1 })
  }

  async getFileNodes (fileKey, nodeIds, opts = {}) {
    const params = new URLSearchParams()
    if (nodeIds?.length) params.set('ids', nodeIds.join(','))
    if (opts.depth) params.set('depth', String(opts.depth))
    const qs = params.toString()
    return this._request(`/files/${fileKey}/nodes${qs ? `?${qs}` : ''}`)
  }

  async getImageFills (fileKey) {
    return this._request(`/files/${fileKey}/images`)
  }

  async exportImages (fileKey, nodeIds, format = 'png', opts = {}) {
    const params = new URLSearchParams({
      ids: nodeIds.join(','),
      format
    })
    if (opts.scale) params.set('scale', String(opts.scale))
    if (opts.svgOutlineText) params.set('svg_outline_text', 'true')
    if (opts.svgIncludeId) params.set('svg_include_id', 'true')
    if (opts.contentsOnly) params.set('contents_only', 'true')
    return this._request(`/images/${fileKey}?${params.toString()}`)
  }
}

module.exports = { FigmaClient, MAX_RETRY_AFTER_SECONDS }
