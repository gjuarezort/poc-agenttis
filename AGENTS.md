<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Design & Usability Guidelines (Nielsen Heuristics & Modern Trends)

All agents modifying the UI must follow these principles to ensure high usability, visual consistency, and premium aesthetics:

1. **Aesthetic and Minimalist Design (Nielsen Heuristic #8)**
   - **No Redundancy:** Avoid repeating information (e.g., don't create unreadable subheaders that replicate the card's main context).
   - **Hide Inactive Metadata:** If a category, list, or relationship (e.g., linked apps, subagents, data sources) is empty, **hide the section entirely**. Do not clutter the interface with "None" / "Ninguno" placeholders.
   - **High Text Contrast:** All text elements must remain readable. Avoid using ultra-low contrast colors (like dark gray text on a dark background) for labels or metadata.

2. **Card Layout Integrity**
   - **Prevent Clipping/Truncation:** The main item name (header) must occupy its own block-level or full-width space. Do not place status badges directly next to it in a way that trims the item name when it grows.
   - **Top Badges Bar:** Place classification tags and status badges (e.g., "Autopilot", "Role") on their own line above the main title. Use flex-wrapping to handle varying badge sizes gracefully.

3. **Visual Hierarchy & Dividers**
   - **Single-Separator Rule:** Cards should have at most **one** divider line. Usually, this is a bottom separator (`border-t`) before action buttons. Do not slice cards into multiple segments with multiple borders.
   - **Margins & Gaps:** Maintain a consistent vertical rhythm. Use proportional gaps (e.g., `gap-2.5` or `mt-3` / `mb-4`) to group related information instead of drawing lines.
