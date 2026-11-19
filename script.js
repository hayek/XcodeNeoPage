// Apps row: repeat the cards once and loop the track by one set, at a steady speed whatever
// the number of apps. Runs before the analytics wiring below so the copies are tracked too.
const appsMarquee = document.querySelector('.apps-marquee');
if (appsMarquee && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const track = appsMarquee.querySelector('.apps-marquee-track');
    [...track.children].forEach(card => {
        const copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.setAttribute('tabindex', '-1');
        track.appendChild(copy);
    });
    const PIXELS_PER_SECOND = 40;
    const setDuration = () => {
        track.style.setProperty('--marquee-duration', `${track.scrollWidth / 2 / PIXELS_PER_SECOND}s`);
    };
    setDuration();
    window.addEventListener('resize', setDuration);
    appsMarquee.classList.add('is-looping');
}

// Analytics - Use global Analytics object (defined in analytics.js)
// Works with both local file:// and HTTP/HTTPS
const logTabClick = (name) => window.Analytics.logTabClick(name);
const logDownloadClick = (loc) => window.Analytics.logDownloadClick(loc);
const logFAQInteraction = (idx, action) => window.Analytics.logFAQInteraction(idx, action);
const logExternalLinkClick = (type) => window.Analytics.logExternalLinkClick(type);
const logThemeChange = (theme) => window.Analytics.logThemeChange(theme);
const logPageLoad = () => window.Analytics.logPageLoad();

// Theme Switcher
const themeButtons = document.querySelectorAll('.theme-button');
const html = document.documentElement;

const TIMINGS = {
    FADE_TRANSITION: 300,
    AUTO_ROTATE_INTERVAL: 8000,
    VIDEO_LOOP_DELAY: 3000,
    FAQ_CLOSE_ANIMATION: 300
};

const savedTheme = localStorage.getItem('theme') || 'system';

function applyTheme(theme) {
    html.classList.remove('light-theme', 'dark-theme');

    if (theme === 'light') {
        html.classList.add('light-theme');
    } else if (theme === 'dark') {
        html.classList.add('dark-theme');
    }

    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    localStorage.setItem('theme', theme);
}

applyTheme(savedTheme);

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        logThemeChange(theme);  // Add this line
        applyTheme(theme);
    });
});

const navbar = document.querySelector('.navbar');
let navbarVisibleState = false;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeVisible = scrollTop > 200;

    if (shouldBeVisible !== navbarVisibleState) {
        navbarVisibleState = shouldBeVisible;
        navbar.classList.toggle('visible', shouldBeVisible);
    }
});

const featureTabs = document.querySelectorAll('.feature-tab');
const featureDescriptionText = document.querySelector('.feature-description-text');
const screenshotImages = document.querySelectorAll('.screenshot-image');
const tabsContainer = document.querySelector('.feature-tabs');
let autoRotateInterval = null;
let userInteracted = false;

const featureContent = {
    ai: {
        title: 'Bring your own AI',
        description: 'Connect Claude, your custom models, or any AI agent directly to your projects through the Zcode Skill. Each project gets dedicated terminal tabs that auto-label from your commands. Let AI agents build, test, and run alongside you.'
    },
    timeline: {
        title: 'See your story unfold',
        description: 'Every build, test, and run lives in a beautiful chronological timeline you can search, filter, and inspect. Your entire development history persists — jump back to any moment to see exactly what happened and why.'
    },
    miniview: {
        title: 'Use your favorite IDE',
        description: 'Love VSCode? Cursor? or are you a vim person? The mini view is a floating window that lives above your favorite IDE. Build, run, stop, or test without context switching. Trigger it with Cmd+Alt+B without losing focus of your IDE and stay in the flow.'
    }
};

function updateScreenshots(feature) {
    screenshotImages.forEach(img => {
        img.classList.toggle('active', img.dataset.feature === feature);
    });
}

function updateTabIndicator() {
    const activeTab = document.querySelector('.feature-tab.active');

    if (activeTab && tabsContainer) {
        const tabsRect = tabsContainer.getBoundingClientRect();
        const activeRect = activeTab.getBoundingClientRect();

        const left = activeRect.left - tabsRect.left;
        const width = activeRect.width;

        tabsContainer.style.setProperty('--indicator-left', `${left}px`);
        tabsContainer.style.setProperty('--indicator-width', `${width}px`);
    }
}

document.documentElement.style.setProperty('--indicator-left', '8px');
document.documentElement.style.setProperty('--indicator-width', '0px');

function switchTab(tab) {
    if (tab.classList.contains('active')) {
        return;
    }

    featureTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    updateTabIndicator();

    const feature = tab.dataset.feature;
    const content = featureContent[feature];

    featureDescriptionText.classList.remove('active');

    setTimeout(() => {
        featureDescriptionText.innerHTML = `<strong>${content.title}.</strong> ${content.description}`;
        featureDescriptionText.classList.add('active');
    }, TIMINGS.FADE_TRANSITION);

    updateScreenshots(feature);
}

featureTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        userInteracted = true;
        stopAutoRotate();
        const feature = tab.dataset.feature;
        logTabClick(feature);
        switchTab(tab);
    });
});

updateTabIndicator();
const initialActiveTab = document.querySelector('.feature-tab.active');
if (initialActiveTab) {
    updateScreenshots(initialActiveTab.dataset.feature);
    featureDescriptionText.classList.add('active');
}

function startAutoRotate() {
    const tabArray = Array.from(featureTabs);
    let currentIndex = 0;

    autoRotateInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % tabArray.length;
        switchTab(tabArray[currentIndex]);
    }, TIMINGS.AUTO_ROTATE_INTERVAL);
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
}

if (!userInteracted) {
    startAutoRotate();
}

window.addEventListener('beforeunload', stopAutoRotate);

window.addEventListener('resize', updateTabIndicator);

// MCP Flip Card
const mcpFlipCard = document.querySelector('.mcp-flip-card');
const mcpFlipButtons = document.querySelectorAll('.mcp-flip-card .mcp-flip-button');

mcpFlipButtons.forEach(button => {
    button.addEventListener('click', () => {
        mcpFlipCard.classList.toggle('flipped');
    });
});

// AI Showcase: each example's prompt types itself out, holds for a moment, then the next
// one shows. One clock (requestAnimationFrame) drives the typing, the active dot's fill
// and the advance, and it stands still while the section is off screen, so a prompt is
// never typed where nobody sees it. Picking an example stops the rotation.
const aiShowcase = document.querySelector('.ai-showcase');
if (aiShowcase) {
    const prompts = [...aiShowcase.querySelectorAll('.ai-prompt')];
    const details = [...aiShowcase.querySelectorAll('.ai-detail')];
    const dotsContainer = aiShowcase.querySelector('.ai-dots');
    const stage = aiShowcase.querySelector('.ai-stage');
    const count = prompts.length;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CHAR_MS = 22;   // typing speed
    const HOLD_MS = 2600; // time to read a typed prompt before the next one
    const START_MS = 400; // let the previous prompt fade out before typing starts
    let current = 0;
    let elapsed = 0;
    let lastTyped = -1;
    let lastFill = -1;
    let autoplay = !reduceMotion;
    let inView = false;
    let lastFrame = null;

    // Split each prompt into one span per character (the highlighted phrase keeps its
    // <mark>), plus a trailing cell for the cursor to sit on when typing is done. The
    // visual copy is hidden from screen readers, which read a plain copy instead.
    const chars = prompts.map(prompt => {
        const text = prompt.textContent;
        const visual = document.createElement('span');
        visual.setAttribute('aria-hidden', 'true');
        visual.append(...prompt.childNodes);
        const list = [];
        const split = (node) => {
            [...node.childNodes].forEach(child => {
                if (child.nodeType !== Node.TEXT_NODE) {
                    split(child);
                    return;
                }
                const fragment = document.createDocumentFragment();
                for (const ch of child.textContent) {
                    const span = document.createElement('span');
                    span.className = 'ai-ch';
                    span.textContent = ch;
                    fragment.appendChild(span);
                    list.push(span);
                }
                child.replaceWith(fragment);
            });
        };
        split(visual);
        const caretCell = document.createElement('span');
        caretCell.className = 'ai-ch';
        caretCell.textContent = ' ';
        visual.appendChild(caretCell);
        list.push(caretCell);
        const readable = document.createElement('span');
        readable.className = 'ai-sr-only';
        readable.textContent = text;
        prompt.append(readable, visual);
        return list;
    });
    aiShowcase.classList.add('has-typing');

    const typingLength = (index) => chars[index].length - 1;
    const duration = (index) => typingLength(index) * CHAR_MS + HOLD_MS;

    const dots = details.map((detail, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'ai-dot';
        dot.setAttribute('aria-label', `Example ${index + 1} of ${count}: ${detail.dataset.title}`);
        dot.innerHTML = '<span class="ai-dot-track"><span class="ai-dot-fill"></span></span>';
        dot.addEventListener('click', () => {
            stopAutoplay();
            show(index);
            window.Analytics.logEvent('ai_example_selected', { index });
        });
        dotsContainer.appendChild(dot);
        return dot;
    });
    const fills = dots.map(dot => dot.querySelector('.ai-dot-fill'));

    prompts.forEach((prompt, index) => {
        prompt.setAttribute('role', 'group');
        prompt.setAttribute('aria-roledescription', 'slide');
        prompt.setAttribute('aria-label', `${index + 1} of ${count}`);
    });

    function render() {
        const list = chars[current];
        const total = typingLength(current);
        const typed = reduceMotion ? total : Math.max(0, Math.min(total, Math.floor(elapsed / CHAR_MS)));
        if (typed !== lastTyped) {
            list.forEach((span, i) => {
                span.classList.toggle('is-typed', i < typed);
                span.classList.toggle('is-caret', i === typed);
            });
            prompts[current].classList.toggle('is-done', typed === total);
            lastTyped = typed;
        }
        const fill = autoplay ? Math.max(0, Math.min(1, elapsed / duration(current))) : 1;
        if (fill !== lastFill) {
            fills[current].style.transform = `scaleX(${fill})`;
            lastFill = fill;
        }
    }

    function show(index) {
        current = index;
        elapsed = reduceMotion ? 0 : -START_MS;
        lastTyped = -1;
        lastFill = -1;
        [prompts, details].forEach(list => list.forEach((el, i) => {
            const active = i === index;
            el.classList.toggle('is-active', active);
            el.toggleAttribute('inert', !active);
            el.setAttribute('aria-hidden', String(!active));
        }));
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
                fills[i].style.transform = 'scaleX(0)';
            }
        });
        render();
    }

    function stopAutoplay() {
        autoplay = false;
        lastFill = -1;
    }

    function frame(now) {
        if (lastFrame !== null && inView && !document.hidden) {
            elapsed += Math.min(now - lastFrame, 100);
        }
        lastFrame = now;
        if (autoplay && elapsed >= duration(current)) {
            show((current + 1) % count);
        } else {
            render();
        }
        requestAnimationFrame(frame);
    }

    new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
    }, { threshold: 0.25 }).observe(aiShowcase);

    // Arrow keys move between examples while a dot has focus.
    dotsContainer.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        stopAutoplay();
        const next = (current + (e.key === 'ArrowRight' ? 1 : -1) + count) % count;
        show(next);
        dots[next].focus();
    });

    // Swipe on touch screens.
    let touchStartX = null;
    stage.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(dx) < 40) return;
        stopAutoplay();
        show((current + (dx < 0 ? 1 : -1) + count) % count);
    });

    show(0);
    requestAnimationFrame(frame);
}

// A link to a FAQ entry (e.g. "How it works →") opens it.
document.querySelectorAll('a[href^="#faq-"]').forEach(link => {
    link.addEventListener('click', () => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target && target.tagName === 'DETAILS') target.open = true;
    });
});

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item, index) => {
    const summary = item.querySelector('summary');

    summary.addEventListener('click', (e) => {
        if (item.open) {
            e.preventDefault();
            logFAQInteraction(index, 'closed');
            item.classList.add('closing');

            setTimeout(() => {
                item.open = false;
                item.classList.remove('closing');
            }, TIMINGS.FAQ_CLOSE_ANIMATION);
        } else {
            logFAQInteraction(index, 'opened');
        }
    });
});

const projectsVideo = document.getElementById('projectsVideo');
if (projectsVideo) {
    projectsVideo.addEventListener('ended', () => {
        setTimeout(() => {
            projectsVideo.currentTime = 0;
            projectsVideo.play();
        }, TIMINGS.VIDEO_LOOP_DELAY);
    });
}

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

// Analytics: Log page load with current theme
logPageLoad();
