# "And Much More" Features Design
**Date:** 2026-03-24
**Project:** Xcode Neo Landing Page
**Scope:** Replace and refine feature items in the "And much more" grid section

---

## Overview

The "And much more" section of the Xcode Neo landing page showcases six key developer features. This design document specifies the final titles and copy for these features, replacing the current nine-item grid with six focused, high-impact items.

---

## Design Rationale

**Approach:** Action-Focused with Benefit-Driven Subtitles

Each feature follows a consistent pattern:
- **Title:** 1-3 words, clear and scannable
- **Subtitle:** Leads with user benefit, emphasizes speed/control/collaboration
- **Tone:** Matches hero section copy ("Bring your own AI," "Your flow, your opinion")
- **Positioning:** All six features treated as equally important

This approach makes each feature feel like it solves a specific workflow problem, with emphasis on keeping developers in their flow and enabling AI collaboration.

---

## Features

### 1. Project Info
**Subtitle:** "Update app versions and build numbers without context switching"

**Purpose:** Quick access to project metadata management
**Benefit:** Developers can update critical version info instantly without leaving the app
**Aligns with:** Productivity, reduced friction

### 2. Scheme Editor
**Subtitle:** "Configure build schemes without the complexity"

**Purpose:** Intuitive interface for managing build schemes
**Benefit:** Build schemes made accessible and manageable visually
**Aligns with:** Control, clarity, reduced cognitive load

### 3. Git Integration
**Subtitle:** "Commit, branch, and collaborate—all without leaving the app"

**Purpose:** Built-in version control workflows
**Benefit:** Seamless Git operations without context switching
**Aligns with:** Flow state, integrated workflows

### 4. Organizer
**Subtitle:** "Archive your builds, organize your releases in one place"

**Purpose:** Centralized management of app archives and releases
**Benefit:** All builds and archives in one searchable, organized location
**Aligns with:** Organization, release readiness

### 5. Simulators
**Subtitle:** "Launch iOS and macOS simulators in seconds, control from one place"

**Purpose:** Unified simulator management interface
**Benefit:** Quick access to any simulator without Apple's complicated menu system
**Aligns with:** Speed, simplicity, multi-platform support

### 6. Tests
**Subtitle:** "You and your AI see every test result. Debug and iterate together in real time"

**Purpose:** Run and monitor unit and UI tests with AI visibility
**Benefit:** Collaborative debugging with AI agents in the development loop
**Aligns with:** AI-first development, collaboration, real-time feedback

---

## Implementation Notes

- Features will replace the current nine-item grid (lines 193-230 in index.html)
- Each item uses `.feature-item` class structure:
  - `.feature-item-title` for the feature name
  - `.feature-item-text` for the subtitle
- Grid maintains existing CSS layout (3x2 on desktop)
- No design changes to layout, only content replacement

---

## Success Criteria

✓ All six titles are punchy and scannable
✓ Subtitles emphasize user benefits, not features
✓ Tone matches existing hero section copy
✓ AI collaboration is highlighted (especially in Tests)
✓ No context switching language pervades the copy
✓ All six features feel equally important
