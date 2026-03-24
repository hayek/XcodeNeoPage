# Firebase Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Firebase Analytics event tracking for tab navigation, download clicks, FAQ interactions, external links, theme changes, and page load theme state.

**Architecture:** Create a new `analytics.js` module using ES6 imports to initialize Firebase and export event logging functions. Integrate analytics calls into existing event handlers in `script.js` and add the module to `index.html`. No breaking changes to existing functionality.

**Tech Stack:** Firebase Analytics Web SDK (v12.11.0), ES6 modules, vanilla JavaScript

---

## File Structure

**New Files:**
- `analytics.js` - Firebase initialization + 6 event logging functions

**Modified Files:**
- `index.html` - Add Firebase SDK scripts and import analytics.js
- `script.js` - Call analytics functions at interaction points (5 integration points)

---

## Implementation Tasks

### Task 1: Create analytics.js with Firebase initialization

**Files:**
- Create: `analytics.js`

- [ ] **Step 1: Write analytics.js with Firebase initialization and helper functions**

```javascript
// Firebase Analytics Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxZfe9wddSwZkml8eg9qtyjPXQK-CXpMs",
  authDomain: "xcodeneopage.firebaseapp.com",
  projectId: "xcodeneopage",
  storageBucket: "xcodeneopage.firebasestorage.app",
  messagingSenderId: "329106470698",
  appId: "1:329106470698:web:4f8c9e0ecf2c23821f9053",
  measurementId: "G-V872QNBT5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Event logging functions
export function logTabClick(tabName) {
  logEvent(analytics, 'tab_clicked', {
    tab_name: tabName
  });
}

export function logDownloadClick(location) {
  logEvent(analytics, 'download_clicked', {
    location: location
  });
}

export function logFAQInteraction(faqIndex, action) {
  logEvent(analytics, action === 'opened' ? 'faq_opened' : 'faq_closed', {
    faq_index: faqIndex
  });
}

export function logExternalLinkClick(linkType) {
  logEvent(analytics, 'external_link_clicked', {
    link_type: linkType
  });
}

export function logThemeChange(theme) {
  logEvent(analytics, 'theme_changed', {
    theme: theme
  });
}

export function logPageLoad() {
  const currentTheme = localStorage.getItem('theme') || 'system';
  logEvent(analytics, 'page_load', {
    theme_on_load: currentTheme
  });
}
```

- [ ] **Step 2: Verify analytics.js is created in project root**

Run: `ls -la analytics.js`
Expected: File exists

- [ ] **Step 3: Commit the new analytics module**

```bash
git add analytics.js
git commit -m "feat: add Firebase analytics module with event logging functions"
```

---

### Task 2: Update index.html to include Firebase scripts and analytics module

**Files:**
- Modify: `index.html:410`

- [ ] **Step 1: Add analytics.js and convert script.js to module**

In `index.html`, replace line 410:
```html
    <script src="script.js"></script>
```

With:
```html
    <script type="module" src="analytics.js"></script>
    <script type="module" src="script.js"></script>
```

**Note**: Both scripts must be module scripts so that script.js can import functions from analytics.js. The Firebase SDK initialization is handled by analytics.js itself.

- [ ] **Step 2: Verify index.html updated correctly**

Run: `grep -n "analytics.js" index.html`
Expected: Line shows `<script type="module" src="analytics.js"></script>`

- [ ] **Step 3: Commit HTML changes**

```bash
git add index.html
git commit -m "feat: add Firebase scripts and analytics module import to HTML"
```

---

### Task 3: Integrate tab click analytics into script.js

**Files:**
- Modify: `script.js:120-126`

- [ ] **Step 1: Import analytics functions at top of script.js**

Add to the top of `script.js` (after line 1):
```javascript
import { logTabClick, logDownloadClick, logFAQInteraction, logExternalLinkClick, logThemeChange, logPageLoad } from './analytics.js';
```

(All imports added at once to avoid multiple modifications)

- [ ] **Step 2: Add analytics call to tab click handler**

In the tab click event listener (lines 120-126), modify to:
```javascript
featureTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        userInteracted = true;
        stopAutoRotate();
        const feature = tab.dataset.feature;
        logTabClick(feature);  // Add this line
        switchTab(tab);
    });
});
```

- [ ] **Step 3: Verify changes in script.js**

Run: `grep -A 6 "featureTabs.forEach(tab =>" script.js`
Expected: Shows logTabClick call within the event listener

- [ ] **Step 4: Commit tab analytics**

```bash
git add script.js
git commit -m "feat: add analytics tracking for feature tab clicks"
```

---

### Task 4: Integrate download button analytics into script.js

**Files:**
- Modify: `script.js` (add new code after existing code)

- [ ] **Step 1: Add event listeners for download buttons**

Add this code at the end of `script.js` (after line 196):
```javascript
// Analytics: Download button clicks
const downloadButtons = document.querySelectorAll('[href*="releases/download"]');
downloadButtons.forEach((button, index) => {
    let location = 'unknown';
    if (button.closest('.navbar')) {
        location = 'navbar';
    } else if (button.closest('.cta-section')) {
        location = 'cta';
    }

    button.addEventListener('click', () => {
        logDownloadClick(location);
    });
});
```

- [ ] **Step 2: Verify download tracking code added**

Run: `grep -n "logDownloadClick" script.js`
Expected: Shows event listener code with logDownloadClick calls

- [ ] **Step 3: Commit download analytics**

```bash
git add script.js
git commit -m "feat: add analytics tracking for download button clicks"
```

---

### Task 5: Integrate FAQ interaction analytics into script.js

**Files:**
- Modify: `script.js:170-185`

- [ ] **Step 1: Modify FAQ interaction handler**

Replace the FAQ event listener section (lines 170-185) with:
```javascript
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item, index) => {
    const summary = item.querySelector('summary');

    summary.addEventListener('click', (e) => {
        if (item.open) {
            e.preventDefault();
            logFAQInteraction(index, 'closed');  // Add this line
            item.classList.add('closing');

            setTimeout(() => {
                item.open = false;
                item.classList.remove('closing');
            }, TIMINGS.FAQ_CLOSE_ANIMATION);
        } else {
            logFAQInteraction(index, 'opened');  // Add this line
        }
    });
});
```

- [ ] **Step 2: Verify FAQ tracking integrated**

Run: `grep -n "logFAQInteraction" script.js`
Expected: Shows 2 usage lines (opened and closed)

- [ ] **Step 3: Commit FAQ analytics**

```bash
git add script.js
git commit -m "feat: add analytics tracking for FAQ open/close interactions"
```

---

### Task 6: Integrate external link and theme change analytics into script.js

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add analytics to theme button clicks**

Modify the theme button event listener (lines 32-36) to:
```javascript
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        logThemeChange(theme);  // Add this line
        applyTheme(theme);
    });
});
```

- [ ] **Step 2: Add event listeners for external links**

Add this code at the end of `script.js`:
```javascript
// Analytics: External link clicks
const externalLinks = {
    '.app-card-link': 'app_card',
    'a[href*="github.com"]': 'github',
    'a[href*="linkedin.com"]': 'linkedin',
    'a[href*="mailto:"]': 'email'
};

Object.entries(externalLinks).forEach(([selector, linkType]) => {
    document.querySelectorAll(selector).forEach(link => {
        link.addEventListener('click', () => {
            logExternalLinkClick(linkType);
        });
    });
});
```

**Note**: Navbar links are internal anchors (#projects-card, #faq), not external links, so they are not tracked here.

- [ ] **Step 3: Add page load event at end of script.js**

Add to the very end of `script.js` (after all other code):
```javascript
// Analytics: Log page load with current theme
logPageLoad();
```

This ensures the theme has been fully applied before logging the event.

- [ ] **Step 4: Verify all imports and calls**

Run: `grep -n "import.*from './analytics.js'" script.js`
Expected: Shows complete import with all 6 functions (including logPageLoad)

- [ ] **Step 5: Commit theme and external link analytics**

```bash
git add script.js
git commit -m "feat: add analytics tracking for theme changes and external link clicks"
```

---

### Task 7: Test all analytics events in browser and Firebase Console

**Files:**
- Test: Manual testing in browser + Firebase Console verification

- [ ] **Step 1: Open page in browser**

Run: Open `index.html` in a web browser (or serve locally if needed)
Expected: Page loads without console errors

- [ ] **Step 2: Check browser console for Firebase errors**

Open DevTools (F12) → Console tab
Expected: No red errors (Firebase SDK loading warnings are OK)

- [ ] **Step 3: Test tab click events**

- Click "Timeline" tab
- Click "Mini View" tab
- Click back to "Use your own AI" tab
Expected: No console errors during clicks

- [ ] **Step 4: Test download button clicks**

- Click navbar Download button
- Click CTA section Download button
Expected: No console errors

- [ ] **Step 5: Test FAQ interactions**

- Click first FAQ item to open
- Click to close it
- Open a different FAQ item
Expected: No console errors

- [ ] **Step 6: Test theme switching**

- Click Light mode button
- Click Dark mode button
- Click System preference button
Expected: Theme changes apply, no console errors

- [ ] **Step 7: Test external links**

- Hover over app showcase cards (don't click, or open in new tab to avoid navigation)
- Check console for any pre-click events
Expected: No errors

- [ ] **Step 8: Verify events in Firebase Console**

Go to: https://console.firebase.google.com/project/xcodeneopage/analytics/app/web/overview
Expected: Events appear within 2-5 seconds after triggering them (real-time debug view)

- [ ] **Step 9: Create final verification checklist**

Verify in Firebase Console:
- ✅ `page_load` event fired with `theme_on_load` parameter
- ✅ `tab_clicked` events show correct tab names
- ✅ `download_clicked` events show correct locations (navbar, cta)
- ✅ `faq_opened` and `faq_closed` events with correct faq_index
- ✅ `external_link_clicked` events with correct link_type
- ✅ `theme_changed` events with correct theme value

---

### Task 8: Final verification and cleanup commit

**Files:**
- Verify: All changes committed

- [ ] **Step 1: Check git status**

Run: `git status`
Expected: `working tree clean`

- [ ] **Step 2: Review git log for new commits**

Run: `git log --oneline -6`
Expected: Shows 6 new commits for analytics feature

- [ ] **Step 3: Final verification**

Run: `grep -c "logEvent" analytics.js`
Expected: Shows 6 (one per event function)

- [ ] **Step 4: Final commit message summary**

All analytics features are now fully integrated:
- Firebase initialized with ES6 module imports
- 6 event types tracked (tabs, downloads, FAQ, external links, theme, page load)
- All event parameters match specification
- No breaking changes to existing functionality

---

## Testing Strategy

- **Manual testing**: Click through all interactive elements in the browser
- **Firebase Console verification**: Check real-time debug view for events
- **Parameter validation**: Confirm each event includes correct parameters
- **Performance**: Verify page load time not significantly impacted

## Rollback Plan

If issues arise, each task commits independently, allowing easy revert:
```bash
git revert [commit-hash]
```

---

## Success Criteria

✅ All 6 event types implemented
✅ Events visible in Firebase Console with correct parameters
✅ No console errors or warnings
✅ Analytics module loads before script.js
✅ All interaction tracking working
✅ Page load theme tracking functional
✅ No breaking changes to existing features
