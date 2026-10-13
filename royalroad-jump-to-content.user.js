// ==UserScript==
// @name         RR Jump to Chapter Content
// @namespace    https://github.com/jake9000/rr-jump-to-chapter-content
// @version      1.1.0
// @description  Automatically scroll past the author's note and advertisement to the start of the chapter text on RoyalRoad. When arriving via a comment notification link (a URL ending in ?comment=<id>), it leaves the scroll position alone.
// @author       jake9000
// @license      MIT
// @match        https://www.royalroad.com/fiction/*/*/chapter/*
// @match        https://royalroad.com/fiction/*/*/chapter/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------------------------------------------------
    // Settings
    // ---------------------------------------------------------------------

    // The chapter's actual text lives inside this container (server-rendered).
    // The author's note (.author-note-portlet) and the advertisement render
    // just above it, so scrolling this element to the top skips both.
    const CONTENT_SELECTOR = '.chapter-inner.chapter-content';

    // Gap (px) left above the first line so the text isn't flush against
    // the very top edge of the window.
    const OFFSET_PX = 16;

    // How long (ms) to keep re-correcting the position after the first jump,
    // in case the ad/images finish loading and shift the layout downward.
    const STABILIZE_MS = 1500;

    // Poll interval (ms) while waiting for the content or correcting position.
    const POLL_MS = 120;

    // ---------------------------------------------------------------------

    // Skip the auto-jump when arriving from a comment notification
    // (e.g. https://...chapter/...?comment=23108599) so the browser can
    // scroll to the comment instead of the start of the chapter.
    const isCommentDeepLink = new URLSearchParams(window.location.search).has('comment');

    let userInteracted = false;

    // Stop auto-scrolling the moment the reader takes over.
    for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown']) {
        window.addEventListener(
            type,
            () => { userInteracted = true; },
            { passive: true, once: true }
        );
    }

    function getContentTop() {
        const el = document.querySelector(CONTENT_SELECTOR);
        if (!el) return null;
        return el.getBoundingClientRect().top + window.scrollY - OFFSET_PX;
    }

    function scrollToTop(top) {
        try {
            // 'instant' bypasses any CSS `scroll-behavior: smooth` on the page.
            window.scrollTo({ top, behavior: 'instant' });
        } catch (e) {
            window.scrollTo(0, top);
        }
    }

    function run() {
        if (isCommentDeepLink) return;

        const deadline = performance.now() + STABILIZE_MS;
        let settled = false;

        const tick = () => {
            if (userInteracted || settled) return;

            const top = getContentTop();
            if (top === null) {
                // Content not in the DOM yet — keep waiting.
                setTimeout(tick, POLL_MS);
                return;
            }

            scrollToTop(Math.max(0, top));

            // Keep correcting until the stabilization window elapses.
            if (performance.now() >= deadline) {
                settled = true;
            } else {
                setTimeout(tick, POLL_MS);
            }
        };

        tick();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        run();
    }
})();
