import { logTabClick, logDownloadClick, logFAQInteraction, logExternalLinkClick, logThemeChange, logPageLoad } from './analytics.js';

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
        applyTheme(button.dataset.theme);
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
        description: 'Connect Claude, your custom models, or any AI agent directly to your projects through MCP Server integration. Each project gets dedicated terminal tabs that auto-label from your commands. Let AI agents build, test, and run alongside you.'
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

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const summary = item.querySelector('summary');

    summary.addEventListener('click', (e) => {
        if (item.open) {
            e.preventDefault();
            item.classList.add('closing');

            setTimeout(() => {
                item.open = false;
                item.classList.remove('closing');
            }, TIMINGS.FAQ_CLOSE_ANIMATION);
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
