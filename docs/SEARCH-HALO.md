# Search halo

Latest request: the header is sticky with right-aligned desktop navigation and a translucent white surface, 18px backdrop blur, and a solid-white fallback. The blue halo breathes over a six-second cycle using scale (.96 to 1.06) and opacity (.72 to 1); blur itself stays static. Reduced motion disables the cycle. The pattern remains stationary so it does not distract from typing. Resource anchors leave 128px clear for the header.

Sticky/breathing verification: browser assertions confirm sticky position and top offset after scrolling, backdrop blur, right-aligned desktop navigation, the halo animation, and its reduced-motion override at 1440/390/320px. Header/footer links and the existing control-family browser checks also pass without console/page errors. The footer has its own end snap target so proximity snapping does not prevent reaching its links. Build, lint, and all 16 component tests pass.

Follow-up: the user requested the original headline and supporting text back. Home now displays “Your learning, all in one place.” and its description above the search field, preserving the full-height opening, blue halo, and scroll invitation.

User-requested reference: rounded blue gradient and fine dots behind the search field. The effect marks search as Home's primary action, rather than adding a page-wide background pattern. Existing light HIMTI colors, opaque white input surface, visible focus, and functionality remain intact. CSS-only pseudo-elements have no pointer interaction or accessibility content; no new image or runtime dependency.

Scoped gate: PASS. Build/lint passed; browser checks at 1440/390/320px passed search submission, scroll invitation/reveal/snap, route cleanup, and reduced motion without page/console errors or horizontal overflow. Desktop/mobile screenshots inspected. Halo layers do not cover text or intercept clicks, and the new focus outline stays visible. No unrelated content, asset, or dependency changes.
