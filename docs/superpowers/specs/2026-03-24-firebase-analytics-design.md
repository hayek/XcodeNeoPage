# Firebase Analytics Integration Design

**Date**: 2026-03-24
**Project**: XcodeNeoPage
**Feature**: Firebase Analytics event tracking for user interactions

---

## Overview

Add Firebase Analytics to the XcodeNeoPage landing page to track user interactions including tab navigation, download button clicks, FAQ interactions, external link clicks, theme preferences, and initial page load theme state.

---

## Architecture

### File Structure
```
XcodeNeoPage/
├── index.html (modified - import analytics.js)
├── script.js (modified - call analytics functions)
├── analytics.js (new - Firebase init + event functions)
├── styles.css (unchanged)
└── docs/superpowers/specs/2026-03-24-firebase-analytics-design.md
```

### Initialization Flow
1. `index.html` loads both analytics.js and script.js as module scripts
2. `analytics.js` initializes Firebase app and analytics, exports event logging functions
3. `script.js` imports analytics functions and sets up event listeners
4. `script.js` calls `logPageLoad()` at the end (after all theme setup is complete)
5. All interactions trigger corresponding analytics function calls

---

## Events Specification

### 1. Tab Navigation
**Event Name**: `tab_clicked`

| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `tab_name` | string | "ai", "timeline", "miniview" | "ai" |

**Trigger**: User clicks on a feature tab button
**Location**: Feature tabs section (lines 85-88, HTML)
**Implementation**: Call `logTabClick(tabName)` in tab click handler

---

### 2. Download Button Clicks
**Event Name**: `download_clicked`

| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `location` | string | "navbar", "cta", "footer" (if added) | "navbar" |

**Trigger**: User clicks any download button
**Locations**:
- Navbar download button (line 43)
- CTA section download button (line 261)
- Any future download buttons

**Implementation**: Call `logDownloadClick(location)` with appropriate location identifier

---

### 3. FAQ Interactions
**Event Name**: `faq_opened` / `faq_closed`

| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `faq_index` | number | 0-4 (position in FAQ list) | 2 |

**Trigger**: User opens or closes FAQ accordion item
**Location**: FAQ section (lines 274-346, HTML)
**Implementation**: Call `logFAQInteraction(index, 'opened')` / `logFAQInteraction(index, 'closed')`

---

### 4. External Link Clicks
**Event Name**: `external_link_clicked`

| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `link_type` | string | "app_card", "github", "linkedin", "email", "navbar_link" | "github" |

**Trigger**: User clicks external links
**Locations**:
- App showcase cards (lines 228-251)
- Author GitHub link (line 360)
- Author LinkedIn link (line 363)
- Author email link (line 366)
- Navbar feature/FAQ links (lines 40-41)

**Implementation**: Call `logExternalLinkClick(linkType)` on link click

---

### 5. Theme Changes
**Event Name**: `theme_changed`

| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `theme` | string | "light", "dark", "system" | "dark" |

**Trigger**: User clicks a theme button
**Location**: Footer theme switcher (lines 380-406)
**Implementation**: Call `logThemeChange(theme)` in theme button click handler

---

### 6. Page Load
**Event Name**: `page_load`

| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `theme_on_load` | string | "light", "dark", "system" | "system" |

**Trigger**: Page loads and all initialization is complete
**Implementation**: `script.js` calls `logPageLoad()` at the end of the script, after all theme setup is finished
**Timing**: Must be called after theme application to capture the actual theme state

---

## Implementation Plan

### analytics.js
```javascript
// Firebase configuration (provided by user)
// Initialize Firebase app and getAnalytics
// Export functions:
// - logTabClick(tabName)
// - logDownloadClick(location)
// - logFAQInteraction(faqIndex, action)
// - logExternalLinkClick(linkType)
// - logThemeChange(theme)
// - logPageLoad()
// Note: logPageLoad() is called from script.js at end of initialization to ensure theme is applied
```

### script.js Changes
- Tab click handler: add `logTabClick(tab.dataset.feature)`
- Download buttons: add `logDownloadClick(location)` on click
- FAQ items: add `logFAQInteraction(index, action)` on open/close
- Theme buttons: add `logThemeChange(theme)` call
- External links: add `logExternalLinkClick(linkType)` on click

### index.html Changes
- Add `<script src="analytics.js"></script>` after Firebase scripts, before `script.js`

---

## Error Handling

- Firebase initialization errors: logged to console, non-blocking
- Event logging failures: silent (don't disrupt user experience)
- Missing parameters: use sensible defaults or skip logging

---

## Testing Considerations

- Verify events appear in Firebase Console within seconds
- Test each event type manually in the browser
- Confirm page_load event fires with correct theme on initial load
- Verify theme_changed event updates correctly when switching themes
- Confirm tab_clicked includes correct tab identifiers

---

## Future Enhancements

- Track scroll depth (% of page viewed)
- Track time spent per tab
- Track download button interaction rate vs actual downloads
- Add user engagement metrics

---

## Success Criteria

✅ All 6 event types implemented and firing
✅ Events visible in Firebase Console
✅ No console errors or warnings
✅ Analytics doesn't impact page load or performance
✅ All event parameters match specification
