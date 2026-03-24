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
