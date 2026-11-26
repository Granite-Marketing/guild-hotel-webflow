import test from 'node:test'
import assert from 'node:assert/strict'
import { parseVideoUrl } from '../../src/utils/embedVideo.ts'

// V1 (#428): editors paste Dropbox links exactly as Dropbox gives them; the
// reader turns each into the direct file on dl.dropboxusercontent.com.
const DIRECT = 'https://dl.dropboxusercontent.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2'

const dropboxCases = [
  ['the sample share link (dl=0, st)', 'https://www.dropbox.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2&st=lznctb23&dl=0', DIRECT],
  ['a share link with dl=1', 'https://www.dropbox.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2&dl=1', DIRECT],
  ['a share link with raw=1', 'https://www.dropbox.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2&raw=1', DIRECT],
  ['a share link without www', 'https://dropbox.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2&dl=0', DIRECT],
  ['a share link with spaces around it', '  https://www.dropbox.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2&dl=0 ', DIRECT],
  ['an old /s/ link', 'https://www.dropbox.com/s/abc123xyz/lobby-loop.mp4?dl=0', 'https://dl.dropboxusercontent.com/s/abc123xyz/lobby-loop.mp4'],
  ['a dl.dropbox.com link', 'https://dl.dropbox.com/s/abc123xyz/lobby-loop.mp4?dl=1', 'https://dl.dropboxusercontent.com/s/abc123xyz/lobby-loop.mp4'],
  ['a direct dl.dropboxusercontent.com link', DIRECT, DIRECT],
  ['a direct link carrying dl and st', `${DIRECT}&st=lznctb23&dl=0`, DIRECT],
]

for (const [name, link, expected] of dropboxCases) {
  test(`Dropbox: ${name} becomes the direct file link`, () => {
    assert.deepEqual(parseVideoUrl(link), { kind: 'file', url: expected })
  })
}

test('Dropbox: rlkey is kept and dl, raw and st are dropped', () => {
  const source = parseVideoUrl('https://www.dropbox.com/scl/fi/abc/clip.mov?raw=1&rlkey=key123&st=tok&dl=0')
  const url = new URL(source.url)
  assert.equal(url.hostname, 'dl.dropboxusercontent.com')
  assert.equal(url.searchParams.get('rlkey'), 'key123')
  for (const dropped of ['dl', 'raw', 'st']) assert.equal(url.searchParams.has(dropped), false, dropped)
})

// MUTATION: a host check like `host.endsWith('dropbox.com')` would rewrite
// this look-alike domain; it must stay a plain file link, untouched.
test('a look-alike domain is not treated as Dropbox', () => {
  const link = 'https://notdropbox.com/s/abc/clip.mp4?dl=0'
  assert.deepEqual(parseVideoUrl(link), { kind: 'file', url: link })
})

// Unchanged behaviour: these are the values the reader returned before V1.
const unchangedCases = [
  ['YouTube watch', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', { kind: 'youtube', id: 'dQw4w9WgXcQ' }],
  ['youtu.be', 'https://youtu.be/dQw4w9WgXcQ', { kind: 'youtube', id: 'dQw4w9WgXcQ' }],
  ['YouTube shorts', 'https://youtube.com/shorts/dQw4w9WgXcQ', { kind: 'youtube', id: 'dQw4w9WgXcQ' }],
  ['YouTube embed', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', { kind: 'youtube', id: 'dQw4w9WgXcQ' }],
  ['Vimeo', 'https://vimeo.com/123456789', { kind: 'vimeo', id: '123456789', hash: undefined }],
  ['unlisted Vimeo', 'https://vimeo.com/123456789/abcdef1234', { kind: 'vimeo', id: '123456789', hash: 'abcdef1234' }],
  ['Vimeo player', 'https://player.vimeo.com/video/123456789?h=abcdef1234', { kind: 'vimeo', id: '123456789', hash: 'abcdef1234' }],
  ['an mp4 file', 'https://cdn.example.com/media/loop.mp4', { kind: 'file', url: 'https://cdn.example.com/media/loop.mp4' }],
  ['a file with a query', 'https://cdn.example.com/media/loop.webm?dl=1&st=keep', { kind: 'file', url: 'https://cdn.example.com/media/loop.webm?dl=1&st=keep' }],
]

for (const [name, link, expected] of unchangedCases) {
  test(`unchanged: ${name}`, () => {
    assert.deepEqual(parseVideoUrl(link), expected)
  })
}

test('blank and broken links give no video', () => {
  for (const link of ['', '   ', 'not a link', 'https://www.youtube.com/']) {
    assert.equal(parseVideoUrl(link), null, JSON.stringify(link))
  }
})
