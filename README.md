# RR jump to chapter content

A [userscript](https://en.wikipedia.org/wiki/Userscript) that automatically scrolls past the author's note and advertisement to the start of the chapter text on [RoyalRoad](https://www.royalroad.com).

When you open a chapter, the script scrolls the chapter content to the top of the window (with a small gap), skipping the author's note and ad that sit above it. If you arrive via a comment notification link (a URL ending in `?comment=<id>`), the script stays out of the way so the browser scrolls to the comment instead.

## Install

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Firefox, Safari)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Edge, Firefox)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
2. Open [`royalroad-jump-to-content.user.js`](royalroad-jump-to-content.user.js) and click **Raw**, or copy the file's contents into a new script in your userscript manager.
3. The script runs automatically on chapter pages:
   - `https://www.royalroad.com/fiction/*/*/chapter/*`
   - `https://royalroad.com/fiction/*/*/chapter/*`

## Configuration

The settings at the top of the script can be adjusted:

| Setting | Default | Purpose |
| --- | --- | --- |
| `CONTENT_SELECTOR` | `.chapter-inner.chapter-content` | The container holding the chapter text |
| `OFFSET_PX` | `16` | Gap left above the first line of text |
| `STABILIZE_MS` | `1500` | How long to keep correcting the position while ads/images load |
| `POLL_MS` | `120` | How often to check/correct the position |

## License

MIT
