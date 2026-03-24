// Firebase Analytics - Global object (works with local file:// and HTTP)
window.Analytics = {
  firebaseAnalytics: null,

  // Initialize Firebase (called when HTTP/HTTPS, skipped for file://)
  init: async function() {
    if (window.location.protocol === 'file:') {
      console.log('Analytics disabled (local file:// testing)');
      return;
    }

    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js");
      const { getAnalytics, logEvent } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js");

      const firebaseConfig = {
        apiKey: "AIzaSyCxZfe9wddSwZkml8eg9qtyjPXQK-CXpMs",
        authDomain: "xcodeneopage.firebaseapp.com",
        projectId: "xcodeneopage",
        storageBucket: "xcodeneopage.firebasestorage.app",
        messagingSenderId: "329106470698",
        appId: "1:329106470698:web:4f8c9e0ecf2c23821f9053",
        measurementId: "G-V872QNBT5M"
      };

      const app = initializeApp(firebaseConfig);
      this.firebaseAnalytics = { analytics: getAnalytics(app), logEvent };
    } catch(e) {
      console.warn('Analytics initialization failed:', e);
    }
  },

  logEvent: function(eventName, params) {
    if (!this.firebaseAnalytics) return;
    this.firebaseAnalytics.logEvent(this.firebaseAnalytics.analytics, eventName, params);
  },

  logTabClick: function(tabName) {
    this.logEvent('tab_clicked', { tab_name: tabName });
  },

  logDownloadClick: function(location) {
    this.logEvent('download_clicked', { location });
  },

  logFAQInteraction: function(faqIndex, action) {
    const eventName = action === 'opened' ? 'faq_opened' : 'faq_closed';
    this.logEvent(eventName, { faq_index: faqIndex });
  },

  logExternalLinkClick: function(linkType) {
    this.logEvent('external_link_clicked', { link_type: linkType });
  },

  logThemeChange: function(theme) {
    this.logEvent('theme_changed', { theme });
  },

  logPageLoad: function() {
    const currentTheme = localStorage.getItem('theme') || 'system';
    this.logEvent('page_load', { theme_on_load: currentTheme });
  }
};

// Initialize analytics
window.Analytics.init();
